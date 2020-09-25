const express = require('express');
const sectionController = require('../controllers/sectionController');
const authController = require('../controllers/authController');
const activityRouter = require('./activityRoutes');

const router = express.Router();

router.use(authController.protect);
router.get('/:sectionId/activities', activityRouter);

router
  .route('/')
  .get(sectionController.getAllSection)
  .post(sectionController.createSection);

router
  .route('/:id')
  .get(sectionController.getSection)
  .patch(sectionController.updateSection)
  .delete(sectionController.deleteSection);

module.exports = router;
