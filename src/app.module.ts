import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChessModule } from './chess/chess.module';

@Module({
  imports: [UserModule, ChessModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
