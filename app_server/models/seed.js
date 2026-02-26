const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

// Import the Trip model
require('./travlr');
const Trip = mongoose.model('trips');

// Connect to MongoDB
mongoose.connect(dbURI).then(() => {
  console.log(`Mongoose connected to ${dbURI}`);
  runSeed();
}).catch(err => {
  console.log('Mongoose connection error:', err);
  process.exit(1);
});

async function runSeed() {
  try {
    // Remove existing records
    await Trip.deleteMany({});
    console.log('Existing trips removed.');

    // Load trips from JSON file
    const tripsPath = path.join(__dirname, '../../data/trips.json');
    const tripsData = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));

    // Convert start date strings to Date objects
    const trips = tripsData.map(trip => ({
      ...trip,
      start: new Date(trip.start)
    }));

    await Trip.insertMany(trips);
    console.log(`Seeded ${trips.length} trip(s) into the database.`);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('Mongoose disconnected.');
    process.exit(0);
  }
}
