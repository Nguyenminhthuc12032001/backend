const userModel = require('../models/user.model');
const orderModel = require('../models/order.model')
const tokenModel = require('../models/token.model');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();
const crypto = require("crypto");
const { console } = require('inspector');

const createNew = async (req, res) => {
    try {
        const { name, email, phone_number, password_hash, role } = req.body;
        if (role === "admin") {
            return res.status(403).json({ msg: "Admin accounts cannot be created." })
        }
        const existingUser = await userModel.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        const newUser = new userModel({ name, email, phone_number, password_hash, role });
        await newUser.save();
        await orderModel.create({ user_id: newUser._id, total_amount: 0 });
        const token = crypto.randomBytes(32).toString("hex");
        await tokenModel.create({
            user_id: newUser._id,
            token,
            type_token: "register"
        });
        const verifyLink = `${process.env.BACKEND_URL}/api/user/verifyEmail?token=${token}`;
        await sendEmail(
            newUser.email,
            "Verify your email",
            `<p>Hello ${newUser.name},</p>
            <p>Click link below to verify your email:</p>
            <a href="${verifyLink}">${verifyLink}</a>`
        )
        return res.status(201).json({ msg: 'User created successfully', user: newUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenDoc = await tokenModel.findOne({ token, type_token: "register" });
        if (!tokenDoc) {
            return res.status(404).json({ msg: "Invalid or expired token" });
        }
        await userModel.findOneAndUpdate({ _id: tokenDoc.user_id, isDeleted: false }, { is_verified: true });
        await tokenModel.deleteOne({ _id: tokenDoc._id });
        return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getAll = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const lastId = req.query.lastId;

        const query = { isDeleted: false };
        if (lastId) {
            query._id = { $lt: lastId }
        }

        const users = (await userModel.find(query)).sort({ _id: -1 }).limit(limit);
        return res.status(200).json({ 
            users,
            nextCursor: products.length > 0 ? products[products.length - 1]._id : null
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const get = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id, isDeleted: false })
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { name, email, phone_number, password_hash, role } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.password_hash = password_hash || user.password_hash;
        user.role = role || user.role;
        
        if(password_hash || email) {
            user.versionToken++
        }
        await user.save();
        return res.status(200).json({ msg: 'User updated successfully', user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        await tokenModel.deleteMany({ user_id: user._id, type_token: "reset_password" });

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        await tokenModel.create({
            user_id: user._id,
            token: hashedToken,
            type_token: "reset_password"
        });
        const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${rawToken}`;
        await sendEmail(
            user.email,
            "Reset your password",
            `<p>Hello ${user.name}</p>
            <p>Click link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>`
        )
        return res.status(200).json({ msg: "Reset password email sent." });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { rawToken, password_hash } = req.body;
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        const tokenDoc = await tokenModel.findOne({ token: hashedToken, type_token: "reset_password" });
        if (!tokenDoc) {
            return res.status(404).json({ msg: 'Invalid or expired token' });
        }
        const user = await userModel.findOne({ _id: tokenDoc.user_id, isDeleted: false });
        if (!user) {
            return res.status(404).json({ msg: "User not found." })
        }
        user.password_hash = password_hash;
        user.versionToken += 1;
        await user.save();
        await tokenModel.deleteOne({ _id: tokenDoc._id });
        return res.status(200).json({ msg: "Your password has been reset successfully."})
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {
        const deletedUser = await userModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true });
        if (!deletedUser) {
            return res.status(404).json({ msg: 'Unable to delete' });
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
        const users = await userModel.find({ ...query, isDeleted: false});
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password_hash } = req.body;
        const user = await userModel.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(401).json({ msg: 'User not found'});
        }
        const isMatch = await user.comparePassword(password_hash);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id, role: user.role, versionToken: user.versionToken }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
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
    login,
    verifyEmail,
    resetPasswordRequest
}