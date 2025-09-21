import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    location: "New Delhi, Delhi",
    state: "Delhi",
    city: "New Delhi",
    type: "ENGINEERING",
    rating: 9.0,
    established: 1961,
    courses: ["Computer Science", "Electronics", "Mechanical Engineering", "Civil Engineering"],
    fees: "₹2.5 Lakhs/year",
    placement: "₹25-30 LPA average",
    website: "https://home.iitd.ac.in/",
    phone: "+91-11-2659-1000"
  },
  {
    name: "All India Institute of Medical Sciences",
    location: "New Delhi, Delhi",
    state: "Delhi",
    city: "New Delhi",
    type: "MEDICAL",
    rating: 9.5,
    established: 1956,
    courses: ["MBBS", "MD", "MS", "DM", "MCh"],
    fees: "₹1.5 Lakhs/year",
    placement: "Government placements available",
    website: "https://www.aiims.edu/",
    phone: "+91-11-2659-3333"
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    location: "Ahmedabad, Gujarat",
    state: "Gujarat",
    city: "Ahmedabad",
    type: "BUSINESS",
    rating: 9.2,
    established: 1961,
    courses: ["MBA", "Executive MBA", "Fellow Programme"],
    fees: "₹25 Lakhs/year",
    placement: "₹30-35 LPA average",
    website: "https://www.iima.ac.in/",
    phone: "+91-79-6632-4001"
  },
  {
    name: "St. Stephen's College",
    location: "Delhi, Delhi",
    state: "Delhi",
    city: "Delhi",
    type: "ARTS",
    rating: 8.8,
    established: 1881,
    courses: ["English", "History", "Economics", "Philosophy"],
    fees: "₹50,000/year",
    placement: "Various corporate and academic opportunities",
    website: "https://www.ststephens.edu/",
    phone: "+91-11-2766-7271"
  },
  {
    name: "Delhi University - Miranda House",
    location: "Delhi, Delhi",
    state: "Delhi",
    city: "Delhi",
    type: "MIXED",
    rating: 8.5,
    established: 1948,
    courses: ["B.A.", "B.Sc.", "B.Com.", "Various postgraduate courses"],
    fees: "₹30,000/year",
    placement: "Good placement record in various sectors",
    website: "https://www.mirandahouse.ac.in/",
    phone: "+91-11-2766-5491"
  }
];

async function seedColleges() {
  console.log('🌱 Starting college data seeding...');
  
  try {
    // Clear existing colleges
    await prisma.college.deleteMany();
    console.log('✅ Cleared existing college data');
    
    // Insert sample colleges
    for (const college of sampleColleges) {
      await prisma.college.create({
        data: college
      });
    }
    
    console.log(`✅ Successfully seeded ${sampleColleges.length} colleges`);
    console.log('🎉 College data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding colleges:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedColleges();