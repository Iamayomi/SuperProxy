const chat = require('../models/chatModel');
const User = require('../models/userModel');
const errorAsync = require('../utils/errorAsync');


exports.sendMessage = errorAsync(async function (req, res, next) {
        if (!req.body.user) req.body.user = req.params.userId;

        const sendMessage = await chat.create({
            text: req.body.text,
            user: req.body.user
        });

        res.status(200).json({
            status: "success",
            data: {
                chats: sendMessage
            }
        });
    next();
});

exports.allChat = errorAsync(async function(req, res, next){
        if (!req.body.user) req.body.user = req.params.userId;
        
        const getallChat = await User.findById(req.body.user).populate('chat');
        console.log(getallChat);
        console.log(req.body.user);

        
        res.status(200).json({
            status: "success",
            data: {
                 getallChat
            }
        });
}); 