const express = require("express");
const http = require("http");
const { connectToDatabase } = require("./config/db");
const elizaRoutes = require("./routes/elizaRoutes");
const { initializeWebSocket, sendInitialData } = require("./services/websocketservices");
const Call = require("./models/Call");

const app = express();
const server = http.createServer(app);

async function startServer() {
  await connectToDatabase();
  
  // Initialize WebSocket
  const wss = initializeWebSocket(server);
  
  wss.on('connection', async (ws) => {
    try {
      // Envoyer les données initiales
      const calls = await Call.find().lean();
      sendInitialData(ws, calls);
    } catch (error) {
      console.error('Erreur lors de la récupération des appels:', error);
    }
  });

  app.use(express.json());
  app.use("/eliza", elizaRoutes);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Échec du démarrage du serveur:', error);
  process.exit(1);
});