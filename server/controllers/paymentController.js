import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import { createNotification } from "./notificationController.js";
import { validationResult } from "express-validator";

console.log("DEBUG RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("DEBUG RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
// Validate Razorpay configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Missing Razorpay credentials:", {
    keyId: process.env.RAZORPAY_KEY_ID ? "Present" : "Missing",
    keySecret: process.env.RAZORPAY_KEY_SECRET ? "Present" : "Missing",
  });
  throw new Error(
    "Razorpay key_id or key_secret is missing. Check your .env file and environment setup."
  );
}

let razorpay;
try {
  // Log the actual values being used (mask the secret)
  console.log("Initializing Razorpay with:", {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
      ? "****" + process.env.RAZORPAY_KEY_SECRET.slice(-4)
      : undefined,
  });

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Verify the instance is properly initialized
  if (!razorpay.orders) {
    throw new Error("Razorpay instance missing orders API");
  }

  console.log("Razorpay initialized successfully");
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
  throw error;
}

// @desc    Create payment intent
// @route   POST /api/payments/create
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    console.log("Creating payment intent with body:", req.body);

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      console.log("error", errors);
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    if (!req.body.courseId) {
      console.error("Missing courseId in request body");
      return res.status(400).json({ message: "Course ID is required" });
    }

    const { courseId } = req.body;
    console.log("Looking up course:", courseId);

    const course = await Course.findById(courseId);
    if (!course) {
      console.error("Course not found:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate course status and availability
    if (!course.published || !course.approved) {
      console.error("Course is not available:", courseId, {
        published: course.published,
        approved: course.approved,
      });
      return res
        .status(400)
        .json({ message: "Course is not available for enrollment" });
    }

    // Check if user is already enrolled
    console.log("Checking enrollment for user:", req.user._id);
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: courseId,
    });

    if (existingEnrollment) {
      console.error("User already enrolled:", req.user._id);
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Ensure course has a valid price
    if (!course.price || course.price < 0) {
      console.error("Invalid course price:", course.price);
      return res.status(400).json({ message: "Invalid course price" });
    }

    console.log("Creating Razorpay order for amount:", course.price);

    try {
      // Check if there's a pending payment for this course
      const existingPendingPayment = await Payment.findOne({
        userId: req.user._id,
        courseId: courseId,
        status: "pending",
      });

      if (existingPendingPayment) {
        console.log(
          "Found existing pending payment, returning it:",
          existingPendingPayment
        );
        return res.json({
          orderId: existingPendingPayment.orderId,
          amount: existingPendingPayment.amount * 100, // Convert to paise
          currency: "INR",
          receipt: existingPendingPayment.receipt,
        });
      }

      const options = {
        amount: Math.round(course.price * 100), // Razorpay expects amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          courseId: courseId,
          userId: req.user._id.toString(),
        },
      };

      console.log("Creating Razorpay order with options:", options);
      let order;
      try {
        // Verify Razorpay configuration before creating order
        if (!razorpay.orders) {
          throw new Error("Razorpay not properly initialized");
        }

        order = await razorpay.orders.create(options);
        if (!order || !order.id) {
          throw new Error("Invalid order response from Razorpay");
        }
        console.log("Razorpay order created:", order);
      } catch (razorpayError) {
        console.error("Razorpay order creation failed:", {
          error: razorpayError,
          statusCode: razorpayError.statusCode,
          description: razorpayError.error?.description,
        });

        if (razorpayError.statusCode === 401) {
          return res.status(500).json({
            message: "Payment service configuration error",
            details: "Invalid API credentials. Please contact support.",
          });
        }

        return res.status(500).json({
          message: "Failed to create Razorpay order",
          details: razorpayError.error?.description || razorpayError.message,
        });
      }

      // Create a payment record in our database
      const payment = new Payment({
        userId: req.user._id,
        courseId: courseId,
        amount: course.price,
        orderId: order.id,
        paymentId: "", // Will be updated after payment completion
        status: "pending",
        paymentMethod: "razorpay",
        receipt: options.receipt,
        notes: options.notes,
      });

      await payment.save();
      console.log("Payment record created:", payment);

      // Return the order details to the client
      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      });
    } catch (innerError) {
      console.error("Inner operation failed:", {
        error: innerError.message,
        stack: innerError.stack,
        name: innerError.name,
      });
      throw innerError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Payment creation failed:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({
      message: error.message || "Failed to create payment",
      details: error.stack,
      type: error.name,
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    console.log("Verifying payment with details:", {
      orderId: req.body.razorpay_order_id,
      paymentId: req.body.razorpay_payment_id,
      signature: req.body.razorpay_signature,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation errors:", errors.array());
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing required payment verification fields", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return res
        .status(400)
        .json({ message: "Missing required payment details" });
    }

    // Debug: Log signature calculation
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");
    console.log("Signature debug:", {
      sign,
      expectedSign,
      receivedSignature: razorpay_signature,
      keySecret: process.env.RAZORPAY_KEY_SECRET
        ? "****" + process.env.RAZORPAY_KEY_SECRET.slice(-4)
        : undefined,
    });

    if (razorpay_signature !== expectedSign) {
      console.error("Payment signature verification failed", {
        expectedSign,
        receivedSignature: razorpay_signature,
      });
      return res.status(400).json({
        message: "Invalid payment signature",
        expectedSign,
        receivedSignature: razorpay_signature,
      });
    }

    // Update payment status and paymentId
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        status: "completed",
      },
      { new: true }
    );

    if (!payment) {
      console.error("Payment not found for orderId:", razorpay_order_id);
      return res
        .status(404)
        .json({ message: "Payment not found", orderId: razorpay_order_id });
    }

    console.log('before Enrollment.findOneAndUpdate')

    console.log({
      userId: payment.userId,
      courseId: payment.courseId,
    })
    // Create or update enrollment
    const enrollment = await Enrollment.findOneAndUpdate(
      {
        userId: payment.userId,
        courseId: payment.courseId,
      },
      {
        userId: payment.userId,
        courseId: payment.courseId,
        paymentStatus: "completed",
        paymentId: razorpay_payment_id,
        enrollmentDate: new Date(),
        status: "active",
      },
      { upsert: true, new: true }
    ).populate("courseId", "title description thumbnail");

    console.log('enrollment')
    console.log(enrollment)

    console.log("Enrollment created/updated:", enrollment);

    // Create notifications for successful payment
    const course = await Course.findById(payment.courseId);

    // Notify admin
    await createNotification(
      payment.userId,
      "Payment Received",
      `Payment of ₹${payment.amount} received for course: ${course.title}`,
      "payment",
      payment._id,
      "Payment"
    );

    // Notify student
    await createNotification(
      payment.userId,
      "Course Enrollment Successful",
      `Your payment for ${course.title} has been confirmed. You can now access the course content.`,
      "enrollment",
      course._id,
      "Course"
    );

    // Return the enrollment object so the frontend can update state
    res.json(enrollment);
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("courseId", "title price")
      .sort("-createdAt");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("courseId", "title price");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
