const rateLimit = require("express-rate-limit");

const limiterAuth = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});

const limiterImageUpload = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});

const limiterImageRetrieve = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});

module.exports = { limiterAuth, limiterImageUpload, limiterImageRetrieve };
