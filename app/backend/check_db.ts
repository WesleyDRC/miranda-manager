import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/miranda-manager"; // Assuming default local MongoDB

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.useDb("test"); // Try test or miranda-manager depending on env
  const collection = mongoose.connection.collection("treasuryinvestments");
  const docs = await collection.find({}).toArray();
  console.log(JSON.stringify(docs, null, 2));
  process.exit(0);
}

run().catch(console.error);
