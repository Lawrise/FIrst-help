const Call = require('../models/Call');
const { broadcastUpdate } = require('../services/websocketservices');

exports.createDocument = async (req, res) => {
  try {
    const newCall = new Call(req.body);
    await newCall.save();

    broadcastUpdate(newCall);

    return res.status(201).json({ 
      message: "Call created", 
      data: newCall
    });
  } catch (error) {
    console.error("Error creating call:", error);
    return res.status(500).json({ 
      message: "Error creating call", 
      error: error.message 
    });
  }
};

exports.getCalls = async (req, res) => {
  try {
    const calls = await Call.find().lean();
    res.json(calls);
  } catch (error) {
    console.error("Error fetching calls:", error);
    res.status(500).json({ 
      message: "Error fetching calls", 
      error: error.message 
    });
  }
};