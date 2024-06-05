const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWTa = require('../middleware/verifyJWTa');

router.route('/')
    .post(usersController.createNewUser)


router.use(verifyJWTa);

router.route('/')
    .get(usersController.getAllUsers)
    // .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router;