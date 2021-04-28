import React from "react";
import IconButton from "@material-ui/core/IconButton";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Chip from "@material-ui/core/Chip";
import { DataGrid } from "@material-ui/data-grid";
import { Rating } from "@material-ui/lab";
import Avatar from "@material-ui/core/Avatar";

import SchoolIcon from "@material-ui/icons/School";
import BusinessIcon from "@material-ui/icons/Business";
import PeopleIcon from "@material-ui/icons/People";
import EventIcon from "@material-ui/icons/Event";
import WhatshotIcon from '@material-ui/icons/Whatshot';


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
  filterOptions,
  setFilterOptions,
  markers,
  panTo,
  filterByDate,
  filterByType,
  filterByTag,
  setSelected,
  setBottomOption,
  setMarkers
}) => {
  const classes = useStyles();

  const handleChange = (event) => {
    console.log(`${event.target.name} ${event.target.checked}`);
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.checked,
    });
  };

  function GetTypeOfPoster(value, key) {
    // by School
    if (value === 0) {
      return (
        <Chip label="School" color="primary" icon={<SchoolIcon />} key={key} />
      );
    }
    // by Organizer
    else if (value === 1) {
      return (
        <Chip
          label="Organizer"
          color="secondary"
          icon={<BusinessIcon />}
          key={key}
        />
      );
    }
    // by Student
    return <Chip label="Student" icon={<PeopleIcon />} key={key} />;
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
      renderCell: (params) => (
        <>{GetTypeOfPoster(params.value, params.row.id)}</>
      ),
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
            icon={<WhatshotIcon fontSize="inherit" />}
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
            onClick={() => {
              panTo({ lat: params.row.lat, lng: params.row.lng });
              setSelected(params.row);
             console.log(params.row)
             setBottomOption(false)
              //toggleDrawer(false)
            }}
          >
            <EventIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <div style={{ height: 450, width: "70%" }}>
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
