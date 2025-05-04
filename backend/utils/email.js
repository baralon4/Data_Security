//mail connection

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "barproj7@gmail.com",
    pass: "xqnr dbja qdfj arak",
  },
});

module.exports = transporter;
