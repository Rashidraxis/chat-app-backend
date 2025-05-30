import { Schema } from 'mongoose';

export const ChatMessageSchema = new Schema({
  username: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
