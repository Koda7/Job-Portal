import "../../fonts/Fonts.css";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Typography, Toolbar } from "@material-ui/core";
import { RiAccountCircleFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "white",
    paddingLeft: "10rem",
  },
  link: {
    textDecoration: "none",
  },
  color: {
    background:
      "linear-gradient(to right, #396afc, #2948ff)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,

    justifyContent: "center",
  },
  logo: {
    fontFamily: "'Baloo Thambi 2', cursive",
    fontSize: "2.2rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    cursor: "pointer",
  },
}));

const NavBar = (props) => {
  const classes = useStyles();

  return (
    <AppBar position='relative' elevation={0}>
      <Toolbar className={classes.color}>
        <div className={classes.title}>
          <Typography variant='h6' className={classes.logo}>
            JOB DEKHO
          </Typography>
        </div>
        <div
          style={{
            display: "inline",
            paddingRight: "0.5rem",
            cursor: "pointer",
          }}
        >
          <RiAccountCircleFill style={{ fontSize: "2rem" }} />
        </div>
        <div
          style={{
            display: "inline",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1.5rem",
            paddingBottom: "0.5rem",
            paddingRight: "2rem",
            cursor: "pointer",
          }}
        >
          {props.userInfo.username}
        </div>
        <div
          onClick={props.logout}
          style={{
            display: "inline",
            paddingRight: "0.5rem",
            cursor: "pointer",
          }}
        >
          <FiLogOut style={{ fontSize: "1.5rem" }} />
        </div>
        <div
          onClick={props.logout}
          style={{
            display: "inline",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1.2rem",
            paddingBottom: "0.5rem",
            paddingRight: "5rem",
            cursor: "pointer",
          }}
        >
          Logout
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
