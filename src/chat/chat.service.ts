import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('ChatMessage') private readonly chatModel: Model<any>,
  ) {}

  async saveMessage(username: string, text: string) {
    const newMsg = new this.chatModel({ username, text });
    return await newMsg.save();
  }

  async getRecentMessages(limit = 25) {
    return this.chatModel.find().sort({ timestamp: -1 }).limit(limit).exec();
  }
}
