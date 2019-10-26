const express = require('express');
const router = express.Router();

const Project = require('../models/project');
const ProjectSerializer = require('../serializers/projectSerializer');
const errorSerializer = require('../serializers/errorSerializer');

// index
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).send(ProjectSerializer.serialize(projects));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// show
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id)
    res.status(200).send(ProjectSerializer.serialize(project));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});


// create
router.post('/', async (req, res) => {
  try {
    const permittedParams = ["projectDescription", "priority", "startDate", "endDate"];

    const projectParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));

    const project = new Project(projectParams);
    const result = await project.save();
    res.status(200).send(ProjectSerializer.serialize(result));

  } catch (err) {
    console.log('err', err);
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// update
router.put('/:id', async (req, res) => {
  try {
    const permittedParams = ["projectDescription", "priority", "startDate", "endDate"];

    const id = req.params.id;
    const projectParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));

    const projectToUpdate = await Project.findById(id);
    if (!projectToUpdate) {
      res.status(400).send('project to update not found');
    }

    const result = await projectToUpdate.update(projectParams);
    if (result && result['ok']) {
      const projectUpdated = await Project.findById(id);
      res.status(200).send(ProjectSerializer.serialize(projectUpdated));
    }
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const projectToDelete = await Project.findById(id);
    if (!!projectToDelete) {
      if (await projectToDelete.delete()) {
        res.status(200).send({status: 'success'});
      }
    } else {
      res.status(400).send('project to delete not found');
    }
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

module.exports = router;
