"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { eventEmitter, EVENTS } = require("./eventEmitter");
const nodemailer = require("nodemailer");
function onProfileUpdated(user) {
  const transporter = nodemailer.createTransport({
    host: "smtp.domain.com",
    port: 465,
    secure: true,
    auth: {
      user: "sampleemail@domain.com",
      pass: "sampleemailpassword",
    },
  });
  const mailOptions = {
    from: '"Node App Notification" <sampleemail@domain.com>',
    to: user.email,
    subject: "User profile has been changed!",
    text: `Hello ${user.fname}, your profile has been changed!`,
    html: `Hello <b>${user.fname}</b>, your profile has been changed!`,
  };
  console.log("Email has been sent to " + user.email);
  console.log(transporter, mailOptions);
  //transporter.sendMail(mailOptions, (err, info) => {});
}
eventEmitter.on(EVENTS.PROFILE_UPDATED, onProfileUpdated);
