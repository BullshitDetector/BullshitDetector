// src/lib/smtp.ts
import nodemailer from 'nodemailer';

interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
}

const config: SMTPConfig = {
  host: process.env.SMTP_HOST || 'smtp.r3alm.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  username: process.env.SMTP_USERNAME || 'no-reply@r3alm.com',
  password: process.env.SMTP_PASSWORD || 'Z3us!@#$1r3alm',
  secure: process.env.SMTP_SECURE === 'true',
};

if (!config.username || !config.password) {
  console.warn('SMTP config incomplete. Email sending disabled. Set SMTP_USERNAME and SMTP_PASSWORD in .env.');
}

export async function sendEmail(to: string, subject: string, text: string, from?: string) {
  if (!config.username || !config.password) {
    throw new Error('SMTP config not set. Check .env for SMTP_USERNAME and SMTP_PASSWORD.');
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  });

  const mailOptions = {
    from: from || `"Bullshit Detector" <${config.username}>`,
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
}