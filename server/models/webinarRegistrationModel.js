import mongoose from 'mongoose';

const webinarRegistrationSchema = new mongoose.Schema({
  webinarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webinar',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  institute: {
    type: String,
    required: false, // No longer required
    trim: true,
  },
  year: {
    type: String,
    required: false, // No longer required
    trim: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const WebinarRegistration = mongoose.model('WebinarRegistration', webinarRegistrationSchema);

export default WebinarRegistration;
