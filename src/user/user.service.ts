import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionsService } from 'src/subscription/subscription.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionsService,
  ) {}

  async subscribe(userId: number) {
    return this.subscriptionService.subscribe(userId);
  }

  async unsubscribe(userId: number) {
    return this.subscriptionService.unsubscribe(userId);
  }
}
