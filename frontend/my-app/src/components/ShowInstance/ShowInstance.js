import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { FaGraduationCap } from "react-icons/fa";
const ShowInstance = (props) => {
  const educationLength = () => {
    let str =
      props.data.startYear +
      " - " +
      (props.data.endYear === 0 ? "Present" : props.data.endYear);
    return str;
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar style={{ background: "#3f51b5" }}>
          <FaGraduationCap />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.data.instituteName}
        secondary={educationLength()}
      />
      <IconButton
        onClick={() => props.deleteEdu(props.data)}
        edge='end'
        aria-label='delete'
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default ShowInstance;
