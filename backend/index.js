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



app.use(passport.initialize());
app.use(passport.session());

app.listen(8080, function () {
    console.log("Server started on port 8080");
  });