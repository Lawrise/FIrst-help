const { Server } = require('ws');
const clients = new Set();

let wss;

function initializeWebSocket(server) {
  wss = new Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('Nouveau client WebSocket connecté');
    clients.add(ws);

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  return wss;
}

function broadcastUpdate(data) {
  const message = JSON.stringify({ type: 'update', data });
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

function sendInitialData(ws, data) {
  ws.send(JSON.stringify({
    type: 'initial',
    data
  }));
}

module.exports = {
  initializeWebSocket,
  broadcastUpdate,
  sendInitialData
};