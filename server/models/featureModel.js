import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  icon: { type: String, required: true }, // e.g. lucide icon name or image url
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Feature', featureSchema);
