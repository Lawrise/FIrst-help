const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: { type: String, required: true },
    accident: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String }, // Optionnel
    dateTime: { type: Date, default: Date.now }, // Optionnel
});

module.exports = mongoose.model('Call', callSchema);