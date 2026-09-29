import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000;
// count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections:: ${numConnection}`);
};

// Check over load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connections::${numConnection}`);

    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
      // notify.send(.....)
    }
  }, _SECONDS);
};

export { countConnect, checkOverload };
