const router = require('express').Router();
const Notification = require('../../models/notification');
const auth = require('../../middleware/auth');

// @route GET /api/notification
// @desc Get current notification. 
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({ user: req.user._id });
        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/markasread
// @desc Make as read all messages.
// @access Private
router.put('/markasread', auth, async (req, res) => {
    try {
        // Find notification and make message status true.
        const notification = await Notification.findOneAndUpdate({ user: req.user._id }, {
            $set: {
                'messages.$[].status': true
            }
        });

        if (!notification) {
            return res.status(404).send('Notification not found.');
        }

        res.send(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/following/:id
// @route-param id Object's Id which user wants follow.
// @desc Registry following post. 
// @access Private
router.put('/following/:id', auth, async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).send('Can\'\t following.');
        }

        const notification = await Notification.findOne({
            user: req.user._id,
            'followingPosts': { $nin: postId }
        });

        if (!notification) {
            return res.status(400).json({ msg: 'User has followed yet.' });
        }

        notification.followingPosts.push(postId);

        await notification.save();

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/unfollowing/:id
// @route-param id Object's Id which user wants unfollow.
// @desc Registry unfollowing post. 
// @access Private
router.put('/unfollowing/:id', auth, async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).send('Can\'\t unfollowing.');
        }

        const notification = await Notification.findOne({
            user: req.user._id,
            'followingPosts': postId
        });

        if (!notification) {
            return res.status(400).json({ msg: 'User has not followed yet.' });
        }

        notification.followingPosts.pull(postId);

        await notification.save();

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

module.exports = router;