import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  socials: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  }
}, { timestamps: true });

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);
export default ContactInfo;
