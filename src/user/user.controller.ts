import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post('me/subscribe')
  subscribe(@GetUser('id') userId: number) {
    return this.userService.subscribe(userId);
  }

  @Post('me/unsubscribe')
  unsubscribe(@GetUser('id') userId: number) {
    return this.userService.unsubscribe(userId);
  }
}
