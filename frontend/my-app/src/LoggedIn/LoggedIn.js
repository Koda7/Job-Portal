import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";
import ShowInfoJobApplicant from "../ShowInfo/ShowInfo";
import ShowInfoRecruiter from "../ShowInfoR/ShowInfoR";
import ViewJobs from "../ViewJobs/ViewJobs";
import MyApplications from "../MyApplications/MyApplications";
import CreateJob from "../CreateJob/CreateJob";
import ListedJobs from "../ListedJobs/ListedJobs";
import ShowJobs from "../ShowJobs/ShowJobs";
import NavBar from "../NavBarSignedIn/NavBar";
import AccApplicants from "../AccApplicants/AccApplicants";
import "../../fonts/Fonts.css";

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(20),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currUser: {},
      currUserInfo: {},
      tabOpen: "profile",
      viewJob: {},
    };
    this.logout = this.logout.bind(this);
    this.redirectTo = this.redirectTo.bind(this);
    this.addJobToInfo = this.addJobToInfo.bind(this);
    this.showJob = this.showJob.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.backToListed = this.backToListed.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8080/currUser")
      .then((response) => {
        let obj = response.data;
        if (Object.entries(obj).length === 0) {
          this.props.history.push("/login");
        } else {
          this.setState({
            currUser: obj.currUser,
            currUserInfo: obj.currUserInfo,
          });
        }
      })
      .catch((err) => {
        this.props.history.push("/login");
      });
  }

  addJobToInfo(jobId) {
    let updatedJobs = this.state.currUserInfo.listedJobs;
    updatedJobs.push(jobId);
    this.setState((prevState) => ({
      currUserInfo: {
        ...prevState.currUserInfo,
        listedJobs: updatedJobs,
      },
    }));
  }
  updateUserInfo(newInfo) {
    this.setState({ currUserInfo: newInfo });
  }

  logout() {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8080/logout")
      .then((response) => {
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/");
      });
  }
  redirectTo(event, value) {
    if (value === "showJobs") return;
    if (value === "logout") this.logout();
    else this.setState({ tabOpen: value });
  }
  TopBarJobApplicant() {
    return (
      <StyledTabs
        variant='fullWidth'
        value={this.state.tabOpen}
        onChange={this.redirectTo}
        aria-label='styled tabs example'
      >
        <StyledTab label='Profile' value='profile' />
        <StyledTab label='ViewJobs' value='viewJobs' />
        <StyledTab label='My Applications' value='myApplications' />
      </StyledTabs>
    );
  }
  TopBarRecruiter() {
    return (
      <StyledTabs
        variant='fullWidth'
        value={this.state.tabOpen}
        onChange={this.redirectTo}
        aria-label='styled tabs example'
      >
        <StyledTab label='Profile' value='profile' />
        <StyledTab label='Create Job' value='createJob' />
        <StyledTab label='Active Jobs' value='listedJobs' />
        <StyledTab label='Accepted Applicants' value='accApplicants' />
      </StyledTabs>
    );
  }

  showJob(job) {
    this.setState({ viewJob: job, tabOpen: "showJobs" });
  }

  backToListed() {
    this.setState({ tabOpen: "listedJobs" });
  }

  render() {
    if (
      Object.entries(this.state.currUser).length === 0 ||
      Object.entries(this.state.currUserInfo).length === 0
    )
      return (
        <h1
          style={{
            fontSize: "3rem",
            fontFamily: "'Work Sans', sans-serif",
            color: "#002147",
          }}
        >
          Loading...
        </h1>
      );
    else {
      return (
        <div style={{ minHeight: "100vh", background: "#f1f3f6" }}>
          <NavBar userInfo={this.state.currUser} logout={this.logout} />
          {this.state.currUser.type === "JA"
            ? this.TopBarJobApplicant()
            : this.state.tabOpen !== "showJobs"
            ? this.TopBarRecruiter()
            : null}
          {this.state.tabOpen === "profile" ? (
            this.state.currUser.type === "JA" ? (
              <ShowInfoJobApplicant
                userInfo={this.state.currUserInfo}
                userType={this.state.currUser.type}
                updateUserInfo={this.updateUserInfo}
              />
            ) : (
              <ShowInfoRecruiter
                userInfo={this.state.currUserInfo}
                userType={this.state.currUser.type}
                updateUserInfo={this.updateUserInfo}
              />
            )
          ) : this.state.tabOpen === "viewJobs" ? (
            <ViewJobs
              user={this.state.currUser}
              userInfo={this.state.currUserInfo}
              history={this.props.history}
            />
          ) : this.state.tabOpen === "myApplications" ? (
            <MyApplications
              userId={this.state.currUser._id}
              history={this.props.history}
            />
          ) : this.state.tabOpen === "createJob" ? (
            <CreateJob
              userInfo={{
                ...this.state.currUserInfo,
                id: this.state.currUser._id,
              }}
              addJobToInfo={this.addJobToInfo}
              history={this.props.history}
            />
          ) : this.state.tabOpen === "listedJobs" ? (
            <ListedJobs
              listedJobs={this.state.currUserInfo.listedJobs}
              showJob={this.showJob}
              history={this.props.history}
            />
          ) : this.state.tabOpen === "showJobs" ? (
            <ShowJobs
              job={this.state.viewJob}
              history={this.props.history}
              back={this.backToListed}
            />
          ) : this.state.tabOpen === "accApplicants" ? (
            <AccApplicants
              jobs={this.state.currUserInfo.listedJobs}
              history={this.props.history}
            />
          ) : null}
        </div>
      );
    }
  }
}
export default LoggedIn;
