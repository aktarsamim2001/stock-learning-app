import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyPayment } from '../../store/slices/paymentSlice';
import type { AppDispatch } from '../../store/store';

interface RazorpayPaymentProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment = ({
  orderId,
  amount,
  currency,
  onSuccess,
  onError,
}: RazorpayPaymentProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      onError('Razorpay key not configured');
      console.error('VITE_RAZORPAY_KEY_ID is not set in environment variables');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount), // Ensure amount is an integer
      currency: currency,
      name: 'LearningHub',
      description: 'Course Payment',
      order_id: orderId,
      prefill: {
        name: window.userName || 'Student', // Get from UserContext if available
        email: window.userEmail || '', // Get from UserContext if available
      },
      theme: {
        color: '#2563EB',
      },
      modal: {
        ondismiss: () => {
          onError('Payment cancelled by user');
        }
      },
      handler: async (response: any) => {
        try {
          const result = await dispatch(verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })).unwrap();
          console.log('Payment verification successful:', result);
          onSuccess();
        } catch (error: any) {
          console.error('Payment verification failed:', error);
          onError(error.message || 'Payment verification failed');
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Pay Now
    </button>
  );
};

export default RazorpayPayment;