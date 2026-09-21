import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const migrateServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collection = mongoose.connection.collection("services");

    await collection.updateMany(
      {},
      [
        {
          $set: {
            price: { $ifNull: ["$price", "$basePrice"] },
            duration: {
              $ifNull: ["$duration", "$estimatedDuration"],
            },
            category: {
              $ifNull: [
                "$category",
                {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$slug", "ac-repair"] },
                        then: "AC & Cooling",
                      },
                      {
                        case: { $eq: ["$slug", "ac-cooling"] },
                        then: "AC & Cooling",
                      },
                      {
                        case: { $eq: ["$slug", "electrical"] },
                        then: "Electrical",
                      },
                      {
                        case: { $eq: ["$slug", "plumbing"] },
                        then: "Plumbing",
                      },
                      {
                        case: { $eq: ["$slug", "home-cleaning"] },
                        then: "Cleaning",
                      },
                      {
                        case: { $eq: ["$slug", "appliance-repair"] },
                        then: "Appliance Repair",
                      },
                      {
                        case: { $eq: ["$slug", "painting"] },
                        then: "Painting",
                      },
                    ],
                    default: "Home Services",
                  },
                },
              ],
            },
            isActive: { $ifNull: ["$isActive", true] },
            icon: { $ifNull: ["$icon", "🔧"] },
          },
        },
        {
          $unset: ["basePrice", "estimatedDuration"],
        },
      ]
    );

    const services = await collection.find({}).toArray();

    console.log("Services after migration:");

    for (const service of services) {
      console.log({
        name: service.name,
        slug: service.slug,
        category: service.category,
        price: service.price,
        duration: service.duration,
        hasBasePrice: Object.prototype.hasOwnProperty.call(
          service,
          "basePrice"
        ),
        hasEstimatedDuration: Object.prototype.hasOwnProperty.call(
          service,
          "estimatedDuration"
        ),
      });
    }

    await mongoose.connection.close();
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateServices();