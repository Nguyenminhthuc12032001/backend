const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createNew = async (req, res) => {
    try {
        const { name, email, phone_number, password_hash, role } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        const newUser = new userModel({ name, email, phone_number, password_hash, role });
        await newUser.save();
        return res.status(201).json({ msg: 'User created successfully', admin: newUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const get = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json({ admin });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { name, email, phone_number, password_hash, role } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.password_hash = password_hash || user.password_hash;
        user.role = role || user.role;
        await user.save();
        return res.status(200).json({ msg: 'User updated successfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { password_hash } = req.body;
        user.password_hash = password_hash;
        await user.save();
        return res.status(200).json({ msg: "Reset password successfully. "})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const result = await userModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'User not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.role) {
            query.role = { $regex: req.query.role, $options: 'i' };
        }
        const users = await userModel.find(query);
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password_hash } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }
        const isMatch = await user.comparePassword(password_hash);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        return res.status(200).json({ msg: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createNew,
    getAll,
    get,
    update,
    resetPassword,
    remove,
    search,
    login
}