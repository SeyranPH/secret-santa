const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const data = require("./data.js");

const sgApiKey = process.env.SENDGRID_API_KEY;
const templateId = process.env.TEMPLATE_ID
const senderEmail = process.env.SENDER_EMAIL
const senderName = process.env.SENDER_NAME

sgMail.setApiKey(sgApiKey);

async function sendEmail({ to, giftTo }) {
  const msg = {
    to: to,
    from: {
      name: senderName,
      email: senderEmail,
    },
    template_id: templateId,
    dynamicTemplateData: {
      giftTo: giftTo,
    },
  };
  const result = await sgMail.send(msg);
  return result;
}

module.exports = { sendEmail };
