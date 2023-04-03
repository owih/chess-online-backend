import { ChessGameState, PlayerTurn, User } from '@prisma/client';

export interface ChessGameRoomTransformedData {
  state: ChessGameState;
  whitePlayer: User;
  blackPlayer: User;
  viewers: User[];
  playerTurn: PlayerTurn;
}
