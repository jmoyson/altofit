import { Module } from '@nestjs/common';
import { SubscriptionsService } from 'src/subscription/subscription.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SubscriptionsService],
})
export class UserModule {}
