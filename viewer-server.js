const http = require('http');
const { WebSocketServer } = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('viewer-counter OK');
});

const wss = new WebSocketServer({ server });
let viewers = 0;

function broadcast() {
  const msg = JSON.stringify({ viewers });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

wss.on('connection', ws => {
  viewers++;
  broadcast();
  console.log(`[+] joined  total: ${viewers}`);

  ws.on('close', () => {
    viewers = Math.max(0, viewers - 1);
    broadcast();
    console.log(`[-] left    total: ${viewers}`);
  });

  ws.on('error', () => {});
});

server.listen(8081, () => {
  console.log('Viewer counter running on :8081');
});
