const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

module.exports = async (req, res, next) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        req.userExist = !!existingUser; // Sets to true if user exists, false otherwise
        next();
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};
