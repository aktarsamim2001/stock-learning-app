import Feature from '../models/featureModel.js';

// Get all features
export const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find().sort({ order: 1 });
    res.json(features);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch features' });
  }
};

// Create a new feature
export const createFeature = async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();
    res.status(201).json(feature);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create feature', error: err.message });
  }
};

// Update a feature
export const updateFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feature) return res.status(404).json({ message: 'Feature not found' });
    res.json(feature);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update feature', error: err.message });
  }
};

// Delete a feature
export const deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) return res.status(404).json({ message: 'Feature not found' });
    res.json({ message: 'Feature deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete feature', error: err.message });
  }
};
