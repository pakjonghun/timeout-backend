import mongoose, { isValidObjectId, Schema } from 'mongoose';

const chatSchema = new Schema({
  room: {
    type: isValidObjectId,
    required: true,
    ref: 'Room',
  },
  user: {
    type: String,
    required: true,
  },
  chat: String,
  gif: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Chat', chatSchema);
