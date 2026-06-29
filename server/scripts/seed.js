require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const News = require('../models/News');
const Department = require('../models/Department');
const Authority = require('../models/Authority');

const departments = [
  { name: 'General Science', tag: 'STEM Focus', icon: '🔬', iconTheme: 'g', order: 1,
    description: "A rigorous programme preparing students for careers in medicine, engineering, pharmacy, and scientific research. Students develop deep analytical and practical laboratory skills.",
    courses: ['Core Mathematics', 'Elective Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT'] },
  { name: 'General Arts', tag: 'Humanities', icon: '📚', iconTheme: 'y', order: 2,
    description: "Explores humanities and social sciences, nurturing critical thinkers, lawyers, journalists, and policymakers. Students develop strong communication and analytical abilities.",
    courses: ['Literature in English', 'History', 'Government', 'French', 'Economics', 'Geography'] },
  { name: 'Agricultural Science', tag: 'Agribusiness', icon: '🌾', iconTheme: 'g', order: 3,
    description: "Equips students with knowledge of modern farming, agribusiness, and sustainable agriculture. Graduates pursue food science, veterinary studies, and agro-entrepreneurship.",
    courses: ['Crop Science', 'Animal Husbandry', 'Agric Economics', 'Chemistry', 'Biology', 'ICT'] },
  { name: 'Business', tag: 'Commerce', icon: '💼', iconTheme: 'y', order: 4,
    description: "Prepares students for commerce, entrepreneurship, and leadership. Emphasis on financial literacy, management principles, and sound economic reasoning for the modern world.",
    courses: ['Financial Accounting', 'Business Management', 'Economics', 'Elective Maths', 'Cost Accounting', 'ICT'] },
  { name: 'Visual Arts', tag: 'Creative Arts', icon: '🎨', iconTheme: 'g', order: 5,
    description: "Nurtures creative expression through drawing, painting, graphic design, ceramics, and art history. Graduates pursue architecture, fashion, advertising, and fine art careers.",
    courses: ['Picture Making', 'Graphic Design', 'Sculpture', 'Ceramics', 'Leatherwork', 'Textiles'] },
  { name: 'Home Economics', tag: 'Life Skills', icon: '🏠', iconTheme: 'y', order: 6,
    description: "Develops practical skills in food science, nutrition, child development, and household management. Students are equipped for catering, hospitality, and family sciences.",
    courses: ['Food & Nutrition', 'Clothing & Textiles', 'Management in Living', 'Child Development', 'Biology', 'ICT'] },
];

const authorities = [
  { name: '[Headmaster Name]', role: 'Headmaster', group: 'headmaster', order: 1, icon: 'fa-user-tie',
    description: "The Headmaster provides overall academic, administrative, and pastoral leadership of St. Augustine's Senior High School. Under his/her stewardship, AUGUSCO continues to uphold its longstanding tradition of excellence, faith, and holistic student development.",
    email: 'headmaster@augusco.edu.gh', phone: '+233 3122 12345' },
  { name: '[Name]', role: 'Asst. Head — Academic', group: 'assistant', order: 1, icon: 'fa-user-tie',
    description: 'Oversees all academic activities, timetabling, examinations, and the performance of teaching staff across all departments.' },
  { name: '[Name]', role: 'Asst. Head — Administration', group: 'assistant', order: 2, icon: 'fa-user-tie',
    description: 'Manages administrative operations, staff welfare, resources, and the day-to-day running of the school.' },
  { name: '[Name]', role: 'Asst. Head — Welfare', group: 'assistant', order: 3, icon: 'fa-user-tie',
    description: 'Responsible for student welfare, boarding, discipline, and guidance and counselling services.' },
  { name: '[Name]', role: 'School Bursar', group: 'officer', order: 1, icon: 'fa-coins',
    description: 'Manages school finances, fees collection, and budget planning.' },
  { name: '[Name]', role: 'Guidance Counsellor', group: 'officer', order: 2, icon: 'fa-comments',
    description: 'Provides personal, academic, and career counselling to students.' },
  { name: '[Name]', role: 'School Librarian', group: 'officer', order: 3, icon: 'fa-book',
    description: 'Manages the school library and promotes a reading culture campus-wide.' },
  { name: '[Name]', role: 'School Chaplain', group: 'officer', order: 4, icon: 'fa-church',
    description: 'Leads the spiritual and Catholic formation of the school community.' },
];

const news = [
  { title: 'AUGUSCO Students Excel in 2025 WASSCE — Record Performance', category: 'Academics',
    excerpt: 'Our 2025 cohort achieved outstanding results, with over 78% of candidates obtaining aggregate 6–24 in the WAEC Senior School Certificate Examination.',
    publishedAt: new Date('2025-06-15') },
  { title: 'AUGUSCO Finishes 2nd at Western Region Inter-Schools Athletics Meet', category: 'Sports',
    excerpt: 'Our athletes delivered a stellar performance securing 2nd place overall and winning gold in three track events at the annual Takoradi meet.',
    publishedAt: new Date('2025-05-28') },
  { title: 'Green Earth Initiative: Students Plant 500 Trees Around Bogoso', category: 'Community',
    excerpt: "In commemoration of Earth Day, AUGUSCO students planted 500 trees as part of the school's environmental sustainability drive.",
    publishedAt: new Date('2025-04-22') },
];

async function seed() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@augusco.edu.gh').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const existing = await Admin.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash, name: 'AUGUSCO Administrator' });
    console.log(`Created admin account: ${email}`);
  } else {
    console.log(`Admin account already exists: ${email}`);
  }

  if (await Department.countDocuments() === 0) {
    await Department.insertMany(departments);
    console.log(`Seeded ${departments.length} departments`);
  }

  if (await Authority.countDocuments() === 0) {
    await Authority.insertMany(authorities);
    console.log(`Seeded ${authorities.length} authorities`);
  }

  if (await News.countDocuments() === 0) {
    await News.insertMany(news);
    console.log(`Seeded ${news.length} news posts`);
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
