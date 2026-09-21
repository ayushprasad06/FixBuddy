import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./src/models/Service.js";

dotenv.config();

const services = [
  {
    name: "AC Repair",
    slug: "ac-repair",
    category: "AC & Cooling",
    description:
      "AC repair, servicing, installation and maintenance.",
    price: 499,
    duration: "1-3 hours",
    icon: "❄️",
  },
  {
    name: "Electrical",
    slug: "electrical",
    category: "Electrical",
    description:
      "Switches, wiring, fans, lights and electrical repairs.",
    price: 249,
    duration: "1-2 hours",
    icon: "⚡",
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    category: "Plumbing",
    description:
      "Leaks, taps, pipes, fittings and everyday plumbing repairs.",
    price: 299,
    duration: "1-2 hours",
    icon: "🔧",
  },
  {
    name: "Home Cleaning",
    slug: "home-cleaning",
    category: "Cleaning",
    description:
      "Deep cleaning, regular cleaning and move-in services.",
    price: 599,
    duration: "2-4 hours",
    icon: "🧹",
  },
  {
    name: "Appliance Repair",
    slug: "appliance-repair",
    category: "Appliance Repair",
    description:
      "Professional repair for everyday household appliances.",
    price: 349,
    duration: "1-2 hours",
    icon: "🛠️",
  },
  {
    name: "Painting",
    slug: "painting",
    category: "Painting",
    description:
      "Interior painting, touch-ups and complete home makeovers.",
    price: 999,
    duration: "1-2 days",
    icon: "🎨",
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Service.deleteMany({});

    await Service.insertMany(services);

    console.log("Services seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedServices();