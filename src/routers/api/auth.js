const router = require('express').Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');

// @route Get api/auth
// @desc Test authentication
// @access private
router.get('/', auth, async (req, res) => {
    res.json(req.user);
});

// @route Post api/auth
// @desc Authenticate user and get token
// @access public
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findByCredentals(username, password);

        const token = await user.generateAuthToken();

        res.send({ token });
    }
    catch (e) {
        res.send({});
        console.log(e);
    }
});

// @route Get api/auth/logout
// @desc Logout user and remove current token.
// @access private
router.get('/auth/logout', auth, async (req, res) => {
    try {
        // Remove a current token.
        req.user.tokens = req.user.tokens.filter(token => token !== req.token);

        // Save user
        await req.user.save();

        // Response message remove token
        res.status(200).send('Logout succesfully !');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is error.');
    }
});

// @route Get api/auth/logoutall
// @desc Logout user and remove all token.
// @access private
router.get('/auth/logoutall', auth, async (req, res) => {
    try {
        // Remove a current token.
        req.user.tokens = [];

        // Save user
        await req.user.save();

        // Response message remove token
        res.status(200).send('Logout succesfully !');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is error.');
    }
});

module.exports = router;