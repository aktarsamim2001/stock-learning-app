import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Webinar title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Webinar description is required'],
      minlength: [20, 'Description must be at least 20 characters long'],
    },
    speaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allow null for custom speaker names
      default: null,
    },
    speakerName: {
      type: String,
      trim: true,
      default: '',
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: 'Start time must be in the future'
      }
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot exceed 8 hours'],
    },
    link: {
      type: String,
      required: [true, 'Webinar link is required'],
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    price: {
      type: Number,
      default: 0 // 0 = free, >0 = paid
    },
    attendees: [{
      email: { type: String, trim: true, required: true },
      paid: { type: Boolean, default: false }
    }],
    recordingUrl: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Please enter a valid URL for the recording'
      }
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    maxAttendees: {
      type: Number,
      min: [1, 'Maximum attendees must be at least 1'],
      default: 100
    },
    learningOutcomes: [{
      type: String,
      trim: true,
    }],
    prerequisites: [{
      type: String,
      trim: true,
    }],
    agenda: [{
      time: { type: String, trim: true },
      topic: { type: String, trim: true },
      description: { type: String, trim: true },
    }],
    resources: [{
      name: { type: String, trim: true },
      type: { type: String, trim: true },
      url: { type: String, trim: true },
    }],
    longDescription: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
      default: 'English',
    },
    level: {
      type: String,
      trim: true,
      default: 'Intermediate',
    },
    speakerBio: {
      type: String,
      trim: true,
    },
    speakerExpertise: [{
      type: String,
      trim: true,
    }],
    speakerRole: {
      type: String,
      trim: true,
    },
    speakerCompany: {
      type: String,
      trim: true,
    },
    speakerExperience: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
webinarSchema.index({ startTime: 1 });
webinarSchema.index({ speaker: 1 });
webinarSchema.index({ status: 1 });
webinarSchema.index({ title: 'text', description: 'text' });

const Webinar = mongoose.model('Webinar', webinarSchema);

export default Webinar;