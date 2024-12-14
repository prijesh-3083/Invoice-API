const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { authMiddleware, adminMiddleware, invoiceAccessMiddleware} = require('../middleware/authMiddleware');

router.post('/register', register);

router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
    try {
        // Return user profile (excluding sensitive information)
        const { _id, username, email, role } = req.user;
        res.json({
            user: {
                id: _id,
                username,
                email,
                role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error retrieving profile',
            details: error.message 
        });
    }
});


router.get('/admin-dashboard', 
    authMiddleware, 
    adminMiddleware, 
    (req, res) => {
        res.json({
            message: 'Welcome to Admin Dashboard',
            adminAccess: true
        });
    }
);

router.post("/logout", logout);
module.exports = router;