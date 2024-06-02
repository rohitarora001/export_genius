const prisma = require('../config/prisma')

exports.checkStatus = async (req, res) => {
    const { imageIds } = req.body;

    try {
        // Fetch status of images from the database based on their IDs
        const imageStatus = await Promise.all(imageIds.map(async (imageId) => {
            const image = await prisma.image.findUnique({
                where: {
                    id: imageId
                },
                select: {
                    status: true
                }
            });
            return { id: imageId, status: image.status };
        }));

        res.json(imageStatus.reduce((acc, curr) => {
            acc[curr.id] = curr.status;
            return acc;
        }, {}));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch image status' });
    }
};
exports.fetchImagesByUserId = async (req, res) => {
    try {
        // const page = req.query.page || 1; // Get the page from the query parameters, default to page 1 if not provided
        // const pageSize = req.query.pageSize || 10; // Get the page size from the query parameters, default to 10 if not provided

        // const skip = (page - 1) * pageSize; // Calculate the number of records to skip

        // Fetch status of images from the database based on their IDs with pagination
        const images = await prisma.image.findMany({
            where: {
                userId: req.userId
            },
            select: {
                status: true,
                url: true,
                originalFileName: true
            },
            // skip, // Skip the specified number of records
            // take: pageSize // Take only the specified number of records
        });

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch image status' });
    }
};
