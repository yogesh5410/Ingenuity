export default function verifyEmailTemplate({ name, otp }) {
  const displayName = name?.trim() || "there"

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #0d6efd; border-bottom: 2px solid #0d6efd; padding-bottom: 10px;">
        Ingenuity CP Club – Email Verification
      </h2>
      <p style="font-size: 16px;">
        Hello <strong>${displayName}</strong>,
      </p>
      <p style="font-size: 16px;">
        Thank you for registering with <strong>Ingenuity</strong>, the Competitive Programming Club of IIT Bhilai.
      </p>
      <p style="font-size: 16px;">
        Please use the following OTP to verify your email:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #0d6efd; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555;">
        This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
      </p>
      <hr style="margin-top: 30px;">
      <footer style="text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} Ingenuity CP Club, IIT Bhilai
      </footer>
    </div>
  `
}
