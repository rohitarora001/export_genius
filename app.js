const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.route');
const imagesRoutes = require('./routes/images.route');
const { limiterAuth, limiterImageRetrieve } = require('./config/rateLimiting')
require('dotenv').config();
require('./jobs/imageQueue')

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/images', limiterImageRetrieve, imagesRoutes);
app.use('/api/auth', limiterAuth, authRoutes);

module.exports = app;
