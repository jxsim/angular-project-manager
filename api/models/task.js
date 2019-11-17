const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskDescription: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    required: true
  },
  isParent: {
    type: Boolean,
    default: false
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Task', TaskSchema);
