import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import pino from "express-pino-logger";
require("dotenv").config();

import { Twilio } from "twilio";

// Twilio client
let twilioClient: Twilio;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // credentials: true,
  })
);

// Add body parser for Twilio
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(pino);

app.post("/api/messages", (req, res) => {
  console.log("text message");
  console.log(req.body);
  res.header("Content-Type", "application/json");
  twilioClient.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body,
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.get("/api/hello", (req, res) => {
  console.log("hello");
  res.send({ "Hello World": "Hello World" });
});

app.listen(4001, () => {
  console.log("server started on port 4001");
});

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log("HELELOEOOO");
// console.log(process.env.TWILIO_ACCOUNT_SID);
// const client = require("twilio")(accountSid, authToken);

// client.messages
//   .create({
//     messagingServiceSid: "MG6fe5a438dbe492eeb092926d2aaeee74",
//     // from: process.env.TWILIO_PHONE_NUMBER,
//     to: "+12173817277",
//     body: "hello!",
//   })
//   .then((message: any) => console.log(message.sid))
//   .done();
