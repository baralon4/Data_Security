//mail connection

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "barproj7@gmail.com",
    pass: "ikou qbej kczg suhs", 
  },
});

module.exports = transporter;
