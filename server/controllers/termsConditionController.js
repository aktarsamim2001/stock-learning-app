import TermsCondition from "../models/termsConditionModel.js";

// Create new terms and conditions
export const createTermsCondition = async (req, res) => {
  try {
    await TermsCondition.updateMany({}, { isActive: false });

    const newTerms = await TermsCondition.create(req.body);
    res.status(201).json({
      success: true,
      data: newTerms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current active terms and conditions
export const getActiveTermsCondition = async (req, res) => {
  try {
    const terms = await TermsCondition.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "No active terms and conditions found",
      });
    }

    res.status(200).json({
      success: true,
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update terms and conditions
export const updateTermsCondition = async (req, res) => {
  try {
    const terms = await TermsCondition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "Terms and conditions not found",
      });
    }

    res.status(200).json({
      success: true,
      data: terms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all terms and conditions (for admin)
export const getAllTermsConditions = async (req, res) => {
  try {
    const terms = await TermsCondition.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: terms.length,
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
