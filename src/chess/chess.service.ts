import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChessGameRoom, CurrentPlayer } from '@prisma/client';
import GetChessGameRoomDto from './dto/get-chess-game-room.dto';

@Injectable()
export class ChessService {
  constructor(private prisma: PrismaService) {}

  async getChessGameRooms(): Promise<ChessGameRoom[]> {
    try {
      return await this.prisma.chessGameRoom.findMany({});
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        { message: 'Something went wrong', response: 'Internal' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChessGameRoom(dto: GetChessGameRoomDto): Promise<ChessGameRoom> {
    console.log(dto);
    try {
      if (dto.id) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.prisma.chessGameRoom.findUnique({
        where: {
          gameId: dto.id,
        },
      });
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        { message: 'Something went wrong', response: 'Internal' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startChessGameRoom(dto: GetChessGameRoomDto): Promise<ChessGameRoom> {
    console.log(dto);
    try {
      if (!dto.id) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const chessGameRoom: ChessGameRoom =
        await this.prisma.chessGameRoom.findUnique({
          where: {
            gameId: dto.id,
          },
        });

      if (!chessGameRoom) {
        return await this.prisma.chessGameRoom.create({
          data: {
            gameId: dto.id,
            currentPlayer: CurrentPlayer.WHITE,
          },
        });
      }

      return chessGameRoom;
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        { message: 'Something went wrong', response: 'Internal' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateChessGameRoom(dto: ChessGameRoom): Promise<ChessGameRoom> {
    try {
      if (!dto.id) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.prisma.chessGameRoom.update({
        where: {
          id: dto.id,
        },
        data: dto,
      });
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        { message: 'Something went wrong', response: 'Internal' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
