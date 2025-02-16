// src/app.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("ws");
const { connectToDatabase } = require("./config/db");
const elizaRoutes = require("./routes/elizaRoutes");
const Call = require("./models/Call");

const app = express();
const server = http.createServer(app);

// Configuration des ports séparés
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

// Création d'un serveur WebSocket séparé
const wss = new Server({ port: WS_PORT });

app.use(express.json());
connectToDatabase();
app.use("/eliza", elizaRoutes);

// Gestion des WebSockets
const clients = new Set();

wss.on('connection', (ws) => {
    console.log(`Nouveau client WebSocket connecté sur le port ${WS_PORT}`);
    
    clients.add(ws);
    
    // Envoyer les appels existants au nouveau client
    Call.find({})
        .sort({ dateTime: -1 })
        .limit(10)
        .then(calls => {
            ws.send(JSON.stringify({
                type: 'initial',
                calls: calls
            }));
        })
        .catch(err => console.error('Erreur lors de la récupération des appels:', err));

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client WebSocket déconnecté');
    });

    ws.on('error', (error) => {
        console.error('Erreur WebSocket:', error);
        clients.delete(ws);
    });
});

const broadcastUpdate = (data) => {
    const message = JSON.stringify({
        type: 'update',
        data: data
    });

    for (const client of clients) {
        if (client.readyState === 1) {
            client.send(message);
        }
    }
};

app.post("/calls", async (req, res) => {
    try {
        const newCall = new Call(req.body);
        await newCall.save();

        broadcastUpdate({
            _id: newCall._id,
            name: newCall.name,
            priority: newCall.priority,
            accident: newCall.accident,
            location: newCall.location,
            description: newCall.description,
            dateTime: newCall.dateTime,
        });

        res.status(201).json(newCall);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de l'enregistrement de l'appel", 
            error: error.message 
        });
    }
});

// Démarrage des serveurs sur des ports différents
server.listen(EXPRESS_PORT, () => {
    console.log(`Serveur Express démarré sur le port ${EXPRESS_PORT}`);
});

wss.on('listening', () => {
    console.log(`Serveur WebSocket démarré sur le port ${WS_PORT}`);
});