import dotenv from "dotenv";
dotenv.config();

const dev = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },
};

const pro = {
  app: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.DATABASE_URL,
    name: process.env.DATABASE_NAME,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

export default config[env];
