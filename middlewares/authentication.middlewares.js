const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ msg: "User not found" })
        }
        if(!decoded.verifyToken != user.versionToken) {
            return res.status(401).json({ msg: "Token expired due to password change" })
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: error.message });
    }
};

const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ msg: `Access denied: Requires ${requiredRole} role` });
        }
        next();
    }
};

module.exports = {
    verifyToken,
    checkRole
};