const mongoose = require("mongoose");



/**/
/*
connectDatabase()
NAME
    connectDatabase - Connects to the MongoDB database.
SYNOPSIS
    connectDatabase = async () => {...};
DESCRIPTION
    This function establishes a connection to the MongoDB database using Mongoose.
RETURNS
    None.
*/
/**/
const connectDatabase = async () => {
  try {
    // Establish a connection to the MongoDB database using the provided URL
    const { connection } = await mongoose.connect(process.env.MONGO_URL);

    // Log a success message if the connection is established
    console.log(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    // Log the error and exit the process with a non-zero status code if the connection fails
    console.error(error);
    process.exit(1); 
  }
}
/* connectDatabase = async () => {...}; */



module.exports = connectDatabase;