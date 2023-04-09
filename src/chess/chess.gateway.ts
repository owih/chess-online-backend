import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
  ChessClientRequest,
  ChessGameMemberEvent,
  ChessGamePlayer,
  ChessGameState,
  ChessGameViewer,
  ChessRoomEvents,
  RoomListener,
} from './chess.types';
import { ChessGameProcess } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: `${process.env.CLIENT_URL}`,
  },
  namespace: '/socket.io',
})
export class ChessGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Socket) {
    console.log('INIT');
  }

  @SubscribeMessage(ChessRoomEvents.JOIN_ROOM)
  handleRoomJoin(client: Socket, data: ChessClientRequest<RoomListener>) {
    const userId = data.userId;
    client.join(data.room);
    this.server.to(data.room).emit(ChessRoomEvents.JOIN_ROOM, data);
    client.on('disconnecting', () => {
      const targetRoom = Array.from(client.rooms)[client.rooms.size - 1];
      const data = {
        userId,
        room: targetRoom,
        data: { userId, room: targetRoom, event: ChessGameMemberEvent.LEAVE },
      };
      this.server.to(targetRoom).emit(ChessRoomEvents.LEAVE_ROOM, data);
    });
  }

  @SubscribeMessage(ChessRoomEvents.LEAVE_ROOM)
  handleRoomLeave(client: Socket, data: ChessClientRequest<RoomListener>) {
    this.server
      .to(data.room)
      .emit(ChessRoomEvents.LEAVE_ROOM, data.data.userId);
    this.server.to(data.room).emit(ChessRoomEvents.LEAVE_ROOM, data);
  }

  @SubscribeMessage(ChessRoomEvents.PROCESS)
  handleProcessMessage(
    @MessageBody() data: ChessClientRequest<ChessGameProcess>,
  ) {
    this.server.to(data.room).emit(ChessRoomEvents.PROCESS, data);
  }

  @SubscribeMessage(ChessRoomEvents.PLAYER)
  handlePlayerMessage(
    @MessageBody() data: ChessClientRequest<ChessGamePlayer>,
  ) {
    this.server.to(data.room).emit(ChessRoomEvents.PLAYER, data);
  }

  @SubscribeMessage(ChessRoomEvents.VIEWERS)
  handleViewerMessage(
    @MessageBody() data: ChessClientRequest<ChessGameViewer>,
  ) {
    this.server.to(data.room).emit(ChessRoomEvents.VIEWERS, data);
  }

  @SubscribeMessage(ChessRoomEvents.EVENT)
  handleEvent(@MessageBody() data: ChessClientRequest<ChessGameState>) {
    this.server.to(data.room).emit(ChessRoomEvents.EVENT, data);
  }

  handleConnection(client: Socket, ...args): void {
    console.log('connected');
  }

  handleDisconnect(client: Socket, ...args): void {
    console.log('DISCONNECT IMPLEMENT');
  }
}
