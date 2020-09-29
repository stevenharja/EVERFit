const express = require('express');
const programController = require('../controllers/programController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const sectionRouter = require('./sectionRoutes');

const router = express.Router();

//Retrieves program automatically sorted by their best reviews.
router.get('/categories/:category', programController.getProgramCategories);

//Retrieve reviews and sections of a certain accessed program.
router.use('/:programId/reviews', reviewRouter);

router.use('/:programId/sections', sectionRouter);

//Only trainer or basically teachers can create a program.
router
  .route('/')
  .get(programController.getAllProgram)
  .post(
    authController.protect,
    authController.restrictTo('trainer'),
    programController.createProgram
  );

router
  .route('/:id')
  .get(programController.getProgram)
  .patch(
    authController.protect,
    authController.restrictTo('trainer', 'admin'),
    programController.uploadProgramImage,
    programController.resizeProgramImage,
    programController.updateProgram
  )
  .delete(
    authController.protect,
    authController.restrictTo('trainer', 'admin'),
    programController.deleteProgram
  );

module.exports = router;
