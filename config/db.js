const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
    try {
        // Use environment variable for database connection string
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        
        // Exit process with failure
        process.exit(1);
    }
};

// Optional: Connection event listeners
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

module.exports = {
    connectDB
};