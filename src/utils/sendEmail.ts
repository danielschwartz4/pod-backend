import dotenv from "dotenv";
const sgMail = require("@sendgrid/mail");
dotenv.config();

export async function sendEmail(to: string, html: string) {
  await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to, // Change to your recipient
    from: "schwartzray8@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "My email text",
    html: html,
  };

  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: any) => {
      console.error(error);
    });
}