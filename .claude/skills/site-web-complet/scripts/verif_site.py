#!/usr/bin/env python3
"""Vérificateur automatique des points mécaniquement contrôlables du standard 20 points.

Usage : python3 verif_site.py https://exemple.fr [--max 25]

Ne remplace pas la validation humaine : la qualité des CTA, la véracité des avis,
la pertinence des FAQ et la réalité des photos d'équipe se vérifient à la main.
"""
import re
import sys
import json
import urllib.error
import urllib.parse
import urllib.request

TIMEOUT = 20
UA = "Mozilla/5.0 (compatible; verif-site/1.0; +checklist-20-points)"
OK, WARN, BAD, NA = "OK ", "ATTENTION", "BLOQUANT", "N/A"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            charset = r.headers.get_content_charset() or "utf-8"
            return r.status, r.read().decode(charset, "replace"), dict(r.headers)
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8", "replace")
        except Exception:
            body = ""
        return e.code, body, dict(e.headers or {})
    except Exception as e:
        return None, "ERREUR: %s" % e, {}


def attr(tag, name):
    m = re.search(r'%s\s*=\s*"([^"]*)"' % name, tag, re.I) or \
        re.search(r"%s\s*=\s*'([^']*)'" % name, tag, re.I)
    return m.group(1).strip() if m else None


def meta(html, key, kind="name"):
    for tag in re.findall(r"<meta\b[^>]*>", html, re.I):
        if (attr(tag, kind) or "").lower() == key.lower():
            return (attr(tag, "content") or "").strip()
    return None


def text_of(html, tag):
    m = re.search(r"<%s\b[^>]*>(.*?)</%s>" % (tag, tag), html, re.I | re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else None


def jsonld_types(html):
    types = set()
    for block in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html, re.I | re.S):
        try:
            data = json.loads(block.strip())
        except Exception:
            found = re.findall(r'"@type"\s*:\s*"([^"]+)"', block)
            types.update(found)
            continue
        stack = [data]
        while stack:
            cur = stack.pop()
            if isinstance(cur, dict):
                t = cur.get("@type")
                if isinstance(t, str):
                    types.add(t)
                elif isinstance(t, list):
                    types.update(x for x in t if isinstance(x, str))
                stack.extend(cur.values())
            elif isinstance(cur, list):
                stack.extend(cur)
    return types


def body_only(html):
    m = re.search(r"<main\b.*?</main>", html, re.I | re.S)
    if m:
        return m.group(0)
    m = re.search(r"<body\b.*?</body>", html, re.I | re.S)
    return m.group(0) if m else html


def discover(base, limit):
    """Pages à analyser : sitemap.xml en priorité, sinon liens internes de l'accueil."""
    status, body, _ = fetch(urllib.parse.urljoin(base, "/sitemap.xml"))
    urls = []
    if status == 200 and "<loc" in body.lower():
        urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body, re.I)
        nested = [u for u in urls if u.lower().endswith(".xml")]
        for sub in nested[:5]:
            s2, b2, _ = fetch(sub)
            if s2 == 200:
                urls += re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", b2, re.I)
        urls = [u for u in urls if not u.lower().endswith(".xml")]
    if not urls:
        _, home, _ = fetch(base)
        host = urllib.parse.urlparse(base).netloc
        for href in re.findall(r'<a\b[^>]*href\s*=\s*["\']([^"\']+)["\']', home, re.I):
            full = urllib.parse.urljoin(base, href.split("#")[0])
            if urllib.parse.urlparse(full).netloc == host and full not in urls:
                urls.append(full)
        urls.insert(0, base)
    seen, out = set(), []
    for u in urls:
        u = u.split("#")[0].rstrip()
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out[:limit]


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    base = sys.argv[1].rstrip("/")
    limit = 25
    if "--max" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--max") + 1])

    lines = []
    def out(status, point, detail):
        lines.append("[%-9s] %-34s %s" % (status, point, detail))

    print("Vérification de %s\n" % base)

    st_home, home_body, _ = fetch(base + "/")
    if st_home is None:
        print("Site injoignable : %s" % home_body)
        print("Vérifier l'URL, la connexion réseau ou le proxy sortant avant de conclure quoi que ce soit.")
        sys.exit(2)

    # --- Point 1 : page 404 -------------------------------------------------
    st, body404, _ = fetch(base + "/cette-page-nexiste-pas-verif-404")
    if st == 404:
        perso = len(body404) > 1500 and bool(re.search(r"<a\b", body404, re.I))
        nb_liens = len(re.findall(r"<a\b[^>]*href", body404, re.I))
        out(OK if perso else WARN, "1. Page 404",
            "code 404, %d liens%s" % (nb_liens, "" if perso else " — page semble non personnalisée"))
    elif st == 200:
        out(BAD, "1. Page 404", "code HTTP 200 sur une URL inexistante (soft 404)")
    else:
        out(BAD, "1. Page 404", "code HTTP %s attendu 404" % st)

    # --- Point 10 : robots.txt ---------------------------------------------
    st, robots, _ = fetch(base + "/robots.txt")
    if st != 200:
        out(BAD, "10. robots.txt", "introuvable (HTTP %s)" % st)
    else:
        pbs = []
        if re.search(r"^\s*Disallow:\s*/\s*$", robots, re.I | re.M):
            pbs.append("Disallow: / — le site entier est bloqué")
        if not re.search(r"^\s*Sitemap:\s*https?://", robots, re.I | re.M):
            pbs.append("aucune directive Sitemap en URL absolue")
        if re.search(r"Disallow:.*\.(css|js)", robots, re.I):
            pbs.append("CSS/JS bloqués")
        if not re.search(r"Disallow:\s*/merci", robots, re.I):
            pbs.append("/merci non bloqué")
        out(BAD if any("Disallow: /" in p for p in pbs) else (WARN if pbs else OK),
            "10. robots.txt", "; ".join(pbs) if pbs else "conforme")

    # --- Sitemap ------------------------------------------------------------
    st, _, _ = fetch(base + "/sitemap.xml")
    out(OK if st == 200 else WARN, "10b. sitemap.xml", "HTTP %s" % st)

    # --- Point 4 : page de remerciement ------------------------------------
    trouvee = False
    for path in ("/merci", "/merci/", "/merci.html", "/merci-devis"):
        st, html, _ = fetch(base + path)
        if st == 200:
            trouvee = True
            robots_meta = (meta(html, "robots") or "").lower()
            out(OK if "noindex" in robots_meta else BAD, "4. Page de remerciement",
                "%s trouvée, meta robots = %s" % (path, robots_meta or "absente (doit être noindex)"))
            break
    if not trouvee:
        out(WARN, "4. Page de remerciement", "aucune URL /merci trouvée (vérifier le nom réel)")

    # --- Analyse page par page ---------------------------------------------
    pages = discover(base, limit)
    print("Pages analysées : %d\n" % len(pages))

    titles, descs = {}, {}
    sans_alt = 0
    total_img = 0
    pages_sans_og = []
    pages_sans_breadcrumb = []
    pages_peu_liens = []
    types_globaux = set()
    gtm = ga4 = False
    tel_present = False
    analysees = 0

    for url in pages:
        st, html, _ = fetch(url)
        if st != 200 or not html:
            print("  ! %s → HTTP %s" % (url, st))
            continue
        analysees += 1
        t = text_of(html, "title")
        d = meta(html, "description")
        titles.setdefault(t or "(absent)", []).append(url)
        descs.setdefault(d or "(absente)", []).append(url)

        imgs = re.findall(r"<img\b[^>]*>", html, re.I)
        total_img += len(imgs)
        sans_alt += sum(1 for i in imgs if attr(i, "alt") is None)

        if not meta(html, "og:image", "property"):
            pages_sans_og.append(url)

        types = jsonld_types(html)
        types_globaux |= types
        if url.rstrip("/") != base and "BreadcrumbList" not in types:
            pages_sans_breadcrumb.append(url)

        host = urllib.parse.urlparse(base).netloc
        liens = re.findall(r'<a\b[^>]*href\s*=\s*["\']([^"\']+)["\']', body_only(html), re.I)
        internes = [l for l in liens if l.startswith("/") or host in l]
        if len(internes) < 3:
            pages_peu_liens.append(url)

        if "tel:" in html:
            tel_present = True
        if "googletagmanager.com/gtm.js" in html or re.search(r"GTM-[A-Z0-9]+", html):
            gtm = True
        if "googletagmanager.com/gtag/js" in html or re.search(r"[\"']G-[A-Z0-9]{6,}[\"']", html):
            ga4 = True

    if analysees == 0:
        out(BAD, "Analyse par page", "aucune page récupérée — contrôles 3/5/7/11-16/18 non effectués")
        print("\n".join(lines))
        sys.exit(2)

    # --- Point 11 : titres --------------------------------------------------
    dup = {t: u for t, u in titles.items() if len(u) > 1}
    longs = [t for t in titles if t != "(absent)" and len(t) > 65]
    courts = [t for t in titles if t != "(absent)" and len(t) < 30]
    det = []
    if "(absent)" in titles:
        det.append("%d page(s) sans <title>" % len(titles["(absent)"]))
    if dup:
        det.append("%d titre(s) dupliqué(s)" % len(dup))
    if longs:
        det.append("%d titre(s) > 65 car." % len(longs))
    if courts:
        det.append("%d titre(s) < 30 car." % len(courts))
    out(BAD if (dup or "(absent)" in titles) else (WARN if det else OK),
        "11. Titres uniques", "; ".join(det) if det else "%d titres uniques et bien calibrés" % len(titles))
    for t, urls in dup.items():
        lines.append("            doublon : %r → %s" % (t[:60], ", ".join(urls[:3])))

    # --- Point 12 : meta descriptions --------------------------------------
    dupd = {d: u for d, u in descs.items() if len(u) > 1 and d != "(absente)"}
    det = []
    if "(absente)" in descs:
        det.append("%d page(s) sans meta description" % len(descs["(absente)"]))
    if dupd:
        det.append("%d description(s) dupliquée(s)" % len(dupd))
    hors = [d for d in descs if d != "(absente)" and not (120 <= len(d) <= 165)]
    if hors:
        det.append("%d hors de 120-165 car." % len(hors))
    out(BAD if "(absente)" in descs or dupd else (WARN if det else OK),
        "12. Meta descriptions", "; ".join(det) if det else "uniques et bien calibrées")

    # --- Point 13 : images sociales ----------------------------------------
    out(BAD if len(pages_sans_og) == len(pages) else (WARN if pages_sans_og else OK),
        "13. Images sociales (og:image)",
        "%d page(s) sans og:image" % len(pages_sans_og) if pages_sans_og else "présentes partout")

    # --- Point 15 : alt -----------------------------------------------------
    out(BAD if sans_alt else OK, "15. Textes alternatifs",
        "%d image(s) sans attribut alt sur %d" % (sans_alt, total_img))

    # --- Point 5 : fil d'Ariane --------------------------------------------
    out(BAD if len(pages_sans_breadcrumb) == max(len(pages) - 1, 1) else (WARN if pages_sans_breadcrumb else OK),
        "5. Fil d'Ariane (JSON-LD)",
        "%d page(s) sans BreadcrumbList" % len(pages_sans_breadcrumb) if pages_sans_breadcrumb else "présent")

    # --- Point 3 : liens internes ------------------------------------------
    out(WARN if pages_peu_liens else OK, "3. Liens internes",
        "%d page(s) avec moins de 3 liens internes dans le contenu" % len(pages_peu_liens)
        if pages_peu_liens else "au moins 3 liens contextuels par page")

    # --- Points 7 / 16 / 14 : schemas --------------------------------------
    local = [t for t in types_globaux if t.endswith("Business") or t in (
        "ProfessionalService", "Plumber", "Electrician", "RoofingContractor", "Dentist",
        "Dermatologist", "Physician", "LegalService", "AccountingService", "RealEstateAgent",
        "HVACBusiness", "Locksmith", "MovingCompany", "Organization")]
    out(OK if local else BAD, "16. Schema LocalBusiness",
        "types détectés : %s" % ", ".join(sorted(local)) if local else "aucun LocalBusiness/Organization trouvé")
    out(OK if "FAQPage" in types_globaux else WARN, "7. FAQPage (JSON-LD)",
        "présent" if "FAQPage" in types_globaux else "aucun FAQPage — vérifier que les 5 FAQ sont balisées")
    out(OK if {"Review", "AggregateRating"} & types_globaux else WARN, "14. Avis (JSON-LD)",
        "balisage présent — VÉRIFIER que les avis sont réels et affichés"
        if {"Review", "AggregateRating"} & types_globaux else "aucun balisage d'avis")

    # --- Point 9 : tel: -----------------------------------------------------
    out(OK if tel_present else WARN, "9. CTA mobile (lien tel:)",
        "lien tel: détecté — vérifier la barre sticky sur mobile" if tel_present
        else "aucun lien tel: trouvé")

    # --- Point 18 : tracking ------------------------------------------------
    out(OK if (gtm or ga4) else BAD, "18. Google Analytics",
        "GTM=%s GA4=%s — vérifier à la main qu'aucun tag ne part avant le consentement"
        % ("oui" if gtm else "non", "oui" if ga4 else "non"))

    # --- Point 17 : pages légales ------------------------------------------
    legal = []
    for path in ("/politique-de-confidentialite", "/politique-de-confidentialite/",
                 "/politique-confidentialite", "/mentions-legales", "/mentions-legales/"):
        st, _, _ = fetch(base + path)
        if st == 200:
            legal.append(path)
    out(OK if len(legal) >= 2 else (WARN if legal else BAD), "17. Pages légales",
        ", ".join(legal) if legal else "ni politique de confidentialité ni mentions légales trouvées")

    print("\n".join(lines))
    print("""
À vérifier À LA MAIN (non automatisable) :
  2.  CTA — une seule action primaire par page, libellé orienté bénéfice
  6.  Études de cas — 3 minimum, avec résultat chiffré et verbatim réels
  7.  FAQ — 5 questions couvrant prix, délai, zone, process, garantie
  8.  Promesse de délai — formulation identique sur toutes les pages
  9.  Barre CTA mobile — cibles >= 48px, ne masque rien
  14. Avis — réels, datés, sourcés (jamais inventés)
  18. Consentement — aucun tag avant clic, refus aussi simple que l'accord
  19. Carte — chargée au clic, bouton itinéraire fonctionnel
  20. Photos d'équipe — vraies personnes, pas de banque d'images""")


if __name__ == "__main__":
    main()
