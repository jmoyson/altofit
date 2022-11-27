import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Invoice, Recurrence } from '@prisma/client';
import { InvoiceService } from 'src/invoice/invoice.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private invoiceService: InvoiceService,
  ) {}

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async renewSubscriptions() {
    // Get all subscription that need to be renew
    // For MONTHLY, Subscriptions that need to be renewed are either
    // - Subscription that have no renewedAt and createdAt are more than one month away from today
    // - Subscription that have a renewed date at more than one month away from today
    const today = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        OR: [
          { AND: { renewedAt: null, createdAt: { lt: oneMonthAgo } } },
          { renewedAt: { lt: oneMonthAgo } },
        ],
      },
    });
    console.log('Subscription to renew...', subscriptions);

    const invoices = await Promise.all(
      subscriptions.map(async (s): Promise<Invoice> => {
        // Set the renew date
        await this.prisma.subscription.update({
          where: { id: s.id },
          data: {
            renewedAt: today,
          },
        });

        // Create the invoice
        const invoice = await this.invoiceService.create(s);
        // Simulate the paiement
        await this.invoiceService.simulatePaiment(invoice.id);
        return invoice;
      }),
    );
    console.log('Invoices of renewed Subscription', invoices);
  }

  async calcCurrentMRR() {
    // We use raw qurey to do the sum instead of retreiving all subscriptions...

    // Do the sum of all the subscription.price that are active (no endDate)
    // use EXPLAIN ANALYZE  to calculate execution time.
    const res = await this.prisma.$queryRaw`
      SELECT SUM (price) AS total
      FROM subscriptions
      WHERE 'endAt' IS NOT NULL OR 'endAt' > ${new Date().toISOString()}
    `;
    console.log(res);
    return res[0].total;
  }
}
