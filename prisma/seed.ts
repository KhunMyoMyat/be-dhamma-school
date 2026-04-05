import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dhamma School database...');

  // Clear existing data
  await prisma.donation.deleteMany();
  await prisma.teaching.deleteMany();
  await prisma.event.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.contactInquiry.deleteMany();
  // We keep the admin user for stability or can delete it too
  // await prisma.user.deleteMany();

  console.log('🧹 Database cleared. Starting fresh seed...');


  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@dhammaschool.mm' },
    update: {},
    create: {
      email: 'admin@dhammaschool.mm',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // Create teachers
  const teacher1 = await prisma.teacher.create({
    data: {
      name: 'Venerable U Pandita',
      nameMm: 'အရှင်ဦးပဏ္ဍိတ',
      bio: 'A renowned meditation master with over 40 years of teaching experience in Vipassana meditation. Known for his strict but compassionate approach to Buddhist practice.',
      bioMm: 'ဝိပဿနာတရားအားထုတ်ခြင်းတွင် နှစ်ပေါင်း ၄၀ ကျော် သင်ကြားပို့ချ‌ခံရသော ကျော်ကြားသည့် တရားအကျင့်ဆရာတစ်ပါး ဖြစ်ပါသည်။',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      title: 'Head Teacher',
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      name: 'Sayalay Daw Kheminda',
      nameMm: 'ဆရာလေး ဒေါ်ခေမိန္ဒာ',
      bio: 'Specializing in Abhidhamma studies and Pali language instruction. Dedicated to making ancient Buddhist texts accessible to modern learners.',
      bioMm: 'အဘိဓမ္မာ နှင့် ပါဠိဘာသာ သင်ကြားရေးတွင် အထူးပြုသည်။ ရှေးဟောင်း ဗုဒ္ဓစာပေများကို ခေတ်သစ်ပညာသင်ယူသူများ လက်လှမ်းမီစေရန် ဆောင်ရွက်သည်။',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000',
      title: 'Abhidhamma Instructor',
    },
  });

  const teacher3 = await prisma.teacher.create({
    data: {
      name: 'U Nyanissara',
      nameMm: 'ဦးဉာဏိဿရ',
      bio: 'Young and dynamic teacher focusing on bringing Dhamma to the youth. Expert in Sutta studies and modern Buddhist ethics.',
      bioMm: 'လူငယ်များထံသို့ ဓမ္မကို ယူဆောင်ပေးရေးတွင် အာရုံစိုက်သော လူငယ်ဆရာတစ်ပါးဖြစ်သည်။',
      image: 'https://images.unsplash.com/photo-1528642463366-20ba5f3e72dc?q=80&w=1000',
      title: 'Sutta Studies Teacher',
    },
  });



  // Create events
  const now = new Date();
  await prisma.event.createMany({
    data: [
      {
        title: 'Vesak Day Celebration',
        titleMm: 'ကဆုန်လပြည့် ဗုဒ္ဓနေ့ အခမ်းအနား',
        description: 'Join us for the most sacred day in the Buddhist calendar, celebrating the birth, enlightenment, and parinibbana of the Buddha.',
        descriptionMm: 'ဗုဒ္ဓ၏ ဖွား‌တော်မူ၊ ဘုရားဖြစ်တော်မူ၊ ပရိနိဗ္ဗာန်စံတော်မူခြင်းတို့ကို ဂုဏ်ပြုသော ဗုဒ္ဓဘာသာပြက္ခဒိန်တွင် အမြင့်မြတ်ဆုံးနေ့တွင် ပါဝင်ပါ။',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        location: 'Main Prayer Hall',
        image: 'https://images.unsplash.com/photo-1549130030-94fa9150ea4c?q=80&w=1000',
      },
      {
        title: '7-Day Meditation Retreat',
        titleMm: '၇ ရက်တရားစခန်း',
        description: 'An intensive 7-day silent meditation retreat guided by our head teacher. Suitable for practitioners with at least 6 months of regular meditation practice.',
        descriptionMm: 'ကျွန်ုပ်တို့၏ ဆရာတော်ကြီး ဦးဆောင်သော ၇ ရက်ကြာ တိတ်ဆိတ်ငြိမ်သက်စွာ တရားထိုင်ခြင်း စခန်းဝင်ခြင်းဖြစ်ပါသည်။',
        date: new Date(now.getFullYear(), now.getMonth() + 2, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 2, 7),
        location: 'Meditation Center',
        image: 'https://images.unsplash.com/photo-1517400030504-2453e925b449?q=80&w=1000',
      },
      {
        title: 'Weekly Dhamma Talk',
        titleMm: 'အပတ်စဥ် တရားပွဲ',
        description: 'Regular weekly Dhamma discourse open to all. Each talk explores practical applications of Buddhist teachings in daily life.',
        descriptionMm: 'အားလုံးအတွက် ပွင့်လင်းသော ပုံမှန်အပတ်စဥ် ဓမ္မတရားပွဲ ဖြစ်ပါသည်။',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        location: 'Dhamma Hall',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000',
      },
      {
        title: 'Kathina Robe Offering Ceremony',
        titleMm: 'ကထိန်သင်္ကန်း လှူဒါန်းပွဲ',
        description: 'Annual Kathina ceremony where the community comes together to offer robes and requisites to the Sangha.',
        descriptionMm: 'သံဃာတော်များအား သင်္ကန်းနှင့် လိုအပ်ပစ္စည်းများကို လှူဒါန်းရန် အသင်းအဖွဲ့ စုစည်းသော နှစ်စဉ် ကထိန်အခမ်းအနား ဖြစ်ပါသည်။',
        date: new Date(now.getFullYear(), now.getMonth() + 3, 20),
        location: 'Main Monastery',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000',
      },
    ],
  });

  // Create teachings
  const teachingsData = [
    {
      translations: {
        create: [
          { locale: 'en', title: 'The Four Noble Truths', content: 'The Four Noble Truths are the central teaching of the Buddha...' },
          { locale: 'mm', title: 'သစ္စာလေးပါး', content: 'သစ္စာလေးပါးသည် ဗုဒ္ဓ၏ အဓိက သင်ကြားချက်ဖြစ်ပါသည်။...' }
        ]
      },
      category: 'dhamma',
      teacherId: teacher1.id,
    },
    {
      translations: {
        create: [
          { locale: 'en', title: 'The Noble Eightfold Path', content: 'The Noble Eightfold Path is the practical guideline to end suffering...' },
          { locale: 'mm', title: 'မဂ္ဂင်ရှစ်ပါး', content: 'မဂ္ဂင်ရှစ်ပါးသည် ဒုက္ခချုပ်ရန် လက်တွေ့ကျင့်စဉ်လမ်းညွှန်ဖြစ်ပါသည်။' }
        ]
      },
      category: 'dhamma',
      teacherId: teacher1.id,
    },
    {
      translations: {
        create: [
          { locale: 'en', title: 'Understanding Kamma', content: 'Kamma (Sanskrit: Karma) is the law of moral causation...' },
          { locale: 'mm', title: 'ကံ ကို နားလည်ခြင်း', content: 'ကံသည် ကုသိုလ်နှင့် အကုသိုလ်ကြောင်း ဆက်စပ်ခြင်း ဥပဒေဖြစ်ပါသည်။' }
        ]
      },
      category: 'dhamma',
      teacherId: teacher3.id,
    },
    {
      translations: {
        create: [
          { locale: 'en', title: 'Introduction to Mindfulness (Satipatthana)', content: 'The Satipatthana Sutta outlines the four foundations of mindfulness...' },
          { locale: 'mm', title: 'သတိပဋ္ဌာန် မိတ်ဆက်', content: 'သတိပဋ္ဌာန်သုတ်သည် သတိထားခြင်း၏ အခြေခံလေးပါးကို ဖော်ပြပါသည်။' }
        ]
      },
      category: 'meditation',
      teacherId: teacher1.id,
    },
    {
      translations: {
        create: [
          { locale: 'en', title: 'The Five Precepts', content: 'The Five Precepts form the foundation of Buddhist ethics...' },
          { locale: 'mm', title: 'ပဉ္စသီလ', content: 'ပဉ္စသီလသည် ဗုဒ္ဓကျင့်ဝတ်များ၏ အခြေခံဖြစ်ပါသည်။' }
        ]
      },
      category: 'sila',
      teacherId: teacher3.id,
    },
  ];

  for (const data of teachingsData) {
    await prisma.teaching.create({ data });
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
