const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Admin = require('../models/Admin');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'user') {
            req.user = await User.findById(decoded.id);
            if (!req.user) throw new Error();
        } else if (decoded.role === 'admin') {
            req.admin = await Admin.findById(decoded.id);
            if (!req.admin) throw new Error();
        } else {
            return res.status(403).json({ message: 'Invalid role.' });
        }

        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// to authorize admin-only routes
const authorizeAdmin = (req, res, next) => {
    if (!req.admin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// to authorize user-only routes
const authorizeUser = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Access denied. Users only.' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin, authorizeUser };
