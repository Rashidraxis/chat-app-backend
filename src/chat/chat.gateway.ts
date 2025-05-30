import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map(); // socket.id => username
  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.users.delete(client.id);
    this.server.emit('leave', { id: client.id });
    this.emitUsers(); // Update user list
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { username: string }) {
    client.data.username = payload.username;
    this.users.set(client.id, payload.username);
    this.server.emit('join', {
      message: `${payload.username} has joined the chat`,
    });
    this.emitUsers(); // Emit updated user list
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { text: string }) {
    const username = client.data.username;
    const message = await this.chatService.saveMessage(username, payload.text);

    this.server.emit('message', {
      username,
      text: message.text,
      timestamp: message.timestamp,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket) {
    const username = client.data.username;
    client.broadcast.emit('typing', { username });
  }

  private emitUsers() {
    const usernames = Array.from(this.users.values());
    this.server.emit('users', usernames);
  }
}
