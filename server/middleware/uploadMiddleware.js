
const multer = require('multer');
const path = require('path');

// Store uploaded files temporarily in memory.
// The controller will upload them to Supabase Storage.
const storage = multer.memoryStorage();

// Validate file extension and MIME type.
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    '.pdf': ['application/pdf'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png']
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = allowedTypes[ext];

  if (!allowedMimeTypes || !allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.')
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;
