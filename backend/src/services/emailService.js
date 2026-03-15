const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = require('../config/env');

const createTransporter = () =>
  nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

const sendMail = async (to, subject, html) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
  console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  return info;
};

const sendApprovalEmail = (user) => {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#4f46e5;">🎉 Account Approved!</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your DecentraVote account has been <strong style="color:green;">approved</strong>. You can now log in and participate in elections.</p>
      <a href="${process.env.CLIENT_URL}/login"
         style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">
        Login Now
      </a>
      <p style="margin-top:24px;color:#666;">— The DecentraVote Team</p>
    </div>
  `;
  return sendMail(user.email, 'Your DecentraVote Account Has Been Approved', html);
};

const sendRejectionEmail = (user, reason) => {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#dc2626;">Account Application Update</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Unfortunately your registration request has been <strong style="color:red;">rejected</strong>.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>If you believe this is a mistake, please contact the administrator.</p>
      <p style="margin-top:24px;color:#666;">— The DecentraVote Team</p>
    </div>
  `;
  return sendMail(user.email, 'DecentraVote Account Application Update', html);
};

module.exports = { sendApprovalEmail, sendRejectionEmail, sendMail };
