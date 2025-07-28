import Stat from '../models/statModel.js';

// Get all stats
export const getStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// Create a new stat
export const createStat = async (req, res) => {
  try {
    const stat = new Stat(req.body);
    await stat.save();
    res.status(201).json(stat);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create stat', error: err.message });
  }
};

// Update a stat
export const updateStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    res.json(stat);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update stat', error: err.message });
  }
};

// Delete a stat
export const deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    res.json({ message: 'Stat deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete stat', error: err.message });
  }
};
