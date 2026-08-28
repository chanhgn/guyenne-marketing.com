# BRIEF — Reel Instagram sponsorisé · ISTD Fès

**Client** : ISTD — Institut Spécialisé en Technologies d'Art Dentaire, Fès
**Objectif** : générer des demandes de RDV / d'inscription via WhatsApp
**Statut** : brief validé — production en attente du GO

---

## 1. Décisions validées

| Paramètre | Décision |
|---|---|
| Plateforme | Instagram (Reel 9:16, déclinaisons Story + 4:5 feed) |
| Durée | 20–25 s |
| Style | 100 % motion design (aucun footage réel) |
| Langue | Voix off darija + sous-titres français à l'écran |
| Voix | Enregistrée par un locuteur réel (script fourni, minuté) |
| Angle | Le débouché : un métier de la santé qui recrute |
| CTA / destination | WhatsApp direct |
| Prix affiché | Non — communiqué en conversation WhatsApp |
| Ciblage | Fès + 100 km (Fès-Meknès, Sefrou, Taza, Moulay Yacoub) |
| Budget test | 150–300 DH/jour × 14 jours (~2 000–4 000 DH) |

---

## 2. Charte graphique (source : kit Elementor istd.ma)

### Couleurs
| Rôle | Hex |
|---|---|
| CTA / accent principal | `#F4380F` |
| Titres | `#110E0E` |
| Texte courant | `#493C3C` |
| Fond clair | `#FAF6F3` |
| Fond beige | `#F3E9E1` |
| Fond sombre | `#1C1C1C` |
| Fond extra-sombre | `#000000` |
| Accent chaud 1 | `#E9BFB3` |
| Accent chaud 2 | `#D7CAC6` |
| Accent chaud 3 | `#DBC1BD` |
| Ligne / séparateur | `#DCDCDE` |
| Blanc | `#FFFFFF` |

### Typographies
- **Titres** : Jost 600 (H1 48px / H2 39px / H3 31px — line-height 1.2)
- **Texte** : Inter 400, line-height 1.4
- **Boutons** : Inter 600, uppercase, letter-spacing 2px
- Rayon des boutons : 10px
- Les deux familles sont sur Google Fonts → disponibles nativement dans Remotion

### Logo
`ISTD-Fes-Ecole-Africaine-de-Prothesistes-Dentaires-logo.webp` — 1285×1177
Alt officiel : « ISTD Fès – École africaine de prothésistes dentaires logo officiel »

### Baseline
« École africaine dédiée à la formation en prothèse dentaire »

---

## 3. Arguments factuels utilisables (vérifiés)

- Institut Spécialisé en Technologies d'Art Dentaire — **depuis 2006**
- **Technicien Spécialisé en Prothèse Dentaire, Bac+3, reconnu par l'État** — arrêté DFP n° 5/10/3/2006
- **3 ans / 6 semestres · 2 808 heures · 68 % de pratique en laboratoire**
- **+20 ans d'expérience**
- **+500 étudiants formés**
- **90 % d'insertion à 12 mois**
- Promotion limitée à 108 étudiants · 5 formateurs experts
- Diplôme donnant accès au métier au Maroc et à l'international
- Partenaires : SMART Lab · Laboratoire dentaire SABEL RACHID · Global Dentaire ·
  Maroc Dentaire Benjelloun · Digital Lab · Ministère
- Mention live sur le site : « Inscription ouverte pour l'année 2026/2027 — Places limitées »

### Coordonnées
- 5, Avenue Ibn Khatib — Quartier Atlas, Fès (face à la maison Mercedes)
- 05 35 65 96 82 / 05 35 73 10 90
- istdentaire@gmail.com
- Lundi–Samedi 9h–18h
- Page d'inscription existante : https://istd.ma/inscription/ (FluentForm multi-étapes avec upload de pièces)

---

## 4. Environnement technique

- Site : WordPress 6.9.7 / PHP 8.3 / Hello Elementor + Elementor Pro
- Multilingue FR/AR via Polylang
- Formulaires : FluentForm (form ID 5 = inscription)
- Plugin bouton WhatsApp maison déjà en place (`istd-whatsapp-button`)
- Metricool et Google Site Kit installés
- Pipeline vidéo : Remotion 4.0.380 (présent dans ce dépôt)

---

## 5. Informations encore manquantes (bloquent la production)

1. **Numéro WhatsApp exact** à utiliser dans la publicité (+ WhatsApp Business ?)
2. **Date de rentrée 2026/2027** et **nombre de places réellement disponibles**
3. **Frais de scolarité** et facilités de paiement (non affichés dans la vidéo, mais nécessaires au script de réponse WhatsApp)
4. **Accès** : compte publicitaire Meta + Page Instagram prêts ?
5. **Fichier logo** : le domaine istd.ma est bloqué par le proxy sortant de cette session.
   → soit fournir le fichier directement, soit autoriser istd.ma dans la politique réseau de l'environnement.

---

## 6. Chaîne de production prévue

| Étape | Outil |
|---|---|
| Script darija minuté + sous-titres FR | Rédaction interne (skill `ad-creative`) |
| Direction artistique / storyboard | Charte ISTD ci-dessus |
| Animation et rendu 9:16 | Remotion (dépôt courant) |
| Musique et nappes sonores | Magnific / Higgsfield |
| Mixage voix enregistrée + musique | Traitement audio local |
| Déclinaisons Story / 4:5 | Remotion (mêmes compositions, formats multiples) |
| Structure de campagne + ciblage | Meta Ads |
| Programmation des publications | Metricool |
