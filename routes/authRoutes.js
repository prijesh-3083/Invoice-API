const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { authMiddleware, adminMiddleware, invoiceAccessMiddleware} = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user's profile
 * @access  Private
 */
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


/**
 * @route   GET /api/auth/admin-dashboard
 * @desc    Admin-only route to access dashboard
 * @access  Private (Admin only)
 */
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