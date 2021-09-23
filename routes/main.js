const mainController = require('../controllers/mainController');
const router = require('express').Router();

router.get('/', mainController.landingPage);

module.exports = router;
