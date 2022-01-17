const mongoose = require("mongoose");

let maxValueSchema = mongoose.Schema(
  {
    macAddress: {
      type: String,
    },
    maxTemperature: {
      type: String,
    },
    maxPressure: {
      type: String,
    },
    maxHumidity: {
      type: String,
    },
    maxWindSpeed: {
      type: String,
    },
    maxBatteryLevel: {
      type: String,
    },
  },
  { timestamps: true }
);
let maxValueModel = new mongoose.model("MaxValue", maxValueSchema);

module.exports = maxValueModel;
