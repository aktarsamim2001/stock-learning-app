import multer from 'multer';

// Use memory storage for simplicity (no file saving, just parsing fields)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
