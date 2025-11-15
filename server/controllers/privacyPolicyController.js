import PrivacyPolicy from "../models/privacyPolicyModel.js";

// Create new privacy policy
export const createPrivacyPolicy = async (req, res) => {
  try {
    // Set all existing policies to inactive
    await PrivacyPolicy.updateMany({}, { isActive: false });

    const newPolicy = await PrivacyPolicy.create(req.body);
    res.status(201).json({
      success: true,
      data: newPolicy,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current active privacy policy
export const getActivePrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "No active privacy policy found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update privacy policy
export const updatePrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all privacy policies (for admin)
export const getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
