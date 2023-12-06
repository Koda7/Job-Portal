import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";
import Fields from "../Fields/Fields";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  TextField,
  Paper,
  Container,
  MenuItem,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: "#222831",
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const [profileType, setProfileType] = useState("");
  function handleChange(event) {
    setProfileType(event.target.value);
  }

  return (
    <React.Fragment>
      <Box className={classes.root}>
        <NavBar />
        <h1>Login Page!</h1>
        <Container>
          <Paper className={classes.paper}>
            <form noValidate autoComplete='off'>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='profileType'
                    select
                    label='Type'
                    value={profileType}
                    onChange={handleChange}
                    helperText='Please select your type'
                  >
                    <MenuItem key='JobApplicant' value='JobApplicant'>
                      Job Applicant
                    </MenuItem>
                    <MenuItem key='Recruiter' value='Recruiter'>
                      Recruiter
                    </MenuItem>
                  </TextField>
                  <Fields type={profileType} />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default Login;
