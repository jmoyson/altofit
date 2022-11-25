import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://alto_admin:alto_password@localhost:5432/alto?schema=public',
        },
      },
    });
  }
}
