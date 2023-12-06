import "../../fonts/Fonts.css";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Typography, Toolbar } from "@material-ui/core";
import { Link } from "react-router-dom";

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
  },
  linkBox: {
    paddingRight: "10rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
  linkStyles: {
    display: "inline",
    fontFamily: "'Montserrat', sans-serif",
    color: "white",
    fontSize: "1rem",
    paddingRight: "3rem",
  },
}));

const NavBar = () => {
  const classes = useStyles();

  return (
    <AppBar position='fixed' elevation={0}>
      <Toolbar className={classes.color}>
        <div className={classes.title}>
          <Link to={`/`} style={{ textDecoration: "none", color: "white" }}>
            <Typography variant='h6' className={classes.logo}>
              JOB DEKHO
            </Typography>
          </Link>
        </div>
        <div className={classes.linkBox}>
          <Link to={`/login`} className={classes.link}>
            <div className={classes.linkStyles}>Login</div>
          </Link>
          <Link to={`/register`} className={classes.link}>
            <div className={classes.linkStyles}>Register</div>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
