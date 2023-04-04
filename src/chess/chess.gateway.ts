import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChessRoomEvents, RoomListener } from './chess.types';

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

  @SubscribeMessage(ChessRoomEvents.JOIN_ROOM)
  handleRoomJoin(client: Socket, data: RoomListener) {
    console.log(data);
    console.log(data.userId, 'connected to room', data.room);
    client.join(data.room);
    this.server.to(data.room).emit(ChessRoomEvents.LEAVE_ROOM, data.userId);
  }

  @SubscribeMessage(ChessRoomEvents.LEAVE_ROOM)
  handleRoomLeave(client: Socket, data: RoomListener) {
    console.log(data.userId, 'leaved from room', data.room);
    client.leave(data.room);
    this.server.to(data.room).emit(ChessRoomEvents.LEAVE_ROOM, data.userId);
  }

  @SubscribeMessage(ChessRoomEvents.EVENT)
  handleEvent(
    @MessageBody() data: { userId: string; room: string; data: string },
  ) {
    console.log(data);
    // this.server.emit('chessGameEvent', data.message);
    this.server.to(data.room).emit(ChessRoomEvents.EVENT, data.data);
  }

  handleConnection(client: Socket, ...args): any {
    console.log('connected');
  }
}
