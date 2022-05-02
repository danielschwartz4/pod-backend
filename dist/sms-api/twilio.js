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
const constants_1 = require("../constants");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: constants_1.__prod__
        ? process.env.VERCEL_APP
        : process.env.LOCALHOST_FRONTEND,
    credentials: true,
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("client/build"));
    app.get("*", (_, res) => {
        res.sendFile(path_1.default.join(__dirname, "client/build", "index.html"));
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
    console.log("hello");
    res.send({ "Hello World": "Hello World" });
});
app.listen(parseInt(process.env.PORT) || 4001, () => {
    console.log("server started on port 4001");
});
//# sourceMappingURL=twilio.js.map