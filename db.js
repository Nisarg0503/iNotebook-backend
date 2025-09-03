const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/iNotebook2";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to mongo Sucessfully");
  } catch (error) {
    console.log("Mongo connection error", error);
  }
};
module.exports = connectToMongo;
