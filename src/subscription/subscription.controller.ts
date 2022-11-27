import { Controller, Get } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionsService: SubscriptionService) {}

  // TODO Function to remove (just to test the without waiting for the cron to execute)
  @Get('renew')
  renew() {
    this.subscriptionsService.renewSubscriptions();
  }

  @Get('mrr')
  currentMRR() {
    return this.subscriptionsService.calcCurrentMRR();
  }
}
