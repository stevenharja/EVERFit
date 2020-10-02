const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/programs', authController.isLoggedIn, viewsController.getOverview);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/account', authController.protect, viewsController.getAccount);

router.use(authController.isLoggedIn);
router.get('/programs/:slug', viewsController.getProgram);

router.get('/programs/category/:category', viewsController.getCategoryProgram);

router.get('/edit/:model/:id', viewsController.getEditContent);

module.exports = router;
