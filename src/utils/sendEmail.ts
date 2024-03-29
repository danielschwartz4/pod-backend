import dotenv from "dotenv";
const sgMail = require("@sendgrid/mail");
dotenv.config();

// !! Make subject and text parameters
export async function sendEmail(to: string, html: string, subject: string) {
  await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to, // Change to your recipient
    from: "schwartzray8@gmail.com", // Change to your verified sender
    subject: subject,
    text: subject, // this cannot be empty for some reason
    html: html,
  };

  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: any) => {
      console.error(error);
      return error;
    });

  return true;
}

export async function sendCustomEmail(to: string) {
  await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to, // Change to your recipient
    from: "schwartzray8@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "My email text",
    html: "<strong>Poddds first auto email :)</strong>",
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
