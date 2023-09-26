const nodemailer = require("nodemailer");
//email carmed.contact4@gmail.com
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "carmed.contact4@gmail.com",
    pass: "kkeg vncz siuv isdp ",
  },
});


const sendEmail = (html, recieverEmail, subject) => transporter.sendMail({
    from: 'carmed.contact4@gmail.com', // sender address
    to:recieverEmail, // list of receivers
    subject: subject, // Subject line
    html, // html body
  });

module.exports = {
  sendEmail
}