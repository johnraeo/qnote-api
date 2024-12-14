const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
});

// @desc Create new user
// @route Get /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { email, password, roles, firstName, lastName } = req.body;

    // Confirm data
    if (!email || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate emails
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    // Check for duplicate emails
    const duplicateEmails = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicateEmails) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
    ? { email, "password": hashedPwd, email, firstName, lastName }
    : { email, "password": hashedPwd, roles, email, firstName, lastName }

    // Create and store new user
    const user = await User.create(userObject);

    if (user) { //created
        res.status(201).json({ message: `New user ${email} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, email, roles, active, password, firstName, lastName } = req.body;

    // Confirm data
    if (!id || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' || !email || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate email
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    // Check for duplicate email
    const duplicateEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec();
    // Allow updates to the original user
    if (duplicateEmail && duplicateEmail?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    user.email = email;
    user.roles = roles;
    user.active = active;
    user.firstName = firstName;
    user.lastName = lastName;

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.email} updated` });
});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required' });
    }

    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();

    const reply = `Email ${result.email} with ID ${result._id} deleted`;

    return res.json(reply);
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};