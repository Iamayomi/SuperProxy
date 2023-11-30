const notification = require('../models/notifyModel');
const upload = require('../utils/multer');
const errorAsync = require('../utils/errorAsync');


exports.uploadUserfile = upload.single('file');

exports.sendAnInvite = errorAsync(async function (req, res, next) {
        if (!req.body.user) req.body.user = req.params.userId;

        const createProposal = await notification.create({
            projectName: req.body.projectName,
            DescribeService: req.body.DescribeService,
            Duration: req.body.Duration,
            Budget: req.body.Budget,
            file: req.body.file,
            user: req.body.user
        });

        res.status(200).json({
            status: "success",
            data: {
                notification: createProposal
            }
        });
});


exports.getInvite = errorAsync(async function(req, res, next){
    if (!req.body.notification) req.body.notification = req.params.notifyId;

    const getAnInvite = await notification.findById(req.body.notification); 
    
    res.status(200).json({
            status: "success",
            data: {
                getAnInvite
            }
        });
});