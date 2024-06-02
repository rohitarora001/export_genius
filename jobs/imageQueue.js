const Queue = require('bull');
const processJobs = require('./processor')

const uploadQueue = new Queue('imageUpload',
    {
        limiter: {
            max: 2, // Limit the maximum number of concurrent jobs to 2
            duration: 1000 * 20
        },
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: 3, // Adjust as needed
            retryStrategy: function (times) {
                return Math.min(times * 2000, 30000);
            }
        }
    });

uploadQueue.process(processJobs);

module.exports = uploadQueue;
