import "../../fonts/Fonts.css";
import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { FaGoogle } from "react-icons/fa";
import swal from "sweetalert";
import {
  Box,
  Grid,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  Container,
  FormControl,
  FormHelperText,
  Button,
} from "@material-ui/core/";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    // backgroundImage: "linear-gradient(315deg, #fbb034 0%, #ffdd00 74%)",
    backgroundColor: "white",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    textAlign: "center",
  },
  input: {
    marginTop: "0.5rem",
    marginBottom: "1rem",
    width: "100%",
    margin: "auto",
  },
  heading: {
    fontSize: "2.5rem",
    fontFamily: "'Baloo Thambi 2', cursive ",
  },
}));

const Register = (props) => {
  const classes = useStyles();
  const [profileInfo, setProfileInfo] = useState({
    profileType: "",
    username: "",
    password: "",
  });
  const [areFieldsEmpty, setFields] = useState({
    profileType: false,
    username: false,
    password: false,
  });
  const [passwordError, setPasswordError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfileInfo((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  }

  function googleSignUp() {
    setFields((prevValues) => {
      return {
        ...prevValues,
        profileType: profileInfo.profileType === "" ? true : false,
      };
    });
    if (profileInfo.profileType === "") return;
    // window.location.href = "http://localhost:8080/auth/google";
    let path = "http://localhost:8080/registerType/" + profileInfo.profileType;
    window.location.href = path;
  }

  function addUser() {
    setFields((prevValues) => {
      return {
        username: profileInfo.username === "" ? true : false,
        password: profileInfo.password === "" ? true : false,
        profileType: profileInfo.profileType === "" ? true : false,
      };
    });
    if (
      profileInfo.username === "" ||
      profileInfo.password === "" ||
      profileInfo.profileType === "" ||
      passwordError
    )
      return;
    axios({
      method: "post",
      url: "http://localhost:8080/register",
      headers: { "Content-Type": "application/json" },
      data: profileInfo,
    })
      .then((response) => {
        if (response.data === "Success") {
          props.history.push("/registerInfo");
        } else {
          swal({
            title: "Registration Failed",
            icon: "error",
          });
          console.log(response.data);
          props.history.push("/register");
        }
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Registration Failed",
          icon: "error",
        });
        props.history.push("/register");
      });
  }
  const [gotResponse, setGotResponse] = useState(false);
  axios.defaults.withCredentials = true;
  axios
    .get("http://localhost:8080/isLoggedIn")
    .then((response) => {
      setGotResponse(true);
      if (response.data === "Yes") props.history.push("/user");
    })
    .catch((err) => setGotResponse(true));
  if (gotResponse)
    return (
      <Box className={classes.root}>
        <NavBar />

        <Container
          maxwidth='xs'
          style={{
            width: 500,
            maxWidth: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Grid container className={classes.container}>
            <h1 className={classes.heading}>Register</h1>
            <Grid item xs={12} className={classes.field}>
              <FormControl
                error={areFieldsEmpty.profileType}
                style={{ alignItems: "center" }}
              >
                <RadioGroup
                  row
                  style={{ justifyContent: "center" }}
                  name='profileType'
                  value={profileInfo.profileType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value='JA'
                    control={<Radio />}
                    label='Job Applicant'
                  />
                  <FormControlLabel
                    value='R'
                    control={<Radio />}
                    label='Recruiter'
                  />
                </RadioGroup>
                {areFieldsEmpty.profileType ? (
                  <FormHelperText>Please Select Type</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextField
                error={areFieldsEmpty.username}
                inputProps={{
                  autoComplete: "new-password",
                }}
                className={classes.input}
                name='username'
                label='Username'
                value={profileInfo.username}
                onChange={handleChange}
                helperText='Please Enter username'
              ></TextField>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextField
                error={areFieldsEmpty.password}
                className={classes.input}
                name='password'
                label='Password'
                value={profileInfo.password}
                type='password'
                onChange={handleChange}
                helperText='Please Enter Password'
              ></TextField>
            </Grid>
            <Grid item xs={12} className={classes.field}>
              <TextField
                error={passwordError}
                className={classes.input}
                label='Confrim Password'
                type='password'
                onChange={(e) =>
                  setPasswordError(e.target.value !== profileInfo.password)
                }
                helperText={passwordError ? "Passwords don't match" : null}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={addUser}
                style={{
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  margin: "20px 0px 20px 0px",
                }}
              >
                Submit
              </Button>

              <Button
                onClick={googleSignUp}
                style={{
                  width: "100%",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  background: "#f14233",
                  color: "white",
                }}
              >
                <FaGoogle
                  style={{
                    fontSize: "1.5rem",
                    paddingRight: "1rem",
                  }}
                />
                Sign In With Google
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  else return <div>Loading...</div>;
};

export default Register;
