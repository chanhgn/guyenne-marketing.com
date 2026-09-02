// Workflow n8n : wYgg7lTDCGV5Cz4G
// Analyse EN LECTURE SEULE des articles de kobo-alu.fr.
// Aucune suppression, aucune redirection, aucune écriture.
// Produit le plan de fusion des doublons, à valider avant toute action.

// Le code SDK complet est déployé dans n8n sous l'id wYgg7lTDCGV5Cz4G.
// Logique appliquée :
//   1. GET /wp/v2/posts?per_page=100&status=any (titre, contenu, date, image à la une)
//   2. GET /wp-json/rankmath/v1 : vérifie si Rank Math expose une route de redirection
//   3. Code : normalisation des titres (accents, ponctuation, mots vides retirés),
//      similarité de Jaccard sur les jetons, regroupement au seuil de 0,75.
//      Dans chaque groupe, l'article conservé est celui qui compte le plus de mots ;
//      à égalité, le plus ancien. Les autres sont proposés à la redirection.
//      Sont également relevés : articles hors périmètre aluminium, contenus de
//      moins de 600 mots, articles sans image à la une, brouillons.
