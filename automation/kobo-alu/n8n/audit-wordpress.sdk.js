import { workflow, node, trigger, newCredential, sticky } from '@n8n/workflow-sdk';

const httpOptions = {
  timeout: 30000,
  response: { response: { fullResponse: true, neverError: true } }
};

const lancerAudit = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Lancer l audit', position: [0, 300] },
  output: [{}]
});

const compteEtDroits = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Compte et droits',
    parameters: {
      method: 'GET',
      url: 'https://kobo-alu.fr/wp-json/wp/v2/users/me?context=edit',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      options: httpOptions
    },
    credentials: { httpBasicAuth: newCredential('WordPress kobo-alu.fr') },
    position: [220, 300]
  },
  output: [{ statusCode: 200, body: { id: 1, name: 'Clement', roles: ['administrator'], capabilities: { upload_files: true, publish_posts: true } } }]
});

const routesDisponibles = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Routes et plugins SEO',
    parameters: {
      method: 'GET',
      url: 'https://kobo-alu.fr/wp-json/?_fields=namespaces',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      options: httpOptions
    },
    credentials: { httpBasicAuth: newCredential('WordPress kobo-alu.fr') },
    executeOnce: true,
    position: [440, 300]
  },
  output: [{ statusCode: 200, body: { namespaces: ['wp/v2', 'rankmath/v1'] } }]
});

const categories = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Categories du blog',
    parameters: {
      method: 'GET',
      url: 'https://kobo-alu.fr/wp-json/wp/v2/categories?per_page=100&_fields=id,name,slug,count',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      options: httpOptions
    },
    credentials: { httpBasicAuth: newCredential('WordPress kobo-alu.fr') },
    executeOnce: true,
    position: [660, 300]
  },
  output: [{ statusCode: 200, body: [{ id: 1, name: 'Actualites', slug: 'actualites', count: 4 }] }]
});

const articles = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Articles existants',
    parameters: {
      method: 'GET',
      url: 'https://kobo-alu.fr/wp-json/wp/v2/posts?per_page=100&status=any&orderby=date&order=desc&_fields=id,slug,status,date,link,title',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      options: httpOptions
    },
    credentials: { httpBasicAuth: newCredential('WordPress kobo-alu.fr') },
    executeOnce: true,
    position: [880, 300]
  },
  output: [{ statusCode: 200, headers: { 'x-wp-total': '4' }, body: [{ id: 12, slug: 'exemple', status: 'publish', date: '2026-01-10T09:00:00', link: 'https://kobo-alu.fr/exemple', title: { rendered: 'Exemple' } }] }]
});

const mediatheque = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Acces mediatheque',
    parameters: {
      method: 'GET',
      url: 'https://kobo-alu.fr/wp-json/wp/v2/media?per_page=1&_fields=id,source_url,mime_type',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      options: httpOptions
    },
    credentials: { httpBasicAuth: newCredential('WordPress kobo-alu.fr') },
    executeOnce: true,
    position: [1100, 300]
  },
  output: [{ statusCode: 200, body: [{ id: 30, source_url: 'https://kobo-alu.fr/wp-content/uploads/img.jpg', mime_type: 'image/jpeg' }] }]
});

const synthese = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Synthese audit',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: "const lire = (nom) => { try { return $(nom).first().json; } catch (e) { return { statusCode: 0, body: { erreur: 'noeud non execute' } }; } };\nconst me = lire('Compte et droits');\nconst ns = lire('Routes et plugins SEO');\nconst cat = lire('Categories du blog');\nconst art = lire('Articles existants');\nconst med = lire('Acces mediatheque');\nconst caps = (me.body && me.body.capabilities) || {};\nconst namespaces = (ns.body && ns.body.namespaces) || [];\nconst seo = namespaces.filter((n) => /rankmath|yoast|seopress|aioseo/i.test(n));\nconst listeCat = Array.isArray(cat.body) ? cat.body.map((c) => ({ id: c.id, nom: c.name, slug: c.slug, articles: c.count })) : [];\nconst listeArt = Array.isArray(art.body) ? art.body.map((p) => ({ id: p.id, slug: p.slug, statut: p.status, date: String(p.date || '').slice(0, 10), titre: p.title && p.title.rendered })) : [];\nconst entetes = art.headers || {};\nconst total = entetes['x-wp-total'] || listeArt.length;\nlet diagnostic = 'Statut inattendu : ' + me.statusCode;\nif (me.statusCode === 200) { diagnostic = 'Credential fonctionnelle'; }\nif (me.statusCode === 401) { diagnostic = 'ECHEC 401 : en-tete Authorization supprimee par l hebergeur, appliquer la regle .htaccess'; }\nif (me.statusCode === 403) { diagnostic = 'ECHEC 403 : identifiants acceptes mais droits insuffisants'; }\nreturn [{ json: {\n  diagnostic: diagnostic,\n  authentification: { statut: me.statusCode, ok: me.statusCode === 200, utilisateur: me.body && me.body.name, roles: (me.body && me.body.roles) || [], peutPublier: caps.publish_posts === true, peutTeleverser: caps.upload_files === true },\n  pluginSeo: { statut: ns.statusCode, detecte: seo, namespaces: namespaces },\n  categories: { statut: cat.statusCode, nombre: listeCat.length, liste: listeCat },\n  articles: { statut: art.statusCode, total: total, slugs: listeArt.map((p) => p.slug), liste: listeArt },\n  mediatheque: { statut: med.statusCode, accessible: med.statusCode === 200 }\n} }];"
    },
    position: [1320, 300]
  },
  output: [{ diagnostic: 'Credential fonctionnelle', authentification: { statut: 200, ok: true }, categories: { nombre: 3 }, articles: { total: 4 } }]
});

export default workflow('kobo-audit-wp', 'Kobo-Alu — Audit WordPress (lecture seule)')
  .add(lancerAudit)
  .to(compteEtDroits)
  .to(routesDisponibles)
  .to(categories)
  .to(articles)
  .to(mediatheque)
  .to(synthese)
  .add(sticky('## Audit en lecture seule\nAucune ecriture sur le site. Uniquement des requetes GET sur l API REST de kobo-alu.fr.\nValide la credential et inventorie le contenu avant construction du workflow de publication.', [lancerAudit], { color: 4 }));
