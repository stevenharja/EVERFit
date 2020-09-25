const factory = require('./handlerFactory');
const Section = require('../models/sectionModel');

exports.getAllSection = factory.getAll(Section);
exports.getSection = factory.getOne(Section, { path: 'activity' });
exports.createSection = factory.createOne(Section);
exports.updateSection = factory.updateOne(Section);
exports.deleteSection = factory.deleteOne(Section);
