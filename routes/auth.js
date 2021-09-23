const express = require('express');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', isAuth, authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/profile', isAuth, authController.getMyProfile);
router.post('/delete-user-account', isAuth, authController.postDeleteProfile);

module.exports = router;
