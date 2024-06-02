const prisma = require('../config/prisma')
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const STATUS = require('../constants/status.constants')
const convertToPng = require('../utils/convertToPng')
const sendMessage = require('../utils/sendMessage')

const processJobs = async (job, done) => {
    const { fileId, fileBuffer, scheduleTime, userId } = job.data;
    try {
        const pngBuffer = await convertToPng(Buffer.from(fileBuffer))
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "uploads",
                transformation: { width: 400, height: 400, crop: 'limit' }
            },
            async function (error, result) {
                if (error) return done(null, error)
                // Check if the record exists before updating
                const existingRecord = await prisma.image.findUnique({ where: { id: fileId } });
                if (!existingRecord) {
                    await job.remove();
                    return done(new Error(`Record with fileId ${fileId} not found`));
                }
                const dataSaved = await prisma.image.update({
                    where: { id: fileId },
                    data: { url: result.secure_url, status: scheduleTime ? STATUS.SCHEDULED : STATUS.PUBLISHED, publishAt: new Date().toISOString() }
                });
                sendMessage({ fileId: dataSaved.id, status: dataSaved.status, url: dataSaved.url, userId })
                done(null, result);
            }
        );

        streamifier.createReadStream(Buffer.from(pngBuffer)).pipe(uploadStream);
    } catch (error) {
        const dataSaved = await prisma.image.update({
            where: { id: fileId },
            data: { status: STATUS.FAILED }
        });
        sendMessage({ fileId: dataSaved.id, status: dataSaved.status, url: dataSaved.url, userId })
        done(new Error(`Failed to process image: ${error.message}`));
    }
}

module.exports = processJobs;