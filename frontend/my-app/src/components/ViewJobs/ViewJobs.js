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

