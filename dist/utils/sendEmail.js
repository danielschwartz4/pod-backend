"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomEmail = exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sgMail = require("@sendgrid/mail");
dotenv_1.default.config();
async function sendEmail(to, html, subject) {
    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: to,
        from: "schwartzray8@gmail.com",
        subject: subject,
        text: "",
        html: html,
    };
    await sgMail
        .send(msg)
        .then(() => {
        console.log("Email sent");
    })
        .catch((error) => {
        console.error(error);
    });
}
exports.sendEmail = sendEmail;
async function sendCustomEmail(to) {
    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: to,
        from: "schwartzray8@gmail.com",
        subject: "Sending with SendGrid is Fun",
        text: "My email text",
        html: null,
    };
    await sgMail
        .send(msg)
        .then(() => {
        console.log("Email sent");
    })
        .catch((error) => {
        console.error(error);
    });
}
exports.sendCustomEmail = sendCustomEmail;
//# sourceMappingURL=sendEmail.js.map