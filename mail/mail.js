import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: "mlsn.486fabf213f0b0838002cee517daad9cd66a17d36619c1d72c18b90f80b0122a",
});
console.log("mailerSend:",mailerSend);

const sentFrom = new Sender("sixsagepath83@gmail.com", "Kaushtubh");
const email = "chandany0861@gmail.com";
const recipients = [
  new Recipient(email, "Your Client")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject("This is a Subject")
  .setHtml("<strong>This is the HTML content</strong>")
  .setText("This is the text content");

const result = await mailerSend.email.send(emailParams);
console.log("result",result);