export interface RoomListener {
  userId: number;
  event: ChessGameMemberEvent;
}

export enum ChessGameMemberEvent {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
}

export enum ChessRoomEvents {
  JOIN_ROOM = 'joinChessGameRoom',
  LEAVE_ROOM = 'leaveChessGameRoom',
  EVENT = 'chessGameEvent',
  PROCESS = 'chessGameProcess',
  PLAYER = 'chessGamePlayer',
  VIEWERS = 'chessGameViewers',
}

export enum FigureName {
  FIGURE = 'Figure',
  KING = 'King',
  QUEEN = 'Queen',
  KNIGHT = 'Knight',
  BISHOP = 'Bishop',
  ROOK = 'Rook',
  PAWN = 'Pawn',
}

export enum Colors {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export interface ChessGameState {
  cells: ChessGameLoadedCell[][];
  currentPlayer: Colors;
}

export interface ChessGamePlayer {
  playerId: number;
}

export interface ChessGameViewer {
  viewerId: number;
}

interface ChessGameLoadedCell {
  x: number;
  y: number;
  color: Colors | undefined;
  figure: FigureName | undefined;
  board: null;
}

export interface ChessClientRequest<T> {
  room: string;
  userId: number;
  data: T;
}
