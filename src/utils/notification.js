const Notification = require('../models/notification');

/**
 * @desc Notifying message to Notification's user is following.
 * @param user User has just interacted collection yet.
 * @param following followingType that user notify.
 * @param collection Collection(post) user is following.
 * @param message Message text alerts on UI.
 * @example 
 * const message = `${req.user.name} have just comment on ${product.name}`;
 * notify(req.user, 'followingPosts', product, message);
 */
const notify = async (user, following, collection, message) => {

    try {
        await Notification.updateMany({
            [following]: collection.id,
            user: { $nin: user._id }
        }, {
            $push: {
                messages: {
                    text: message,
                    user: user.id
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};

const createNotification = async (user) => {
    try {
        const notification = await Notification.findOne({ user: user._id });

        if (!notification) {
            await Notification.create({
                user: user._id
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { notify, createNotification };