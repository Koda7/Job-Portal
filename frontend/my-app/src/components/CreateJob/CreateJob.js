import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import ShowSkills from "../ShowSkills/ShowSkills";
import axios from "axios";
import swal from "sweetalert";
import {
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  RadioGroup,
  Radio,
  FormControlLabel,
  DialogActions,
  Grid,
  Paper,
  Container,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: "3rem",
    fontFamily: "'Work Sans', sans-serif",
    // fontWeight: 400,
    color: "#002147",
  },
  field: {
    display: "inline",
  },
}));

const CreateJob = (props) => {
  const initializeJob = {
    title: "",
    recruiterName: props.userInfo.name,
    recruiterEmail: props.userInfo.email,
    maxApp: 0,
    numPos: 0,
    postingDate: Date.now(),
    deadlineDate: Date.now(),
    reqSkills: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
    rating: 0,
    appliedBy: [],
    gotBy: [],
  };

  const [jobInfo, setJobInfo] = useState(initializeJob);
  const [chosenSkill, setChosenSkill] = useState("");
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillInfo, setSkillInfo] = useState("");
  const [errFields, setErrFields] = useState({
    title: false,
    name: false,
    email: false,
    maxApp: false,
    numPos: false,
    salary: false,
  });
  const classes = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "maxApp" || name === "numPos" || name === "salary") {
      if (value < 0 && value !== "") return;
    }

    setJobInfo((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  function handleSkillOpen() {
    setSkillOpen(true);
  }
  function handleSkillClose() {
    setSkillOpen(false);
  }

  const addJob = () => {
    let nameEmpty = jobInfo.recruiterName === "";
    let titleEmpty = jobInfo.title === "";
    let validApp = Number(jobInfo.numPos) <= Number(jobInfo.maxApp);
    let validPos = jobInfo.numPos > 0;
    let validSalary = jobInfo.salary >= 0;
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validEmail = emailRegExp.test(
      String(jobInfo.recruiterEmail).toLowerCase()
    );
    setErrFields({
      name: nameEmpty,
      title: titleEmpty,
      email: !validEmail,
      maxApp: !validApp,
      numPos: !validPos,
      salary: !validSalary,
    });
    if (
      nameEmpty ||
      !validEmail ||
      titleEmpty ||
      !validPos ||
      !validApp ||
      !validSalary
    )
      return;
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8080/addJob", {
        ...jobInfo,
        id: props.userInfo.id,
      })
      .then((response) => {
        swal({
          title: "Job added",
          icon: "success",
        });
        setJobInfo(initializeJob);
        props.addJobToInfo(response.data);
        setChosenSkill("");
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Failed to add Job",
          icon: "error",
        });
        if (err.response.status === 401) props.history.push("/login");
      });
  };

  const deleteSkill = (skillName) => {
    let newSkillArray = jobInfo.reqSkills.filter(
      (skill) => skillName !== skill.skillName
    );
    setJobInfo((prevValues) => {
      return { ...prevValues, reqSkills: newSkillArray };
    });
  };

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }
  const addSkill = (name) => {
    name = titleCase(name);
    let index = jobInfo.reqSkills.findIndex((x) => {
      return x.skillName === name;
    });
    if (index === -1) {
      setJobInfo((prevValues) => {
        return {
          ...prevValues,
          reqSkills: [...prevValues.reqSkills, { skillName: name }],
        };
      });
    }
    handleSkillClose();
  };

  const showSkills = () => {
    const Languages = ["C++", "Java", "Python", "Ruby", "JavaScript"];
    return (
      <div>
        <Grid container direction='row' alignItems='flex-end'>
          <Grid item xs={6}>
            <TextField
              select
              label='Choose Skill'
              value={chosenSkill}
              style={{ margin: 0, width: "100%" }}
              onChange={(e) => {
                setChosenSkill(e.target.value);
                addSkill(e.target.value);
              }}
            >
              {Languages.map((name, index) => {
                return (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs={6} align='center' style={{ height: "100%" }}>
            <Button
              variant='contained'
              color='primary'
              style={{ width: "80%" }}
              className={classes.skillbutton}
              startIcon={<AddIcon />}
              onClick={handleSkillOpen}
            >
              Add Skill
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={skillOpen}
          onClose={handleSkillClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Add Skill</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              value={skillInfo}
              onChange={(e) => setSkillInfo(e.target.value)}
              required
              margin='dense'
              label='Skill'
              type='text'
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSkillClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => addSkill(skillInfo)} color='primary'>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const displaySkills = () => {
    return (
      <div style={{ margin: "1rem 0rem 1rem 0rem" }}>
        {jobInfo.reqSkills.length === 0 ? (
          <Chip
            label='No Skills Added'
            clickable
            color='primary'
            style={{ fontSize: 15, margin: "0.3rem", padding: "0.5rem" }}
          />
        ) : (
          jobInfo.reqSkills.map((skill, index) => {
            return (
              <ShowSkills
                data={skill.skillName}
                key={index}
                deleteSkill={deleteSkill}
              />
            );
          })
        )}
      </div>
    );
  };

  const displayJobTypeAndDuration = (element) => {
    let durationChoices = [];
    let jobTypes = ["Full Time", "Part Time", "Work from Home"];
    let jobTypesChoices = [];
    for (var i = 0; i < 7; i++) {
      durationChoices.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    for (i = 0; i < jobTypes.length; i++) {
      jobTypesChoices.push(
        <FormControlLabel
          key={i}
          value={jobTypes[i]}
          control={<Radio color='primary' />}
          label={<span style={{ fontSize: "1rem" }}>{jobTypes[i]}</span>}
        />
      );
    }
    if (element === "duration")
      return (
        <div>
          <TextField
            name='duration'
            select
            fullWidth
            label={
              <span
                style={{
                  fontSize: "1.2rem",
                  color: "#2874ef",
                  fontFamily: "'Work Sans'",
                  fontWeight: "bold",
                }}
              >
                Duration
              </span>
            }
            value={jobInfo.duration}
            onChange={handleChange}
          >
            {durationChoices}
          </TextField>
        </div>
      );
    else
      return (
        <RadioGroup
          row
          style={{ justifyContent: "center", paddingTop: "2rem" }}
          name='jobType'
          value={jobInfo.jobType}
          onChange={handleChange}
        >
          {jobTypesChoices}
        </RadioGroup>
      );
  };
  
  return (
    <Container style={{ width: 1100, maxWidth: "100%" }}>
      <Grid container spacing={3} justify='center'>
        <Paper elevation={4} style={{ width: "100%", marginTop: "2rem" }}>
          <Grid
            container
            direction='column'
            style={{ padding: "0rem 4rem 4rem" }}
          >
            <h1 className={classes.heading}>Create Job</h1>
            <Grid
              container
              direction='row'
              spacing={3}
              align='center'
              justify='space-around'
              style={{ paddingBottom: "3rem" }}
            >
              <Grid item xs={5}>
                <TextField
                  name='title'
                  error={errFields.title}
                  fullWidth
                  label={
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#2874ef",
                        fontFamily: "'Work Sans'",
                        fontWeight: "bold",
                      }}
                    >
                      Title
                    </span>
                  }
                  value={jobInfo.title}
                  onChange={handleChange}
                  helperText={errFields.numPos ? "Title can't be empty" : null}
                ></TextField>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  name='recruiterName'
                  error={errFields.name}
                  fullWidth
                  label={
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#2874ef",
                        fontFamily: "'Work Sans'",
                        fontWeight: "bold",
                      }}
                    >
                      Recruiter Name
                    </span>
                  }
                  value={jobInfo.recruiterName}
                  onChange={handleChange}
                  helperText={errFields.numPos ? "Name can't be empty" : null}
                ></TextField>
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={3}
              align='center'
              justify='space-around'
              style={{ paddingBottom: "3rem" }}
            >
              <Grid item xs={5}>
                <TextField
                  error={errFields.email}
                  name='recruiterEmail'
                  fullWidth
                  label={
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#2874ef",
                        fontFamily: "'Work Sans'",
                        fontWeight: "bold",
                      }}
                    >
                      Recruiter Email
                    </span>
                  }
                  value={jobInfo.recruiterEmail}
                  onChange={handleChange}
                  helperText={errFields.email ? "Invalid Email" : null}
                ></TextField>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  name='maxApp'
                  type='number'
                  error={errFields.maxApp}
                  fullWidth
                  label={
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#2874ef",
                        fontFamily: "'Work Sans'",
                        fontWeight: "bold",
                      }}
                    >
                      Maximum Applications
                    </span>
                  }
                  value={jobInfo.maxApp}
                  onChange={handleChange}
                  helperText={errFields.maxApp ? "Invalid value" : null}
                ></TextField>
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={3}
              align='center'
              justify='space-around'
              style={{ paddingBottom: "3rem" }}
            >
              <Grid item xs={5}>
                <TextField
                  name='numPos'
                  type='number'
                  error={errFields.numPos}
                  fullWidth
                  label={
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#2874ef",
                        fontFamily: "'Work Sans'",
                        fontWeight: "bold",
                      }}
                    >
                      No. of Vacancies
                    </span>
                  }
                  value={jobInfo.numPos}
                  onChange={handleChange}
                  helperText={errFields.numPos ? "Invalid value" : null}
                ></TextField>
              </Grid>
              <Grid item xs={5}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    fullWidth
                    label={
                      <span
                        style={{
                          fontSize: "1.2rem",
                          color: "#2874ef",
                          fontFamily: "'Work Sans'",
                          fontWeight: "bold",
                        }}
                      >
                        Deadline Date
                      </span>
                    }
                    value={jobInfo.deadlineDate}
                    onChange={(date) => {
                      setJobInfo((prevValues) => {
                        return {
                          ...prevValues,
                          deadlineDate: date.toISOString(),
                        };
                      });
                    }}
                    disablePast
                    format='dd/MM/yyyy hh:mm a'
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid
              container
              direction='row'
              spacing={3}
              justify='space-around'
              style={{ paddingBottom: "3rem" }}
            >
              <Grid item xs={5} align='flex-end'>
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "#2874ef",
                    fontFamily: "'Work Sans'",
                    fontWeight: "bold",
                  }}
                >
                  Skills
                </span>
                {displaySkills()}
                {showSkills()}
              </Grid>
              <Grid item xs={5} align='flex-end'>
                <Grid container direction='column'>
                  <Grid container direction='row' spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        error={errFields.salary}
                        name='salary'
                        type='number'
                        InputProps={{ inputProps: { min: 0 } }}
                        fullWidth
                        label={
                          <span
                            style={{
                              fontSize: "1.2rem",
                              color: "#2874ef",
                              fontFamily: "'Work Sans'",
                              fontWeight: "bold",
                            }}
                          >
                            Salary per Month
                          </span>
                        }
                        value={jobInfo.salary}
                        onChange={handleChange}
                        helperText={
                          errFields.salary ? "Salary cannot be negative" : null
                        }
                      ></TextField>
                    </Grid>
                    <Grid item xs={6}>
                      {displayJobTypeAndDuration("duration")}
                    </Grid>
                  </Grid>
                </Grid>
                {displayJobTypeAndDuration()}
              </Grid>
            </Grid>
            <Grid item xs={12} align='center'>
              <Button
                onClick={addJob}
                variant='contained'
                color='secondary'
                style={{
                  fontSize: "1.3rem",
                  maxwidth: "100%",
                  width: 360,
                }}
              >
                Add Job
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
};

export default CreateJob;
