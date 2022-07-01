const express = require('express');
const userController = require('../../models/user/controller');
const router = express.Router();

router.get('/', userController.getAll);
router.get('/:id/logs', userController.getLogs);

router.post('/', userController.insert);
router.post('/:id/exercises', userController.insertExercise);


module.exports = router;