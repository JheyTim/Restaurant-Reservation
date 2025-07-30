const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectInMemoryDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

const disconnectInMemoryDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = {
  connectInMemoryDB,
  disconnectInMemoryDB,
};
