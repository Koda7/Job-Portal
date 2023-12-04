require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const upload = require("express-fileupload");
const { User, JobApplicant, Recruiter, Job } = require("./schemas/schema");
// require("./schemas/dummyJobs.js");
const cors = require("cors");
var LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./scratch");

mongoose.connect('mongodb://localhost:27017/userTestDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const app = express();
app.use(upload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", function (req, res) {
    res.send("Server is up and running");
  });

app.get("/registerType/:profileType", (req, res) => {
    localStorage.setItem("type", req.params.profileType);
    res.redirect("/auth/google");
  });
  
app.get("/currUser", function (req, res) {
  if (!req.isAuthenticated()) res.sendStatus(401);
  else {
    let currUser = req.user;
    if (req.user.type === "JA") {
      JobApplicant.findOne({ userId: req.user._id }, function (err, userInfo) {
        if (err) res.json();
        if (userInfo) {
          currUserInfo = userInfo;
          res.json({ currUser, currUserInfo });
        }
      });
    } else {
      Recruiter.findOne({ userId: req.user._id }, function (err, userInfo) {
        if (err) res.json();
        if (userInfo) {
          currUserInfo = userInfo;
          res.json({ currUser, currUserInfo });
        }
      });
    }
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.send("Logout Successful");
});

app.get("/jobs", function (req, res) {
  Job.find({}, function (err, foundJobs) {
    if (err) {
      console.log(err);
      res.json({ jobs: [] });
    } else {
      res.json({ jobs: foundJobs });
    }
  });
});

app.get("/isLoggedIn", function (req, res) {
  if (req.isAuthenticated()) res.send("Yes");
  else res.send("No");
});
  
app.get("/myApplications", (req, res) => {
  if (typeof req.user === "undefined") res.sendStatus(401);
  else {
    userId = req.user._id;
    Job.find(
      { appliedBy: { $elemMatch: { id: userId } } },
      function (err, foundJobs) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          res.json({ foundJobs });
        }
      }
    );
  }
});

app.post("/updateUserInfo", (req, res) => {
  let chosenModel = Recruiter;
  if (req.body.type == "JA") chosenModel = JobApplicant;
  chosenModel
    .updateOne({ _id: req.body.userInfo._id }, req.body.userInfo)
    .exec()
    .then((foundUser) => res.send("OK"))
    .catch((err) => {
      console.log(err), res.sendStatus(400);
    });
});

app.post("/getFile", (req, res) => {
  if (typeof req.user === "undefined") res.sendStatus(401);
  else res.download(__dirname + "/uploads/" + req.user._id + req.body.filename);
});

app.post("/getFile2", (req, res) => {
  if (typeof req.user === "undefined") res.sendStatus(401);
  else res.download(__dirname + "/uploads/" + req.body.filename);
});

app.post("/storeFile", function (req, res) {
  if (req.files) {
    var file = req.files.file;
    var filename = file.name.replace(/ /g, "");
    file.mv("./uploads/" + req.user._id + filename, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("File Uploded");
        let path = __dirname + "/uploads/" + req.user._id + filename;
        let obj = {
          resumePath: filename,
        };
        if (req.body.type === "Image")
          obj = {
            ImagePath: filename,
          };
        JobApplicant.updateOne(
          { userId: req.user._id },
          obj,
          function (err, foundUser) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    });
  }
});

app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username, type: req.body.profileType },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        req.login(user, function (err) {
          if (err) console.log(err);
          else {
            passport.authenticate("local")(req, res, function () {
              console.log("LoggedIn");
            });
          }
        });
        let chosenModel;
        if (user.type === "JA") chosenModel = JobApplicant;
        else chosenModel = Recruiter;
        const temp = new chosenModel({
          userId: user._id,
        });
        temp.save(function (err) {
          if (err) {
            res.send("Failed to register");
          } else res.send("Success");
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.send("Failed");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.send("Success");
      });
    }
  });
});

app.post("/applyToJob", async (req, res) => {
  try {
    let dateOfApplication = new Date(Date.now());
    let dateString = dateOfApplication.toISOString();
    const userApplied = {
      id: req.body.userId,
      SOP: req.body.jobSOP,
      status: "Applied",
      dateOfApplication: dateString,
    };
    let user = await JobApplicant.findOne({ userId: req.body.userId });
    if (user.foundJob) {
      res.send("Already Accepted in another Job!");
      return;
    }
    const appliedTo = req.body.jobId;
    let job = await Job.findById(appliedTo);
    if (job.appliedBy.length == job.maxApp || job.gotBy.length == job.numPos) {
      res.send(" The job is already full");
    } else {
      job.appliedBy.push(userApplied);
      await job.save();
      await JobApplicant.updateOne(
        { userId: req.body.userId },
        { $push: { appliedJobs: appliedTo } },
        { useFindAndModify: false }
      );
      res.send("Success");
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post("/addJob", async (req, res) => {
  if (!req.isAuthenticated()) res.sendStatus(401);
  else {
    let userId = req.body.id;
    delete req.body["id"];
    try {
      const newJob = new Job(req.body);
      let user = await newJob.save();
      await Recruiter.updateOne(
        { userId },
        { $push: { listedJobs: user._id } }
      );
      res.send(user._id);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
});

app.post("/myJobs", async (req, res) => {
  if (!req.isAuthenticated()) res.sendStatus(401);
  else {
    try {
      const jobList = req.body.listOfJobs;
      let foundJobs = await Job.find({ _id: { $in: jobList } });
      res.json({ foundJobs });
    } catch (err) {
      console.log(err);
      res.sendStatus(500).send("Failed to Read Database");
    }
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.listen(8080, function () {
    console.log("Server started on port 8080");
  });