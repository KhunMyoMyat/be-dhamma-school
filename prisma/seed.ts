import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dhamma School database...');

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
      image: '/images/teachers/teacher1.jpg',
      title: 'Head Teacher',
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      name: 'Sayalay Daw Kheminda',
      nameMm: 'ဆရာလေး ဒေါ်ခေမိန္ဒာ',
      bio: 'Specializing in Abhidhamma studies and Pali language instruction. Dedicated to making ancient Buddhist texts accessible to modern learners.',
      bioMm: 'အဘိဓမ္မာ နှင့် ပါဠိဘာသာ သင်ကြားရေးတွင် အထူးပြုသည်။ ရှေးဟောင်း ဗုဒ္ဓစာပေများကို ခေတ်သစ်ပညာသင်ယူသူများ လက်လှမ်းမီစေရန် ဆောင်ရွက်သည်။',
      image: '/images/teachers/teacher2.jpg',
      title: 'Abhidhamma Instructor',
    },
  });

  const teacher3 = await prisma.teacher.create({
    data: {
      name: 'U Nyanissara',
      nameMm: 'ဦးဉာဏိဿရ',
      bio: 'Young and dynamic teacher focusing on bringing Dhamma to the youth. Expert in Sutta studies and modern Buddhist ethics.',
      bioMm: 'လူငယ်များထံသို့ ဓမ္မကို ယူဆောင်ပေးရေးတွင် အာရုံစိုက်သော လူငယ်ဆရာတစ်ပါးဖြစ်သည်။',
      image: '/images/teachers/teacher3.jpg',
      title: 'Sutta Studies Teacher',
    },
  });

  // Create courses
  await prisma.course.createMany({
    data: [
      {
        title: 'Introduction to Vipassana Meditation',
        titleMm: 'ဝိပဿနာ တရားထိုင်ခြင်း မိတ်ဆက်',
        description: 'Learn the foundational techniques of Vipassana meditation as taught in the Theravada Buddhist tradition. This course covers basic sitting posture, breathing techniques, and mindfulness practices suitable for beginners.',
        descriptionMm: 'ထေရဝါဒ ဗုဒ္ဓဘာသာ ထုံးတမ်းအရ သင်ကြားသော ဝိပဿနာတရားထိုင်ခြင်း၏ အခြေခံနည်းစနစ်များကို လေ့လာပါ။',
        level: 'beginner',
        duration: '8 weeks',
        schedule: 'Every Saturday 6:00 AM - 8:00 AM',
        teacherId: teacher1.id,
      },
      {
        title: 'Abhidhamma Studies - Level 1',
        titleMm: 'အဘိဓမ္မာ ပထမဆင့်',
        description: 'A comprehensive introduction to Abhidhamma, the higher teaching of the Buddha. Study the nature of consciousness, mental factors, and the ultimate realities as described in the Abhidhamma Pitaka.',
        descriptionMm: 'ဗုဒ္ဓ၏ အထက်တန်းသင်ကြားချက် ဖြစ်သော အဘိဓမ္မာ၏ ပြည့်စုံသော မိတ်ဆက်ချက်ဖြစ်ပါသည်။',
        level: 'intermediate',
        duration: '12 weeks',
        schedule: 'Every Sunday 9:00 AM - 11:00 AM',
        teacherId: teacher2.id,
      },
      {
        title: 'Pali Language for Beginners',
        titleMm: 'ပါဠိဘာသာ အခြေခံ',
        description: 'Learn the sacred language of Theravada Buddhism. This course teaches reading, writing, and basic grammar of Pali, enabling students to read original Buddhist texts.',
        descriptionMm: 'ထေရဝါဒ ဗုဒ္ဓဘာသာ၏ မြင့်မြတ်သော ဘာသာစကားကို လေ့လာပါ။',
        level: 'beginner',
        duration: '16 weeks',
        schedule: 'Every Wednesday 5:00 PM - 7:00 PM',
        teacherId: teacher2.id,
      },
      {
        title: 'Buddhist Ethics in Modern Life',
        titleMm: 'ခေတ်သစ်ဘဝတွင် ဗုဒ္ဓကျင့်ဝတ်',
        description: 'Explore how the Five Precepts and Buddhist moral codes apply to contemporary challenges. Topics include digital ethics, environmental responsibility, and mindful leadership.',
        descriptionMm: 'ပဉ္စသီလနှင့် ဗုဒ္ဓကျင့်ဝတ်စည်းကမ်းများ ခေတ်သစ်စိန်ခေါ်မှုများနှင့် မည်ကဲ့သို့ သက်ဆိုင်ကြောင်း လေ့လာပါ။',
        level: 'beginner',
        duration: '6 weeks',
        schedule: 'Every Friday 6:00 PM - 7:30 PM',
        teacherId: teacher3.id,
      },
      {
        title: 'Advanced Meditation Retreat Preparation',
        titleMm: 'အဆင့်မြင့် တရားစခန်း ပြင်ဆင်မှု',
        description: 'Intensive preparation for long meditation retreats. Learn advanced meditation techniques, proper retreat conduct, and how to deepen your practice over extended periods.',
        descriptionMm: 'ရက်ရှည်တရားစခန်းများအတွက် ပြင်းထန်သော ပြင်ဆင်မှုဖြစ်ပါသည်။',
        level: 'advanced',
        duration: '4 weeks',
        schedule: 'Every Saturday 4:00 AM - 7:00 AM',
        teacherId: teacher1.id,
      },
      {
        title: 'Sutta Study Circle',
        titleMm: 'သုတ္တန်းစာဖတ်ဝိုင်း',
        description: 'Weekly study and discussion of important Suttas from the Tipitaka. Each session focuses on a different discourse, exploring its meaning and practical applications.',
        descriptionMm: 'တိပိဋကမှ အရေးကြီးသော သုတ္တန်းများကို အပတ်စဉ် လေ့လာ ဆွေးနွေးခြင်း ဖြစ်ပါသည်။',
        level: 'intermediate',
        duration: 'Ongoing',
        schedule: 'Every Thursday 6:00 PM - 8:00 PM',
        teacherId: teacher3.id,
      },
    ],
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
        image: '/images/events/vesak.jpg',
      },
      {
        title: '7-Day Meditation Retreat',
        titleMm: '၇ ရက်တရားစခန်း',
        description: 'An intensive 7-day silent meditation retreat guided by our head teacher. Suitable for practitioners with at least 6 months of regular meditation practice.',
        descriptionMm: 'ကျွန်ုပ်တို့၏ ဆရာတော်ကြီး ဦးဆောင်သော ၇ ရက်ကြာ တိတ်ဆိတ်ငြိမ်သက်စွာ တရားထိုင်ခြင်း စခန်းဝင်ခြင်းဖြစ်ပါသည်။',
        date: new Date(now.getFullYear(), now.getMonth() + 2, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 2, 7),
        location: 'Meditation Center',
        image: '/images/events/retreat.jpg',
      },
      {
        title: 'Weekly Dhamma Talk',
        titleMm: 'အပတ်စဥ် တရားပွဲ',
        description: 'Regular weekly Dhamma discourse open to all. Each talk explores practical applications of Buddhist teachings in daily life.',
        descriptionMm: 'အားလုံးအတွက် ပွင့်လင်းသော ပုံမှန်အပတ်စဥ် ဓမ္မတရားပွဲ ဖြစ်ပါသည်။',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        location: 'Dhamma Hall',
        image: '/images/events/dhamma-talk.jpg',
      },
      {
        title: 'Kathina Robe Offering Ceremony',
        titleMm: 'ကထိန်သင်္ကန်း လှူဒါန်းပွဲ',
        description: 'Annual Kathina ceremony where the community comes together to offer robes and requisites to the Sangha.',
        descriptionMm: 'သံဃာတော်များအား သင်္ကန်းနှင့် လိုအပ်ပစ္စည်းများကို လှူဒါန်းရန် အသင်းအဖွဲ့ စုစည်းသော နှစ်စဉ် ကထိန်အခမ်းအနား ဖြစ်ပါသည်။',
        date: new Date(now.getFullYear(), now.getMonth() + 3, 20),
        location: 'Main Monastery',
        image: '/images/events/kathina.jpg',
      },
    ],
  });

  // Create teachings
  await prisma.teaching.createMany({
    data: [
      {
        title: 'The Four Noble Truths',
        titleMm: 'သစ္စာလေးပါး',
        content: 'The Four Noble Truths are the central teaching of the Buddha. They describe the nature of suffering, its cause, its cessation, and the path leading to its cessation. Understanding these truths is essential for any Buddhist practitioner.',
        contentMm: 'သစ္စာလေးပါးသည် ဗုဒ္ဓ၏ အဓိက သင်ကြားချက်ဖြစ်ပါသည်။ ဒုက္ခ၏ သဘာဝ၊ ဒုက္ခဖြစ်ကြောင်း၊ ဒုက္ခချုပ်ခြင်း နှင့် ဒုက္ခချုပ်ရာ လမ်းစဉ်တို့ကို ဖော်ပြပါသည်။',
        category: 'dhamma',
        teacherId: teacher1.id,
      },
      {
        title: 'The Noble Eightfold Path',
        titleMm: 'မဂ္ဂင်ရှစ်ပါး',
        content: 'The Noble Eightfold Path is the practical guideline to end suffering. It encompasses Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, and Right Concentration.',
        contentMm: 'မဂ္ဂင်ရှစ်ပါးသည် ဒုက္ခချုပ်ရန် လက်တွေ့ကျင့်စဉ်လမ်းညွှန်ဖြစ်ပါသည်။',
        category: 'dhamma',
        teacherId: teacher1.id,
      },
      {
        title: 'Understanding Kamma',
        titleMm: 'ကံ ကို နားလည်ခြင်း',
        content: 'Kamma (Sanskrit: Karma) is the law of moral causation. Every intentional action creates consequences that shape our future experiences. Learn how understanding kamma can transform your daily decisions.',
        contentMm: 'ကံသည် ကုသိုလ်နှင့် အကုသိုလ်ကြောင်း ဆက်စပ်ခြင်း ဥပဒေဖြစ်ပါသည်။',
        category: 'dhamma',
        teacherId: teacher3.id,
      },
      {
        title: 'Introduction to Mindfulness (Satipatthana)',
        titleMm: 'သတိပဋ္ဌာန် မိတ်ဆက်',
        content: 'The Satipatthana Sutta outlines the four foundations of mindfulness: contemplation of body, feelings, mind, and mental objects. This teaching is the direct path to the realization of Nibbana.',
        contentMm: 'သတိပဋ္ဌာန်သုတ်သည် သတိထားခြင်း၏ အခြေခံလေးပါးကို ဖော်ပြပါသည်။',
        category: 'meditation',
        teacherId: teacher1.id,
      },
      {
        title: 'The Five Precepts',
        titleMm: 'ပဉ္စသီလ',
        content: 'The Five Precepts form the foundation of Buddhist ethics. They are: refraining from killing, stealing, sexual misconduct, false speech, and intoxicants. These are not commandments but voluntary commitments to ethical conduct.',
        contentMm: 'ပဉ္စသီလသည် ဗုဒ္ဓကျင့်ဝတ်များ၏ အခြေခံဖြစ်ပါသည်။',
        category: 'sila',
        teacherId: teacher3.id,
      },
    ],
  });

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
