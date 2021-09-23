const router = require('express').Router();
const isAuth = require('../middlewares/is-auth');
const adminController = require('../controllers/admin');

router.post('/add-new-admin', isAuth, adminController.postAddNewAdmin);

router.post('/delete-admin', isAuth, adminController.postDeleteAdmin);

module.exports = router;
