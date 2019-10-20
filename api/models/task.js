const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskDescription: {
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
  },
  status: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
});

module.exports = mongoose.model('Task', TaskSchema);
