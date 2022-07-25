require("dotenv").config();
const { workerData } = require("worker_threads");
const nodeMailer = require("nodemailer");

async function main() {
  console.log(workerData.description);

  //Transporter configuration
  let transporter = nodeMailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL, //REPLACE WITH YOUR EMAIL ADDRESS
      pass: process.env.PASSWORD, //REPLACE WITH YOUR EMAIL PASSWORD
    },
  });

  //Email configuration
  await transporter.sendMail({
    from: "akrao@live.in", //SENDER
    to: "akrao@live.in, testemail@test.com", //MULTIPLE RECEIVERS
    subject: "Hello", //EMAIL SUBJECT
    text: "This is a test email.", //EMAIL BODY IN TEXT FORMAT
    html: "<b>This is a test email.</b>", //EMAIL BODY IN HTML FORMAT
  });
}

main().catch((err) => console.log(err));
