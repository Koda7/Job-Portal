import React from "react";
import axios from "axios";
import { FcDocument } from "react-icons/fc";
import swal from "sweetalert";
import {
  Chip,
  TextField,
  MenuItem,
  Button,
  Container,
  Grid,
  Paper,
  InputLabel,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { FcCalendar } from "react-icons/fc";

const classes = {
  heading: {
    margin: "0rem",
    fontSize: "3rem",
    fontFamily: "'Work Sans', sans-serif",
    // fontWeight: 400,
    color: "#002147",
    paddingLeft: "2rem",
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
  applicantTitle: {
    display: "inline-block",
    fontSize: "2rem",
    fontFamily: "'Rosario', sans-serif",
    fontWeight: 600,
  },
  applicantRating: {
    display: "inline-block",
    paddingLeft: "0.4rem",
    fontSize: "1.3rem",
    fontWeight: "bold",
    fontFamily: "'Rosario', sans-serif",
    color: "green",
  },
};

class ShowJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortChoice: "name",
      order: 1,
      applicants: [],
      gotResponse: false,
      leftPositions: this.props.job.numPos - this.props.job.gotBy.length,
    };
    this.displayApplicants = this.displayApplicants.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.rejectleft = this.rejectLeft.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8080/jobApplicants", {
        jobApplicants: this.props.job.appliedBy,
      })
      .then((response) => {
        let applicantsInfo = [];
        this.props.job.appliedBy.forEach((application) => {
          if (application.status !== "Rejected") {
            let index = response.data.applicantsInfo.findIndex(
              (x) => x.userId === application.id
            );
            applicantsInfo.push(
              Object.assign(response.data.applicantsInfo[index], application)
            );
          }
        });
        this.setState({
          applicants: applicantsInfo,
          gotResponse: true,
        });
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Failed to retrieve Applicants",
          icon: "error",
        });
        if (err.response.status === 401) this.props.history.push("/login");
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  downloadFile(filename, file) {
    filename = filename.replace(/ /g, "");
    console.log(filename);
    axios({
      method: "POST",
      url: "http://localhost:8080/getFile2",
      responseType: "blob",
      data: { filename },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Download Failed",
          icon: "error",
        });
        if (err.response.status === 401) this.props.history.push("/login");
      });
  }

  setStatus(status, index) {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8080/setStatus", {
        jobId: this.props.job._id,
        applicationId: this.state.applicants[index]._id,
        status,
        userId: this.state.applicants[index].userId,
      })
      .then((response) => {
        if (response.data === "Success") {
          let updatedApplicationsArray = this.state.applicants;
          updatedApplicationsArray[index].status = status;

          this.setState({
            applicants: updatedApplicationsArray,
          });
          if (status === "Accepted") {
            this.props.job.gotBy.push(this.state.applicants[index].userId);
            if (this.state.leftPositions === 1) {
              this.rejectLeft();
              swal({
                title: "All Positions Filled",
                icon: "success",
              });
            }
            this.setState((prevValues) => ({
              leftPositions: prevValues.leftPositions - 1,
            }));
          }
        } else {
          swal({
            title: response.data,
            icon: "error",
          });
          let updatedApplicationsArray = this.state.applicants;
          updatedApplicationsArray[index].status = "Rejected";
          this.setState({
            applicants: updatedApplicationsArray,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Failed to set Status",
          icon: "error",
        });
        if (err.response.status === 401) this.props.history.push("/login");
      });
  }

  displayButtons(userId) {
    let index = this.state.applicants.findIndex(
      (applicant) => applicant.userId === userId
    );
    let appStatus = this.state.applicants[index].status;
    let isShortList = false;
    let isFinal = "";
    if (appStatus === "Applied") isShortList = true;
    if (appStatus === "Accepted" || appStatus === "Rejected")
      isFinal = appStatus;
    if (isFinal !== "") {
      let bgcolor = "#ff0000";
      if (appStatus === "Accepted") bgcolor = "#4BCA81";
      return (
        <div>
          <Button
            disabled
            variant='contained'
            style={{
              background: bgcolor,
              color: "white",
              padding: "0.5rem 1rem",
              fontWeight: "bold",
            }}
          >
            {isFinal}
          </Button>
        </div>
      );
    } else {
      if (isShortList) {
        return (
          <div>
            <Button
              variant='contained'
              color='primary'
              style={{ padding: "0.5rem 1.5rem" }}
              onClick={() => this.setStatus("ShortListed", index)}
            >
              ShortList
            </Button>
            <Button
              variant='contained'
              style={{
                background: "#ff0000",
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem 1.5rem",
              }}
              onClick={() => this.setStatus("Rejected", index)}
            >
              Reject
            </Button>
          </div>
        );
      } else
        return (
          <div>
            <Button
              variant='contained'
              style={{
                backgroundColor: "#4BCA81",
                color: "white",
                padding: "0.5rem 1.5rem",
              }}
              onClick={() => this.setStatus("Accepted", index)}
            >
              Accept
            </Button>
            <Button
              variant='contained'
              style={{
                background: "#ff0000",
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem 1.5rem",
              }}
              onClick={() => this.setStatus("Rejected", index)}
            >
              Reject
            </Button>
          </div>
        );
    }
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  displayApplicants() {
    return this.state.applicants
      .sort((a, b) => {
        let retValue;
        if (this.state.sortChoice === "name")
          retValue = a.name.localeCompare(b.name);
        else if (this.state.sortChoice === "rating")
          retValue = a.rating - b.rating;
        else
          retValue =
            new Date(a.dateOfApplication) - new Date(b.dateOfApplication);
        return retValue * parseInt(this.state.order);
      })
      .map((applicant, index) => {
        //         Name, Skills, Date of
        // Applica on, Educa on, SOP, Ra ng, Stage of Applica on in view.
        let statusColor = "#ff0000";
        if (applicant.status === "Applied") statusColor = "#3f51b4";
        if (applicant.status === "ShortListed") statusColor = "#f50057";
        if (applicant.status === "Accepted") statusColor = "#4BCA81";
        var dateFormat = require("dateformat");
        let applicationDate = new Date(applicant.dateOfApplication);
        const formattedApplicationDate = dateFormat(
          applicationDate,
          "dddd, mmmm dS, yyyy"
        );
        return (
          <Grid item xs={12} key={index}>
            <Grid
              container
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  paddingLeft: "1rem",
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
                  justify='space-around'
                >
                  <Grid item xs={6}>
                    <Grid
                      container
                      direction='column'
                      style={{
                        width: "100%",
                      }}
                      spacing={1}
                    >
                      <Grid
                        item
                        xs={10}
                        style={{
                          fontFamily: "'Baloo Thambi 2', curisve",
                          color: statusColor,
                        }}
                      >
                        {applicant.status}
                      </Grid>
                      <Grid item xs={10}>
                        <div style={classes.applicantTitle}>
                          {this.titleCase(applicant.name)}
                        </div>{" "}
                        <div style={classes.applicantRating}>
                          <Rating
                            name={applicant.userId}
                            defaultValue={applicant.rating}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </Grid>
                      <Grid item xs={10}>
                        {applicant.skills.length === 0 ? (
                          <Chip
                            key={index}
                            label='No Skills Given'
                            clickable
                            color='primary'
                            style={{ fontSize: 10 }}
                          />
                        ) : (
                          applicant.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill.skillName}
                              clickable
                              color='primary'
                              style={{ fontSize: 10 }}
                            />
                          ))
                        )}
                      </Grid>

                      <Grid item xs={10}>
                        <InputLabel
                          style={{
                            fontFamily: "'Baloo Thambi 2', curisve",
                            fontSize: "1.2rem",
                          }}
                        >
                          Education
                          <ul style={{ margin: "0rem", paddingLeft: "1rem" }}>
                            {applicant.education.length === 0 ? (
                              <li style={{ margin: "0.5rem" }}>
                                No instance given
                              </li>
                            ) : (
                              applicant.education.map((instance, index) => {
                                let secondPart = "Present";
                                if (instance.endYear !== 0)
                                  secondPart = instance.endYear;
                                return (
                                  <li key={index} style={{ margin: "0.5rem" }}>
                                    {this.titleCase(instance.instituteName)}{" "}
                                    {`(${instance.startYear}-${secondPart})`}
                                  </li>
                                );
                              })
                            )}
                          </ul>
                        </InputLabel>
                      </Grid>
                      <Grid item xs={9}>
                        <InputLabel
                          style={{ display: "inline", fontWeight: "bold" }}
                        >
                          SOP: {"   "}
                        </InputLabel>
                        <span style={{ fontFamily: "'Work Sans'" }}>
                          {applicant.SOP}
                        </span>
                      </Grid>
                      <Grid item xs={10}>
                        <InputLabel
                          style={{
                            fontSize: "1rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <FcCalendar /> {formattedApplicationDate}
                        </InputLabel>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid
                      container
                      alignContent='center'
                      justify='center'
                      alignItems='center'
                      style={{ height: "100%" }}
                    >
                      {this.displayButtons(applicant.userId)}
                      <Button
                        style={{
                          margin: "1rem",
                          padding: "0.7rem",
                          color: "#1464F4	",
                          border: "3px  solid #1D7CF2",
                          borderRadius: 0,
                          width: 200,
                          backgroundColor: "#FFF",
                          maxWdith: "100%",
                        }}
                        component='label'
                        disabled={applicant.resumePath === ""}
                        onClick={() =>
                          this.downloadFile(
                            applicant.userId + applicant.resumePath,
                            applicant.resumePath
                          )
                        }
                      >
                        {applicant.resumePath === ""
                          ? "No Resume"
                          : "Download Resume"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      });
  }

  rejectLeft() {
    let newApplications = this.state.applicants;
    newApplications.forEach((application, index) => {
      if (application.status !== "Accepted") {
        application.status = "Rejected";
        this.setStatus("Rejected", index);
      }
      return application;
    });
    this.setState({ applicants: newApplications });
  }

  render() {
    if (!this.state.gotResponse)
      return <h1 style={classes.heading}>Loading..</h1>;
    else if (this.state.applicants.length === 0) {
      return (
        <Container>
          <Button
            style={{
              position: "absolute",
              left: 0,
              top: 90,
              background: "transparent",
              fontSize: "1.2rem",
            }}
            onClick={this.props.back}
            variant='contained'
          >
            Back
          </Button>
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
        </Container>
      );
    } else
      return (
        <Container
          style={{
            width: "100vw",
            padding: 0,
            maxWidth: 1400,
            paddingTop: "3rem",
          }}
        >
          <Button
            style={{
              position: "absolute",
              left: 0,
              top: 90,
              background: "transparent",
              fontSize: "1.2rem",
            }}
            onClick={this.props.back}
            variant='contained'
          >
            Back
          </Button>
          <h1 style={classes.heading}>Applicants</h1>
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
                        value={this.state.sortChoice}
                        onChange={this.handleChange}
                      >
                        <MenuItem key='name' value='name'>
                          Name
                        </MenuItem>
                        <MenuItem
                          key='dateOfApplication'
                          value='rdateOfApplication'
                        >
                          Application Date
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
                        value={this.state.order}
                        onChange={this.handleChange}
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
                  padding: "0rem 1rem",
                  background: "transparent",
                }}
              >
                <div style={classes.sfheading}>
                  Positions Left: {this.state.leftPositions}
                </div>
                <div
                  style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                    width: "100%",
                  }}
                >
                  <Grid
                    container
                    style={{
                      paddingTop: "0rem",
                      width: "100%",
                    }}
                    spacing={1}
                  >
                    {this.displayApplicants()}
                  </Grid>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      );
  }
}

export default ShowJobs;
