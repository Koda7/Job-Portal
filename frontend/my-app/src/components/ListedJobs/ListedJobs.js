import React from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DateFnsUtils from "@date-io/date-fns";
import { ImStopwatch } from "react-icons/im";
import { FcCalendar, FcDocument } from "react-icons/fc";
import swal from "sweetalert";
import "../../fonts/Fonts.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import {
  InputLabel,
  TextField,
  Button,
  Dialog,
  Grid,
  Paper,
  Container,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

const classes = {
  heading: {
    margin: "3rem 0rem",
    fontSize: "3rem",
    fontFamily: "'Work Sans', sans-serif",
    color: "#002147",
    textAlign: "center",
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

class ListedJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myJobs: [],
      editOpen: false,
      deleteOpen: false,
      currJob: {},
      appErr: false,
      posErr: false,
      gotResponse: false,
    };
    this.displayJobs = this.displayJobs.bind(this);
    this.editJob = this.editJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.deleteClose = this.deleteClose.bind(this);
    this.updateJob = this.updateJob.bind(this);
  }
  componentDidMount() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8080/myJobs", {
        listOfJobs: this.props.listedJobs,
      })
      .then((response) => {
        let activeJobs = response.data.foundJobs.filter(
          (job) => job.numPos - job.gotBy.length
        );
        this.setState({ myJobs: activeJobs, gotResponse: true });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) this.props.history.push("/login");
      });
  }

  handleEdit(event) {
    this.setState((prevState) => ({
      currJob: {
        ...prevState.currJob,
        [event.target.name]: event.target.value,
      },
    }));
  }

  handleEditClose() {
    this.setState({
      editOpen: false,
      appErr: false,
      posErr: false,
    });
  }

  deleteJob() {
    let jobGone = this.state.currJob;
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:8080/deleteJob", { job: jobGone })
      .then((response) => {
        swal({
          title: "Job deleted from database",
          icon: "success",
        });
        const updatedJobs = this.state.myJobs.filter((job) => {
          return job._id !== jobGone._id;
        });
        this.setState({ myJobs: updatedJobs });
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Could not delete Job",
          icon: "error",
        });
      });
  }

  updateJob() {
    this.setState({
      appErr: this.state.currJob.maxApp < this.state.currJob.numPos,
      posErr:
        this.state.currJob.numPos <= 0 ||
        this.state.currJob.numPos < this.state.currJob.gotBy.length,
    });
    if (
      this.state.currJob.maxApp < this.state.currJob.numPos ||
      this.state.currJob.numPos <= 0 ||
      this.state.currJob.numPos < this.state.currJob.gotBy.length
    )
      return;
    const updatedJobs = this.state.myJobs.map((job) => {
      if (job._id === this.state.currJob._id) {
        return this.state.currJob;
      } else {
        return job;
      }
    });
    this.setState({ myJobs: updatedJobs });
    this.handleEditClose();
    axios.default.withCredentials = true;
    axios
      .post("http://localhost:8080/updateJob", { job: this.state.currJob })
      .then((response) => {
        swal({
          title: "Updated Job",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Failed to Apply",
          icon: "error",
        });
      });
  }

  editJob(job) {
    this.setState({ currJob: job, editOpen: true });
  }
  callDelete(job) {
    this.setState({ currJob: job, deleteOpen: true });
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  displayJobs() {
    // Title, Date of pos ng, Number of Applicants, Maximum Number of
    // Posi ons
    const jobs = this.state.myJobs.filter(
      (job) => job.numPos - job.gotBy.length
    );
    var dateFormat = require("dateformat");
    return jobs.map((job, index) => {
      let postingDate = new Date(job.postingDate);
      const formattedPostingDate = dateFormat(
        postingDate,
        "dddd, mmmm dS, yyyy"
      );
      let deadlineDate = new Date(job.deadlineDate);
      const formattedDeadlineDate = dateFormat(
        deadlineDate,
        "dddd, mmmm dS, yyyy"
      );
      return (
        <Grid item xs={12} lg={6} key={job._id}>
          <Grid
            key={job._id}
            container
            style={{
              width: "100%",
            }}
          >
            <Paper
              elevation={3}
              style={{
                width: "100%",
                cursor: "pointer",
                paddingTop: "1rem",
                paddingLeft: "2rem",
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
                <Grid item xs={8} onClick={() => this.props.showJob(job)}>
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
                        {this.titleCase(job.title)}
                      </div>
                    </Grid>
                    <Grid item>
                      <InputLabel
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "1.3rem",
                          marginTop: "0.5rem",
                          fontFamily: "'Baloo Thambi 2', cursive",
                        }}
                      >
                        Positions left: {job.numPos - job.gotBy.length},
                      </InputLabel>
                    </Grid>
                    <Grid item>
                      <InputLabel
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "1.2rem",
                          marginTop: "0.5rem",
                          fontFamily: "'Baloo Thambi 2', cursive",
                        }}
                      >
                        Applied By: {job.appliedBy.length},
                      </InputLabel>
                    </Grid>
                    <Grid item>
                      <InputLabel
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "1.2rem",
                          fontFamily: "'Baloo Thambi 2', cursivef",
                          marginTop: "0.5rem",
                        }}
                      >
                        Maximum Applications: {job.maxApp}
                      </InputLabel>
                    </Grid>
                    <Grid item style={{ marginTop: "0.5rem" }}>
                      <InputLabel
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "1rem",
                          display: "inline",
                          marginTop: "0.5rem",
                        }}
                      >
                        <FcCalendar /> {formattedPostingDate}
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
                        <ImStopwatch style={{ color: "red" }} />{" "}
                        {formattedDeadlineDate}
                      </InputLabel>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction='row'
                    align='center'
                    justify='center'
                    alignItems='center'
                    style={{ height: "100%" }}
                  >
                    <Grid item>
                      <Button
                        onClick={() => this.editJob(job)}
                        variant='contained'
                        color='primary'
                        style={{
                          color: "white",
                          minWidth: 60,
                          fontSize: "1rem",
                          marginRight: "1rem",
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => this.callDelete(job)}
                        variant='contained'
                        style={{
                          color: "white",
                          background: "red",
                          minWidth: 60,
                          fontSize: "1rem",
                          marginRight: "1rem",
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      );
    });
  }
  deleteClose() {
    this.setState({ deleteOpen: false });
  }
  deleteDialog() {
    return (
      <Dialog
        open={this.state.deleteOpen}
        onClose={this.deleteClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle>
          <span
            style={{
              fontWeight: 600,
              fontFamily: "'Baloo Thambi 2',cursive",
              fontSize: "1.7rem",
            }}
          >
            Delete Job ?
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span style={{ fontSize: "1.2rem" }}>
              This job will be permanently deleted from the database and all the
              accepted applications will be deleted with it
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.deleteClose} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.deleteClose();
              this.deleteJob();
            }}
            color='primary'
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  editDialog() {
    return (
      <Dialog open={this.state.editOpen} onClose={this.handleEditClose}>
        <DialogTitle>
          <span
            style={{
              fontSize: "1.5rem",
              color: "#2874ef",
              fontFamily: "'Work Sans'",
              fontWeight: "bold",
            }}
          >
            Edit Job
          </span>
        </DialogTitle>
        <DialogContent>
          <TextField
            error={this.state.appErr}
            autoFocus
            name='maxApp'
            value={this.state.currJob.maxApp}
            style={{ padding: "1rem 0rem" }}
            onChange={this.handleEdit}
            required
            margin='dense'
            label='No. of Applications'
            type='number'
            helperText={this.state.appErr ? "Invalid value" : null}
            fullWidth
          />
          <TextField
            error={this.state.posErr}
            autoFocus
            name='numPos'
            style={{ padding: "1rem 0rem" }}
            value={this.state.currJob.numPos}
            onChange={this.handleEdit}
            required
            margin='dense'
            label='No. Of Positions'
            helperText={this.state.posErr ? "Invalid value" : null}
            type='number'
            fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              label='Deadline Date'
              style={{ padding: "1rem 0rem" }}
              value={this.state.currJob.deadlineDate}
              onChange={(date) => {
                this.setState((prevState) => ({
                  currJob: {
                    ...prevState.currJob,
                    deadlineDate: date.toISOString(),
                  },
                }));
              }}
              minDateMessage='The deadline has passed for this job'
              disablePast
              format='dd/MM/yyyy hh:mm a'
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleEditClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.updateJob} color='primary'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    if (!this.state.gotResponse)
      return <h1 style={classes.heading}>Loading...</h1>;
    else
      return (
        <Container
          style={{
            width: "100vw",
            padding: 0,
            maxWidth: 1400,
          }}
        >
          {this.state.myJobs.length === 0 ? (
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
                  No Active Jobs Found :(
                </h1>
              </Grid>
            </Grid>
          ) : (
            <Grid container style={{ marginTop: "0rem" }}>
              <Paper
                elevation={0}
                style={{
                  width: "100%",
                  background: "transparent",
                }}
              >
                <h1 style={classes.heading}>Listed Jobs</h1>
                <Grid
                  container
                  direction='row'
                  spacing={3}
                  style={{ width: "100%" }}
                >
                  {this.displayJobs()}
                </Grid>
              </Paper>
              {this.editDialog()}
              {this.deleteDialog()}
            </Grid>
          )}
        </Container>
      );
  }
}

export default ListedJobs;
