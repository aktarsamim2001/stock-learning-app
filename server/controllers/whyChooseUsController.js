import WhyChooseUs from '../models/whyChooseUsModel.js';

// Get all Why Choose Us items (public)
export const getWhyChooseUs = async (req, res) => {
  try {
    const items = await WhyChooseUs.find({ isActive: true }).sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create (admin)
export const createWhyChooseUs = async (req, res) => {
  try {
    const item = new WhyChooseUs(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update (admin)
export const updateWhyChooseUs = async (req, res) => {
  try {
    const item = await WhyChooseUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete (admin)
export const deleteWhyChooseUs = async (req, res) => {
  try {
    const item = await WhyChooseUs.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
