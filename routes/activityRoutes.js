const express = require('express');
const activityController = require('../controllers/activityController');
const authController = require('../controllers/authController');

const router = express.Router();

//Visitor must login to access the activities section.
router.use(authController.protect);
//Basic CRUD Operations
router
  .route('/')
  .get(activityController.getAllActivity)
  .post(
    authController.restrictTo('trainer'),
    activityController.createActivity
  );

router
  .route('/:id')
  .get(activityController.getActivity)
  .patch(
    authController.restrictTo('trainer', 'admin'),
    activityController.updateActivity
  )
  .delete(
    authController.restrictTo('trainer', 'admin'),
    activityController.deleteActivity
  );

module.exports = router;
