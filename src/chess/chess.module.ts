import { Module } from '@nestjs/common';
import { ChessController } from './chess.controller';
import { ChessService } from './chess.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChessGateway } from './chess.gateway';

@Module({
  controllers: [ChessController],
  providers: [ChessService, PrismaService, ChessGateway],
})
export class ChessModule {}
