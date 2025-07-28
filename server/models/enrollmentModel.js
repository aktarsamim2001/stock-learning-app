import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    quizResults: [quizResultSchema],
    
    // ✅ Updated: Added 'free' as valid status
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'free'],
      default: 'pending',
    },

    // ✅ Updated: Only required for 'completed' (paid) status
    paymentId: {
      type: String,
      required: function () {
        return this.paymentStatus === 'completed';
      },
      default: '',
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    notes: [
      {
        content: String,
        lessonId: mongoose.Schema.Types.ObjectId,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookmarks: [
      {
        lessonId: mongoose.Schema.Types.ObjectId,
        timestamp: Number,
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Ensure unique enrollment per user and course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// ✅ Index for user enrollments query
enrollmentSchema.index({ userId: 1, createdAt: -1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
