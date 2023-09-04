const nodeMailer = require("nodemailer");


/*
sendEmail(options)
NAME
    sendEmail - Send an email using Nodemailer.
SYNOPSIS
    sendEmail = async (options);
    options -> An object containing email-related options.
        - email: The recipient's email address.
        - subject: The subject of the email.
        - message: The email message content.
DESCRIPTION
    This function uses the Nodemailer library to send an email with the provided options. It configures a transporter with the SMTP service, email, and password from environment variables. Then, it creates mail options with the recipient's email address, subject, and message. Finally, it sends the email using the configured transporter.
RETURNS
    No direct return value. Sends an email based on the provided options.
*/

const sendEmail = async(options) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    })

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    await transporter.sendMail(mailOptions);
}
/*    sendEmail = async (options); */
module.exports = sendEmail;