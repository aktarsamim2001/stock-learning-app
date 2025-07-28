import User from '../models/userModel.js';

// Helper to resolve speaker to ObjectId if username is sent
export async function resolveSpeakerId(speaker) {
  if (!speaker) return null;
  // If already a valid ObjectId string, return as is
  if (typeof speaker === 'string' && speaker.match(/^[0-9a-fA-F]{24}$/)) {
    return speaker;
  }
  // If it's a username, look up the user
  const user = await User.findOne({ name: speaker });
  if (user) return user._id;
  return null;
}
