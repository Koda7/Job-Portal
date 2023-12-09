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