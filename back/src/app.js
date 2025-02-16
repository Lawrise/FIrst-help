require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("ws");
const { connectToDatabase } = require("./config/db");
const elizaRoutes = require("./routes/elizaRoutes");
const Call = require("./models/Call");

const app = express();
const server = http.createServer(app);

// Configuration des ports
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

// Serveur WebSocket
const wss = new Server({ port: WS_PORT });
const clients = new Set();

// Configuration de base
app.use(express.json());

async function startServer() {
  await connectToDatabase();
  
  // Routes
  app.use("/eliza", elizaRoutes);

  // Démarrage du serveur Express
  server.listen(EXPRESS_PORT, () => {
    console.log(`Serveur Express démarré sur le port ${EXPRESS_PORT}`);
  });
}

// Gestion WebSocket
wss.on('connection', async (ws) => {
  console.log(`Nouveau client WebSocket connecté sur le port ${WS_PORT}`);
  clients.add(ws);

  try {
    // Récupérer tous les appels de la BDD
    const calls = await Call.find()
      .lean() // Pour convertir en objets JSON simples
      .exec();  // Pour s'assurer que la promesse est résolue

    // Envoyer les données au client
    ws.send(JSON.stringify({ 
      type: 'initial', 
      calls: calls 
    }));

    console.log(`Envoyé ${calls.length} appels au client`);
  } catch (error) {
    console.error('Erreur lors de la récupération des appels:', error);
    ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Erreur lors de la récupération des données' 
    }));
  }

  // ... reste du code

});

// Route POST
app.post("/calls", async (req, res) => {
  try {
    const newCall = new Call(req.body);
    await newCall.save();

    broadcastUpdate({
      _id: newCall._id,
      ...req.body // Spread operator pour les autres champs
    });

    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de l'enregistrement", 
      error: error.message 
    });
  }
});

function broadcastUpdate(data) {
  const message = JSON.stringify({ type: 'update', data });
  clients.forEach(client => {
    if (client.readyState === 1) client.send(message);
  });
}

// Démarrage global
startServer().catch(error => {
  console.error('Échec du démarrage du serveur:', error);
  process.exit(1);
});

wss.on('listening', () => {
  console.log(`Serveur WebSocket démarré sur le port ${WS_PORT}`);
});