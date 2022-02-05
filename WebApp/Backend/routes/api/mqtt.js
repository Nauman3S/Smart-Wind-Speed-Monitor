const mqtt = require("mqtt");
const express = require("express");
const router = express.Router();
const mqttMessgae = require("../../models/mqttmessage");

const topic = "wsmdata/#";
const host = "34.214.65.82";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;
let client;
//Get all Devices Data
router.get("/", async (req, res) => {
  try {
    let mqttMessgaes = await mqttMessgae.find();

    res.send(mqttMessgaes);
  } catch (err) {
    console.log(err);
  }
});

//To Get one Device Data using MacAddress
router.post("/getOne", async (req, res) => {
  try {
    let mqttMessgaes = await mqttMessgae.find({
      macAddress: req.body.macAddress,
    });
    return res.send(mqttMessgaes);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
// router.post();
router.post("/", async (req, res) => {
  try {
    client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000000,
      username: "hello",
      password: "hello",
      reconnectPeriod: 1000000,
    });

    client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
      });
    });

    client.on("message", async (topic, payload) => {
      let message = JSON.parse(payload);
      console.log("Received Message:", topic, message);

      // const macAdrs = topic.split("/");

      console.log(message);
      // let macAd = message.macAddress;
      let mqttMsg = new mqttMessgae({
        macAddress: message.macAddress,
        temperature: message.temperature,
        pressure: message.pressure,
        humidity: message.humidity,
        windSpeed: message.windSpeed,
        batteryLevel: message.batteryLevel,
        longitude: message.longitude,
        latitude: message.latitude,
      });
      mqttMsg.save();
    });
    res.send("DATA SAVED");
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/publish/:macAddress/", async (req, res) => {
  try {
    let { message } = req.body;

    console.log(message);

    client.publish(
      `${req.params.macAddress}/wsm`,
      message,
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
    return res.status(200).send("Message Published  ");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
