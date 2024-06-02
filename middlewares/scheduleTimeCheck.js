const moment = require('moment');

module.exports = (req, res, next) => {
    try {
        const { scheduleDateTime } = req.body;

        if (!scheduleDateTime) {
            return next();
        }

        const currentTime = moment();
        const diffMinutes = moment(scheduleDateTime).diff(currentTime, 'minutes');
        console.log(diffMinutes)
        if (currentTime.isAfter(scheduleDateTime)) {
            return res.json({
                error: 'Current time is greater than the provided schedule time.'
            });
        }

        if (diffMinutes < 2) {
            return res.json({
                error: 'There should be at least 2 minutes of gap between schedule time and upload time (now).'
            });
        }

        next();
    } catch (error) {
        next(new Error('Something went wrong'));
    }
};
