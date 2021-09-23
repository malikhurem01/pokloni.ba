const giftController = require('../controllers/giftController');
const isAuth = require('../middlewares/is-auth');
const router = require('express').Router();

router.post('/add-gift', isAuth, giftController.postAddGift);
router.get('/add-gift', isAuth, giftController.getAddGift);

router.post('/edit-gift', isAuth, giftController.postEditGift);
router.get('/edit-gift/:giftId', isAuth, giftController.getEditGift);

router.post('/delete-gift', isAuth, giftController.postDeleteGift);

router.get('/list', giftController.getGifts);
router.get('/my-gifts', isAuth, giftController.getMyGifts);
router.get('/order/:giftId', isAuth, giftController.getOrderGift);

module.exports = router;
