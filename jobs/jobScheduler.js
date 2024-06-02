const schedule = require('node-schedule');
const prisma = require('../config/prisma');
const STATUS = require('../constants/status.constants')
const sendMessage = require('../utils/sendMessage');

module.exports = async (jobDetails) => {
    const { scheduledDate, imageIds, status, userId } = jobDetails;
    schedule.scheduleJob(scheduledDate, async () => {
        try {
            console.log('Scheduled job executed.');
            const failedUpdates = [];

            // Update each image individually and catch errors for failed updates
            for (const id of imageIds) {
                try {
                    const dataSaved = await prisma.image.update({
                        where: { id },
                        data: { status, publishAt: new Date().toISOString() }
                    });
                    sendMessage({ fileId: dataSaved.id, status: dataSaved.status, url: dataSaved.url, userId })
                } catch (error) {
                    failedUpdates.push(id);
                }
            }

            // Update failed records to 'FAILED' status
            if (failedUpdates.length > 0) {
                const dataSaved = await prisma.image.updateMany({
                    where: {
                        id: { in: failedUpdates },
                    },
                    data: {
                        status: STATUS.FAILED
                    }
                });
                sendMessage({ fileId: dataSaved.id, status: dataSaved.status, url: dataSaved.url, userId })
                console.log(`Updated ${failedUpdates.length} images to 'FAILED' status.`);
            }

        } catch (error) {
            console.error('Error processing scheduled job:', error);
        } finally {
            await prisma.$disconnect();
        }
    });

    console.log(`Job scheduled for ${scheduledDate}.`);
};
