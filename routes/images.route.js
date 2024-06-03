const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadController = require('../controllers/uploadController');
const upload = require('../config/multer');
router.post('/upload', authMiddleware, upload.array('files'), uploadController.uploadImages);
router.get('/get-images', authMiddleware, imageController.fetchImagesByUserId);
router.post('/status', authMiddleware, imageController.checkStatus);

module.exports = router;
