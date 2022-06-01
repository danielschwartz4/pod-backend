import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Twilio } from "twilio";
import dotenv from "dotenv";
import { __prod__ } from "../constants";
import path from "path";
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
app.set("trust proxy", 1);

app.use(
  cors({
    origin: __prod__
      ? (process.env.VERCEL_APP as string)
      : (process.env.LOCALHOST_FRONTEND as string),
    credentials: true,
  })
);

// Add body parser for Twilio
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

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
  res.send({ "Hello World": "Hello World" });
});

app.listen(parseInt(process.env.PORT as string) || 4001, () => {
  console.log("server started on port 4001");
});
