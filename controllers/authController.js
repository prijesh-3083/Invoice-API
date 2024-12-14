const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Validation schema for user registration
const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
});

// Validation schema for login
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
});

// Generate JWT Token
const generateToken = (userId) => {
    // generateTokenAndSetCookie(userId, res)
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
};

// User Registration
exports.register = async (req, res) => {
    try {
        // Validate input
        const { error, value } = registerSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: error.details[0].message 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: value.email },
                { username: value.username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists with this email or username' 
            });
        }

        // Create new user
        const user = new User({
            username: value.username,
            email: value.email,
            password: value.password,
            role: value.role
        });

        // Save user
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error during registration',
            details: error.message 
        });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        // Validate input
        const { error, value } = loginSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: error.details[0].message 
            });
        }

        // Find user by email
        const user = await User.findOne({ email: value.email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(value.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error during login',
            details: error.message 
        });
    }
};

//User Logout
exports.logout = async (req,res) => {
    try{
        res.clearCookie("jwt-invoice-api");
        res.status(200).json({success: true, message: "Logged out successfully",token:""})
    }catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}