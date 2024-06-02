const prisma = require('../config/prisma')
const uploadQueue = require('../jobs/imageQueue');
const STATUS = require('../constants/status.constants')
const jobScheduler = require('../jobs/jobScheduler')

exports.uploadImages = async (req, res) => {
    const { userId, files } = req;
    try {
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Save initial metadata with status "In Queue"
        const savePromises = files.map(file => {
            return prisma.image.create({
                data: {
                    userId: userId,
                    status: STATUS.IN_QUEUE,
                    url: '',
                    originalFileName: file.originalname
                }
            });
        });
        const savedImages = await Promise.all(savePromises);
        if (req.body.scheduleDateTime) {
            const scheduledDate = new Date(req.body.scheduleDateTime);
            jobScheduler({ scheduledDate, imageIds: savedImages.map(image => image.id), status: STATUS.PUBLISHED, userId })
        }
        // Enqueue jobs with the file buffer and corresponding database record ID
        savedImages.forEach((image, index) => {
            uploadQueue.add({ fileId: image.id, fileBuffer: files[index].buffer, userId, scheduleTime: req.body.scheduleDateTime ?? null });
        });
        // Send response with image metadata
        const responsePayload = {
            message: "Images are enqueued for processing",
            images: savedImages.map(image => ({
                id: image.id,
                filename: image.originalFileName,
                status: image.status,
            })),
        };
        res.status(200).json(responsePayload);
    } catch (error) {
        res.status(400).json({ error: `Failed to enqueue images: ${error.message}` });
    }
};
