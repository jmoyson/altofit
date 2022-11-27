import { Module } from '@nestjs/common';
import { InvoiceService } from 'src/invoice/invoice.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, SubscriptionService, InvoiceService],
})
export class UserModule {}
