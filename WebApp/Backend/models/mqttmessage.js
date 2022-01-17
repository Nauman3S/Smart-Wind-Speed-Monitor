const mongoose = require("mongoose");

let mqttMessageSchema = mongoose.Schema(
  {
    macAddress: {
      type: String,
    },
    temperature: {
      type: String,
    },
    pressure: {
      type: String,
    },
    humidity: {
      type: String,
    },
    windSpeed: {
      type: String,
    },
    batteryLevel: {
      type: String,
    },
  },
  { timestamps: true }
);
let mqttMessageModel = new mongoose.model("Mqttmessage", mqttMessageSchema);

module.exports = mqttMessageModel;
