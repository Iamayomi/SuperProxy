const notify = require('../models/notifyModel')

exports.sendAUserNotify = async function (req, res, next) {
    try {
        if (!req.body.user) req.body.user = req.params.userId;

        const sendAUserMessage = await notify.create({
            text: req.body.text,
            user: req.body.user
        });

        res.status(200).json({
            status: "success",
            data: {
                notification: sendAUserMessage
            }
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};