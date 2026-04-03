
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('🚀 Starting migration of teaching translations...');

  // 1. Get all teachings that have legacy fields populated
  const teachings = await prisma.teaching.findMany();

  let migratedCount = 0;

  for (const teaching of teachings) {
    console.log(`\nProcessing Teaching ID: ${teaching.id}`);

    // Migrate English (Legacy title/content)
    if (teaching.title) {
      await prisma.teachingTranslation.upsert({
        where: {
          teachingId_locale: {
            teachingId: teaching.id,
            locale: 'en',
          },
        },
        update: {
          title: teaching.title,
          content: teaching.content,
        },
        create: {
          teachingId: teaching.id,
          locale: 'en',
          title: teaching.title,
          content: teaching.content,
        },
      });
      console.log(`  ✅ Migrated English translation: "${teaching.title}"`);
    }

    // Migrate Myanmar (Legacy titleMm/contentMm)
    if (teaching.titleMm) {
      await prisma.teachingTranslation.upsert({
        where: {
          teachingId_locale: {
            teachingId: teaching.id,
            locale: 'mm',
          },
        },
        update: {
          title: teaching.titleMm,
          content: teaching.contentMm,
        },
        create: {
          teachingId: teaching.id,
          locale: 'mm',
          title: teaching.titleMm,
          content: teaching.contentMm,
        },
      });
      console.log(`  ✅ Migrated Myanmar translation: "${teaching.titleMm}"`);
    }
    
    migratedCount++;
  }

  console.log(`\n✨ Migration completed! Successfully processed ${migratedCount} teachings.`);
}

migrate()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
