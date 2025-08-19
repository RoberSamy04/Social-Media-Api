const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    console.log(`Connected to the database successfully `);
  } catch (error) {
    console.log(`Failed to connect to the database \n ${error}`);
  }
};

module.exports = connectToDatabase;
