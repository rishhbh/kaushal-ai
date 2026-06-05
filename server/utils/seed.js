const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config({ path: '../.env' }); // Assuming ran from utils folder

const User = require('../models/User');
const Employer = require('../models/Employer');
const Assessment = require('../models/Assessment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("No MONGODB_URI provided in .env");
        process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    await User.deleteMany();
    await Employer.deleteMany();
    await Assessment.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Certificate.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    // ----------------------------------------------------
    // Create Courses
    // ----------------------------------------------------
    const coursesData = [
      {
        title: "Advanced Woodworking",
        trade: "Carpenter",
        level: "Beginner",
        durationHrs: 3,
        description: "Learn essential measuring, marking, and joinery techniques.",
        isExample: true,
        modules: [
          {
            title: "Measuring & Marking",
            orderIndex: 0,
            contentText: "Measure twice, cut once. Use a tri-square for 90° angles.",
            quiz: [
              { question: "What is a good rule for woodworking?", options: ["Cut twice, measure once", "Measure twice, cut once", "Guess the size", "Don't measure"], correctIndex: 1 },
              { question: "What tool is used for 90° angles?", options: ["Hammer", "Screwdriver", "Tri-square", "Pliers"], correctIndex: 2 },
              { question: "Why should you measure twice?", options: ["To waste time", "To ensure accuracy", "To dull the pencil", "It's tradition"], correctIndex: 1 }
            ]
          },
          {
            title: "Joinery Basics",
            orderIndex: 1,
            contentText: "Use dowels for strong unseen joints. Apply wood glue evenly before clamping.",
            quiz: [
              { question: "What is used for unseen joints?", options: ["Nails", "Screws", "Dowels", "Tape"], correctIndex: 2 },
              { question: "What should be applied before clamping?", options: ["Paint", "Wood glue", "Water", "Oil"], correctIndex: 1 },
              { question: "How should glue be applied?", options: ["Unevenly", "Evenly", "In thick lumps", "Not at all"], correctIndex: 1 }
            ]
          },
          {
            title: "Finishing Techniques",
            orderIndex: 2,
            contentText: "Sand along the grain. Apply varnish in a dust-free area for a smooth finish.",
            quiz: [
              { question: "How should you sand wood?", options: ["Across the grain", "Along the grain", "In circles", "Randomly"], correctIndex: 1 },
              { question: "Where should you apply varnish?", options: ["Dust-free area", "Windy area", "Rainy area", "Loud area"], correctIndex: 0 },
              { question: "What does varnish provide?", options: ["Smooth finish", "Rough texture", "Color", "Measurements"], correctIndex: 0 }
            ]
          }
        ]
      },
      {
        title: "Industrial Welding Safety",
        trade: "Welder",
        level: "Intermediate",
        durationHrs: 4,
        description: "Focus on safety protocols and protective gear in industrial welding.",
        isExample: true,
        modules: [
          {
            title: "Protective Gear",
            orderIndex: 0,
            contentText: "Always wear a welding helmet and leather apron. The arc can cause skin burns.",
            quiz: [
              { question: "What must you always wear?", options: ["Welding helmet", "Sunglasses", "Hat", "Cap"], correctIndex: 0 },
              { question: "What type of apron is recommended?", options: ["Cotton", "Plastic", "Leather", "Paper"], correctIndex: 2 },
              { question: "What can the welding arc cause?", options: ["Sunburn", "Skin burns", "Frostbite", "Acne"], correctIndex: 1 }
            ]
          },
          {
            title: "Machine Setup",
            orderIndex: 1,
            contentText: "Set the correct amperage. Too much current can cause burn-through. Connect the ground clamp securely.",
            quiz: [
              { question: "What can too much current cause?", options: ["Burn-through", "Cold weld", "Weak arc", "Nothing"], correctIndex: 0 },
              { question: "What should be connected securely?", options: ["Electrode", "Ground clamp", "Power cord", "All of the above"], correctIndex: 3 },
              { question: "Why is correct amperage important?", options: ["Saves electricity", "Ensures proper penetration", "Makes less noise", "Looks good"], correctIndex: 1 }
            ]
          },
          {
            title: "Fume Extraction",
            orderIndex: 2,
            contentText: "Always work in well-ventilated areas or use local exhaust ventilation to avoid inhaling toxic fumes.",
            quiz: [
              { question: "Where should you always weld?", options: ["Small rooms", "Closed spaces", "Well-ventilated areas", "Dark areas"], correctIndex: 2 },
              { question: "What should you avoid inhaling?", options: ["Air", "Oxygen", "Toxic fumes", "Water vapor"], correctIndex: 2 },
              { question: "What system helps remove fumes?", options: ["Local exhaust ventilation", "Air conditioner", "Heater", "Humidifier"], correctIndex: 0 }
            ]
          }
        ]
      },
      {
        title: "Modern Bricklaying",
        trade: "Mason",
        level: "Beginner",
        durationHrs: 2,
        description: "Learn the fundamentals of mortar mixing and brick bonding.",
        isExample: true,
        modules: [
          {
            title: "Mortar Ratios",
            orderIndex: 0,
            contentText: "Standard ratio for walls is 1 part cement to 6 parts sand. Add water until it sticks to the trowel.",
            quiz: [
              { question: "What is the standard ratio for walls?", options: ["1:1", "1:6", "1:10", "1:2"], correctIndex: 1 },
              { question: "What do you mix cement with?", options: ["Water only", "Sand", "Gravel", "Dirt"], correctIndex: 1 },
              { question: "When is enough water added?", options: ["When it's liquid", "When it sticks to trowel", "When it's dusty", "Never"], correctIndex: 1 }
            ]
          },
          {
            title: "English Bond",
            orderIndex: 1,
            contentText: "An English bond consists of alternating courses of headers and stretchers. It is one of the strongest bonds.",
            quiz: [
              { question: "What does an English bond alternate between?", options: ["Headers and stretchers", "Bricks and blocks", "Cement and sand", "Red and white bricks"], correctIndex: 0 },
              { question: "Is English bond strong?", options: ["No", "One of the strongest", "Weakest", "Average"], correctIndex: 1 },
              { question: "What is a course in bricklaying?", options: ["A class", "A horizontal layer of bricks", "A vertical column", "A type of mortar"], correctIndex: 1 }
            ]
          },
          {
            title: "Tool Usage",
            orderIndex: 2,
            contentText: "Use a spirit level and plumb line constantly. Keep your trowel clean to ensure mortar spreads smoothly.",
            quiz: [
              { question: "What tool ensures a wall is straight vertically?", options: ["Hammer", "Plumb line", "Trowel", "Shovel"], correctIndex: 1 },
              { question: "Why keep the trowel clean?", options: ["Looks nice", "Spreads mortar smoothly", "Prevents rust", "Saves time"], correctIndex: 1 },
              { question: "What does a spirit level check?", options: ["Horizontal and vertical alignment", "Weight", "Volume", "Temperature"], correctIndex: 0 }
            ]
          }
        ]
      },
      {
        title: "Interior Wall Finishes",
        trade: "Painter",
        level: "Beginner",
        durationHrs: 2,
        description: "Master surface preparation and painting applications.",
        isExample: true,
        modules: [
          {
            title: "Sanding & Putty",
            orderIndex: 0,
            contentText: "Fill holes with wall putty first. Sand with 120-grit paper for a flat surface.",
            quiz: [
              { question: "What should you fill holes with?", options: ["Cement", "Wall putty", "Plaster", "Glue"], correctIndex: 1 },
              { question: "What grit paper is recommended for sanding?", options: ["40-grit", "80-grit", "120-grit", "400-grit"], correctIndex: 2 },
              { question: "Why do we sand?", options: ["For fun", "For a flat surface", "To make dust", "To remove paint"], correctIndex: 1 }
            ]
          },
          {
            title: "Primer Application",
            orderIndex: 1,
            contentText: "Apply a coat of primer before painting. It seals the wall and ensures the paint adheres properly.",
            quiz: [
              { question: "What should be applied before painting?", options: ["Water", "Primer", "Nothing", "Varnish"], correctIndex: 1 },
              { question: "What does primer do?", options: ["Seals the wall", "Adds color", "Makes it shiny", "Removes dust"], correctIndex: 0 },
              { question: "Does primer help paint adhere?", options: ["No", "Yes", "Sometimes", "Only dark colors"], correctIndex: 1 }
            ]
          },
          {
            title: "Painting Techniques",
            orderIndex: 2,
            contentText: "Use a 'W' motion when using a roller. Cut in the edges with a brush first before rolling the main wall.",
            quiz: [
              { question: "What motion is recommended for a roller?", options: ["'W' motion", "Straight lines", "Circles", "Random strokes"], correctIndex: 0 },
              { question: "What should you do with edges?", options: ["Roll them", "Ignore them", "Cut in with a brush", "Tape them"], correctIndex: 2 },
              { question: "Should you brush or roll first?", options: ["Roll main wall first", "Cut in edges with brush first", "Both at same time", "Doesn't matter"], correctIndex: 1 }
            ]
          }
        ]
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);

    const c1 = createdCourses.find(c => c.title === "Advanced Woodworking");
    const c2 = createdCourses.find(c => c.title === "Industrial Welding Safety");
    const c3 = createdCourses.find(c => c.title === "Modern Bricklaying");
    const c4 = createdCourses.find(c => c.title === "Interior Wall Finishes");

    // ----------------------------------------------------
    // Create Employer
    // ----------------------------------------------------
    const salt = await bcrypt.genSalt(10);
    const pwdHash = await bcrypt.hash("password123", salt);

    const emp1 = await Employer.create({
      companyName: "BuildRight Construction",
      gst: "22AAAAA0000A1Z5",
      industry: "Construction",
      companySize: "50-200",
      city: "Lucknow",
      state: "UP",
      contactName: "Anil Sharma",
      email: "anil@buildright.com",
      passwordHash: pwdHash
    });

    const emp2 = await Employer.create({
      companyName: "HomeFix Services",
      gst: "07BBBBB1111B1Z5",
      industry: "Home Services",
      companySize: "10-50",
      city: "Delhi",
      state: "Delhi",
      contactName: "Sunita Mehta",
      email: "sunita@homefix.com",
      passwordHash: pwdHash
    });

    // ----------------------------------------------------
    // Create Jobs
    // ----------------------------------------------------
    const job1 = await Job.create({
      employerId: emp1._id,
      companyName: emp1.companyName,
      title: "Junior Electrician",
      trade: "Electrician",
      level: "Beginner",
      location: "Lucknow, UP",
      salaryMin: 15000,
      salaryMax: 20000,
      description: "Looking for a junior electrician to assist in residential wiring.",
      requiredCertifications: ["KAUSHAL-CERT-E1"],
      isActive: true
    });

    const job2 = await Job.create({
      employerId: emp1._id,
      companyName: emp1.companyName,
      title: "Senior Electrician",
      trade: "Electrician",
      level: "Intermediate",
      location: "Lucknow, UP",
      salaryMin: 25000,
      salaryMax: 35000,
      description: "Experienced electrician needed for leading commercial projects.",
      requiredCertifications: ["KAUSHAL-CERT-E2"],
      isActive: true
    });

    const job3 = await Job.create({
      employerId: emp2._id,
      companyName: emp2.companyName,
      title: "Plumber",
      trade: "Plumber",
      level: "Beginner",
      location: "Delhi",
      salaryMin: 18000,
      salaryMax: 22000,
      description: "Plumber required for household maintenance tasks.",
      requiredCertifications: [],
      isActive: true
    });

    emp1.postedJobs.push(job1._id, job2._id);
    await emp1.save();
    emp2.postedJobs.push(job3._id);
    await emp2.save();


    // ----------------------------------------------------
    // Create Workers
    // ----------------------------------------------------
    const worker1 = await User.create({
      name: "Ramesh Kumar",
      phone: "9876543210",
      district: "Lucknow",
      state: "UP",
      trade: "Electrician",
      experience: 3,
      language: "hi",
      skillLevel: "Intermediate",
      passwordHash: pwdHash,
      enrolledCourses: [c1._id]
    });

    const worker2 = await User.create({
      name: "Priya Devi",
      phone: "9876543211",
      district: "Kanpur",
      state: "UP",
      trade: "Plumber",
      experience: 1,
      language: "hi",
      skillLevel: "Beginner",
      passwordHash: pwdHash,
      enrolledCourses: [c3._id]
    });

    // ----------------------------------------------------
    // Create Enrollments
    // ----------------------------------------------------
    const w1Enrollment = await Enrollment.create({
      userId: worker1._id,
      courseId: c1._id,
      currentModuleIndex: 3,
      moduleProgress: c1.modules.map(m => ({
        moduleId: m._id,
        completed: true,
        score: 3,
        completedAt: new Date()
      })),
      completedAt: new Date()
    });

    const w2Enrollment = await Enrollment.create({
      userId: worker2._id,
      courseId: c3._id,
      currentModuleIndex: 1,
      moduleProgress: c3.modules.map((m, idx) => ({
        moduleId: m._id,
        completed: idx === 0,
        score: idx === 0 ? 3 : null,
        completedAt: idx === 0 ? new Date() : null
      })),
      completedAt: null
    });


    // ----------------------------------------------------
    // Create Certificates & Assessments
    // ----------------------------------------------------
    await Certificate.create({
      userId: worker1._id,
      courseId: c1._id,
      certUUID: "KAUSHAL-2026-RK001",
      workerName: worker1.name,
      courseName: c1.title,
      trade: c1.trade,
      skillLevel: worker1.skillLevel
    });

    await Assessment.create({
      userId: worker1._id,
      skillLevel: "Intermediate",
      strengths: ["Tool handling", "Safety awareness"],
      gaps: ["Circuit reading", "Advanced wiring"],
      recommendedCourse: "Residential Wiring",
      rawResponse: "Initial AI payload mock."
    });

    await Assessment.create({
      userId: worker2._id,
      skillLevel: "Beginner",
      strengths: ["Basic tools"],
      gaps: ["Pipe joints", "Pressure systems"],
      recommendedCourse: "Plumbing Basics",
      rawResponse: "Initial AI payload mock."
    });

    // ----------------------------------------------------
    // Create Applications (Kanban Demo)
    // ----------------------------------------------------
    await Application.create({ userId: worker1._id, jobId: job1._id, employerId: emp1._id, status: "Shortlisted" });
    await Application.create({ userId: worker1._id, jobId: job2._id, employerId: emp1._id, status: "Applied" });
    await Application.create({ userId: worker2._id, jobId: job3._id, employerId: emp2._id, status: "Interview" });
    await Application.create({ userId: worker1._id, jobId: job3._id, employerId: emp2._id, status: "Applied" });
    await Application.create({ userId: worker2._id, jobId: job1._id, employerId: emp1._id, status: "Hired" });

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
