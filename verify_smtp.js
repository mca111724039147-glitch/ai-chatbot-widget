const nodemailer = require('nodemailer');

const emailCfg = {
  "enabled": true,
  "adminEmail": "shivaratrimanikanth@gmail.com",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUser": "amarangabadukrishnaveni@gmail.com",
  "smtpPass": "oyyc npzp omgo qayl"
};

const transporter = nodemailer.createTransport({
  host: emailCfg.smtpHost,
  port: emailCfg.smtpPort,
  secure: emailCfg.smtpPort === 465,
  auth: { user: emailCfg.smtpUser, pass: emailCfg.smtpPass }
});

console.log("Verifying SMTP connection...");
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP verification failed:");
    console.error(error);
  } else {
    console.log("SMTP server is ready to take our messages!");
  }
});
