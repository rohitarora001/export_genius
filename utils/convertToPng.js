const sharp = require('sharp');

// Function to convert image buffer to PNG
module.exports = async (imageBuffer) => {
    try {
        const pngBuffer = await sharp(imageBuffer).toFormat('png').toBuffer();
        return pngBuffer;
    } catch (error) {
        return null;
    }
};