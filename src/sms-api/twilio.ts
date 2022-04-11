import bodyParser from "body-parser";
import pino from "express-pino-logger";
import { Twilio } from "twilio";
import express from "express";

const app = express();

// Twilio client
let twilioClient: Twilio;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Add body parser for Twilio
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.set("port", 4001);

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

app.listen(app.get("port"));

// fetch("/api/messages", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(this.state.message),
// });
