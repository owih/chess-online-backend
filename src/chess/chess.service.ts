import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChessGameRoom,
  ChessGameState,
  PlayerTurn,
  User,
} from '@prisma/client';
import GetChessGameRoomDto from './dto/get-chess-game-room.dto';
import UpdateChessGameRoomDto from './dto/update-chess-game-room.dto';
import UpdateChessGameStateDto from './dto/update-chess-game-state.dto';
import { ChessGameRoomTransformedData } from './chess.types';

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

  async getChessGameRoom(
    dto: GetChessGameRoomDto,
  ): Promise<ChessGameRoomTransformedData> {
    console.log(dto);
    try {
      if (dto.id) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const chessGameRoom: ChessGameRoom | null =
        await this.prisma.chessGameRoom.findUnique({
          where: {
            gameId: dto.id,
          },
        });

      if (!chessGameRoom) {
        throw new HttpException(
          { message: 'Unauthorized', response: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const chessGameState: ChessGameState | null =
        await this.prisma.chessGameState.findUnique({
          where: {
            id: chessGameRoom.stateId,
          },
        });

      let whitePlayer: User | null = null;

      if (chessGameRoom.whitePlayerId) {
        whitePlayer = await this.prisma.user.findUnique({
          where: {
            id: chessGameRoom.whitePlayerId,
          },
        });
      }

      let blackPlayer: User | null = null;

      if (chessGameRoom.blackPlayerId) {
        blackPlayer = await this.prisma.user.findUnique({
          where: {
            id: chessGameRoom.blackPlayerId,
          },
        });
      }

      const viewers: User[] = await this.prisma.user.findMany({
        where: {
          id: { in: chessGameRoom.viewersId },
        },
      });

      return {
        state: chessGameState,
        blackPlayer,
        whitePlayer,
        viewers,
        playerTurn: chessGameRoom.playerTurn,
      };
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

  async startChessGameRoom(
    dto: GetChessGameRoomDto,
  ): Promise<ChessGameRoomTransformedData> {
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
        const chessGameState: ChessGameState =
          await this.prisma.chessGameState.create({ data: {} });

        await this.prisma.chessGameRoom.create({
          data: {
            gameId: dto.id,
            stateId: chessGameState.id,
            playerTurn: PlayerTurn.WHITE,
          },
        });

        return {
          state: null,
          blackPlayer: null,
          whitePlayer: null,
          viewers: [],
          playerTurn: PlayerTurn.WHITE,
        };
      }

      const chessGameState: ChessGameState | null =
        await this.prisma.chessGameState.findUnique({
          where: {
            id: chessGameRoom.stateId,
          },
        });

      let whitePlayer: User | null = null;

      if (chessGameRoom.whitePlayerId) {
        whitePlayer = await this.prisma.user.findUnique({
          where: {
            id: chessGameRoom.whitePlayerId,
          },
        });
      }

      let blackPlayer: User | null = null;

      if (chessGameRoom.blackPlayerId) {
        blackPlayer = await this.prisma.user.findUnique({
          where: {
            id: chessGameRoom.blackPlayerId,
          },
        });
      }

      const viewers: User[] = await this.prisma.user.findMany({
        where: {
          id: { in: chessGameRoom.viewersId },
        },
      });

      return {
        state: chessGameState,
        blackPlayer,
        whitePlayer,
        viewers,
        playerTurn: chessGameRoom.playerTurn,
      };
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

  async updateChessGameRoom(
    dto: UpdateChessGameRoomDto,
  ): Promise<ChessGameRoom> {
    try {
      if (!Number(dto.id)) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.prisma.chessGameRoom.update({
        where: {
          id: dto.id,
        },
        data: {
          whitePlayerId: dto.whitePlayerId,
          blackPlayerId: dto.blackPlayerId,
          viewersId: dto.viewersId,
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

  async updateChessGameState(
    dto: UpdateChessGameStateDto,
  ): Promise<ChessGameState> {
    try {
      if (!Number(dto.id)) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.prisma.chessGameState.update({
        where: {
          id: dto.id,
        },
        data: {
          state: dto.state,
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
