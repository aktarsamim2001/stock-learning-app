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
      if (!webinar.attendees.includes(email)) {
        webinar.attendees.push(email);
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
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: `🎓 You're Registered – Stock Market Webinar Details Inside!`,
    html: `<p>Hello <b>${name}</b>,</p>
      <p>Thank you for registering for our upcoming webinar:</p>
      <ul>
        <li>🗓 Date: ${webinar.startTime.toLocaleDateString('en-IN')}</li>
        <li>⏰ Time: ${new Date(webinar.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</li>
        <li>📡 Zoom Link: <a href="${webinar.link}">${webinar.link}</a></li>
        <li>📋 Topic: ${webinar.title}</li>
      </ul>
      <p>Please join 5 minutes early. We look forward to seeing you there!</p>
      <p>Regards,<br/>Team</p>`
  };
  await transporter.sendMail(mailOptions);
}
