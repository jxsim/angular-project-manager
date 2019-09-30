const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectDescription: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
