import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
  ChessClientRequest,
  ChessGamePlayer,
  ChessGameProcess,
  ChessGameState,
  ChessGameViewer,
  ChessRoomEvents,
  RoomListener,
} from './chess.types';

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
  handleRoomJoin(client: Socket, data: ChessClientRequest<RoomListener>) {
    console.log(data);
    console.log(data.data.userId, 'connected to room', data.room);
    client.join(data.room);
    this.server.to(data.room).emit(ChessRoomEvents.JOIN_ROOM, data.data.userId);
    this.server.to(data.room).emit(ChessRoomEvents.VIEWERS, data);
  }

  @SubscribeMessage(ChessRoomEvents.LEAVE_ROOM)
  handleRoomLeave(client: Socket, data: ChessClientRequest<RoomListener>) {
    console.log(data, 'leaved from room');
    this.server
      .to(data.room)
      .emit(ChessRoomEvents.LEAVE_ROOM, data.data.userId);
    this.server.to(data.room).emit(ChessRoomEvents.VIEWERS, data);
  }

  @SubscribeMessage(ChessRoomEvents.PROCESS)
  handleProcessMessage(
    @MessageBody() data: ChessClientRequest<ChessGameProcess>,
  ) {
    console.log(data);
    this.server.to(data.room).emit(ChessRoomEvents.PROCESS, data);
  }

  @SubscribeMessage(ChessRoomEvents.PLAYER)
  handlePlayerMessage(
    @MessageBody() data: ChessClientRequest<ChessGamePlayer>,
  ) {
    console.log(data);
    this.server.to(data.room).emit(ChessRoomEvents.PLAYER, data);
  }

  @SubscribeMessage(ChessRoomEvents.VIEWERS)
  handleViewerMessage(
    @MessageBody() data: ChessClientRequest<ChessGameViewer>,
  ) {
    console.log(data);
    this.server.to(data.room).emit(ChessRoomEvents.VIEWERS, data);
  }

  @SubscribeMessage(ChessRoomEvents.EVENT)
  handleEvent(@MessageBody() data: ChessClientRequest<ChessGameState>) {
    console.log(data);
    this.server.to(data.room).emit(ChessRoomEvents.EVENT, data);
  }

  handleConnection(client: Socket, ...args): any {
    console.log('connected');
  }
}
