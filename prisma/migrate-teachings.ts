import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teachings = await prisma.teaching.findMany({
    include: { translations: true },
  });

  for (const teaching of teachings) {
    const existing = new Set(teaching.translations.map((t) => t.locale));
    const operations: Promise<any>[] = [];

    if (teaching.title && !existing.has('en')) {
      operations.push(
        prisma.teachingTranslation.create({
          data: {
            teachingId: teaching.id,
            locale: 'en',
            title: teaching.title,
            content: teaching.content ?? undefined,
          },
        }),
      );
    }

    if (teaching.titleMm && !existing.has('mm')) {
      operations.push(
        prisma.teachingTranslation.create({
          data: {
            teachingId: teaching.id,
            locale: 'mm',
            title: teaching.titleMm,
            content: teaching.contentMm ?? undefined,
          },
        }),
      );
    }

    if (operations.length > 0) {
      await Promise.all(operations);
      console.log(`Migrated teaching ${teaching.id}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
