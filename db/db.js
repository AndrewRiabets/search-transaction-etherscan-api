import mongoose from "mongoose";

const { connect, connection } = mongoose;

const uriDb = process.env.URI_DB;

const db = connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection.on("connected", () => {
  console.log("Database connection successful");
});

connection.on("err", (err) => {
  console.log(`Mongoose connection error: ${err.message}`);
});

connection.on("disconnected", () => {
  console.log("Database disconnected");
});

process.on("SIGINT", () => {
  connection.close();
  console.log("Connection DB closed");
  process.exit(1);
});

export default db;
