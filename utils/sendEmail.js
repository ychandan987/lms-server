import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

// ✅ Initialize MailerSend client
const mailerSend = new MailerSend({
  apiKey: "mlsn.486fabf213f0b0838002cee517daad9cd66a17d36619c1d72c18b90f80b0122a",
});

// ✅ Sender info
const sentFrom = new Sender(
  "sixsagepath83@gmail.com",
  "Kaushtubh Yadav"
);
console.log("Sender Info:", sentFrom);


/**
 * Send an email using MailerSend
 * @param {string} toEmail - recipient email
 * @param {string} toName - recipient name
 * @param {string} subject - email subject
 * @param {string} html - HTML content
 * @param {string} text - plain text content
 */
export const sendMail = async (toEmail, toName, subject, html, text) => {
  try {
    const recipients = [new Recipient(toEmail, toName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(html)
      .setText(text);

    const result = await mailerSend.email.send(emailParams);
    console.log('📨 Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};




