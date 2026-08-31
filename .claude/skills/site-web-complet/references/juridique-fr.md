# Conformité française (points 14, 17, 18)

> Repères pratiques pour construire un site conforme. Ce n'est pas un avis juridique : pour un secteur
> réglementé (santé, immobilier, courtage, alimentaire), faire relire par un professionnel du droit.

---

## Avis clients — ce qui est interdit (point 14)

Publier de faux avis, ou présenter comme authentiques des avis non vérifiés, relève de la **pratique
commerciale trompeuse** (code de la consommation, art. L.121-2 et suivants), renforcée par la
directive « Omnibus » transposée en 2022. Sont concernés :

- inventer des avis, même « à titre d'exemple » ou « en attendant les vrais » ;
- afficher une note moyenne ou un nombre d'avis non vérifiables ;
- supprimer sélectivement les avis négatifs pour ne montrer que les positifs ;
- rémunérer des avis sans le divulguer.

La DGCCRF contrôle ce point, et les sanctions peuvent atteindre plusieurs années
d'emprisonnement et des amendes calculées sur le chiffre d'affaires.

**Conséquence dans ce skill** : aucun avis, note, ou verbatim n'est généré. Si le client n'a pas
d'avis à fournir, on écrit `[À FOURNIR : 3 avis avec prénom, ville, date et source]`, le point 14
est marqué ⛔, et on met en place la collecte d'avis au lieu d'en fabriquer.

Même logique pour les **études de cas** (une réalisation inventée = allégation trompeuse sur
l'expérience de l'entreprise) et les **photos d'équipe** (photos de banque d'images présentées comme
l'équipe = tromperie sur l'identité du professionnel).

---

## Politique de confidentialité (point 17)

Obligatoire dès qu'il y a un formulaire, un cookie de mesure ou un log conservé. Doit contenir :

1. Identité et coordonnées du **responsable de traitement** (+ DPO s'il existe).
2. **Données collectées** : formulaire (nom, email, téléphone, message), données de navigation, cookies.
3. **Finalités** : répondre à une demande de devis, mesure d'audience, sécurité.
4. **Base légale** de chaque traitement : consentement (cookies de mesure), intérêt légitime
   (répondre à une demande), obligation légale (facturation).
5. **Durées de conservation** chiffrées : prospects 3 ans après le dernier contact, cookies 13 mois max,
   mesures d'audience 25 mois max.
6. **Destinataires / sous-traitants** nommés : hébergeur, service d'emailing, CRM, Google (Analytics),
   et les transferts hors UE le cas échéant.
7. **Droits** : accès, rectification, effacement, limitation, opposition, portabilité, directives
   post-mortem + modalités d'exercice + **droit de réclamation auprès de la CNIL** (cnil.fr).
8. **Cookies** : liste, finalité, durée, et comment retirer son consentement.
9. **Date de dernière mise à jour**.

Lien vers cette page depuis le **footer de chaque page** et sous chaque formulaire.

---

## Mentions légales (LCEN) — souvent oubliées

Page distincte, obligatoire pour tout site professionnel :

- Raison sociale, forme juridique, capital social ;
- Adresse du siège, téléphone, email ;
- **SIREN/SIRET, RCS + ville d'immatriculation**, numéro de TVA intracommunautaire ;
- Nom du **directeur de la publication** ;
- **Hébergeur** : raison sociale, adresse **et** téléphone ;
- Pour les professions réglementées : ordre/organisme, numéro d'inscription, règles professionnelles ;
- Assurance professionnelle (RC pro, décennale) : nom de l'assureur et couverture géographique —
  obligatoire pour les artisans du bâtiment.

---

## Formulaire de contact — conformité minimale

- Ne demander que les champs **nécessaires** (minimisation).
- Mention sous le bouton d'envoi :
  « Les informations recueillies servent uniquement à traiter votre demande. Elles sont conservées
  3 ans et destinées à <Société>. Vous disposez d'un droit d'accès, de rectification et de
  suppression : <email>. En savoir plus : [politique de confidentialité]. »
- Case à cocher **non pré-cochée** uniquement si on veut aussi envoyer de la prospection.
- Protection anti-spam sans traceur si possible (honeypot plutôt que reCAPTCHA, qui ajoute un
  sous-traitant Google à déclarer).

---

## Cookies (point 18)

- Aucun cookie non essentiel avant le consentement.
- « Refuser » aussi simple et visible qu'« Accepter », dès le premier écran.
- Consentement conservé ~6 mois maximum, puis nouvelle demande.
- Moyen de **retirer** son consentement accessible en permanence (lien footer).
- Les cookies strictement nécessaires (session, panier, sécurité) ne demandent pas de consentement,
  mais doivent être listés.

---

## Accessibilité

Le RGAA s'impose légalement au secteur public et aux grandes entreprises. Pour un site vitrine de TPE,
il n'est pas obligatoire — mais les bases coûtent peu et servent aussi le SEO :
contrastes ≥ 4.5:1, navigation au clavier, `alt` sur les images informatives, hiérarchie de titres
correcte, libellés de formulaires liés à leurs champs, focus visible.
