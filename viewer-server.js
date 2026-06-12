const http = require('http');
const { WebSocketServer } = require('ws');

const clients = new Map(); // ws → { ip, connectedAt }
let viewers = 0;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && req.url === '/api/clients') {
    const list = [...clients.values()];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ viewers, clients: list }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('viewer-counter OK');
});

const wss = new WebSocketServer({ server });

function broadcast() {
  const msg = JSON.stringify({ viewers });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

wss.on('connection', (ws, req) => {
  // Real IP passed by nginx via X-Forwarded-For header
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || req.headers['x-real-ip']
          || req.socket.remoteAddress
          || 'unknown';

  clients.set(ws, { ip, connectedAt: new Date().toISOString() });
  viewers++;
  broadcast();
  console.log(`[+] ${ip}  total: ${viewers}`);

  ws.on('close', () => {
    const info = clients.get(ws) || {};
    clients.delete(ws);
    viewers = Math.max(0, viewers - 1);
    broadcast();
    console.log(`[-] ${info.ip || '?'}  total: ${viewers}`);
  });

  ws.on('error', () => {});
});

server.listen(8081, () => {
  console.log('Viewer counter running on :8081  —  /api/clients available');
});
