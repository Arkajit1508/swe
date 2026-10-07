const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/iem_admission_db';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected (Host: ${conn.connection.host})`);
  } catch (error) {
    console.log(`Local MongoDB not available (${error.message}). Initializing In-Memory MongoDB Engine...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected: ${memoryUri}`);

      // Auto seed initial data
      const seedDB = require('../seeds/seedData');
      await seedDB(false);
      console.log(`Auto-seeded courses, student accounts, and admin accounts into In-Memory Database.`);
    } catch (memErr) {
      console.error(`MongoDB Initialization Failure: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
