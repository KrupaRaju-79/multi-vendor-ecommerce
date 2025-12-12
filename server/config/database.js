const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('❌ MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 10000, // Close idle connections after 10s
    };

    // Create connection
    mongoose.connect(mongoURI, options)
      .then(() => {
        console.log('✅ MongoDB connected successfully');
        
        // Get the default connection
        const db = mongoose.connection;
        
        // Connection events
        db.on('connected', () => {
          console.log(`📊 MongoDB connected to: ${db.host}:${db.port}/${db.name}`);
        });

        db.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err.message);
        });

        db.on('disconnected', () => {
          console.log('⚠️ MongoDB disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', async () => {
          try {
            await mongoose.connection.close();
            console.log('👋 MongoDB connection closed through app termination');
            process.exit(0);
          } catch (err) {
            console.error('❌ Error closing MongoDB connection:', err);
            process.exit(1);
          }
        });
      })
      .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        console.error('💡 Troubleshooting tips:');
        console.error('1. Check if MongoDB Atlas IP is whitelisted');
        console.error('2. Verify connection string in .env file');
        console.error('3. Check internet connection');
        process.exit(1);
      });
  }

  // Method to get connection status
  static getConnectionStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    const state = mongoose.connection.readyState;
    return {
      state: states[state] || 'unknown',
      readyState: state
    };
  }

  // Method to close connection (for testing)
  static async closeConnection() {
    try {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
      return true;
    } catch (err) {
      console.error('❌ Error closing connection:', err);
      return false;
    }
  }
}

// Create singleton instance
module.exports = new Database();