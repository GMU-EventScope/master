import React from "react";
import clsx from "clsx";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useState, useEffect, useCallback, useRef } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const Filter = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [state, setState] = useState({
    bySchool: true,
    byOrganizer: true,
    byStudent: true,
    checkedG: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date("2014-08-18T21:11:54"),
    endDate: new Date("2014-08-18T21:11:54"),
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <List component="div" disablePadding>
        {/* <ListItem button className={classes.nested}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Inside of Nest 2!" />
        </ListItem>
        <ListItem button className={classes.nested}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Another one" />
        </ListItem>
        <ListItem button className={classes.nested}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="And Another one" />
        </ListItem> */}
        {/* <FormControlLabel className={classes.nested}
            control={
              <Checkbox
                checked={state.checkedA}
                onChange={handleChange}
                name="checkedA"
                color="primary"
              />
            }
            label="primary"
          /> */}
        <ListItem button className={classes.nested}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Fliter By Posters</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.bySchool}
                    onChange={handleChange}
                    name="bySchool"
                  />
                }
                label="By School Faculties"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.byOrganizer}
                    onChange={handleChange}
                    name="byOrganizer"
                  />
                }
                label="By Outside Organizers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.byStudent}
                    onChange={handleChange}
                    name="byStudent"
                  />
                }
                label="By Students"
              />
            </FormGroup>
            {/* <FormHelperText>Be careful</FormHelperText> */}
          </FormControl>
        </ListItem>
        <ListItem button className={classes.nested}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Within</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.bySchool}
                    onChange={handleChange}
                    name="bySchool"
                  />
                }
                label="Within 7 Days"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.byOrganizer}
                    onChange={handleChange}
                    name="byOrganizer"
                  />
                }
                label="Within 30 Days"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.byStudent}
                    onChange={handleChange}
                    name="byStudent"
                  />
                }
                label="Within 90 Days"
              />
            </FormGroup>
            {/* <FormHelperText>Be careful</FormHelperText> */}
          </FormControl>
        </ListItem>
        <ListItem button className={classes.nested}>       
          <TextField
            id="datetime-local"
            label="Start Date"
            type="datetime-local"
            defaultValue="2017-05-24T10:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </ListItem> 
      </List>
    </div>
  );
};

export default Filter;
