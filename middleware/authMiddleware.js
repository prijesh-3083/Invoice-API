const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Validate Authorization header
        const authHeader = req.header('Authorization');
        // Detailed logging for debugging
        console.log('Received Authorization Header:', authHeader);
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Authorization header is missing',
                details: 'Please include a valid Bearer token'
            });
        }
        // Ensure token is prefixed correctly
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            return res.status(401).json({ 
                error: 'Invalid token format',
                details: 'Token must start with "Bearer "'
            });
        }
        // Verify token with additional error handling
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (verificationError) {
            // Handle specific JWT verification errors
            if (verificationError.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expired',
                    details: 'Please log in again to obtain a new token'
                });
            }
            if (verificationError.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    error: 'Invalid token',
                    details: 'The provided token is malformed or invalid'
                });
            }
            throw verificationError; // Re-throw unknown errors
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found',
                details: 'The user associated with this token no longer exists'
            });
        }


        // Get token from header
        // const token = req.header('Authorization')?.replace('Bearer ', '');

        // if (!token) {
            // return res.status(401).json({ error: 'No token, authorization denied' });
        // }

        // Verify token
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        // const user = await User.findById(decoded.userId);

        // if (!user) {
            // return res.status(401).json({ error: 'User not found' });
        // }

        // Attach user and role to request
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;

        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({ 
            error: 'Authentication failed',
            details: 'An unexpected error occurred during authentication'
        });    }
};

// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
    next();
};

// Middleware to check user access to specific invoice
const invoiceAccessMiddleware = async (req, res, next) => {
    try {
        const Invoice = require('../models/Invoice');
        const invoiceId = req.params.id;
        // console.log(invoiceId);
        

        // Find the invoice
        const invoice = await Invoice.findById(invoiceId);
        // console.log(invoice);
        
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Admin can access all invoices
        if (req.userRole === 'admin') {
            req.invoice = invoice;
            return next();
        }

        // Regular users can only access their own invoices
        if (invoice.createdBy.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        req.invoice = invoice;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error checking invoice access' });
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware,
    invoiceAccessMiddleware
};