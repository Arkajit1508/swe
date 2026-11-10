
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const createAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('Connected to MongoDB.');

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;
    const phone = process.env.ADMIN_PHONE;

    if (!name || !email || !password || !phone) {
      throw new Error(
        'Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_PHONE before running this script.'
      );
    }

    if (password.length < 6) {
      throw new Error('Admin password must be at least 6 characters.');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('An admin account with this email already exists. No changes made.');
      } else {
        console.log('This email belongs to an existing student. No changes made.');
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'admin'
    });

    console.log('Admin account created successfully.');
    console.log(`Admin email: ${email}`);
    console.log('Password stored as a bcrypt hash.');
  } catch (error) {
    console.error('Admin creation failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
