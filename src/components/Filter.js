import React from "react";
import fbArray from "../apis/firebase.js";

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
import Switch from "@material-ui/core/Switch";
import Chip from "@material-ui/core/Chip";
import { DataGrid } from "@material-ui/data-grid";
import { Rating } from "@material-ui/lab";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";

import SchoolIcon from "@material-ui/icons/School";
import BusinessIcon from "@material-ui/icons/Business";
import PeopleIcon from "@material-ui/icons/People";
import EventIcon from "@material-ui/icons/Event";

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

const Filter = ({
  filter,
  setFilter,
  toggleDrawer,
  filterOptions,
  setFilterOptions,
  markers,
  panTo,
  filterByDate,
  filterByType,
  filterByTag,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const [filteredMarkers, setFilteredMarkers] = useState(markers);

  // [1, 2, 3 , 4, 5 ]
  const handleChange = (event) => {
    console.log(`${event.target.name} ${event.target.checked}`);
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.checked,
    });
    // setFilteredMarkers( markers.filter(marker => (marker.type === 0 && filterOptions.bySchool) || (marker.type === 1 && filterOptions.byOrganizer) || (marker.type === 2 && filterOptions.byStudent) ) )
  };

  function GetTypeOfPoster(value, key) {
    // by School
    if (value === 0) {
      return <Chip label="School" color="primary" icon={<SchoolIcon /> } key={key}/>;
    }
    // by Organizer
    else if (value === 1) {
      return (
        <Chip label="Organizer" color="secondary" icon={<BusinessIcon />} key={key}/>
      );
    }
    // by Student
    return <Chip label="Student" icon={<PeopleIcon />} key={key}/>;
  }

  const columns = [
    {
      field: "pictureURL",
      headerName: "Picture",
      width: 100,
      renderCell: (params) => (
        <>
          <Avatar alt={params.value} src={params.value} />
        </>
      ),
    },
    { field: "author", headerName: "Author", width: 130 },
    { field: "title", headerName: "Title", width: 130 },
    {
      field: "date",
      headerName: "Date",
      width: 160,
    },
    {
      field: "type",
      headerName: "Posted By",
      width: 140,
      renderCell: (params) => <>{GetTypeOfPoster(params.value, params.row.id)}</>,
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 230,
      renderCell: (params) => (
        <>
          {params.value.map((data) => (
            <Chip label={data} color="primary" key={data} />
          ))}
        </>
      ),
    },
    {
      field: "rating",
      headerName: "Popularity",
      width: 230,
      renderCell: (params) => (
        <>
          <Rating
            name="half-rating"
            defaultValue={params.value}
            precision={0.1}
            readOnly
          />
          {params.value}
        </>
      ),
    },
    {
      field: "detail",
      headerName: "Details",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="detail"
            color="secondary"
            onClick={() => panTo({ lat: params.row.lat, lng: params.row.lng })}
          >
            <EventIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <div style={{ height: 600, width: "70%" }}>
        <DataGrid
          rows={markers.filter(
            (marker) =>
              filterByType(marker) &&
              filterByTag(marker) &&
              filterByDate(marker)
          )}
          columns={columns}
          pageSize={10}
          // columnTypes={{ rating: ratingOnlyOperators }}
        />
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
              label="By School Faculties"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.byOrganizer}
                  onChange={handleChange}
                  name="byOrganizer"
                />
              }
              label="By Outside Organizers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.byStudent}
                  onChange={handleChange}
                  name="byStudent"
                />
              }
              label="By Students"
            />
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.viewAll}
                  onChange={handleChange}
                  name="viewAll"
                />
              }
              label="View All Events"
            />
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Tags</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={filterOptions.tagFree}
                  onChange={handleChange}
                  name="tagFree"
                  color="primary"
                />
              }
              label="Free"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filterOptions.tagSports}
                  onChange={handleChange}
                  name="tagSports"
                  color="primary"
                />
              }
              label="Sports"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filterOptions.tagArts}
                  onChange={handleChange}
                  name="tagArts"
                  color="primary"
                />
              }
              label="Arts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filterOptions.tagClub}
                  onChange={handleChange}
                  name="tagClub"
                  color="primary"
                />
              }
              label="Club"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filterOptions.tagFundraiser}
                  onChange={handleChange}
                  name="tagFundraiser"
                  color="primary"
                />
              }
              label="Fundraiser"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={filterOptions.tagNeedTicket}
                  onChange={handleChange}
                  name="tagNeedTicket"
                  color="primary"
                />
              }
              label="Need Ticket"
            />
          </FormGroup>
          <FormHelperText>Tags</FormHelperText>
        </FormControl>
        <TextField
          id="date"
          label="Date"
          type="date"
          defaultValue={"2021-02-20"}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {/*
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
        </Button> */}
      </div>
    </div>
  );
};

export default Filter;
