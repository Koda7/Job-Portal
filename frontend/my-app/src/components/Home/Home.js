import "../../fonts/Fonts.css";
import React from "react";
import NavBar from "../NavBar/NavBar";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Button } from "@material-ui/core/";
import bgImage from "../../images/bg.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  text: {
    fontFamily: "'Baloo Thambi 2', cursive",
    fontSize: "1.9rem",
    lineHeight: "30px",
    color: "#c0c0c0",
    margin: "1rem 0rem",

    // textAlign: "center",
  },
  mainText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "6rem",
    fontWeight: 100,
    color: "#03506f",
    margin: "2rem 0rem",
    // textAlign: "center",
  },
}));

const Home = (props) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <NavBar />
      <Grid
        container
        justify-content='flex-end'
        style={{
          height: "100%",
        }}
        alignItems='center'
      >
        <Grid item xs={4} align='center'>
          <div className={classes.mainText}>Job Portal</div>
          <div className={classes.text}>
            Find the Job You are always looking for where all the best
            Recruiters post all kinds of Jobs{" "}
          </div>
          <Button
            variant='contained'
            onClick={() => props.history.push("/login")}
            style={{
              fontSize: "1.3rem",
              width: 250,
              background: "#2874ef",
              fontFamily: "'Baloo Thambi 2'",
              // background: "linear-gradient(to right, #1488cc, #2b32b2)",
              color: "white",
              borderRadius: "30px",
              margin: "2rem 1rem",
            }}
          >
            Login
          </Button>
          <Button
            variant='contained'
            onClick={() => props.history.push("/register")}
            style={{
              fontSize: "1.3rem",
              width: 280,
              fontFamily: "'Baloo Thambi 2'",
              background: "#fa5e6a",
              borderRadius: "30px",

              // background: "linear-gradient(to right, #ec008c, #fc6767)",
              color: "white",
              margin: "2rem 1rem",
            }}
          >
            Register
          </Button>
        </Grid>
        <Grid item xs={7}>
          <img src={bgImage} alt='job' style={{ width: "100%" }}></img>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;