import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { SEND_GMAIL, GMAIL_USER } = process.env;

if (!SEND_GMAIL || !GMAIL_USER) {
  throw new Error("SEND_GMAIL or GMAIL_USER is missing");
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
  const mailOptions = {
    from: `"Ingenuity CP Club" <${GMAIL_USER}>`,
    to: sendTo,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
