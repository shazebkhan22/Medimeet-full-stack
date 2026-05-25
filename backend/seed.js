import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import doctorModel from "./models/doctorModel.js";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModel.js";

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "medimeet";

// Placeholder image URL — replace with real Cloudinary URLs if needed
const PLACEHOLDER = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

const doctors = [
  {
    name: "Dr. Richard James",
    email: "richard.james@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("richard"),
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    available: true,
    fees: 50,
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Emily Larson",
    email: "emily.larson@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("emily"),
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Larson specialises in women's health with expertise in obstetrics and gynaecology, committed to compassionate, evidence-based care.",
    available: true,
    fees: 60,
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Sarah Patel",
    email: "sarah.patel@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("sarah"),
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about:
      "Dr. Patel is passionate about skin health, treating conditions ranging from acne to complex dermatological disorders with modern techniques.",
    available: true,
    fees: 30,
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Christopher Lee",
    email: "christopher.lee@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("christopher"),
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Lee dedicates his practice to child health, offering compassionate care from infancy through adolescence.",
    available: true,
    fees: 40,
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "jennifer.garcia@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("jennifer"),
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Garcia is a neurologist with deep expertise in diagnosing and treating disorders of the nervous system, from migraines to epilepsy.",
    available: true,
    fees: 50,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Andrew Williams",
    email: "andrew.williams@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("andrew"),
    speciality: "Neurologist",
    degree: "MD",
    experience: "6 Years",
    about:
      "Dr. Williams brings six years of neurology experience, specialising in stroke management and movement disorders.",
    available: true,
    fees: 70,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Christopher Davis",
    email: "chris.davis@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("cdavis"),
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis focuses on holistic primary care, building long-term relationships with patients to manage chronic and acute conditions.",
    available: true,
    fees: 50,
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Timothy White",
    email: "timothy.white@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("timothy"),
    speciality: "Gynecologist",
    degree: "MD",
    experience: "5 Years",
    about:
      "Dr. White is committed to women's wellness, providing personalised gynaecological care and family planning advice.",
    available: true,
    fees: 65,
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Ava Mitchell",
    email: "ava.mitchell@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("ava"),
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Mitchell blends clinical dermatology with cosmetic procedures, helping patients achieve healthy, confident skin.",
    available: true,
    fees: 35,
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Jeffrey King",
    email: "jeffrey.king@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("jeffrey"),
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. King provides thorough and caring paediatric services, prioritising the physical and emotional wellbeing of every child.",
    available: true,
    fees: 40,
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Zoe Kelly",
    email: "zoe.kelly@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("zoe"),
    speciality: "Neurologist",
    degree: "MD",
    experience: "5 Years",
    about:
      "Dr. Kelly specialises in headache medicine and cognitive neurology, offering evidence-based treatment plans.",
    available: true,
    fees: 55,
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Patrick Harris",
    email: "patrick.harris@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("patrick"),
    speciality: "Gastroenterologist",
    degree: "MD",
    experience: "7 Years",
    about:
      "Dr. Harris is a gastroenterologist with extensive experience in endoscopy and the management of digestive disorders.",
    available: true,
    fees: 80,
    address: { line1: "10th Cross, Jayanagar", line2: "Block 2, Bangalore" },
    date: Date.now(),
  },
  {
    name: "Dr. Chloe Evans",
    email: "chloe.evans@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("chloe"),
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Evans delivers patient-centred primary care, emphasising preventive health and lifestyle management.",
    available: true,
    fees: 50,
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Ryan Martinez",
    email: "ryan.martinez@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("ryan"),
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Martinez provides compassionate obstetric and gynaecological care, supporting women through every stage of life.",
    available: true,
    fees: 60,
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
  {
    name: "Dr. Amelia Hill",
    email: "amelia.hill@medimeet.com",
    password: "Doctor@1234",
    image: PLACEHOLDER("amelia"),
    speciality: "Dermatologist",
    degree: "MD",
    experience: "5 Years",
    about:
      "Dr. Hill is a board-certified dermatologist focusing on medical and surgical skin care, treating patients of all ages.",
    available: true,
    fees: 45,
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
    date: Date.now(),
  },
];

const users = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "User@1234",
    phone: "9876543210",
    gender: "Female",
    dob: "1990-04-15",
    address: { line1: "12 Baker Street", line2: "London" },
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    password: "User@1234",
    phone: "9876543211",
    gender: "Male",
    dob: "1985-08-22",
    address: { line1: "34 Elm Avenue", line2: "Manchester" },
  },
  {
    name: "Carol White",
    email: "carol.white@example.com",
    password: "User@1234",
    phone: "9876543212",
    gender: "Female",
    dob: "1995-01-10",
    address: { line1: "56 Oak Lane", line2: "Birmingham" },
  },
  {
    name: "David Brown",
    email: "david.brown@example.com",
    password: "User@1234",
    phone: "9876543213",
    gender: "Male",
    dob: "1978-11-30",
    address: { line1: "78 Pine Road", line2: "Leeds" },
  },
  {
    name: "Eva Green",
    email: "eva.green@example.com",
    password: "User@1234",
    phone: "9876543214",
    gender: "Female",
    dob: "2000-06-05",
    address: { line1: "90 Maple Court", line2: "Bristol" },
  },
];

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function seed() {
  await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
  console.log("Connected to MongoDB —", DB_NAME);

  // Clear existing data
  await Promise.all([
    doctorModel.deleteMany({}),
    userModel.deleteMany({}),
    appointmentModel.deleteMany({}),
  ]);
  console.log("Cleared existing doctors, users, and appointments.");

  // Seed doctors
  const hashedDoctors = await Promise.all(
    doctors.map(async (d) => ({ ...d, password: await hashPassword(d.password) }))
  );
  const insertedDoctors = await doctorModel.insertMany(hashedDoctors);
  console.log(`Seeded ${insertedDoctors.length} doctors.`);

  // Seed users
  const hashedUsers = await Promise.all(
    users.map(async (u) => ({ ...u, password: await hashPassword(u.password) }))
  );
  const insertedUsers = await userModel.insertMany(hashedUsers);
  console.log(`Seeded ${insertedUsers.length} users.`);

  // Seed appointments
  const slotDates = [
    "20_5_2026",
    "22_5_2026",
    "25_5_2026",
    "27_5_2026",
    "28_5_2026",
    "1_6_2026",
    "3_6_2026",
    "5_6_2026",
    "10_6_2026",
    "15_6_2026",
  ];
  const slotTimes = [
    "09:00 am",
    "09:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "02:00 pm",
    "02:30 pm",
    "03:00 pm",
    "03:30 pm",
    "04:00 pm",
  ];

  const appointments = [];
  for (let i = 0; i < 15; i++) {
    const user = insertedUsers[i % insertedUsers.length];
    const doctor = insertedDoctors[i % insertedDoctors.length];

    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      image: user.image,
    };

    const docData = {
      _id: doctor._id.toString(),
      name: doctor.name,
      email: doctor.email,
      image: doctor.image,
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      about: doctor.about,
      fees: doctor.fees,
      address: doctor.address,
    };

    appointments.push({
      userId: user._id.toString(),
      docId: doctor._id.toString(),
      slotDate: slotDates[i % slotDates.length],
      slotTime: slotTimes[i % slotTimes.length],
      userData,
      docData,
      amount: doctor.fees,
      date: Date.now() - i * 86400000, // stagger dates
      cancelled: i === 14, // one cancelled appointment
      payment: i < 5,      // first 5 are paid
      isCompleted: i < 3,  // first 3 are completed
    });
  }

  const insertedAppointments = await appointmentModel.insertMany(appointments);
  console.log(`Seeded ${insertedAppointments.length} appointments.`);

  console.log("\nSeed complete. Summary:");
  console.log(`  Doctors      : ${insertedDoctors.length}`);
  console.log(`  Users        : ${insertedUsers.length}`);
  console.log(`  Appointments : ${insertedAppointments.length}`);
  console.log("\nTest credentials:");
  console.log("  Admin  — email: shazebkhan@gmail.com  | password: shazebkhan123");
  console.log("  User   — email: alice.johnson@example.com | password: User@1234");
  console.log("  Doctor — email: richard.james@medimeet.com | password: Doctor@1234");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
