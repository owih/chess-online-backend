import { Controller, Get, Param } from '@nestjs/common';
import { ChessService } from './chess.service';
import GetChessGameRoomDto from './dto/get-chess-game-room.dto';

@Controller('chess')
export class ChessController {
  constructor(private userService: ChessService) {}

  @Get(':id')
  getChessGameRoom(@Param() chessGameRoomDto: GetChessGameRoomDto) {
    return this.userService.getChessGameRoom(chessGameRoomDto);
  }

  @Get('start/:id')
  startChessGameRoom(@Param() chessGameRoomDto: GetChessGameRoomDto) {
    return this.userService.startChessGameRoom(chessGameRoomDto);
  }

  @Get()
  getChessGameRooms() {
    return this.userService.getChessGameRooms();
  }
}
