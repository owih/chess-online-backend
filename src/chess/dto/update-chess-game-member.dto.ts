import { ChessRoomEvents, Colors } from '../chess.types';

export default class UpdateChessGameMemberDto {
  readonly id: string;
  readonly gameId: string;
  readonly userId: number;
  readonly event: ChessRoomEvents;
  readonly color?: Colors;
}
