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
import Switch from '@material-ui/core/Switch'

import { DataGrid } from '@material-ui/data-grid';
import { Rating } from '@material-ui/lab';
import PropTypes from 'prop-types';
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


function RatingInputValue(props) {
  const classes = useStyles();
  const { item, applyValue } = props;

  const handleFilterChange = (event) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <div className={classes.root}>
      <Rating
        name="custom-rating-filter-operator"
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={handleFilterChange}
        precision={0.5}
      />
    </div>
  );
}

RatingInputValue.propTypes = {
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string,
    id: PropTypes.number,
    operatorValue: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

const ratingOnlyOperators = [
  {
    label: 'From',
    value: 'from',
    getApplyFilterFn: (filterItem, column) => {
      if (
        !filterItem.columnField ||
        !filterItem.value ||
        !filterItem.operatorValue
      ) {
        return null;
      }

      return (params) => {
        const rowValue = column.valueGetter
          ? column.valueGetter(params)
          : params.value;
        return Number(rowValue) >= Number(filterItem.value);
      };
    },
    InputComponent: RatingInputValue,
    InputComponentProps: { type: 'number' },
  },
];


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

  // [1, 2, 3 , 4, 5 ]
  const handleChange = (event) => {
    console.log(`${event.target.name} ${event.target.checked}`)
    setFilterOptions({ ...filterOptions, [event.target.name]: event.target.checked });
    // setFilteredMarkers( markers.filter(marker => (marker.type === 0 && filterOptions.bySchool) || (marker.type === 1 && filterOptions.byOrganizer) || (marker.type === 2 && filterOptions.byStudent) ) )
  };

  // TODO REMOVE THIS SHIT
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

  //    { field: 'key', headerName: 'key', width: 130 },
  const columns = [
    { field: 'author', headerName: 'Author', width: 130 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'date', headerName: 'Date', width: 230 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'tags', headerName: 'Tags', width: 230 },
    { field: 'rating', headerName: 'rating', width: 230, filterOperators: ratingOnlyOperators },
  ];
  

  // if (columns.length > 0) {
  //   const ratingColumn = columns.find((col) => col.field === 'rating');
  //   const newRatingColumn = {
  //     ...ratingColumn,
  //     filterOperators: ratingOnlyOperators,
  //   };

  //   const ratingColIndex = columns.findIndex((col) => col.field === 'rating');
  //   columns[ratingColIndex] = newRatingColumn;
  // }

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

        <DataGrid rows={markers.filter(marker => ((marker.type === 0 && filterOptions.bySchool) || (marker.type === 1 && filterOptions.byOrganizer) || (marker.type === 2 && filterOptions.byStudent))
                  && ( (marker.tags.includes('Free') && filterOptions.tagFree) || (marker.tags.includes('Sports') && filterOptions.tagSports) || (marker.tags.includes('Arts') && filterOptions.tagArts)
                  || (marker.tags.includes('Club') && filterOptions.tagClub) || (marker.tags.includes('Fundraiser') && filterOptions.tagFundraiser) || (marker.tags.includes('NeedTicket') && filterOptions.tagNeedTicket) )
          ) } columns={ columns } pageSize={10}

          columnTypes={{ rating: ratingOnlyOperators }}
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
                        <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.from90d}
                  onChange={handleChange}
                  name="viewPast"
                />
              }
              label="View Past Events"
            />
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>
        <FormControl component="fieldset">
      <FormLabel component="legend">Tags</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={filterOptions.tagFree} onChange={handleChange} name="tagFree" color="primary"/>}
          label="Free"
        />
        <FormControlLabel
          control={<Switch checked={filterOptions.tagSports} onChange={handleChange} name="tagSports" color="primary"/>}
          label="Sports"
        />
        <FormControlLabel
          control={<Switch checked={filterOptions.tagArts} onChange={handleChange} name="tagArts" color="primary"/>}
          label="Arts"
        />
                <FormControlLabel
          control={<Switch checked={filterOptions.tagClub} onChange={handleChange} name="tagClub" color="primary"/>}
          label="Club"
        />
                <FormControlLabel
          control={<Switch checked={filterOptions.tagFundraiser} onChange={handleChange} name="tagFundraiser" color="primary"/>}
          label="Fundraiser"
        />
                <FormControlLabel
          control={<Switch checked={filterOptions.tagNeedTicket} onChange={handleChange} name="tagNeedTicket" color="primary"/>}
          label="Need Ticket"
        />
      </FormGroup>
      <FormHelperText>Tags</FormHelperText>
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
