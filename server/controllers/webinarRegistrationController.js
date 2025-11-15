import { validationResult } from 'express-validator';
import WebinarRegistration from '../models/webinarRegistrationModel.js';
import Webinar from '../models/webinarModel.js';
import nodemailer from 'nodemailer';

// @desc    Register for a webinar
// @route   POST /api/webinars/:id/register
// @access  Public
export const registerForWebinar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, phone, institute, year } = req.body;
  const webinarId = req.params.id;
  try {
    // Check if already registered
    const existing = await WebinarRegistration.findOne({ webinarId, email });
    if (existing) {
      return res.status(400).json({ message: 'You are already registered for this webinar.' });
    }
    // Save registration
    const registration = new WebinarRegistration({
      webinarId,
      name,
      email,
      phone,
      institute,
      year,
    });
    await registration.save();
    // Add attendee to Webinar's attendees array if not already present
    const webinar = await Webinar.findById(webinarId);
    if (webinar) {
      if (!webinar.attendees.some(a => a.email === email)) {
        webinar.attendees.push({ email });
        await webinar.save();
      }
      // Send confirmation email
      await sendConfirmationEmail({
        to: email,
        name,
        webinar,
      });
    }
    // Return updated webinar for frontend state sync
    res.status(201).json({ message: 'Registration successful. Confirmation email sent.', webinar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: Send confirmation email
async function sendConfirmationEmail({ to, name, webinar }) {
  // Configure your SMTP or use a service like SendGrid
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Modern, dark-themed HTML email template
  const html = `
  <div style="font-family: Arial, sans-serif, Helvetica; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; position: relative; overflow: hidden; border: 1px solid #333;">

    <div style="padding: 40px 30px 20px; text-align: center; position: relative; z-index: 10;">
      <img src="https://scontent.fccu16-1.fna.fbcdn.net/v/t39.30808-6/348823672_6976623595688268_8003113453763375012_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=muBdNsuRHnIQ7kNvwEctVab&_nc_oc=AdnqRopFUlTIuMV37obAhH7bpQHpajmAHwGDdcQLoubXajubH0kzTR6HcWSk-Dsm6KA&_nc_zt=23&_nc_ht=scontent.fccu16-1.fna&_nc_gid=pjvSz45UI7CKaqUpScZjHg&oh=00_AfbnKAgkd3KbJ2ZwyP6cMC_Tl_PCoNkNMX1WPDcXQ0Xytg&oe=68CBC1E6" alt="StopLoss Academy Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 12px; border-radius: 50%; box-shadow: 0 2px 12px rgba(13,110,253,0.15); background: #fff;" />
      <h2 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0 0 10px 0; line-height: 1.3;">Welcome to StopLoss Academy</h2>
      <p style="color: #ffffff; font-size: 16px; margin: 0; opacity: 0.9;">Hello <b>${name}</b>, Ready to transform your trading journey?</p>
    </div>

    <div style="padding: 20px 30px 40px; position: relative; z-index: 10;">
      <div style="background-color: rgba(13, 110, 253, 0.1); border: 1px solid rgba(13, 110, 253, 0.3); padding: 25px; margin-bottom: 25px; border-radius: 8px;">
        <h3 style="color: #0d6efd; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">📊 Master Stop Loss Strategies</h3>
        <p style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0; opacity: 0.9;">Learn proven stop loss techniques that protect your capital and maximize your profits. Our comprehensive course covers everything from basic concepts to advanced strategies used by professional traders.</p>
      </div>

      <div style="background: #222; color: #fff; border-radius: 8px; padding: 24px 18px 18px 18px; margin-bottom: 30px; border: 1px solid #333;">
        <h3 style="color: #0d6efd; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">Webinar Details</h3>
        <ul style="list-style:none; padding:0; margin:0; color:#fff; font-size:15px;">
          <li>🗓 <b>Date:</b> ${webinar.startTime ? new Date(webinar.startTime).toLocaleDateString('en-IN') : ''}</li>
          <li>⏰ <b>Time:</b> ${webinar.startTime ? new Date(webinar.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</li>
          <li>📡 <b>Zoom Link:</b> <a href="${webinar.link}" style="color:#0d6efd;">${webinar.link}</a></li>
          <li>📋 <b>Topic:</b> ${webinar.title}</li>
        </ul>
        <p style="color:#fff; font-size:13px; margin:18px 0 0 0; opacity:0.8;">Please join 5 minutes early. We look forward to seeing you there!</p>
      </div>

      <div style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; opacity: 0.8;">✅ Dedicated | 📱 User Friendly | 💬 Community Support</p>
        <p style="color: #0d6efd; font-size: 16px; font-weight: bold; margin: 0;">Join 1000+ Successful Traders</p>
      </div>
    </div>

          // <div style="text-align: center; margin: 40px 0;">
      //   <a href="https://yourwebsite.com/courses" style="display: inline-block; background-color: #0d6efd; color: #ffffff; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: bold; box-shadow: 0 8px 25px rgba(13, 110, 253, 0.4); border: 2px solid #0d6efd;">🎯 Start Learning Today</a>
      // </div>

    <div style="background-color: #16213e; padding: 30px; text-align: center; position: relative; z-index: 10; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="margin-bottom: 20px;">
        <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 0 0 15px 0;">📧 stoplossranaghat@gmail.com | 📞 +91 089180 18217</p>
      </div>
      <div style="margin-bottom: 20px;">
        <a href="{{unsubscribe_link}}" style="color: #0d6efd; text-decoration: none; font-size: 14px; margin: 0 15px;">Unsubscribe</a>
        <a href="#" style="color: #0d6efd; text-decoration: none; font-size: 14px; margin: 0 15px;">Privacy Policy</a>
        <a href="#" style="color: #0d6efd; text-decoration: none; font-size: 14px; margin: 0 15px;">Terms of Service</a>
      </div>
      <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px; margin: 0;">© 2024 StopLoss Academy. All rights reserved.<br/>Aishtala More, Ranaghat, India, West Bengal</p>
    </div>
  </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: `🎓 You're Registered – Stock Market Webinar Details Inside!`,
    html,
  };
  await transporter.sendMail(mailOptions);
}
