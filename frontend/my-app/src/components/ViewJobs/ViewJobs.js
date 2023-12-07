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