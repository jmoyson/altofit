import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'thierry@altofit.fr' },
    update: {},
    create: {
      email: 'thierry@altofit.fr',
      hash: await argon.hash('thierry1234'),
      firstName: 'Thierry',
      lastName: 'Fréchette',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'pierre@altofit.fr' },
    update: {},
    create: {
      email: 'pierre@altofit.fr',
      hash: await argon.hash('pierre1234'),
      firstName: 'Pierre',
      lastName: 'Lang',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'elodie@altofit.fr' },
    update: {},
    create: {
      email: 'elodie@altofit.fr',
      hash: await argon.hash('elodie1234'),
      firstName: 'Élodie Frappier',
      lastName: 'Frappier',
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'sabine@altofit.fr' },
    update: {},
    create: {
      email: 'sabine@altofit.fr',
      hash: await argon.hash('sabine1234'),
      firstName: 'Sabine',
      lastName: 'Talon',
    },
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'camille@altofit.fr' },
    update: {},
    create: {
      email: 'camille@altofit.fr',
      hash: await argon.hash('camille1234'),
      firstName: 'Camille',
      lastName: 'Simon',
    },
  });

  console.log({ user1, user2, user3, user4, user5 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
