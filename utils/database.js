const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let db = null;

const mongoClient = () => {
  return MongoClient.connect(
    "mongodb+srv://sush_mongo:rlRxRyzJFe4BmWfr@cluster0.m6exljw.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected to MongoDB");
      // Set the db variable to the connected database
      db = client.db(); // this will use the shop database specified in the connection string
      // we can also specify a database name here to override
      // db = client.db('shop');
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};

const getDb = () => {
  if (db) {
    return db;
  } else {
    throw new Error("Database not initialized. Call mongoClient() first.");
  }
};

module.exports = {
  mongoClient,
  getDb,
};
// Usage example:
// const { mongoClient, getDb } = require('./utils/database');
// mongoClient();
// const db = getDb();
// db.collection('your_collection_name').find().toArray().then(data => console.log(data));
// Ensure to call mongoClient() before using getDb()
// to initialize the database connection.
