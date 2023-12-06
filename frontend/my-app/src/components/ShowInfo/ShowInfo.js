import { Rating } from "@material-ui/lab";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import swal from "sweetalert";
import AddIcon from "@material-ui/icons/Add";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import ShowInstance from "../ShowInstance/ShowInstance";
import ShowSkills from "../ShowSkills/ShowSkills";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import "../../fonts/Fonts.css";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  MenuItem,
  Container,
  Paper,
  InputBase,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  profileName: {
    fontFamily: "'Work Sans',sans-serif",
    fontWeight: 50,
    marginBottom: "0rem",
  },
  status: {
    marginTop: "0rem",
    fontSize: "1rem",
    fontFamily: "'Baloo Thambi 2',cursive",
  },
  errorText: {
    fontSize: "0.9rem",
    color: "red",
    fontFamily: "Helvetica",
    fontWeight: "bold",
  },
  edubutton: {
    fontSize: "1rem",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
  },
  heading: {
    fontSize: "3rem",
    fontFamily: "'Work Sans', sans-serif",
    // fontWeight: 400,
    color: "#002147",
  },
  skillbutton: {
    fontSize: "1rem",
    width: "90%",
  },
  label: {
    padding: "1.3rem",
    fontSize: "1.2rem",
    fontFamily: "'Montserrat',sans-serif",
    color: "#23689b",
    fontWeight: "900",
  },
  info: {
    color: "#19456b",
    padding: "1rem",
    fontSize: "1.3rem",
    boxShadow: "1px 1px #C8C8C8",
  },
}));

const ShowInfo = (props) => {
  const [eduOpen, setEduOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [eduInfo, setEduInfo] = useState({
    instituteName: "",
    startYear: new Date(Date.now()).getFullYear(),
    endYear: 0,
  });
  const [addEndYear, setAddEndYear] = useState(false);
  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
  });
  const [skillInfo, setSkillInfo] = useState("");
  const [chosenSkill, setChosenSkill] = useState("");
  const [userInfo, setUserInfo] = useState(props.userInfo);
  const [errFields, setErrFields] = useState({
    name: false,
    email: false,
  });
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const showImage = () => {
      let filename;
      filename = userInfo.ImagePath;
      filename = filename.replace(/ /g, "");
      if (filename === "") {
        return;
      }
      axios({
        method: "POST",
        url: "http://localhost:8080/getFile",
        responseType: "blob",
        data: { filename },
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          document.querySelector("#profilePic").src = url;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    showImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    } else {
    }
    handleEduClose();
  }

  const classes = useStyles();

  const uploadFile = (event) => {
    let type = event.target.name;
    let filType = event.target.files[0].type;
    if (
      type === "Image" &&
      filType !== "image/jpeg" &&
      filType !== "image/png"
    ) {
      swal({
        title: "Only JPEG and PNG images allowed",
        icon: "error",
      });
      return;
    } else if (type === "resume" && filType !== "application/pdf") {
      swal({
        title: "Only PDF allowed",
        icon: "error",
      });
      return;
    }
    if (event.target.files.length > 1) {
      swal({
        title: "Only one file allowed",
        icon: "error",
      });
      return;
    }
    if (type === "Image")
      setUserInfo((prevValues) => {
        return { ...prevValues, ImagePath: event.target.files[0].name };
      });
    else
      setUserInfo((prevValues) => {
        return { ...prevValues, resumePath: event.target.files[0].name };
      });

    let data = new FormData();
    data.append("file", event.target.files[0]);
    data.append("type", type);
    axios
      .post("http://localhost:8080/storeFile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        swal({
          title: "Uploaded successfully",
          icon: "success",
        });
        const url = window.URL.createObjectURL(event.target.files[0]);
        if (type === "Image") document.querySelector("#profilePic").src = url;
        console.log(userInfo.resumePath);
      })
      .catch((err) => {
        swal({
          title: "Upload failed",
          icon: "error",
        });
        console.log(err);
      });
    // window.location.reload();
  };
  const downloadFile = (type) => {
    let filename;
    if (type === "Image") filename = userInfo.ImagePath;
    else filename = userInfo.resumePath;
    filename = filename.replace(/ /g, "");
    if (filename === "") {
      swal({
        title: "No File Uploaded",
        icon: "error",
      });
      return;
    }
    console.log(userInfo.resumePath);
    axios({
      method: "POST",
      url: "http://localhost:8080/getFile",
      responseType: "blob",
      data: { filename },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
        <Redirect to='/login' />;
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
    } else {
    }
    handleSkillClose();
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

  const updateFullInfo = () => {
    let nameEmpty = userInfo.name === "";
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validEmail = emailRegExp.test(String(userInfo.email).toLowerCase());
    setErrFields({
      name: nameEmpty,
      email: !validEmail,
    });
    if (nameEmpty || !validEmail) return;
    axios
      .post("http://localhost:8080/updateUserInfo", {
        userInfo,
        type: props.userType,
      })
      .then((response) => {
        swal({
          title: "Updated Information",
          icon: "success",
        });
        props.updateUserInfo(userInfo);
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Update failed",
          icon: "error",
        });
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
    if (userInfo.education.length === 0) return;
    return (
      <div
        style={{
          marginTop: "10px",
          boxShadow: "1px 1px 1px 1px #C8C8C8",
        }}
      >
        {userInfo.education.map((instance, index) => {
          return (
            <ShowInstance data={instance} key={index} deleteEdu={deleteEdu} />
          );
        })}
      </div>
    );
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

  const updateIsEditable = (field) => {
    setIsEditable((prevValues) => {
      return {
        ...prevValues,
        [field]: !prevValues[field],
      };
    });
  };
  return (
    <Container style={{ paddingBottom: "5rem" }}>
      <h1 className={classes.heading}>PROFILE</h1>
      {/* <Paper elevation={3} style={{ padding: "2rem 1rem" }}> */}
      <Grid container spacing={3} justify='center'>
        <Grid item xs={3} style={{ height: "100%" }}>
          <Paper elevation={3} style={{ padding: "2rem 1rem" }}>
            <Grid
              container
              justify='center'
              alignItems='center'
              style={{ marginTop: "4rem" }}
              direction='column'
            >
              <Grid item>
                <img
                  src={process.env.PUBLIC_URL + "/assets/profilePic.png"}
                  style={{
                    objectFit: "cover",
                    width: 200,
                    height: 200,
                    borderRadius: "100%",
                  }}
                  alt='profilePic'
                  id='profilePic'
                />
              </Grid>
              <Grid item>
                <h1 className={classes.profileName}>{userInfo.name}</h1>
              </Grid>
              <Grid item>
                <Rating
                  name='rating'
                  value={Number(userInfo.rating)}
                  onChange={updateInfo}
                  defaultValue={props.userInfo.rating}
                  precision={0.5}
                  readOnly
                />
              </Grid>
              <Grid item>
                <h1 className={classes.status}>
                  {!userInfo.foundJob ? (
                    <span style={{ color: "#00a86b" }}>Actively Looking</span>
                  ) : (
                    <span style={{ color: "#e32636" }}>Employed</span>
                  )}
                </h1>
              </Grid>
              <Button
                style={{
                  padding: "0.7rem",
                  margin: "1rem",
                  color: "#1464F4	",
                  border: "3px  solid #1D7CF2",
                  borderRadius: 0,
                  width: 200,
                  backgroundColor: "#FFF",
                  maxWdith: "100%",
                }}
                component='label'
              >
                Change Image
                <input
                  type='file'
                  name='Image'
                  hidden
                  onChange={(e) => (e.target ? uploadFile(e) : null)}
                />
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper elevation={3} style={{ padding: "2rem 1rem" }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container direction='row'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Name</h1>
                  </Grid>
                  <Grid item xs={8}>
                    <h1 className={classes.info}>
                      <InputBase
                        error={errFields.name}
                        disabled={!isEditable.name}
                        fullWidth
                        style={{
                          color: "#19456b",
                          fontSize: "1.3rem",
                        }}
                        name='name'
                        value={userInfo.name}
                        onChange={(e) =>
                          isEditable.name ? updateInfo(e) : null
                        }
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => updateIsEditable("name")}
                            >
                              {isEditable.name ? <DoneIcon /> : <EditIcon />}
                            </IconButton>
                          </InputAdornment>
                        }
                      ></InputBase>
                    </h1>
                    {errFields.name ? (
                      <div className={classes.errorText}>
                        Name cannot be empty
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction='row'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Email</h1>
                  </Grid>
                  <Grid item xs={8}>
                    <h1 className={classes.info}>
                      <InputBase
                        disabled={!isEditable.email}
                        fullWidth
                        style={{
                          color: "#19456b",
                          fontSize: "1.3rem",
                        }}
                        name='email'
                        value={userInfo.email}
                        onChange={(e) =>
                          isEditable.email ? updateInfo(e) : null
                        }
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => updateIsEditable("email")}
                            >
                              {isEditable.email ? <DoneIcon /> : <EditIcon />}
                            </IconButton>
                          </InputAdornment>
                        }
                      ></InputBase>
                    </h1>
                    {errFields.email ? (
                      <div className={classes.errorText}>Email not valid</div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction='row'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Education</h1>
                  </Grid>
                  <Grid item xs={8}>
                    {displayEducation()}
                    {showEducation()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction='row'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Skills</h1>
                  </Grid>
                  <Grid item xs={8}>
                    <div
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      {displaySkills()}
                    </div>
                    {showSkills()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={10} align='center' style={{ marginTop: "1rem" }}>
                <Button
                  style={{
                    padding: "0.7rem",
                    margin: "1rem",
                    color: "#1464F4	",
                    border: "3px  solid #1D7CF2",
                    backgroundColor: "#FFF",
                    borderRadius: 0,
                  }}
                  component='label'
                >
                  Upload Resume
                  <input
                    type='file'
                    name='resume'
                    hidden
                    onChange={(e) => (e.target ? uploadFile(e) : null)}
                  />
                </Button>
                <Button
                  onClick={() => downloadFile("resume")}
                  style={{
                    padding: "0.9rem",
                    margin: "1rem",
                    background: "#1D7CF2",
                    color: "white",
                    borderRadius: 0,
                  }}
                >
                  Download Resume
                </Button>
              </Grid>
              <Grid item xs={10}>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "2rem",
                  }}
                >
                  <Button
                    onClick={updateFullInfo}
                    variant='contained'
                    color='secondary'
                    style={{
                      fontSize: "1.5rem",
                      margin: "0rem 0rem 2rem 0rem",
                      maxwidth: "100%",
                      width: 360,
                    }}
                  >
                    Update Infromation
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {/* </Paper> */}
    </Container>
  );
};

export default ShowInfo;

