import React, { useState } from "react";
import { Rating } from "@material-ui/lab";
import axios from "axios";
import { Grid, InputLabel, Paper, Button } from "@material-ui/core";
import { FcCalendar } from "react-icons/fc";

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

const Application = (props) => {
  let status;
  let joiningDate;
  let userRating;

  const updateJobRating = (event) => {
    let value = event.target.value;
    axios
      .post("http://localhost:8080/updateJobRating", {
        jobId: props.application._id,
        userId: props.userId,
        rating: value,
      })
      .then((response) => {
        setRating(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let durationString = "Indefinite";
  if (props.application.duration === 1) durationString = "1 month";
  else if (props.application.duration >= 2)
    durationString = props.application.duration + " months";
  props.application.appliedBy.forEach((user) => {
    if (user.id === props.userId) {
      status = user.status;
      if (status === "Accepted") {
        joiningDate = user.dateOfJoining;
        userRating = user.rating;
      }
    }
  });
  const [rating, setRating] = useState(userRating);
  let dateOfJoining = "Not Applicable";
  if (status === "Accepted") {
    let dateFormat = require("dateformat");
    dateOfJoining = dateFormat(joiningDate, "dddd, mmmm dS, yyyy");
  }

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }
  console.log(props.application.status);
  let statusColor = "#ff0000";
  if (status === "Applied") statusColor = "#3f51b4";
  if (status === "ShortListed") statusColor = "#f50057";
  if (status === "Accepted") statusColor = "#4BCA81";

  return (
    // <div>
    //   <p>
    //     {props.application.title} {props.application.duration}{" "}
    //     {props.application.salary} {props.application.recruiterName} {status}{" "}
    //     {dateOfJoining}
    //   </p>
    //   {status === "Accepted" ? (
    //     <Rating
    //       name={props.application._id}
    //       value={rating}
    //       onChange={updateJobRating}
    //     />
    //   ) : null}
    // </div>
    <Grid item xs={6}>
      <Grid
        key={props.application._id}
        container
        style={{
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          style={{
            width: "100%",
            paddingTop: "1.5rem",
            paddingLeft: "2rem",
            paddingBottom: "1.5rem",
          }}
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
                    {titleCase(props.application.title)}
                  </div>{" "}
                  {status === "Accepted" ? (
                    <div style={classes.jobRating}>
                      <Rating
                        name={props.application._id}
                        value={rating}
                        onChange={updateJobRating}
                        precision={0.5}
                      />
                    </div>
                  ) : null}
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
                    {props.application.salary === 0
                      ? "Unpaid"
                      : `₹ ${props.application.salary} /- month`}
                  </div>
                </Grid>
                <Grid item>
                  <InputLabel
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "1rem",
                      display: "inline",
                    }}
                  >
                    By {titleCase(props.application.recruiterName)},
                  </InputLabel>
                  <InputLabel
                    style={{
                      display: "inline",
                      marginLeft: "0.5rem",
                      fontSize: "1.2rem",
                      fontFamily: "'Baloo Thambi 2', cursivef",
                    }}
                  >
                    {durationString}
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
                    <FcCalendar /> {dateOfJoining}
                  </InputLabel>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid
                container
                align='center'
                justify='center'
                alignItems='center'
                style={{ height: "100%" }}
              >
                <Button
                  variant='contained'
                  style={{
                    backgroundColor: statusColor,
                    color: "white",
                    minWidth: 120,
                    fontSize: "1rem",
                    marginRight: "2rem",
                  }}
                  disabled
                >
                  {status}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Application;
