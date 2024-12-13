const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// JWT Configuration Function
const configureJWT = (app) => {
    // JWT Options
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };

    // Passport JWT Strategy
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            // Find user by ID from JWT payload
            const user = await User.findById(jwt_payload.id).select('-password');
            
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    // Initialize Passport
    app.use(passport.initialize());

    // JWT Token Generation Function
    const generateToken = (user) => {
        return jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: process.env.JWT_EXPIRE || '1d' 
            }
        );
    };

    // Middleware to protect routes
    const authenticateJWT = passport.authenticate('jwt', { session: false });

    return {
        generateToken,
        authenticateJWT
    };
};

module.exports = {
    configureJWT
};