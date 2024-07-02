import mongoose from "mongoose";

class Database {
  connection: any;

  constructor() {
    this.connect();
  }

  private async connect() {
    mongoose.connect(process.env.MONGO_URI, {
      user:process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      dbName: process.env.MONGO_DATABASE_NAME
    });
    this.connection = mongoose.connection

    this.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    this.connection.on("error", (err) => {
      console.error("Error connecting to MongoDB:", err);
    });

    this.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  }
}

export default new Database();
