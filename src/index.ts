import http from 'http';
import si from 'systeminformation';

// Récupération configuration port
const PORT = process.env.PORT || 8000;

// Fonction pour récupérer les infos système
async function getSystemInfo() {
  const cpu = await si.cpu();
  const mem = await si.mem();
  const os = await si.osInfo();
  const disk = await si.diskLayout();
  const network = await si.networkInterfaces();

  return { cpu, mem, os, disk, network };
}
//
// Fonction pour ajouter headers CORS (exemple simple)
function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Gestionnaire des requêtes HTTP
export async function requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
  // Log simple de la requête
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Ajouter les headers CORS
  setCorsHeaders(res);

  if (req.method === 'GET' && req.url === '/apiv1/sysinfo') {
    try {
      const sysinfo = await getSystemInfo();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sysinfo));
    } catch (error) {
      console.error('Erreur lors de la récupération des infos système:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur serveur' }));
    }
  } else if (req.method === 'OPTIONS') {
    // Réponse aux pré-vol CORS
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Page non trouvée' }));
  }
}

// Création et démarrage du serveur
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}