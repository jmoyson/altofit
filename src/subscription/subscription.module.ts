import { Module } from '@nestjs/common';
import { InvoiceService } from 'src/invoice/invoice.service';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';

@Module({
  providers: [SubscriptionService, InvoiceService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
