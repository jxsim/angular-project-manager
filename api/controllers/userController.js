const express = require('express');
const router = express.Router();

const User = require('../models/user');
const UserSerializer = require('../serializers/userSerializer');
const errorSerializer = require('../serializers/errorSerializer');

// index
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
    res.status(200).send(UserSerializer.serialize(users));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});

// show
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).send(UserSerializer.serialize(user));
  } catch (err) {
    res.status(500).send(errorSerializer(500, err.errmsg));
  }
});


// create
router.post('/', async (req, res) => {
  try {
    const permittedParams = ['firstName', 'lastName', 'employeeId'];

    const userParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));

    const user = new User(userParams);
    const result = await user.save();
    res.status(200).send(UserSerializer.serialize(result));

  } catch (err) {
    console.log('err', err);
    res.status(500).send(err.errmsg);
  }
});

// update
router.put('/:id', async (req, res) => {
  try {
    const permittedParams = ['firstName', 'lastName', 'employeeId'];

    const id = req.params.id;
    const userParams = Object.fromEntries(Object.entries(req.body).filter(_k => permittedParams.includes(_k[0])));

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      res.status(400).send('user to update not found');
    }
    const result =  await userToUpdate.update(userParams);
    if (result && result['ok']) {
      const userUpdated = await User.findById(id);
      res.status(200).send(UserSerializer.serialize(userUpdated));
    }
  } catch (err) {
    res.status(500).send(err.errmsg);
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      res.status(400).send('user to delete not found');
    }

    const result = await userToDelete.update({ isDeleted: true });
    if (result && result['ok']) {
      const userUpdated = await User.findById(id);
      res.status(200).send(UserSerializer.serialize(userUpdated));
    }
  } catch (err) {
    res.status(500).send(err.errmsg);
  }
});

module.exports = router;
