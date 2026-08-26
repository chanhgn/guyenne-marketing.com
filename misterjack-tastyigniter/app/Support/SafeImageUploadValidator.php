<?php

declare(strict_types=1);

namespace App\Support;

use GdImage;
use Igniter\Flame\Exception\ApplicationException;
use Igniter\Flame\Support\MediaUploadValidator;
use Override;

/**
 * Débloque l'envoi de photos refusées à tort par « contenu non sûr ».
 *
 * TastyIgniter refuse une image dès qu'il trouve la suite d'octets `<?=`
 * dedans, parce qu'un fichier qui est à la fois une image et du PHP peut
 * s'exécuter sur un serveur mal configuré. Le problème : dans les octets
 * compressés d'une photo, ces trois caractères tombent au hasard. Sur un
 * échantillon de 117 images, une était touchée ; pour une photo de téléphone
 * de 4 Mo la probabilité tourne autour d'une sur cinq. Le client se retrouve
 * donc avec une photo parfaitement saine qu'il ne peut pas envoyer.
 *
 * Plutôt que de désactiver le contrôle, on ré-encode l'image : GD la décode
 * en pixels puis la ré-écrit. Le fichier obtenu ne contient plus que de
 * l'image — la suite d'octets malheureuse a disparu, et un vrai code caché
 * dedans aussi. On repasse ensuite le contrôle d'origine, intact. S'il refuse
 * encore, on ré-encode un peu différemment, quelques fois. Si rien ne passe,
 * l'erreur d'origine est renvoyée telle quelle.
 *
 * Les fichiers qui ne sont pas des photos (SVG, PDF, documents) ne sont pas
 * touchés : ils suivent le contrôle d'origine, du début à la fin.
 */
class SafeImageUploadValidator extends MediaUploadValidator
{
    /**
     * Formats que GD sait décoder et ré-écrire sans perdre l'image.
     * Le GIF est écarté : le ré-encodage tuerait l'animation.
     */
    private const array REENCODABLE = ['jpg', 'jpeg', 'png', 'webp'];

    private const int MAX_ATTEMPTS = 6;

    /**
     * Au-delà, le décodage demanderait plus de mémoire que n'en a un
     * hébergement mutualisé. 40 Mpx, c'est déjà bien plus qu'un reflex.
     */
    private const int MAX_PIXELS = 40000000;

    #[Override]
    public function validateAndSanitize(string $filename, string $contents, ?array $allowedExtensions = null): string
    {
        try {
            return parent::validateAndSanitize($filename, $contents, $allowedExtensions);
        } catch (ApplicationException $exception) {
            foreach ($this->reencodeAttempts($filename, $contents) as $candidate) {
                try {
                    return parent::validateAndSanitize($filename, $candidate, $allowedExtensions);
                } catch (ApplicationException) {
                    continue;
                }
            }

            throw new ApplicationException($this->explain($filename, $contents, $exception));
        }
    }

    /**
     * Remplace « contenu non sûr » par une phrase qui dit ce qui a coincé.
     *
     * Le message d'origine ne distingue pas une photo malchanceuse d'un vrai
     * fichier piégé, et n'indique pas pourquoi le ré-encodage n'a pas pu la
     * sauver. Sans ça, un refus ne laisse rien à quoi se raccrocher.
     */
    private function explain(string $filename, string $contents, ApplicationException $exception): string
    {
        $extension = strtolower(pathinfo(basename($filename), PATHINFO_EXTENSION));
        $size = @getimagesizefromstring($contents);

        $reason = match (true) {
            !in_array($extension, self::REENCODABLE, true) => sprintf(
                'format %s non ré-encodable', $extension === '' ? 'inconnu' : $extension,
            ),
            !function_exists('imagecreatefromstring') => 'GD absent du serveur',
            !$size => 'image illisible par GD',
            ($size[0] * $size[1]) > self::MAX_PIXELS => sprintf('image trop grande (%dx%d)', $size[0], $size[1]),
            !$this->isDecodable($contents) => sprintf('décodage GD impossible (%s)', $size['mime'] ?? '?'),
            default => 'ré-encodage tenté sans succès',
        };

        $markers = array_keys(array_filter([
            '<?php' => (bool) preg_match('/<\\?php/i', $contents),
            '<?=' => (bool) preg_match('/<\\?=/', $contents),
            '<?' => (bool) preg_match('/<\\?(?!xml)/i', $contents),
            'directive Apache' => (bool) preg_match('/SetHandler|AddHandler|php_value|php_flag/i', $contents),
            '<script' => (bool) preg_match('/<script/i', $contents),
        ]));

        return sprintf(
            '%s [%s, %s, %.0f Ko, motif : %s, %s]',
            $exception->getMessage(),
            $filename,
            $size ? $size[0].'x'.$size[1] : 'dimensions inconnues',
            strlen($contents) / 1024,
            $markers ? implode(' ', $markers) : 'aucun',
            $reason,
        );
    }

    private function isDecodable(string $contents): bool
    {
        $image = @imagecreatefromstring($contents);
        if (!$image instanceof GdImage) {
            return false;
        }

        imagedestroy($image);

        return true;
    }

    /**
     * Rend plusieurs ré-encodages de la même image, tous un peu différents.
     *
     * @return iterable<string>
     */
    private function reencodeAttempts(string $filename, string $contents): iterable
    {
        $extension = strtolower(pathinfo(basename($filename), PATHINFO_EXTENSION));
        if (!in_array($extension, self::REENCODABLE, true)) {
            return;
        }

        if (!function_exists('imagecreatefromstring')) {
            return;
        }

        $size = @getimagesizefromstring($contents);
        if (!$size || ($size[0] * $size[1]) > self::MAX_PIXELS) {
            return;
        }

        $image = @imagecreatefromstring($contents);
        if (!$image instanceof GdImage) {
            return;
        }

        try {
            $image = $this->applyExifOrientation($image, $contents, $extension);

            // La transparence d'un PNG ou d'un WebP doit survivre au passage.
            imagealphablending($image, false);
            imagesavealpha($image, true);

            for ($attempt = 0; $attempt < self::MAX_ATTEMPTS; $attempt++) {
                if ($encoded = $this->encode($image, $extension, $attempt)) {
                    yield $encoded;
                }
            }
        } finally {
            imagedestroy($image);
        }
    }

    /**
     * Chaque tentative change un réglage de compression : les octets produits
     * sont différents, donc la suite d'octets refusée ne peut pas retomber au
     * même endroit six fois de suite.
     */
    private function encode(GdImage $image, string $extension, int $attempt): ?string
    {
        ob_start();

        $written = match ($extension) {
            'jpg', 'jpeg' => imagejpeg($image, null, 92 - $attempt),
            'png' => imagepng($image, null, 9 - $attempt),
            'webp' => imagewebp($image, null, 92 - $attempt),
            default => false,
        };

        $encoded = (string) ob_get_clean();

        return $written && $encoded !== '' ? $encoded : null;
    }

    /**
     * GD ignore l'orientation EXIF : sans ça, une photo prise à la verticale
     * ressortirait couchée sur le côté.
     */
    private function applyExifOrientation(GdImage $image, string $contents, string $extension): GdImage
    {
        if (!in_array($extension, ['jpg', 'jpeg'], true) || !function_exists('exif_read_data')) {
            return $image;
        }

        $exif = @exif_read_data('data://image/jpeg;base64,'.base64_encode($contents));
        $rotation = match ($exif['Orientation'] ?? null) {
            3 => 180,
            6 => -90,
            8 => 90,
            default => null,
        };

        if (is_null($rotation)) {
            return $image;
        }

        $rotated = @imagerotate($image, (float) $rotation, 0);
        if (!$rotated instanceof GdImage) {
            return $image;
        }

        imagedestroy($image);

        return $rotated;
    }
}
