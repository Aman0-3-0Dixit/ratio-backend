const nodemailer = require("nodemailer");
const { generateTemplate } = require("./template");
const path = require("path");

const generateMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "138ce9df037149",
      pass: "37e1f5bc37e91c",
    },
  });

  return transporter;
};

exports.sendVerificationMail = async (options) => {
  const transport = generateMailTransporter();

  const { email, link } = options;

  const message = `Please verify yourself by clicking the link below. Thanks for your cooperation. :)`;

  transport.sendMail({
    to: email,
    subject: "Verification Link",
    from: "kshitijgupta2308@gmail.com",
    html: generateTemplate({
      title: "Verification Link from Ratio",
      message,
      logo: "cid:logo",
      banner: "cid:welcome",
      link,
      btnTitle: "Verify Account",
    }),

    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};
