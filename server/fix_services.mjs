import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  const services = await mongoose.connection.collection("services").find().toArray();
  for (const s of services) {
    const price = s.price ?? s.basePrice ?? 299;
    const duration = s.duration ?? s.estimatedDuration ?? "1-2 hours";
    const category = s.category || s.name;
    await mongoose.connection.collection("services").updateOne(
      { _id: s._id },
      { $set: { price, duration, category } }
    );
    console.log("Updated:", s.name, "-> price:", price, "duration:", duration, "category:", category);
  }
  await mongoose.connection.close();
  console.log("Done!");
}

fix().catch(console.error);
