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
  port: emailCfg.smtpPort || 587,
  secure: emailCfg.smtpPort === 465,
  auth: { user: emailCfg.smtpUser, pass: emailCfg.smtpPass }
});

console.log("Sending test mail via nodemailer...");
transporter.sendMail({
  from: `"GAdigital Solution" <${emailCfg.smtpUser}>`,
  to: "shivaratrimanikanth@gmail.com",
  subject: "Test Welcome Email from Node.js",
  html: "This is a test welcome email from Node.js."
}).then(info => {
  console.log("Email sent successfully:", info);
}).catch(err => {
  console.error("Email send failed:", err);
});
