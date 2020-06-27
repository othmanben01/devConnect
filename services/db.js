const mongoose = require("mongoose");
const config = require("config");
const dbDebug = require("debug")("app:db");

const dbURI = config.get("db.mongoURI");

const connectDB = async () => {
  try {
    // connect to mongodb
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    mongoose.set("useFindAndModify", false);

    dbDebug("MongoDB connected...");
  } catch (error) {
    console.error(error);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
