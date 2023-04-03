import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: `${process.env.CLIENT_URL}`,
  },
  namespace: '/socket.io',
})
export class ChessGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('INIT');
  }

  @SubscribeMessage('joinChessGameRoom')
  handleRoomJoin(client: Socket, room: string) {
    console.log(room);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveChessGameRoom')
  handleRoomLeave(client: Socket, room: string) {
    console.log(room);
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('chessGameEvent')
  handleEvent(
    @MessageBody() data: { sender: string; room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data);
    this.server.emit('chessGameEvent', data.message);
    this.server.to(data.room).emit(data.message);
  }

  handleConnection(client: Socket, ...args): any {
    console.log('connected');
    this.server.emit('chessGameEvent', 'CLIENT CONNECTED');
  }
}
