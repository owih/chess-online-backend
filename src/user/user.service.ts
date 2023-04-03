import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import CreateUserDto from './dto/create-user.dto';
import GetUserDto from './dto/get-user.dto';
import ChangeUserInfo from './dto/change-name.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(dto: GetUserDto): Promise<User> {
    console.log(dto);
    try {
      if (!Number(dto.id)) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const user: User = await this.prisma.user.findUnique({
        where: {
          id: Number(dto.id),
        },
      });

      if (!user) {
        throw new HttpException(
          { message: 'Unauthorized', response: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return user;
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
  async getUsersList(dto: GetUserDto): Promise<User> {
    console.log(dto);
    try {
      if (!Number(dto.id)) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const user: User = await this.prisma.user.findUnique({
        where: {
          id: Number(dto.id),
        },
      });

      if (!user) {
        throw new HttpException(
          { message: 'Unauthorized', response: 'Unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return user;
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

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      if (!dto.name) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.prisma.user.create({
        data: {
          name: dto.name,
        },
      });
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        { message: 'Something went wrong', response: 'Internal' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeUserInfo(dto: ChangeUserInfo): Promise<User> {
    try {
      console.log(dto);
      if (
        !dto.name ||
        dto.name.trim().length > 15 ||
        dto.name.trim().length < 3 ||
        !dto.id
      ) {
        throw new HttpException(
          { message: 'Bad request', response: 'Bad request' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.prisma.user.update({
        where: {
          id: dto.id,
        },
        data: {
          name: dto.name,
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
