import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChessGameRoom, ChessGameProcess, CurrentPlayer } from '@prisma/client';
import GetChessGameRoomDto from './dto/get-chess-game-room.dto';
import { ChessRoomEvents, Colors } from './chess.types';
import UpdateChessGameMemberDto from './dto/update-chess-game-member.dto';

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
            gameProcess: ChessGameProcess.RESUMED,
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
      if (!dto.gameId) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!dto.state) {
        return this.prisma.chessGameRoom.update({
          where: {
            gameId: dto.gameId,
          },
          data: {
            gameProcess: dto.gameProcess,
            whitePlayerId: dto.whitePlayerId,
            blackPlayerId: dto.blackPlayerId,
            viewersId: dto.viewersId,
          },
        });
      }

      return this.prisma.chessGameRoom.update({
        where: {
          gameId: dto.gameId,
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

  async updateChessGameMember(
    dto: UpdateChessGameMemberDto,
  ): Promise<ChessGameRoom> {
    try {
      if (!dto.gameId || !Number(dto.userId)) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const chessGameRoom: ChessGameRoom =
        await this.prisma.chessGameRoom.findUnique({
          where: {
            gameId: dto.gameId,
          },
        });

      let valueToUpdate = {} as Partial<ChessGameRoom>;

      if (dto.event === ChessRoomEvents.LEAVE_ROOM) {
        valueToUpdate = {
          whitePlayerId:
            chessGameRoom.whitePlayerId === dto.userId
              ? null
              : chessGameRoom.whitePlayerId,
          blackPlayerId:
            chessGameRoom.blackPlayerId === dto.userId
              ? null
              : chessGameRoom.blackPlayerId,
          viewersId: chessGameRoom.viewersId.filter(
            (item) => item !== dto.userId,
          ),
          gameProcess:
            ((chessGameRoom.whitePlayerId === dto.userId ||
              chessGameRoom.blackPlayerId === dto.userId) &&
              ChessGameProcess.ENDED) ||
            chessGameRoom.gameProcess,
        };
      }

      if (dto.event === ChessRoomEvents.VIEWERS) {
        valueToUpdate = {
          whitePlayerId:
            chessGameRoom.whitePlayerId === dto.userId
              ? null
              : chessGameRoom.whitePlayerId,
          blackPlayerId:
            chessGameRoom.blackPlayerId === dto.userId
              ? null
              : chessGameRoom.blackPlayerId,
          viewersId: chessGameRoom.viewersId.includes(dto.userId)
            ? chessGameRoom.viewersId
            : [...chessGameRoom.viewersId, dto.userId],
          gameProcess:
            ((chessGameRoom.whitePlayerId === dto.userId ||
              chessGameRoom.blackPlayerId === dto.userId) &&
              ChessGameProcess.ENDED) ||
            chessGameRoom.gameProcess,
        };
      }

      if (
        (dto.event === ChessRoomEvents.PLAYER &&
          dto.color === Colors.WHITE &&
          chessGameRoom.whitePlayerId) ||
        (dto.event === ChessRoomEvents.PLAYER &&
          dto.color === Colors.BLACK &&
          chessGameRoom.blackPlayerId)
      ) {
        throw new HttpException(
          { message: 'Outdated information', response: 'Outdated information' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (dto.event === ChessRoomEvents.PLAYER) {
        if (dto.color === Colors.WHITE) {
          valueToUpdate = {
            whitePlayerId: dto.userId,
            blackPlayerId:
              chessGameRoom.blackPlayerId === dto.userId
                ? null
                : chessGameRoom.blackPlayerId,
          };
        } else if (dto.color === Colors.BLACK) {
          valueToUpdate = {
            blackPlayerId: dto.userId,
            whitePlayerId:
              chessGameRoom.whitePlayerId === dto.userId
                ? null
                : chessGameRoom.whitePlayerId,
          };
        }
        valueToUpdate.viewersId = chessGameRoom.viewersId.filter(
          (item) => item !== dto.userId,
        );
      }

      return this.prisma.chessGameRoom.update({
        where: {
          gameId: dto.gameId,
        },
        data: {
          ...valueToUpdate,
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
}
