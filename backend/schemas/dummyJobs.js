const { Job } = require("./schema");

const dummyJobs = [
  new Job({
    title: "manager",
    recruiterName: "aman",
    recruiterEmail: "aman@goyal.com",
    maxApp: 5,
    numPos: 3,
    postingDate: Date.now(),
    deadlineDate: Date.now(),
    reqSkills: ["C", "Java"],
    jobType: "Full Time",
    duration: 2,
    salary: 10000,
    rating: 3,
  }),
  new Job({
    title: "employee",
    recruiterName: "aman",
    recruiterEmail: "aman@goyal.com",
    maxApp: 5,
    numPos: 3,
    postingDate: Date.now(),
    deadlineDate: Date.now(),
    reqSkills: ["C", "Java"],
    jobType: "Part Time",
    duration: 5,
    salary: 5000,
    rating: 2,
  }),
  new Job({
    title: "peeyun",
    recruiterName: "aman",
    recruiterEmail: "aman@goyal.com",
    maxApp: 5,
    numPos: 3,
    postingDate: Date.now(),
    deadlineDate: Date.now(),
    reqSkills: ["C", "Java"],
    jobType: "Work from Home",
    duration: 3,
    salary: 2000,
    rating: 4,
  }),
  new Job({
    title: "enginner",
    recruiterName: "aman",
    recruiterEmail: "aman@goyal.com",
    maxApp: 5,
    numPos: 3,
    postingDate: Date.now(),
    deadlineDate: Date.now(),
    reqSkills: ["C", "Java"],
    jobType: "Full Time",
    duration: 6,
    salary: 50000,
    rating: 1,
  }),
];
for (i = 0; i < dummyJobs.length; i++) dummyJobs[i].save();