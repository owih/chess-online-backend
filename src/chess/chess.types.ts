export interface RoomListener {
  room: string;
  userId: number;
}

export enum ChessRoomEvents {
  JOIN_ROOM = 'joinChessGameRoom',
  LEAVE_ROOM = 'leaveChessGameRoom',
  EVENT = 'chessGameEvent',
}
