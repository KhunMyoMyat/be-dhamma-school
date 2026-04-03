
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teachings = await prisma.teaching.findMany({
    include: { translations: true }
  });

  console.log('--- TEACHINGS DATA ---');
  teachings.forEach(t => {
    console.log(`ID: ${t.id}, Category: ${t.category}`);
    t.translations.forEach(tr => {
      console.log(`  Locale: [${tr.locale}], Title: "${tr.title}", Content-Length: ${tr.content?.length || 0}`);
    });
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
