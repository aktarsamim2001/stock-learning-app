import { validationResult } from "express-validator";
import Contact from "../models/contactModel.js";
import { createNotification } from "./notificationController.js";
import User from "../models/userModel.js";
import ContactInfo from "../models/contactInfoModel.js";
import nodemailer from "nodemailer";

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const contact = new Contact({
      ...req.body,
    });

    const savedContact = await contact.save();

    // Find an admin to send notification to
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      console.error("No admin found in the system");
    } else {
      // Create notification for admin
      await createNotification(
        admin._id,
        "New Contact Form Submission",
        `${contact.name} has sent a message: ${contact.subject}`,
        "other",
        savedContact._id,
        "Contact"
      );
      // Send email to admin using the modern template
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        const html = `
                                <div style="font-family: Arial, sans-serif, Helvetica; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; position: relative; overflow: hidden; border: 1px solid #333;">
                                    <div style="padding: 40px 30px 20px; text-align: center; position: relative; z-index: 10;">
                                        <img src="https://scontent.fccu16-1.fna.fbcdn.net/v/t39.30808-6/348823672_6976623595688268_8003113453763375012_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=muBdNsuRHnIQ7kNvwEctVab&_nc_oc=AdnqRopFUlTIuMV37obAhH7bpQHpajmAHwGDdcQLoubXajubH0kzTR6HcWSk-Dsm6KA&_nc_zt=23&_nc_ht=scontent.fccu16-1.fna&_nc_gid=pjvSz45UI7CKaqUpScZjHg&oh=00_AfbnKAgkd3KbJ2ZwyP6cMC_Tl_PCoNkNMX1WPDcXQ0Xytg&oe=68CBC1E6" alt="StopLoss Academy Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 12px; border-radius: 50%; box-shadow: 0 2px 12px rgba(13,110,253,0.15); background: #fff;" />
                                        <h2 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0 0 10px 0; line-height: 1.3;">New Contact Form Submission</h2>
                                        <p style="color: #ffffff; font-size: 16px; margin: 0; opacity: 0.9;">A new message has been submitted via the website contact form.</p>
                                    </div>
                                    <div style="padding: 20px 30px 40px; position: relative; z-index: 10;">
                                        <div style="background: #222; color: #fff; border-radius: 8px; padding: 24px 18px 18px 18px; margin-bottom: 30px; border: 1px solid #333;">
                                            <h3 style="color: #0d6efd; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">Contact Details</h3>
                                            <ul style="list-style:none; padding:0; margin:0; color:#fff; font-size:15px;">
                                                <li><b>Name:</b> ${
                                                  contact.name
                                                }</li>
                                                <li><b>Email:</b> ${
                                                  contact.email
                                                }</li>
                                                <li><b>Phone:</b> ${
                                                  contact.phone || ""
                                                }</li>
                                                <li><b>Subject:</b> ${
                                                  contact.subject || ""
                                                }</li>
                                                <li><b>Message:</b> ${
                                                  contact.message
                                                }</li>
                                            </ul>
                                        </div>
                                        <div style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                            <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; opacity: 0.8;">✅ Dedicated | 📱 User Friendly | 💬 Community Support</p>
                                            <p style="color: #0d6efd; font-size: 16px; font-weight: bold; margin: 0;">StopLoss Academy Admin Panel</p>
                                        </div>
                                    </div>
                                    <div style="background-color: #16213e; padding: 30px; text-align: center; position: relative; z-index: 10; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                                        <div style="margin-bottom: 20px;">
                                            <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 0 0 15px 0;">📧 stoplossranaghat@gmail.com | 📞 +91 90647 51732</p>
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
          to: admin.email,
          subject: `New Contact Form Submission from ${contact.name}`,
          html,
        };
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error("Failed to send admin contact email:", mailErr);
      }
    }

    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort("-createdAt").limit(50);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact reply status
// @route   PATCH /api/contact/:id/reply
// @access  Private/Admin
export const markAsReplied = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { replied: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }
    res.json({ message: "Contact submission removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dynamic contact info from database
export const getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      // Optionally, create a default if not found
      info = await ContactInfo.create({
        email: "support@learninghub.com",
        phone: "+1 (234) 567-890",
        address: "123 Learning Street\nEducation City, ED 12345\nUnited States",
        socials: {
          facebook: "",
          twitter: "",
          linkedin: "",
        },
      });
    }
    res.json({
      email: info.email,
      phone: info.phone,
      address: info.address,
      socials: info.socials || { facebook: "", twitter: "", linkedin: "" },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load contact info." });
  }
};
