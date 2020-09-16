const router = require('express').Router();
const Notification = require('../../models/notification');

// @route Get /api/following
// @desc Test Following
// @access public
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find({});
        res.json(notifications);
    } 
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route Post /api/following
// @desc Test Register Following
// @access public
router.post('/', async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        
        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

module.exports = router;