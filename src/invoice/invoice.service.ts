import { Injectable } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  create(subscription: Subscription) {
    return this.prisma.invoice.create({
      data: {
        userId: subscription.userId, // FIXME do I really need the user ID in the invoice ?
        subscriptionId: subscription.id,
        amount: subscription.price,
      },
    });
  }

  simulatePaiment(id: number) {
    return this.prisma.invoice.update({
      where: { id },
      data: {
        paidAt: new Date(),
      },
    });
  }
}
