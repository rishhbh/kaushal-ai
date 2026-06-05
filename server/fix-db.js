const mongoose = require('mongoose');
require('dotenv').config();

const fixDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // 1. Drop existing indexes that might be causing the issue
    console.log('Dropping email_1 index if it exists...');
    try {
      await usersCollection.dropIndex('email_1');
      console.log('Successfully dropped old email_1 index.');
    } catch (e) {
      if (e.codeName === 'IndexNotFound') {
        console.log('Index email_1 not found, no need to drop.');
      } else {
        console.error('Error dropping index:', e);
      }
    }

    // 2. Clean up data: ensure 'email' field is completely unset if it was saved as null or empty string
    // This removes the field entirely so sparse index won't trip over it.
    console.log('Cleaning up existing users with null or empty emails...');
    const cleanupResult = await usersCollection.updateMany(
      { $or: [{ email: null }, { email: "" }] },
      { $unset: { email: "" } }
    );
    console.log(`Unset email field on ${cleanupResult.modifiedCount} documents.`);

    // 3. Recreate the index explicitly with sparse: true
    console.log('Creating new unique, sparse index for email...');
    await usersCollection.createIndex(
      { email: 1 }, 
      { unique: true, sparse: true, background: true }
    );
    console.log('Successfully created sparse index for email.');

    console.log('Fix complete! Disconnecting...');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
};

fixDatabase();
