const express = require('express');
const router = express.Router();

const Task = require('../models/task');
const TaskSerializer = require('../serializers/taskSerializer');
const errorSerializer = require('../serializers/errorSerializer');

// index
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('parentId');
    res.status(200).send(TaskSerializer.serialize(tasks));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// show
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id).populate('parentId');
    res.status(200).send(TaskSerializer.serialize(task));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});


// create
router.post('/', async (req, res) => {
  try {
    const permittedParams = ["taskDescription", "priority", "startDate", "endDate", "parentId"];

    const taskParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));
    const parentTaskId = taskParams['parentId'];
    if (!!parentTaskId) {
      const parentTask = await Task.findById(parentTaskId);
      if (!parentTask) {
        res.status(400).send(errorSerializer(400, 'parent Task not found'));
      }
    }

    const task = new Task(taskParams);
    const result = await task.save();
    res.status(200).send(TaskSerializer.serialize(result));

  } catch (err) {
    console.log('err', err);
    res.status(500).send(err.errmsg);
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
    res.status(500).send(err.errmsg);
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
    res.status(500).send(err.errmsg);
  }
});

module.exports = router;
