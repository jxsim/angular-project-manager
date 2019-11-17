const express = require('express');
const router = express.Router();

const Task = require('../models/task');
const User = require('../models/user');
const Project = require('../models/project');
const TaskSerializer = require('../serializers/taskSerializer');
const errorSerializer = require('../serializers/errorSerializer');

// index
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('project').populate('user').populate('parentTask');
    res.status(200).send(TaskSerializer.serialize(tasks));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// show
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id).populate('project').populate('user').populate('parentTask');
    res.status(200).send(TaskSerializer.serialize(task));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});


// create
router.post('/', async (req, res) => {
  try {
    let permittedParams = [];

    if (req.body["isParent"]) {
      permittedParams = ["taskDescription", "isParent", "project", "user"];
    } else {
      permittedParams = ["taskDescription", "priority", "startDate", "endDate", "isParent", "parentTask", "project", "user"];
    }
    const taskParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));
    if (!req.body["isParent"]) {
      const parentTask = taskParams['parentTask'];
      if (!!parentTask) {
        const parentTaskObj = await Task.findById(parentTask);
        if (!parentTaskObj) {
          res.status(400).send(errorSerializer(400, 'parent Task not found'));
        }
      } else {
        taskParams['parentTask'] = undefined;
      }
    }
    const project = taskParams['project'];
    const user = taskParams['user'];
    if (!!project) {
      const projectObj = await Project.findById(project);
      if (!projectObj) {
        res.status(400).send(errorSerializer(400, 'project not found'));
      }
    }
    if (!!user) {
      const userObj = await User.findById(user);
      if (!userObj) {
        res.status(400).send(errorSerializer(400, 'user not found'));
      }
    }

    const task = new Task({ ...taskParams, status: 'ongoing' });
    const taskResult = await task.save();
    if (taskResult) {
      const savedTask = await Task.findById(taskResult.id).populate('parentTask').populate('project').populate('user');
      res.status(200).send(TaskSerializer.serialize(savedTask));
    }
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// update
router.put('/:id', async (req, res) => {
  try {
    const permittedParams = ["taskDescription", "priority", "startDate", "endDate", "parentId"];

    const id = req.params.id;
    const taskParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));
    const parentTaskId = taskParams['parentId'];
    if (!!parentTaskId) {
      const parentTask = await Task.findById(parentTaskId);
      if (!parentTask) {
        res.status(400).send(errorSerializer(400, 'parent Task not found'));
      }
    }

    const taskToUpdate = await Task.findById(id);
    if (!taskToUpdate) {
      res.status(400).send('task to update not found');
    }

    if (await taskToUpdate.update(taskParams)) {
      res.status(200).send({status: 'success'});
    }
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const taskToDelete = await Task.findById(id);
    if (!!taskToDelete) {
      if (await taskToDelete.delete()) {
        res.status(200).send({status: 'success'});
      }
    } else {
      res.status(400).send('task to delete not found');
    }
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

module.exports = router;
