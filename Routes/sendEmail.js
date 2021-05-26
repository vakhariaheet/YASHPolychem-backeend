const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: "kunal@gmail.com",
    subject,
    html,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
module.exports = sendEmail;
