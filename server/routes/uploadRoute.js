const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { isAdmin, isAuth } = require('../validation');
const expressAsyncHandler = require('express-async-handler')

const upload = multer();

router.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  expressAsyncHandler ( async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_URL_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.status(200).json(result);
  }
));
module.exports = router;