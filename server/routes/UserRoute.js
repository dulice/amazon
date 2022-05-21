const router = require('express').Router();
const { isAuth, isAdmin } = require('../validation');
const { SignUp, SignIn, getAllUsers, updateProfile } = require('../controllers/User');

router.get('/', getAllUsers);
router.post('/signup', SignUp);
router.post('/signin', SignIn);
router.put('/profile', isAuth, updateProfile);

module.exports = router;