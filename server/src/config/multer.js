import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /\.(pdf|png|jpg|jpeg|webp)$/i;
  if (file.originalname.match(allowed)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});
