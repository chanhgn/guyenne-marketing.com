# Rédaction — CTA, FAQ, études de cas, promesse de délai, avis (points 2, 6, 7, 8, 14)

Règle transverse : **une affirmation = une preuve**. Chiffre, certification, photo, verbatim, date.
Sans preuve, la phrase est du remplissage : la couper.

Passer les textes finaux par le skill **`humanizer`** avant livraison.

🌍 Ces gabarits sont écrits en français de France. Pour un autre marché, adapter la devise, le
canal de contact et le registre — voir `international.md`. Pour une profession réglementée
(santé notamment), les points 2, 6, 8 et 14 changent : voir `juridique-pays.md` §6.

---

## Point 2 — CTA

Formule : **verbe d'action + bénéfice concret + réducteur de friction**.

| ❌ Faible | ✅ Fort |
|---|---|
| Envoyer | Recevoir mon devis gratuit |
| En savoir plus | Voir les 3 chantiers réalisés à Bordeaux |
| Contactez-nous | Être rappelé sous 24 h |
| Nos services | Choisir ma prestation |

Sous le bouton, une micro-copie qui lève le frein :
« Sans engagement · Réponse par un humain sous 48 h ouvrées · Aucun démarchage ».

Placement : hero (sans scroll), après le bloc preuves, après les études de cas, en fin de page,
plus la barre mobile sticky. Toujours **le même libellé** pour le CTA primaire d'un même site.

---

## Point 8 — Promesse de délai

Gabarits selon l'activité :

| Activité | Promesse |
|---|---|
| Artisan / urgence | « Rappel sous 2 h en journée · intervention sous 48 h » |
| Artisan / chantier | « Visite technique sous 5 jours ouvrés · devis chiffré sous 48 h après visite » |
| B2B services | « Devis chiffré sous 48 h ouvrées · livraison de la maquette sous 10 jours » |
| Cabinet / santé | « Réponse à votre demande de RDV sous 24 h ouvrées » |
| Maroc / WhatsApp | « Réponse sur WhatsApp sous 2 h, du lundi au samedi » |
| Maroc / chantier | « Visite sur site sous 3 jours · devis sous 48 h » |

Au Maroc et en Afrique, la promesse porte souvent sur **WhatsApp** plutôt que sur l'email : c'est
là que le prospect attend la réponse. Annoncer le canal en même temps que le délai.

Écrire ensuite **la même chaîne exacte** partout. Vérifier avec un `grep` avant livraison.
Ajouter la condition (jours ouvrés) et, si possible, l'engagement en cas de retard :
« Si nous ne tenons pas ce délai, nous vous prévenons avant l'échéance. »

Ne jamais annoncer un délai que le client ne peut pas tenir en haute saison : c'est la fabrique
à avis 1 étoile.

---

## Point 7 — Les 5 FAQ obligatoires

1. **Prix** — « Combien coûte … ? » Donner un ordre de grandeur ou expliquer ce qui fait varier le
   prix ; ne jamais esquiver, c'est la première question.
2. **Délai** — « Sous combien de temps … ? » Reprendre la promesse mot pour mot.
3. **Zone** — « Est-ce que vous intervenez à … ? » Citer les communes réellement couvertes.
4. **Process** — « Comment ça se passe ? » 3 à 5 étapes numérotées, du premier appel à la livraison.
5. **Garantie / assurance** — « Que se passe-t-il si … ? » Assurance, décennale, SAV, reprise.

Questions supplémentaires selon le secteur : matériaux, urgence/nuit, financement/aides,
confidentialité des données, qui intervient physiquement.

Format d'une réponse : 40-80 mots, la réponse dans la **première phrase**, la nuance ensuite,
un lien interne pertinent à la fin.

---

## Point 6 — Étude de cas (gabarit à remplir)

```markdown
# <Type de projet> à <Ville> — <résultat en 4 mots>

**Client** : <qui, ou anonymisé : « un cabinet d'architecture bordelais »>
**Lieu** : <ville>   **Durée** : <x jours>   **Livrables** : <liste>

## Le contexte
<2-3 phrases : qui, quoi, pourquoi maintenant.>

## La contrainte
<Ce qui rendait le projet difficile : bâtiment occupé, délai serré, accès, données manquantes.>

## Ce que nous avons fait
<Le déroulé concret, avec le vocabulaire métier. 4-6 phrases ou une liste d'étapes.>

## Le résultat
- <Chiffre 1 : surface, délai tenu, précision, économie>
- <Chiffre 2>
- <Chiffre 3>

> « <Verbatim client, une à deux phrases.> »
> — <Prénom N.>, <rôle>, <entreprise ou ville>

<Photos réelles avec alt descriptif.>

[CTA vers la prestation concernée]
```

S'il manque le résultat chiffré, la retourner au client : une étude de cas sans chiffre ne convainc
personne et ne se distingue pas d'une page de vente.

---

## Point 14 — Affichage des avis

Gabarit d'un avis :

```
★★★★★  « Devis tenu au centime près, chantier fini avec un jour d'avance. »
        Sophie L. — Mérignac — mars 2026 — avis Google [lien]
```

Bonnes pratiques :
- Afficher **la date** : un avis sans date paraît fabriqué.
- Garder les avis nuancés (4/5) : ils crédibilisent l'ensemble.
- Ne pas corriger l'orthographe au point de lisser le style ; on peut retirer une information
  personnelle, pas changer le sens.
- Lier vers la fiche publique quand elle existe : c'est la meilleure preuve.
- Répartir les avis sur le site (accueil, pages de service concernées), pas seulement une page « Avis ».

Si le client n'a pas encore d'avis : mettre en place la collecte (lien court Google Business Profile
envoyé après chaque prestation) et afficher `[À FOURNIR]` en attendant. **Jamais d'avis inventé** —
voir `juridique-pays.md`.

🌍 **Profession de santé** : pas d'avis patients sur le site, ni en France ni au Maroc. Remplacer ce
bloc de preuve par des éléments autorisés : diplômes et titres, appartenance à une société savante,
équipements, protocoles, informations de prévention.

---

## Point 3 — Maillage interne, schéma type

```
Accueil
 ├─ Prestation A ─┬─ Étude de cas 1 (A) ─→ retour Prestation A
 │                └─ FAQ (ancre prix) ──→ Contact
 ├─ Prestation B ──→ Prestation A (« souvent associée à »)
 ├─ Réalisations ──→ chaque étude de cas ──→ prestation liée
 ├─ Équipe ────────→ Contact
 └─ Contact ───────→ /merci ──→ Réalisations, FAQ
```
Chaque page de service : 3 liens minimum (une étude de cas, une prestation liée, le contact).
