const Notification = require('../models/notification');

/**
 * @desc Notifying message to Notification's user is following.
 * @param user User has just interacted collection yet.
 * @param following followingType that user notify.
 * @param collection Collection(post) user is following.
 * @param message Message text alerts on UI.
 * @example 
 * const message = `${req.user.name} have just comment on ${product.name}`;
 * notification(req.user, 'followingPosts', product, message);
 */
const notification = async (user, following, collection, message) => {

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
};

module.exports = notification;