import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect.js";
import config from "../configs/config.mongodb.js";

const connectString = `${config.db.url}/${config.db.name}`;

if (!connectString) {
  throw new Error("DATABASE_URL is not defined");
}

// Bật debug chỉ ở dev
if (process.env.NODE_ENV === "dev") {
  mongoose.set("debug", { color: true });
}

async function connect() {
  try {
    await mongoose
      .connect(connectString)
      .then((_) => console.log("Connected Mongodb success", countConnect()))
      .catch((err) => console.log("Connected Mongodb error: ", err));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

export default connect;
