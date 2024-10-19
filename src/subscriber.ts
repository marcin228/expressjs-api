import { User } from ".";

const { eventEmitter, EVENTS } = require("./eventEmitter");
const nodemailer = require("nodemailer");

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

type Transporter = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

function onProfileUpdated(user: User) {
  const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.domain.com",
    port: 465,
    secure: true,
    auth: {
      user: "sampleemail@domain.com",
      pass: "sampleemailpassword",
    },
  });

  const mailOptions: MailOptions = {
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
