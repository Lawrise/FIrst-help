// src/app.js
require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const { connectToDatabase, getCollection } = require('./config/db');
const elizaRoutes = require('./routes/elizaRoutes');
const cors = require('cors');

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket connection handling
wss.on('connection', async (ws) => {
  console.log('New WebSocket connection');

  try {
    // Send initial data
    const collection = getCollection();
    const calls = await collection.find({}).toArray();
    ws.send(JSON.stringify({ 
      type: 'initial_data', 
      data: calls 
    }));

    // Handle incoming messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);
        
        switch (data.type) {
          case 'update_call':
            // Update a call in MongoDB
            await collection.updateOne(
              { id: data.call.id },
              { $set: data.call }
            );
            // Broadcast updated data to all clients
            const updatedCalls = await collection.find({}).toArray();
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'calls_updated',
                  data: updatedCalls
                }));
              }
            });
            break;

          case 'add_call':
            // Add a new call to MongoDB
            await collection.insertOne(data.call);
            // Broadcast updated data
            const newCalls = await collection.find({}).toArray();
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'calls_updated',
                  data: newCalls
                }));
              }
            });
            break;

          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Error processing your request' 
        }));
      }
    });
  } catch (error) {
    console.error('Error in WebSocket connection:', error);
    ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Internal server error' 
    }));
  }

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB
connectToDatabase();

// Use REST API routes
app.use('/eliza', elizaRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
});

