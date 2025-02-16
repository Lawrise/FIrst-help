// src/models/Call.js
const mongoose = require("mongoose");
const { idleTimeoutMillis } = require("pg/lib/defaults");

const callSchema = new mongoose.Schema({
  uuid: String,
  id: String,
  name: String,
  priority: String,
  accident: String,
  location: String,
  description: String,
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Call", callSchema);
