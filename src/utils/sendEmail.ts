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

// async..await is not allowed in global scope, must use a wrapper
// export async function sendEmail(to: string, html: string) {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   // let testAccount = await nodemailer.createTestAccount();
//   // console.log('testAccount', testAccount)

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "wpcaadrh2nryhmq7@ethereal.email", // generated ethereal user
//       pass: "3FepvCfqfUsncErHPS", // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: to, // list of receivers
//     subject: "Change password", // Subject line
//     html: html,
//   });

//   console.log("Message sent: %s", info.messageId);

//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }
