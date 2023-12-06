import React from "react";
import { Chip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const ShowSkills = (props) => {
  return (
    <Chip
      label={props.data}
      clickable
      color='primary'
      style={{ fontSize: 15, margin: "0.3rem", padding: "0.5rem" }}
      onDelete={() => props.deleteSkill(props.data)}
      deleteIcon={<CloseIcon />}
    />
  );
};

export default ShowSkills;
