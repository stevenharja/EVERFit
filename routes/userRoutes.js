const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
//Login operations from authController
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

//Logged in users operation.
router.use(authController.protect);

//Retrieve logged in user data
router.get('/me', userController.getMe, userController.getUser);
//Update password, receives passwordCurrent, password, passwordConfirm in Body.
//Will not work if the 3 is not available.
router.patch('/updateMyPassword', authController.updatePassword);

//Update name and email, photo
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

//Make account inactive (Does not deletes it completely)
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));
//CRUD Operations from userController, restricted to only admin
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
