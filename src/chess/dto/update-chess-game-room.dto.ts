export default class UpdateChessGameRoomDto {
  readonly id: number;
  readonly whitePlayerId: number;
  readonly blackPlayerId: number;
  readonly viewersId: number[];
}
