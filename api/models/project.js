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
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
