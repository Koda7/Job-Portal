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


app.use(passport.initialize());
app.use(passport.session());

app.listen(8080, function () {
    console.log("Server started on port 8080");
  });