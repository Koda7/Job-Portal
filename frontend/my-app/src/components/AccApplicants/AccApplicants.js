import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, MenuItem, Container, Grid, Paper } from "@material-ui/core";
import Employee from "../Employee/Employee";
import { FcDocument } from "react-icons/fc";

const classes = {
  heading: {
    margin: "1rem 0rem",
    fontSize: "3rem",
    fontFamily: "'Work Sans', sans-serif",
    // fontWeight: 400,
    color: "#002147",
  },
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

const AccApplications = (props) => {
  const [employees, setEmployees] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
  const [sortChoice, setSortChoice] = useState("name");
  const [order, setOrder] = useState("1");

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8080/employeeInfo", { jobList: props.jobs })
      .then((response) => {
        setEmployees(response.data.employees);
        setGotResponse(true);
      })
      .catch((err) => {
        console.log(err);
        setGotResponse(true);
        if (err.response.status === 401) props.history.push("/login");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const updateRating = (rating, userId) => {
    let tempArr = employees;
    tempArr.forEach((user, index) => {
      if (user.userId === userId) {
        tempArr[index].rating = Number(rating);
      }
    });
    setEmployees(tempArr);
  };

  const displayEmployees = () => {
    return employees
      .sort((a, b) => {
        let retValue;
        if (sortChoice === "name" || sortChoice === "title")
          retValue = a[sortChoice].localeCompare(b[sortChoice]);
        else if (sortChoice === "rating") retValue = a.rating - b.rating;
        else
          retValue =
            new Date(a.dateOfApplication) - new Date(b.dateOfApplication);
        return retValue * parseInt(order);
      })
      .map((employee) => {
        return (
          <Employee
            key={employee.userId}
            employee={employee}
            updateRating={updateRating}
          />
        );
      });
  };
  if (!gotResponse) return <h1 style={classes.heading}>Loading...</h1>;
  else {
    if (employees.length === 0)
      return (
        <Grid
          container
          align='center'
          justify='center'
          style={{ marginTop: "5rem", height: "100%" }}
          alignItems='center'
        >
          <Grid item xs={12}>
            <FcDocument style={{ fontSize: "10rem", display: "block" }} />
          </Grid>
          <Grid item xs={12}>
            <h1
              style={{
                fontFamily: "'Baloo Thambi 2'",
                fontSize: "3.5rem",
                fontWeight: 100,
                margin: "0rem",
              }}
            >
              No Accepted Applicants
            </h1>
          </Grid>
        </Grid>
      );
    else
      return (
        <Container
          style={{
            width: "100vw",
            padding: 0,
            maxWidth: 1400,
            paddingTop: "3rem",
          }}
        >
          <h1 style={classes.heading}>Accepted Applicants</h1>
          <Grid
            container
            spacing={3}
            justify='flex-end'
            style={{ marginTop: "2rem" }}
          >
            <Grid item xs={3}>
              <Paper elevation={3} style={{ padding: "0rem" }}>
                <div style={classes.sfheading}>Sort and Filter</div>

                <Grid
                  container
                  direction='column'
                  justify='center'
                  alignItems='center'
                  style={{ padding: "0rem 1rem" }}
                >
                  <Grid
                    container
                    direction='column'
                    style={{ width: "80%", paddingBottom: "2rem" }}
                  >
                    <Grid item style={classes.field}>
                      <TextField
                        fullWidth
                        name='sortChoice'
                        select
                        label='Sort By'
                        value={sortChoice}
                        onChange={(e) => setSortChoice(e.target.value)}
                      >
                        <MenuItem key='name' value='name'>
                          Name
                        </MenuItem>
                        <MenuItem key='title' value='title'>
                          Job Title
                        </MenuItem>
                        <MenuItem key='dateOfJoining' value='dateOfJoining'>
                          Joining Date
                        </MenuItem>
                        <MenuItem key='rating' value='rating'>
                          Rating
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item style={classes.field}>
                      <TextField
                        fullWidth
                        name='order'
                        select
                        label='Order'
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                      >
                        <MenuItem key='ascending' value='1'>
                          Ascending
                        </MenuItem>
                        <MenuItem key='descending' value='-1'>
                          Descending
                        </MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <Paper
                elevation={0}
                style={{
                  background: "transparent",
                  padding: "0rem 1rem 1rem",
                  maxHeight: "65vh",
                  overflowY: "auto",
                }}
              >
                <Grid
                  container
                  style={{
                    paddingTop: "0rem",
                  }}
                  spacing={1}
                >
                  {displayEmployees()}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      );
  }
};

export default AccApplications;
