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
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";

import { DataGrid } from '@material-ui/data-grid';

import { useState, useEffect, useCallback, useRef } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  nested: {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  button: {
    paddingLeft: theme.spacing(8),
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

const Filter = ({ filter, setFilter, toggleDrawer, filterOptions, setFilterOptions, markers}) => {
  const classes = useStyles();
  const theme = useTheme();

  const today = new Date();

  const [filteredMarkers, setFilteredMarkers] = useState(markers);

  const todaytime =
    today.getFullYear() +
    "-" +
    today.getMonth() +
    "-" +
    today.getDay() +
    "T" +
    today.getHours() +
    ":" +
    today.getMinutes();


  const handleChange = (event) => {
    setFilterOptions({ ...filterOptions, [event.target.name]: event.target.checked });
    // setFilteredMarkers( markers.filter(marker => (marker.type === 0 && filterOptions.bySchool) || (marker.type === 1 && filterOptions.byOrganizer) || (marker.type === 2 && filterOptions.byStudent) ) )
  };

  const handleFilterChange = (name, checked) => {
    setFilter({ ...filter, [name]: checked });
    
  };

  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date("2014-08-18T21:11:54"),
    endDate: new Date("2014-08-18T21:11:54"),
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onSaveClick = (name, checked) => {
    console.log(`${name} and ${checked}`);
    handleFilterChange(name, checked);
  };


  const columns = [
    { field: 'key', headerName: 'key', width: 130 },
    { field: 'author', headerName: 'author', width: 130 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'date', headerName: 'date', width: 230 },
    { field: 'type', headerName: 'Type', width: 130 },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  

  return (
    <div className={classes.root}>
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
      <div style={{ height: 400, width: '70%' }}>

        <DataGrid rows={markers.filter(marker => (marker.type === 0 && filterOptions.bySchool) || (marker.type === 1 && filterOptions.byOrganizer) || (marker.type === 2 && filterOptions.byStudent) ) } columns={ columns } pageSize={5} checkboxSelection />
          
      </div>
      <div className={classes.nested}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Fliter By Posters</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.bySchool}
                  onChange={handleChange}
                  name="bySchool"
                />
              }
              label="By School Faculties (Type 0)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.byOrganizer}
                  onChange={handleChange}
                  name="byOrganizer"
                />
              }
              label="By Outside Organizers (Type 1)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.byStudent}
                  onChange={handleChange}
                  name="byStudent"
                />
              }
              label="By Students (Type 2)"
            />
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Within</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.from7d}
                  onChange={handleChange}
                  name="from7d"
                />
              }
              label="Within 7 Days"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.from30d}
                  onChange={handleChange}
                  name="from30d"
                />
              }
              label="Within 30 Days"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.from90d}
                  onChange={handleChange}
                  name="from90d"
                />
              }
              label="Within 90 Days"
            />
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>

        <TextField
          id="datetime-local"
          label="Start Date"
          type="datetime-local"
          // defaultValue={today}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={() => {
            setFilter(!filter);
            toggleDrawer(filterOptions);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Filter;
