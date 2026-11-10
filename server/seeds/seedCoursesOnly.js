
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Course = require('../models/Course');

const sampleCourses = [
  {
    programName: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 180,
    availableSeats: 142,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank'
  },
  {
    programName: 'B.Tech Information Technology',
    department: 'Information Technology',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 120,
    availableSeats: 98,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank'
  },
  {
    programName: 'B.Tech Electronics & Communication Engineering',
    department: 'Electronics & Communication',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 120,
    availableSeats: 85,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate + valid IEMJEE/WBJEE rank'
  },
  {
    programName: 'B.Tech Computer Science & Business Systems',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    durationYears: 4,
    totalSeats: 60,
    availableSeats: 45,
    applicationFee: 500,
    eligibility: '10+2 with PCM minimum 60% aggregate'
  },
  {
    programName: 'Bachelor of Computer Applications (BCA)',
    department: 'Computer Applications',
    degree: 'BCA',
    durationYears: 3,
    totalSeats: 120,
    availableSeats: 90,
    applicationFee: 500,
    eligibility: '10+2 in any stream with Mathematics/Computer Science (min 50%)'
  },
  {
    programName: 'Master of Computer Applications (MCA)',
    department: 'Computer Applications',
    degree: 'MCA',
    durationYears: 2,
    totalSeats: 60,
    availableSeats: 35,
    applicationFee: 500,
    eligibility: 'BCA/B.Sc Computer Science with min 50% + JECA rank'
  },
  {
    programName: 'Master of Business Administration (MBA)',
    department: 'Management Studies',
    degree: 'MBA',
    durationYears: 2,
    totalSeats: 120,
    availableSeats: 70,
    applicationFee: 500,
    eligibility: 'Graduation in any discipline with min 50% + CAT/MAT/JEMAT score'
  }
];

const seedCoursesOnly = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas.');

    let inserted = 0;
    let skipped = 0;

    for (const course of sampleCourses) {
      const existing = await Course.findOne({
        programName: course.programName
      });

      if (existing) {
        console.log(`Already exists: ${course.programName}`);
        skipped++;
        continue;
      }

      await Course.create(course);
      console.log(`Inserted: ${course.programName}`);
      inserted++;
    }

    console.log('\nCourse seeding completed.');
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped (already existing): ${skipped}`);
    console.log(`Total courses in database: ${await Course.countDocuments()}`);
  } catch (error) {
    console.error('Course seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedCoursesOnly();
