import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChessService } from './chess.service';
import GetChessGameRoomDto from './dto/get-chess-game-room.dto';
import { ChessGameRoom } from '@prisma/client';

@Controller('chess')
export class ChessController {
  constructor(private userService: ChessService) {}

  @Get(':id')
  getChessGameRoom(@Param() chessGameRoomDto: GetChessGameRoomDto) {
    return this.userService.getChessGameRoom(chessGameRoomDto);
  }

  @Get('start/:id')
  startChessGameRoom(@Param() getChessGameRoomDto: GetChessGameRoomDto) {
    return this.userService.startChessGameRoom(getChessGameRoomDto);
  }

  @Get()
  getChessGameRooms() {
    return this.userService.getChessGameRooms();
  }

  @Post()
  setChessGameState(@Body() updateChessGameRoomDto: ChessGameRoom) {
    return this.userService.updateChessGameRoom(updateChessGameRoomDto);
  }
}
