import { validationResult } from 'express-validator';
import Webinar from '../models/webinarModel.js';
import { resolveSpeakerId } from './resolveSpeakerId.js';

// @desc    Create a new webinar
// @route   POST /api/webinars
// @access  Private/Instructor
export const createWebinar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Use resolveSpeakerId to support username or ObjectId
    let speakerId = req.body.speaker || req.user._id;
    let resolvedSpeakerId = null;
    // Only try to resolve if speaker is a valid ObjectId or a string that looks like an ObjectId
    if (speakerId && typeof speakerId === 'string' && speakerId.match(/^[0-9a-fA-F]{24}$/)) {
      resolvedSpeakerId = await resolveSpeakerId(speakerId);
    } else if (speakerId && typeof speakerId === 'object') {
      resolvedSpeakerId = await resolveSpeakerId(speakerId);
    }
    // If not found, but a custom name is provided, allow custom speaker
    if (!resolvedSpeakerId && req.body.speaker) {
      req.body.speakerName = req.body.speaker;
      req.body.speaker = null;
      req.body.speakerImage = req.body.speakerImage || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face";
    } else if (!resolvedSpeakerId) {
      req.body.speaker = null;
      req.body.speakerName = req.body.speakerName || '';
    } else {
      req.body.speaker = resolvedSpeakerId;
      req.body.speakerName = '';
    }
    // Price fallback
    if (typeof req.body.price !== 'number') req.body.price = 0;
    // startTime fallback
    if (!req.body.startTime) req.body.startTime = new Date();
    // endTime fallback (if not provided, set as startTime + duration minutes)
    if (!req.body.endTime) {
      const start = new Date(req.body.startTime);
      const duration = Number(req.body.duration) || 90;
      req.body.endTime = new Date(start.getTime() + duration * 60000);
    }
    // Webinar creation
    const webinar = new Webinar({
      ...req.body,
    });
    const createdWebinar = await webinar.save();
    await createdWebinar.populate('speaker', 'name email profileImage');
    
    res.status(201).json(createdWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all webinars
// @route   GET /api/webinars
// @access  Public
export const getWebinars = async (req, res) => {
  try {
    const { status, search, speaker } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (speaker) filter.speaker = speaker;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let webinars = await Webinar.find(filter)
      .populate('speaker', 'name email profileImage role company experience bio expertise')
      .sort({ startTime: 1 });

      console.log('webinars')
      console.log(webinars)

    // Always return a speaker object
    webinars = webinars.map(w => {
      const obj = w.toObject();
      if (!obj.speaker || typeof obj.speaker !== 'object') {
        obj.speaker = {
          _id: null,
          name: obj.speakerName || '',
          email: '',
          role: obj.speakerRole || '',
          company: obj.speakerCompany || '',
          bio: obj.speakerBio || '',
          expertise: obj.speakerExpertise || [],
          experience: obj.speakerExperience || '',
          profileImage: obj.speakerImage || '',
        };
      }
      delete obj.speakerName;
      delete obj.speakerRole;
      delete obj.speakerCompany;
      delete obj.speakerBio;
      delete obj.speakerExpertise;
      delete obj.speakerExperience;
      delete obj.speakerImage;
      return obj;
    });

    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get webinar by ID
// @route   GET /api/webinars/:id
// @access  Public
export const getWebinarById = async (req, res) => {
  try {
    let webinar = await Webinar.findById(req.params.id)
      .populate('speaker', 'name email profileImage role company experience bio expertise')
      .populate('attendees', 'name email');

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    let obj = webinar.toObject();
    if (!obj.speaker || typeof obj.speaker !== 'object') {
      obj.speaker = {
        _id: null,
        name: obj.speakerName || '',
        email: '',
        role: obj.speakerRole || '',
        company: obj.speakerCompany || '',
        bio: obj.speakerBio || '',
        expertise: obj.speakerExpertise || [],
        experience: obj.speakerExperience || '',
        profileImage: obj.speakerImage || '',
      };
    }
    delete obj.speakerName;
    delete obj.speakerRole;
    delete obj.speakerCompany;
    delete obj.speakerBio;
    delete obj.speakerExpertise;
    delete obj.speakerExperience;
    delete obj.speakerImage;

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update webinar
// @route   PUT /api/webinars/:id
// @access  Private/Instructor
export const updateWebinar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.speaker && webinar.speaker.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this webinar' });
    }

    // Robust fallback: if speaker is not a valid ObjectId, treat as custom name (for both create and update)
    if (req.body.speaker && (typeof req.body.speaker !== 'string' || !req.body.speaker.match(/^[0-9a-fA-F]{24}$/))) {
      req.body.speakerName = req.body.speaker;
      req.body.speaker = null;
      req.body.speakerImage = req.body.speakerImage || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face";
    }
    // Price fallback
    if (typeof req.body.price !== 'number') req.body.price = webinar.price || 0;
    // startTime fallback
    if (!req.body.startTime) req.body.startTime = webinar.startTime || new Date();
    // endTime fallback (if not provided, set as startTime + duration minutes)
    if (!req.body.endTime) {
      const start = new Date(req.body.startTime);
      const duration = Number(req.body.duration) || Number(webinar.duration) || 90;
      req.body.endTime = new Date(start.getTime() + duration * 60000);
    }
    // Allow zoomUrl update
    if (typeof req.body.zoomUrl === 'undefined') req.body.zoomUrl = webinar.zoomUrl || '';

    const updatedWebinar = await Webinar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('speaker', 'name email profileImage');

    res.json(updatedWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete webinar
// @route   DELETE /api/webinars/:id
// @access  Private/Instructor
import mongoose from 'mongoose';

export const deleteWebinar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid webinar ID' });
    }
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }


    // If webinar.speaker is null (custom speaker), only admin can delete
    if (!webinar.speaker && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this webinar (custom speaker webinars can only be deleted by admin)' });
    }
    if (webinar.speaker && webinar.speaker.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this webinar' });
    }

  await Webinar.deleteOne({ _id: webinar._id });
  res.json({ message: 'Webinar removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for webinar
// @route   PATCH /api/webinars/register/:id
// @access  Private
export const registerForWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.status === 'cancelled') {
      return res.status(400).json({ message: 'This webinar has been cancelled' });
    }

    if (webinar.startTime < new Date()) {
      return res.status(400).json({ message: 'This webinar has already started or ended' });
    }

    if (webinar.attendees.length >= webinar.maxAttendees) {
      return res.status(400).json({ message: 'Webinar has reached maximum capacity' });
    }

    if (webinar.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this webinar' });
    }

    webinar.attendees.push(req.user._id);
    await webinar.save();

    const populatedWebinar = await Webinar.findById(webinar._id)
      .populate('speaker', 'name email profileImage')
      .populate('attendees', 'name email');

    res.json(populatedWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update webinar status
// @route   PATCH /api/webinars/:id/status
// @access  Private/Instructor
export const updateWebinarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.speaker.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this webinar' });
    }

    webinar.status = status;
    await webinar.save();

    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user is registered for a webinar
// @route   GET /api/webinars/:id/is-registered
// @access  Private
export const isRegisteredForWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }
    const registered = webinar.attendees.some(
      (att) => att.toString() === req.user._id.toString()
    );
    res.json({ registered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};