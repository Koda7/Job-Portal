import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../fonts/Fonts.css";
import NavBar from "../NavBarSignedIn/NavBar";
import AddIcon from "@material-ui/icons/Add";
import swal from "sweetalert";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import ShowInstance from "../ShowInstance/ShowInstance";
import ShowSkills from "../ShowSkills/ShowSkills";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  Paper,
  Grid,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundImage: "white",
  },
  heading: {
    fontFamily: "'Baloo Thambi 2', cursive",
    textAlign: "center",
    color: "#312c51",
    fontSize: "3rem",
  },
  field: {
    paddingTop: "0.5rem",
    paddingBottom: "1.5rem",
  },
  edubutton: {
    fontSize: "1rem",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
  },
  skillbutton: {
    fontSize: "1rem",
    width: "90%",
  },
  label: {
    fontFamily: "'Baloo Thambi 2'",
    fontSize: "1rem",
    color: "#2948ff",
  },
}));

const RegisterInfo = (props) => {
  const [gotResponse, setGotResponse] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [profileInfo, setProfileInfo] = useState({});
  const [eduOpen, setEduOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [eduInfo, setEduInfo] = useState({
    instituteName: "",
    startYear: new Date(Date.now()).getFullYear(),
    endYear: 0,
  });
  const [addEndYear, setAddEndYear] = useState(false);
  const [skillInfo, setSkillInfo] = useState("");
  const [chosenSkill, setChosenSkill] = useState("");
  const [errFields, setErrFiedls] = useState({
    name: false,
    email: false,
    contact: false,
  });

  function handleEduOpen() {
    setEduOpen(true);
  }
  function handleEduClose() {
    setSkillInfo("");
    setEduOpen(false);
  }
  function handleSkillOpen() {
    setSkillOpen(true);
  }
  function handleSkillClose() {
    setSkillOpen(false);
  }
  function addEducation() {
    if (eduInfo.instituteName === "") return;
    let index = userInfo.education.findIndex((x) => {
      return (
        x.instituteName === eduInfo.instituteName &&
        x.startYear === eduInfo.startYear &&
        x.endYear === eduInfo.endYear
      );
    });
    if (index === -1) {
      setUserInfo((prevValues) => {
        return {
          ...prevValues,
          education: [...prevValues.education, eduInfo],
        };
      });
      setEduInfo({
        instituteName: "",
        startYear: new Date(Date.now()).getFullYear(),
        endYear: 0,
      });
    }
    handleEduClose();
  }

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
    let index = userInfo.skills.findIndex((x) => {
      return x.skillName === name;
    });
    if (index === -1) {
      setUserInfo((prevValues) => {
        return {
          ...prevValues,
          skills: [...prevValues.skills, { skillName: name }],
        };
      });
    }
    handleSkillClose();
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8080/currUser")
      .then((response) => {
        setProfileInfo(response.data.currUser);
        setUserInfo(response.data.currUserInfo);
        setGotResponse(true);
      })
      .catch((err) => {
        console.log(err);
        setGotResponse(true);
        if (err.response.status === 401) props.history.push("/register");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUserInfo = () => {
    let nameEmpty = userInfo.name === "";
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validEmail = emailRegExp.test(String(userInfo.email).toLowerCase());
    const contactRegExp = /^[0-9]+$/;
    let validContact = true;
    if (profileInfo.type === "R") {
      validContact = userInfo.contactNo.length === 10;
      validContact =
        contactRegExp.test(String(userInfo.contactNo)) && validContact;
    }
    setErrFiedls({
      name: nameEmpty,
      email: !validEmail,
      contact: !validContact,
    });
    if (profileInfo.type === "JA" && (nameEmpty || !validEmail)) return;
    if (profileInfo.type === "R" && (nameEmpty || !validEmail || !validContact))
      return;
    axios
      .post("http://localhost:8080/updateUserInfo", {
        userInfo,
        type: profileInfo.type,
      })
      .then((response) => props.history.push("/user"))
      .catch((err) => {
        console.log(err);
        swal({
          title: "Update Failed",
          icon: "error",
        });
      });
  };

  const updateInfo = (event) => {
    setUserInfo((prevValues) => {
      return {
        ...prevValues,
        [event.target.name]: event.target.value,
      };
    });
  };

  const updateEduInfo = (event) => {
    setEduInfo((prevValues) => {
      return {
        ...prevValues,
        [event.target.name]: event.target.value,
      };
    });
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

  const showEducation = () => {
    return (
      <div>
        <Button
          variant='contained'
          color='primary'
          className={classes.edubutton}
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleEduOpen}
        >
          Add Education
        </Button>
        <Dialog
          open={eduOpen}
          onClose={handleEduClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Education Instance</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              name='instituteName'
              error={eduInfo.instituteName === ""}
              value={eduInfo.instituteName}
              onChange={updateEduInfo}
              required
              margin='dense'
              label='Institution Name'
              type='text'
              helperText={
                eduInfo.instituteName === "" ? "Please Enter Name" : null
              }
              fullWidth
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                views={["year"]}
                name='startYear'
                required
                label='Select Start Year'
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                value={new Date(eduInfo.startYear, 1, 0)}
                onChange={(date) =>
                  setEduInfo((prevValues) => {
                    return { ...prevValues, startYear: date.getFullYear() };
                  })
                }
                style={{ marginTop: "10px" }}
                fullWidth
                animateYearScrolling
              />
              <DatePicker
                views={["year"]}
                name='endYear'
                label='Select End Year'
                disabled={!addEndYear}
                value={
                  eduInfo.endYear === 0
                    ? new Date(new Date().getFullYear(), 1, 0)
                    : new Date(eduInfo.endYear, 1, 0)
                }
                minDate={
                  eduInfo.endYear === ""
                    ? null
                    : new Date(eduInfo.startYear, 1, 0)
                }
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                onChange={(date) =>
                  setEduInfo((prevValues) => {
                    return { ...prevValues, endYear: date.getFullYear() };
                  })
                }
                style={{ marginTop: "10px" }}
                fullWidth
                animateYearScrolling
              />
            </MuiPickersUtilsProvider>
            {addEndYear ? (
              <Button
                size='small'
                color='primary'
                onClick={() => {
                  setAddEndYear(false);
                  setEduInfo((prevValues) => {
                    return {
                      ...prevValues,
                      endYear: 0,
                    };
                  });
                }}
              >
                Remove End Year
              </Button>
            ) : (
              <Button
                size='small'
                color='primary'
                onClick={() => {
                  setAddEndYear(true);
                  setEduInfo((prevValues) => {
                    return {
                      ...prevValues,
                      endYear: new Date(Date.now()).getFullYear(),
                    };
                  });
                }}
              >
                Add End Year
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEduClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={addEducation} color='primary'>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  const deleteEdu = (obj) => {
    let newEduArray = userInfo.education.filter(
      (instance) =>
        instance.instituteName !== obj.instituteName ||
        instance.startYear !== obj.startYear ||
        instance.endYear !== obj.endYear
    );
    setUserInfo((prevValues) => {
      return { ...prevValues, education: newEduArray };
    });
  };
  const deleteSkill = (skillName) => {
    let newSkillArray = userInfo.skills.filter(
      (skill) => skillName !== skill.skillName
    );
    setUserInfo((prevValues) => {
      return { ...prevValues, skills: newSkillArray };
    });
  };
  const displayEducation = () => {
    // Title, date of joining, salary per month, name of recruiter.
    // Date of joining?
    return userInfo.education.map((instance, index) => {
      return <ShowInstance data={instance} key={index} deleteEdu={deleteEdu} />;
    });
  };
  const displaySkills = () => {
    return (
      <div style={{ margin: "1rem 0rem 1rem 0rem" }}>
        {userInfo.skills.map((skill, index) => {
          return (
            <ShowSkills
              data={skill.skillName}
              key={index}
              deleteSkill={deleteSkill}
            />
          );
        })}
      </div>
    );
  };

  const logout = () => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8080/logout")
      .then((response) => {
        props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        props.history.push("/");
      });
  };

  const takeApplicantInfo = () => {
    return (
      <div>
        <InputLabel className={classes.label}>Name</InputLabel>
        <TextField
          error={errFields.name}
          name='name'
          inputProps={{
            autoComplete: "off",
          }}
          required
          fullWidth
          value={userInfo.name}
          onChange={updateInfo}
          className={classes.field}
          helperText={errFields.name ? "Please Enter Name" : null}
        />
        <InputLabel className={classes.label}>Email</InputLabel>
        <TextField
          error={errFields.email}
          name='email'
          fullWidth
          inputProps={{
            autoComplete: "off",
          }}
          required
          value={userInfo.email}
          onChange={updateInfo}
          className={classes.field}
          helperText={errFields.email ? "Please Enter Valid Email" : null}
        />
        <InputLabel className={classes.label}>Education Instances</InputLabel>
        {displayEducation()}
        {showEducation()}
        <InputLabel className={classes.label}>Skills</InputLabel>
        {displaySkills()}
        {showSkills()}
      </div>
    );
  };
  const takeRecruiterInfo = () => {
    return (
      <div>
        <InputLabel className={classes.label}>Name</InputLabel>
        <TextField
          error={errFields.name}
          name='name'
          inputProps={{
            autoComplete: "off",
          }}
          required
          fullWidth
          value={userInfo.name}
          onChange={updateInfo}
          className={classes.field}
          helperText={errFields.name ? "Please Enter Name" : null}
        />
        <InputLabel className={classes.label}>Email</InputLabel>
        <TextField
          error={errFields.email}
          name='email'
          fullWidth
          inputProps={{
            autoComplete: "off",
          }}
          required
          value={userInfo.email}
          onChange={updateInfo}
          className={classes.field}
          helperText={errFields.email ? "Please Enter Valid Email" : null}
        />
        <InputLabel className={classes.label}>Contact Number</InputLabel>
        <TextField
          error={errFields.contact}
          name='contactNo'
          inputProps={{
            autoComplete: "off",
          }}
          fullWidth
          required
          value={userInfo.contactNo}
          className={classes.field}
          type='number'
          onChange={updateInfo}
          helperText={
            errFields.contact ? "Please Enter Valid Contact Number" : null
          }
        />
        <InputLabel className={classes.label}>Bio</InputLabel>
        <TextField
          name='bio'
          fullWidth
          autoFocus
          rows={3}
          rowsMax={6}
          required
          margin='dense'
          label='max 250 words'
          type='text'
          style={{
            marginTop: "2rem",
          }}
          inputProps={{ maxLength: 250 }}
          multiline
          value={userInfo.bio}
          onChange={updateInfo}
          variant='outlined'
        />
      </div>
    );
  };
  const classes = useStyles();
  if (!gotResponse) return <h1>Loading..</h1>;
  else {
    return (
      <Box className={classes.root}>
        <NavBar userInfo={profileInfo} logout={logout} />
        <Grid
          container
          style={{
            margin: "auto",
            width: 500,
            paddingTop: "5rem",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            position: "relative",
          }}
        >
          <Paper
            style={{
              width: "100%",
            }}
            elevation={5}
          >
            <h1 className={classes.heading}>Information</h1>
            <div style={{ width: "80%", margin: "auto" }}>
              {profileInfo.type === "JA"
                ? takeApplicantInfo()
                : takeRecruiterInfo()}
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "2rem",
                }}
              >
                <Button
                  onClick={updateUserInfo}
                  variant='contained'
                  color='secondary'
                  style={{
                    fontSize: "1.5rem",
                    margin: "0.5rem 0rem 2rem 0rem",
                  }}
                >
                  Add Infromation
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
      </Box>
    );
  }
};

export default RegisterInfo;
