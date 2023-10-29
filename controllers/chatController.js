const chat = require('../models/chatModel')

exports.sendMessage = async function (req, res, next) {
    try {
        if (!req.body.user) req.body.user = req.params.userId;

        const sendMessage = await chat.create({
            text: req.body.text,
            user: req.body.user
        });

        res.status(200).json({
            status: "success",
            data: {
                notification: sendMessage
            }
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};