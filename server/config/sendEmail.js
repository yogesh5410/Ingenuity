import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const SEND_GMAIL = process.env.SEND_GMAIL?.trim();
const GMAIL_USER = process.env.GMAIL_USER?.trim();

if (!SEND_GMAIL || !GMAIL_USER) {
  console.error("❌ SEND_GMAIL or GMAIL_USER is missing in the .env file");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: SEND_GMAIL,
  },
});

/**
 * Sends an email using Gmail SMTP.
 * @param {Object} options
 * @param {string} options.sendTo - Recipient email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.html - HTML content of the email.
 * @returns {Promise<Object>} - Info about the sent email.
 */
const sendEmail = async ({ sendTo, subject, html }) => {
  const recipient = sendTo?.trim().toLowerCase();

  const mailOptions = {
    from: `"Ingenuity CP Club" <${GMAIL_USER}>`,
    to: recipient,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    const accepted = info.accepted || [];
    const rejected = info.rejected || [];

    if (!accepted.includes(recipient) || rejected.includes(recipient)) {
      console.error('❌ Email was not accepted by SMTP:', {
        recipient,
        accepted,
        rejected,
        response: info.response,
      });
      throw new Error('Email was not accepted by the mail server');
    }

    console.log('📧 Email accepted:', {
      messageId: info.messageId,
      accepted,
      rejected,
      response: info.response,
    });
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send OTP email. Please try again later.');
  }
};

export default sendEmail;
