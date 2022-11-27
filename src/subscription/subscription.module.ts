import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscription.service';

@Module({
  providers: [SubscriptionsService],
})
export class SubscriptionModule {}
