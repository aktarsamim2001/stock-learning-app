import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import paymentReducer from './slices/paymentSlice';
import blogReducer from './slices/blogSlice';
import webinarReducer from './slices/webinarSlice';
import dashboardReducer from './slices/dashboardSlice';
import adminReducer from './slices/adminSlice';
import studentReducer from './slices/studentSlice';
import notificationReducer from './slices/notificationSlice';
import featureReducer from './slices/featureSlice';
import statReducer from './slices/statSlice';
import testimonialReducer from './slices/testimonialSlice';
import faqReducer from './slices/faqSlice';
import bannerReducer from './slices/bannerSlice';
import whyChooseUsReducer from './slices/whyChooseUsSlice';
import webinarRegistrationReducer from './slices/webinarRegistrationSlice';
import aboutReducer from './slices/aboutSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    enrollments: enrollmentReducer,
    payments: paymentReducer,
    blogs: blogReducer,
    webinars: webinarReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    student: studentReducer,
    notifications: notificationReducer,
    features: featureReducer,
    stats: statReducer,
    testimonials: testimonialReducer,
    faqs: faqReducer,
    banners: bannerReducer,
    whyChooseUs: whyChooseUsReducer,
    webinarRegistration: webinarRegistrationReducer,
    about: aboutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for handling Date objects in notifications
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;