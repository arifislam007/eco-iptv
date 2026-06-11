const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8081 });
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
  console.log(`[+] Viewer joined  — total: ${viewers}`);

  ws.on('close', () => {
    viewers = Math.max(0, viewers - 1);
    broadcast();
    console.log(`[-] Viewer left   — total: ${viewers}`);
  });

  ws.on('error', () => {});
});

console.log('Live viewer WebSocket server running on :8081');
