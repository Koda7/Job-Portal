import React from "react";
import axios from "axios";
import Application from "../Application/Application";
import { Container, Paper, Grid } from "@material-ui/core";
import { FcDocument } from "react-icons/fc";

const classes = {
  heading: {
    margin: "3rem 0rem",
    fontSize: "3rem",
    fontFamily: "'Work Sans', sans-serif",
    color: "#002147",
  },
};

class MyApplications extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      applications: [],
    };
    this.displayApplications = this.displayApplications.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8080/isLoggedIn")
      .then((response) => {
        if (response.data !== "Yes") {
          this.props.history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login");
      });
    axios.get("http://localhost:8080/myApplications").then((response) => {
      this.setState({
        applications: response.data.foundJobs,
      });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  displayApplications() {
    // Title, date of joining, salary per month, name of recruiter.
    // Date of joining?
    return this.state.applications.map((application) => {
      return (
        <Application
          key={application._id}
          application={application}
          userId={this.props.userId}
        />
      );
    });
  }
  render() {
    // return (
    //   <div>
    //     <h1>My Applications</h1>
    //     {this.displayApplications()}
    //   </div>
    // );
    if (this.state.applications.length === 0)
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
              No Applications Yet
            </h1>
          </Grid>
        </Grid>
      );
    else
      return (
        <Container style={{ width: "100vw", padding: 0, maxWidth: 1400 }}>
          <Grid container style={{ marginTop: "0rem" }}>
            <Paper
              elevation={0}
              style={{
                background: "transparent",
                width: "100%",

                padding: "0rem 0rem 2rem 2rem",
              }}
            >
              <h1 style={classes.heading}>My Applications</h1>

              <Grid
                container
                direction='row'
                spacing={3}
                style={{ width: "100%", maxHeight: "60vh", overflowY: "auto" }}
              >
                {this.displayApplications()}
              </Grid>
            </Paper>
          </Grid>
        </Container>
      );
  }
}

export default MyApplications;
