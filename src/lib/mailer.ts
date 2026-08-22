import nodemailer from "nodemailer";
interface SendOtpEmailProps {
  email: string;
  otp: string;
  name: string;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export async function sendOtpEmail({ email, otp, name }: SendOtpEmailProps) {
  const info = await transporter.sendMail({
    from: `"Expense App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">

        <h2>Password Reset</h2>

        <p>Hello ${name},</p>

        <p>
          We received a request to reset your password.
          Use the OTP below:
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 25px 0;
          "
        >
          ${otp}
        </div>

        <p>
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't request a password reset,
          you can safely ignore this email.
        </p>

        <p>Thanks,<br />Expense Team</p>

      </div>
    `,
  });

  console.log("Email sent:", info.messageId);

  return info;
}
