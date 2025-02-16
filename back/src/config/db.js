const mongoose = require('mongoose');
require('dotenv').config();

let db;

async function connectToDatabase() {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = connection.connection.db; // Stocke la base de données
    console.log('Connexion à MongoDB réussie.');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
    process.exit(1);
  }
}

function getCollection(collectionName) {
  if (!db) throw new Error("DB non connectée");
  return db.collection(collectionName);
}

module.exports = { connectToDatabase, getCollection };
