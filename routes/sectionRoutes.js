const express = require('express');
const sectionController = require('../controllers/sectionController');
const authController = require('../controllers/authController');
const activityRouter = require('./activityRoutes');
const handlerFactory = require('../controllers/handlerFactory');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.get('/:sectionId/activities', activityRouter);

router
  .route('/')
  .get(sectionController.getAllSection)
  .post(authController.restrictTo('trainer'), sectionController.createSection);

router
  .route('/:id')
  .get(sectionController.getSection)
  .patch(
    authController.restrictTo('trainer', 'admin'),
    handlerFactory.handleMultipartForm,
    sectionController.updateSection
  )
  .delete(
    authController.restrictTo('trainer', 'admin'),
    sectionController.deleteSection
  );

module.exports = router;
