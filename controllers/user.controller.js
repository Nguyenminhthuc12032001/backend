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

const getAll = async (res) => {
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
        const { password, role } = req.body;
        user.password_hash = password || user.password_hash;
        user.role = role || user.role;
        await user.save();
        return res.status(200).json({ msg: 'User updated successfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        const result = await adminModel.deleteOne({ _id: req.params.id });
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
        if (req.query.username) {
            query.username = { $regex: req.query.username, $options: 'i' };
        }
        if (req.query.role) {
            query.role = { $regex: req.query.role, $options: 'i' };
        }
        const admins = await adminModel.find(query);
        return res.status(200).json({ admins });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await adminModel.findOne({ username });
        if (!admin) {
            return res.status(401).json({ msg: 'User not found' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
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
    remove,
    search,
    login
}