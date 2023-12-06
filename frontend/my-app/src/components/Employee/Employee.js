import React, { useState } from "react";
import { Rating } from "@material-ui/lab";
import { Grid, Paper, InputLabel } from "@material-ui/core";
import { FcCalendar } from "react-icons/fc";
import axios from "axios";

const classes = {
  field: {
    margin: "1rem 0rem",
  },
  sfheading: {
    background: "#2874ef",
    color: "white",
    textAlign: "center",
    fontSize: "1.5rem",
    padding: "1rem 0rem",
    marginBottom: "1rem",
    fontFamily: "'Baloo Thambi 2', cursive",
  },
  sliderheading: {
    fontSize: "0.9rem",
    fontWeight: 100,
    margin: "0rem",
    marginBottom: "0.5rem",
    marginTop: "0.5rem",
    color: "#57575f",
  },
  salaryRange: {
    fontSize: "1.4rem",
    marginTop: "0.3rem",
    textAlign: "center",
  },
  jobTitle: {
    display: "inline-block",
    fontSize: "2rem",
    fontFamily: "'Rosario', sans-serif",
    fontWeight: 600,
  },
  jobRating: {
    display: "inline-block",
    paddingLeft: "0.4rem",
    fontSize: "1.3rem",
    fontWeight: "bold",
    fontFamily: "'Rosario', sans-serif",
    color: "green",
  },
};

const Employee = (props) => {
  const [rating, setRating] = useState(props.employee.rating);
  let dateFormat = require("dateformat");
  let formattedJoiningDate = "Not available";
  if (props.employee.dateOfJoining) {
    let joiningDate = new Date(props.employee.dateOfJoining);
    formattedJoiningDate = dateFormat(joiningDate, "dddd, mmmm dS, yyyy");
  }

  const updateRating = (event) => {
    let newRating = event.target.value;
    let userId = props.employee.userId;
    axios
      .post("http://localhost:8080/updateRating", { userId, newRating })
      .then((response) => {
        setRating(newRating);
        props.updateRating(newRating, userId);
      })
      .catch((err) => {
        console.log(err);
      });
    setRating(newRating);
  };

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  return (
    <Grid item xs={6}>
      <Grid
        container
        style={{
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          style={{ width: "100%", paddingTop: "1rem", paddingLeft: "2rem" }}
        >
          <Grid
            container
            style={{
              width: "100%",
              paddingTop: "1rem",
              paddingLeft: "2rem",
              paddingBottom: "1rem",
            }}
          >
            <Grid item xs={9}>
              <Grid
                container
                direction='column'
                style={{
                  width: "100%",
                }}
              >
                {" "}
                <Grid item xs={10}>
                  <div style={classes.jobTitle}>
                    {titleCase(props.employee.name)}
                  </div>
                </Grid>
                <Grid item>
                  <div style={classes.jobRating}>
                    <Rating
                      name={props.employee.userId}
                      value={Number(rating)}
                      onChange={updateRating}
                      precision={0.5}
                    />
                  </div>
                </Grid>
                <Grid item>
                  <div
                    style={{
                      marginLeft: "0.5rem",
                      marginBottom: "0.5rem",
                      fontSize: "1.2rem",
                      fontFamily: "'Rosario', sans-serif",
                    }}
                  >
                    {titleCase(props.employee.title)}
                  </div>
                </Grid>
                <Grid item>
                  <InputLabel
                    style={{
                      fontSize: "1rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {props.employee.jobType}
                  </InputLabel>
                </Grid>
                <Grid item style={{ marginTop: "0.5rem" }}>
                  <InputLabel
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "1rem",
                      display: "inline",
                    }}
                  >
                    <FcCalendar /> {formattedJoiningDate}
                  </InputLabel>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Employee;
