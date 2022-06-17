import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;

// const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
const MONGO_URL = 'mongodb://localhost:27017/gifchat';
const connect = () => {
  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(MONGO_URL, () => {
    console.log('connected db');
  });
};

mongoose.connection.on('error', (error) => {
  console.error('error', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('disconnected');
  connect();
});

export default connect;
