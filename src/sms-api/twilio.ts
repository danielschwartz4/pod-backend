import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Twilio } from "twilio";
import dotenv from "dotenv";
dotenv.config();

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

app.post("/api/messages", (req, res) => {
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

app.get("/api/hello", (_, res) => {
  console.log("hello");
  res.send({ "Hello World": "Hello World" });
});

app.listen(4001, () => {
  console.log("server started on port 4001");
});
