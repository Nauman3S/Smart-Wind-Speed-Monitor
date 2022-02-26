const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const maxValueModel = require("../../models/maxValue");

router.put("/", async (req, res) => {
  try {
    let maxValue = await maxValueModel.findOneAndUpdate(
      { macAddress: req.body.macAddress },
      {
        maxTemperature: req.body.maxTemperature,
        maxPressure: req.body.maxPressure,
        maxHumidity: req.body.maxHumidity,
        maxWindSpeed: req.body.maxWindSpeed,
        maxBatteryLevel: req.body.maxBatteryLevel,
      }
    );
    return res.status(200).send("Max Values Setted");
  } catch (err) {
    console.log(err);
  }
});
router.post("/getValues", async (req, res) => {
  try {
    console.log(req.body.macAddress);
    let maxValues = await maxValueModel.findOne({
      macAddress: req.body.macAddress,
    });
    return res.status(200).send(maxValues);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
