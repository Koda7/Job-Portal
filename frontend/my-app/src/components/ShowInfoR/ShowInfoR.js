import React, { useState } from "react";
import swal from "sweetalert";
import {
  Button,
  Container,
  InputAdornment,
  Grid,
  Paper,
  IconButton,
  InputBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import axios from "axios";
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

const ShowInfoR = (props) => {
  const classes = useStyles();
  axios.defaults.withCredentials = true;
  const [userInfo, setUserInfo] = useState(props.userInfo);
  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    contactNo: false,
    bio: false,
  });
  const [errFields, setErrFields] = useState({
    name: false,
    email: false,
    contactNo: false,
  });
  const updateFullInfo = () => {
    let nameEmpty = userInfo.name === "";
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validEmail = emailRegExp.test(String(userInfo.email).toLowerCase());
    const contactRegExp = /^[0-9]+$/;
    let validContact = true;
    validContact = userInfo.contactNo.length === 10;
    validContact =
      contactRegExp.test(String(userInfo.contactNo)) && validContact;
    setErrFields({
      name: nameEmpty,
      email: !validEmail,
      contactNo: !validContact,
    });
    if (nameEmpty || !validEmail || !validContact) return;
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
          title: "Could not update Information",
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

  const updateIsEditable = (field) => {
    setIsEditable((prevValues) => {
      return {
        ...prevValues,
        [field]: !prevValues[field],
      };
    });
  };

  return (
    <Container>
      <Grid container justify='center'>
        <Grid item xs={10}>
          <h1 className={classes.heading}>PROFILE</h1>
          <Paper elevation={3} style={{ padding: "2rem 1rem" }}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container direction='row' justify='center'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Name</h1>
                  </Grid>
                  <Grid item xs={7} align='center'>
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
                <Grid container direction='row' justify='center'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Email</h1>
                  </Grid>
                  <Grid item xs={7}>
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
                <Grid container direction='row' justify='center'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Contact Number</h1>
                  </Grid>
                  <Grid item xs={7}>
                    <h1 className={classes.info}>
                      <InputBase
                        disabled={!isEditable.contactNo}
                        fullWidth
                        type='number'
                        style={{
                          color: "#19456b",
                          fontSize: "1.3rem",
                        }}
                        name='contactNo'
                        value={userInfo.contactNo}
                        onChange={(e) =>
                          isEditable.contactNo ? updateInfo(e) : null
                        }
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => updateIsEditable("contactNo")}
                            >
                              {isEditable.contactNo ? (
                                <DoneIcon />
                              ) : (
                                <EditIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      ></InputBase>
                    </h1>
                    {errFields.contactNo ? (
                      <div className={classes.errorText}>
                        Contact Number not valid
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction='row' justify='center'>
                  <Grid item xs={3}>
                    <h1 className={classes.label}>Bio</h1>
                  </Grid>
                  <Grid item xs={7}>
                    <h1 className={classes.info}>
                      <InputBase
                        disabled={!isEditable.bio}
                        fullWidth
                        autoFocus
                        rows={3}
                        rowsMax={6}
                        required
                        margin='dense'
                        type='text'
                        inputProps={{ maxLength: 250 }}
                        multiline
                        style={{
                          color: "#19456b",
                          fontSize: "1.3rem",
                        }}
                        name='bio'
                        value={userInfo.bio}
                        onChange={(e) =>
                          isEditable.bio ? updateInfo(e) : null
                        }
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton onClick={() => updateIsEditable("bio")}>
                              {isEditable.bio ? <DoneIcon /> : <EditIcon />}
                            </IconButton>
                          </InputAdornment>
                        }
                      ></InputBase>
                    </h1>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
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
    </Container>
  );
};

export default ShowInfoR;
