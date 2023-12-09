import React from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { withStyles } from "@material-ui/core/styles";
import SearchBar from "material-ui-search-bar";
import { Rating } from "@material-ui/lab";
import { ImStopwatch } from "react-icons/im";
import SearchIcon from "@material-ui/icons/Search";
import swal from "sweetalert";
import {
  TextField,
  MenuItem,
  Slider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  InputLabel,
  Paper,
  Grid,
} from "@material-ui/core";
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

const PrettoSlider = withStyles({
  root: {
    color: "#2874ef",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

class ViewJobs extends React.Component {
  constructor(props) {
    super(props);
    this.maxSalary = 0;
    this.applyingToJob = "";
    this._isMounted = false;
    this.state = {
      currUser: props.user,
      currUserInfo: props.userInfo,
      jobs: [],
      sortChoice: "salary",
      order: 1,
      search: "",
      filterType: "None",
      filterSalary: [0, 0],
      filterDuration: 7,
      openDialog: false,
      searchValue: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.applyToJob = this.applyToJob.bind(this);
    this.sendApplication = this.sendApplication.bind(this);
  }

  handleClose() {
    this.setState({
      openDialog: false,
    });
  }

  sendApplication() {
    const jobSOP = document.getElementById("sop").value;
    const jobId = this.applyingToJob;
    const userId = this.state.currUser._id;
    let applytoJob = {
      jobId,
      userId,
      jobSOP,
    };
    axios.defaults.withCredentials = true;
    axios({
      method: "post",
      url: "http://localhost:8080/applyToJob",
      headers: { "Content-Type": "application/json" },
      data: applytoJob,
    })
      .then((response) => {
        if (response.data === "Success") {
          let jobsTemp = this.state.jobs;
          let userInfoTemp = this.state.currUserInfo;
          for (let i = 0; i < this.state.jobs.length; i++) {
            if (jobsTemp[i]._id === jobId) {
              jobsTemp[i].appliedBy.push({ id: userId, SOP: jobSOP });
            }
          }
          userInfoTemp.appliedJobs.push(jobId);
          this.setState({
            jobs: jobsTemp,
            currUserInfo: userInfoTemp,
          });
        } else {
          swal({
            title: response.data,
            icon: "error",
          });
          console.log(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        swal({
          title: "Failed to Apply",
          icon: "error",
        });
      });
    if (this._isMounted) this.handleClose();
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
    axios
      .get("http://localhost:8080/jobs")
      .then((response) => {
        for (var i = 0; i < response.data.jobs.length; i++) {
          let rating = 0;
          let job = response.data.jobs[i];
          job.appliedBy.forEach((applicant) => {
            if (applicant.status === "Accepted") rating += applicant.rating;
          });
          if (job.gotBy.length !== 0) rating = rating / job.gotBy.length;
          response.data.jobs[i].rating = rating;
          this.maxSalary = Math.max(
            this.maxSalary,
            response.data.jobs[i].salary
          );
        }
        if (this._isMounted)
          this.setState({
            jobs: response.data.jobs,
            filterSalary: [0, this.maxSalary],
          });
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login");
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  valuetext(value) {
    return `${value}`;
  }

  displayFilters() {
    let durationFilters = [];
    let jobTypeFilters = ["None", "Full Time", "Part Time", "Work from Home"];
    let typeFilters = [];
    for (var i = 1; i < 8; i++) {
      durationFilters.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }

    for (i = 0; i < jobTypeFilters.length; i++) {
      typeFilters.push(
        <MenuItem key={i} value={jobTypeFilters[i]}>
          {jobTypeFilters[i]}
        </MenuItem>
      );
    }

    return (
      <Grid container>
        <Grid item xs={12} style={classes.field}>
          <TextField
            fullWidth
            name='filterDuration'
            select
            label='Duration'
            value={this.state.filterDuration}
            onChange={this.handleChange}
          >
            {durationFilters}
          </TextField>
        </Grid>
        <Grid item xs={12} style={classes.field}>
          <TextField
            fullWidth
            name='filterType'
            select
            label='Type'
            value={this.state.filterType}
            onChange={this.handleChange}
          >
            {typeFilters}
          </TextField>
        </Grid>
        <Grid item xs={12} style={classes.field}>
          <InputLabel style={classes.sliderheading}>Price</InputLabel>
          <PrettoSlider
            value={this.state.filterSalary}
            onChange={this.handleSlider}
            min={0}
            max={this.maxSalary}
            step={this.maxSalary / 10}
          />
          <Grid container justify='space-between'>
            <span>₹ {this.state.filterSalary[0]}</span>
            <span>₹ {this.state.filterSalary[1]}</span>
          </Grid>
          {/* <InputLabel style={classes.salaryRange}>
            Min: {this.state.filterSalary[0]} Max: {this.state.filterSalary[1]}
          </InputLabel> */}
        </Grid>
      </Grid>
    );
  }

  applyToJob(jobId) {
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
    axios
      .get("http://localhost:8080/jobs")
      .then((response) => {
        let count = 0;
        for (let i = 0; i < response.data.jobs.length; i++) {
          let job = response.data.jobs[i];
          for (let j = 0; j < job.appliedBy.length; j++) {
            if (
              job.appliedBy[j].id === this.props.user._id &&
              job.appliedBy[j].status !== "Rejected"
            )
              count++;
          }
        }
        console.log(count);
        if (count < 10) {
          this.setState({
            openDialog: true,
          });
          this.applyingToJob = jobId;
        } else {
          swal({
            title: "Applications limit reached",
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/login");
      });
  }

  canApply(job, jobId) {
    let returnButton = false;
    for (let i = 0; i < job.appliedBy.length; i++) {
      if (job.appliedBy[i].id === this.state.currUser._id) returnButton = true;
    }
    if (!returnButton)
      if (
        job.appliedBy.length === job.maxApp ||
        job.gotBy.length === job.numPos
      )
        return (
          <Button
            variant='contained'
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              fontWeight: "bold",
              width: 120,
              fontSize: "1.2rem",
            }}
            disabled
          >
            Full
          </Button>
        );
      else
        return (
          <Button
            color='primary'
            id='applyButton'
            variant='contained'
            onClick={() => this.applyToJob(jobId)}
            style={{ fontWeight: "bold", width: 120, fontSize: "1.2rem" }}
          >
            Apply
          </Button>
        );
    else {
      return (
        <Button
          disabled
          variant='contained'
          style={{
            backgroundColor: "#4BCA81",
            color: "white",
            fontWeight: "bold",
            width: 120,
            fontSize: "1.2rem",
          }}
        >
          Applied
        </Button>
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

  displayJob(job) {
    let durationString = "Indefinite";
    if (job.duration === 1) durationString = "1 month";
    else if (job.duration >= 2) durationString = job.duration + " months";
    var dateFormat = require("dateformat");
    let deadlineDate = new Date(job.deadlineDate);
    const deadlineString = dateFormat(
      deadlineDate,
      "dddd, mmmm dS, yyyy, h:MM TT"
    );
    return (
      <Grid
        key={job._id}
        container
        style={{
          width: "100%",
          paddingTop: "1rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <Paper
          style={{
            width: "100%",
            paddingTop: "1rem",
            paddingLeft: "2rem",
            paddingBottom: "1rem",
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
                    {this.titleCase(job.title)}
                  </div>{" "}
                  <div style={classes.jobRating}>
                    <Rating
                      name='rating'
                      defaultValue={job.rating}
                      precision={0.1}
                      readOnly
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
                    {job.salary === 0 ? "Unpaid" : `₹ ${job.salary} /- month`}
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
                    By {this.titleCase(job.recruiterName)},
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
                    <ImStopwatch /> {deadlineString}
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
                {this.canApply(job, job._id)}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }

  displayJobs() {
    this.state.jobs.sort(
      (a, b) =>
        (a[this.state.sortChoice] - b[this.state.sortChoice]) *
        parseInt(this.state.order)
    );
    const options = {
      shouldSort: false,
      useExtendedSearch: true,
      keys: ["title"],
    };

    const fuse = new Fuse(this.state.jobs, options);
    let final =
      this.state.search === ""
        ? this.state.jobs
        : fuse.search(this.state.search);
    const finalJobs = [];
    if (this.state.search !== "") {
      final.forEach((job) => finalJobs.push(job.item));
      final = finalJobs;
    }
    const [minSal, maxSal] = this.state.filterSalary;
    return final
      .filter((job) => new Date(job.deadlineDate) >= new Date())
      .filter((job) => job.duration < this.state.filterDuration)
      .filter((job) => job.salary <= maxSal && job.salary >= minSal)
      .filter((job) =>
        this.state.filterType === "None"
          ? true
          : job.jobType === this.state.filterType
      )
      .map((job) => {
        return this.displayJob(job);
      });
  }
  handleChange(event) {
    if (this._isMounted)
      this.setState({
        ...this.state,
        [event.target.name]: event.target.value,
      });
  }
  handleSlider(event, newValue) {
    if (this._isMounted)
      this.setState({
        ...this.state,
        filterSalary: newValue,
      });
  }
  render() {
    if (this.state.jobs.length === 0)
      return <h1 style={classes.heading}>Loading...</h1>;
    else
      return (
        <Container style={{ width: "100vw", padding: 0, maxWidth: 1400 }}>
          <h1 style={classes.heading}>View Jobs</h1>
          <Grid container spacing={3} justify='flex-end'>
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
                  <Grid container direction='column' style={{ width: "80%" }}>
                    <Grid item style={classes.field}>
                      <TextField
                        fullWidth
                        name='sortChoice'
                        select
                        label='Sort By'
                        value={this.state.sortChoice}
                        onChange={this.handleChange}
                      >
                        <MenuItem key='salary' value='salary'>
                          Salary
                        </MenuItem>
                        <MenuItem key='rating' value='rating'>
                          Rating
                        </MenuItem>
                        <MenuItem key='duration' value='duration'>
                          Duration
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
                    {this.displayFilters()}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <Grid container direction='column'>
                <Paper
                  elevation={0}
                  style={{
                    padding: "0rem 0rem 2rem",
                    background: "transparent",
                  }}
                >
                  <Grid item xs={5} style={{ marginLeft: "2rem" }}>
                    <SearchBar
                      name='search'
                      label='Search Jobs'
                      value={this.state.search}
                      inputProps={{ autoComplete: "off" }}
                      closeIcon={<SearchIcon style={{ color: "grey" }} />}
                      onChange={(newValue) =>
                        this.setState({ searchValue: newValue })
                      }
                      onCancelSearch={() =>
                        this.setState({ search: this.state.searchValue })
                      }
                      onRequestSearch={() =>
                        this.setState({ search: this.state.searchValue })
                      }
                    />
                  </Grid>
                  <Grid
                    container
                    style={{
                      marginTop: "1rem",
                      paddingTop: "0rem",
                      maxHeight: "60vh",
                      overflowY: "auto",
                    }}
                  >
                    {this.displayJobs()}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Dialog
            open={this.state.openDialog}
            onClose={this.handleClose}
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle id='form-dialog-title'>
              <span style={{ fontSize: "1.5rem", fontFamily: "'Rosario'" }}>
                Statement of Purpose
              </span>
            </DialogTitle>
            <DialogContent>
              <TextField
                style={{ minWidth: 500 }}
                autoFocus
                rows={3}
                rowsMax={6}
                required
                margin='dense'
                id='sop'
                label='max 250 words'
                type='text'
                inputProps={{ maxLength: 250 }}
                multiline
                variant='outlined'
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color='primary'>
                Cancel
              </Button>
              <Button onClick={() => this.sendApplication()} color='primary'>
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      );
  }
}

export default ViewJobs;
