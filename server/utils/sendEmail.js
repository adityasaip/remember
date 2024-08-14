const nodemailer = require('nodemailer')

// need transporter object to send emails
// transporter - object that can send email
// transport - transport configuration object, connection url or a transport plugin instance
// defaults - object that defines default values for mail options

let transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    Port: 587,  // smtp port
    secure: false,  // use TLS
    auth: {
        user: '7a4bad001@smtp-brevo.com',
        pass: 'dnP3OJz6GhWE2CsY'
    }
})

let mailOptions = {
    from: 'adityasai6009@gmail.com',
    to: 'recipient@example.com',
    subject: 'Please Verify Your Email Address', // Subject line
    text: `Hello,\n\nPlease verify your email address by clicking the following link:\n\nhttps://example.com/verify?token=123456\n\nThank you!`, // Plain text body
    html: `<p>Hello,</p><p>Please verify your email address by clicking the following link:</p><p><a href="https://example.com/verify?token=123456">Verify your email</a></p><p>Thank you!</p>`
}

// Send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error:', error);
    }
    console.log('Message sent:', info.messageId);
  });