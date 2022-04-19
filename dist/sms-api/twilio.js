"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const twilio_1 = require("twilio");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.VERCEL_APP,
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
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
//# sourceMappingURL=twilio.js.map