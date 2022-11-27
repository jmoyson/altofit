import { ForbiddenException, Injectable } from '@nestjs/common';
import { Recurrence } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: number) {
    // Get current subscription
    let subscription = await this.getCurrentUserSubscription(userId);

    // if there is a subscription and it's not canceled
    if (subscription && subscription.endAt === null) {
      // send a error message that the user is already subscribe
      throw new ForbiddenException('Already subscribed');
    }

    // if subscription is cancelled (with end date) but not ended
    if (subscription) {
      // Resubscribe (clear the endDate)
      return this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          endAt: null,
        },
      });
    }

    // if no subscription create a new one
    // TODO Create a Plan table that will list all the offers (to get the price of the subscribed plan)
    subscription = await this.prisma.subscription.create({
      data: {
        userId,
        price: 39.99, // TOFIX
      },
    });

    // Send invoice...
    return subscription;
  }

  async unsubscribe(userId: number) {
    // Get current subscription
    const subscription = await this.getCurrentUserSubscription(userId);

    // if subscription is already cancelled (endDate is set)
    if (subscription.endAt != null) {
      throw new ForbiddenException('Already unsubscribe');
    }

    // If not already canceled then calc the endDate
    const endDate = this.calcEndDate(
      subscription.renewedAt || subscription.createdAt,
      subscription.recurrence,
    );

    // And update the subscription to expire (set the endDate)
    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        endAt: endDate,
      },
    });
  }

  calcEndDate(startDate: Date, recurrence: Recurrence) {
    let endDate = new Date();
    switch (recurrence) {
      case Recurrence.DAILY:
        endDate = new Date(startDate.setDate(startDate.getDate() + 1));
        break;
      case Recurrence.MONTHLY:
        endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        break;
      default:
        break;
    }
    return endDate;
  }

  getCurrentUserSubscription(userId: number) {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        OR: [{ endAt: null }, { endAt: { gt: new Date() } }],
      },
    });
  }
}
