import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import mapStyles from "./mapStyles";
import EventMarker from "./EventMarker";
import fbArray from "../apis/firebase.js";
import { useState, useEffect, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  filterButton: {
    position: "fixed",
    bottom: 50,
    right: 60,
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  
}));

// get firebase stuff
const db = fbArray.db;
const libraries = ["places"];
const mapContainerStyle = {
  height: "90vh",
  width: "100%",
};

//GMU Location
const center = {
  lat: 38.82982569870483,
  lng: -77.30736763569308,
};

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  restriction: {
    latLngBounds: {
      east: center.lng + 0.011,
      north: center.lat + 0.00666,
      south: center.lat - 0.006, 
      west: center.lng - 0.0249,
    },
    strictBounds: true,
  },
};

const Map = ({ mapRef, filter, setFilter, savedEvents, setSavedEvents }) => {
  const classes = useStyles();
  // Load the google map api key from .env file by useLoadScript function
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const [bottomOption, setBottomOption] = useState(false);

  // Use Callbacks to make sure not rendering map everytime
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Use Callback to save a function that moves lat and lng and set Zoom to 14
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  // List of events as a useState
  const [events, setEvents] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    bySchool: true,
    byOrganizer: true,
    byStudent: true,
    from7d: true,
    from30d: true,
    from90d: true,
    viewAll: false,
    tagFree: true,
    tagSports: true,
    tagArts: true,
    tagClub: true,
    tagFundraiser: true,
    tagNeedTicket: true,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setBottomOption(open);
  };

  const testDate = "2021-02-20";
  const testDate7 = "2021-02-27";
  const testDate30 = "2021-03-20";
  const testDate90 = "2021-05-20";
  // value : target date
  // compareDate : a date to compare with value (For filtering purpose)
  // allEvents : boolean to display all no mater of dates
  function dateCompare(value, compareDate, allEvents) {
    return allEvents ? true : Date.parse(value) < Date.parse(compareDate);
  }
  //filterByDate={filterByDate} filterByType={filterByType} filterByTag={filterByTag}
  // filterByDate, filterByType, filterByTag
  function filterByDate(marker) {
    return (
      (dateCompare(marker.date, testDate7, false) && filterOptions.from7d) ||
      (dateCompare(marker.date, testDate30, false) && filterOptions.from30d) ||
      (dateCompare(marker.date, testDate90, false) && filterOptions.from90d) ||
      (dateCompare(marker.date, testDate, true) && filterOptions.viewAll)
    );
  }

  function filterByType(marker) {
    return (
      (marker.type === 0 && filterOptions.bySchool) ||
      (marker.type === 1 && filterOptions.byOrganizer) ||
      (marker.type === 2 && filterOptions.byStudent)
    );
  }

  function filterByTag(marker) {
    return (
      ((marker.tags.includes("Free") && filterOptions.tagFree) ||
        !marker.tags.includes("Free")) &&
      ((marker.tags.includes("Sports") && filterOptions.tagSports) ||
        !marker.tags.includes("Sports")) &&
      ((marker.tags.includes("Arts") && filterOptions.tagArts) ||
        !marker.tags.includes("Arts")) &&
      ((marker.tags.includes("Club") && filterOptions.tagClub) ||
        !marker.tags.includes("Club")) &&
      ((marker.tags.includes("Fundraiser") && filterOptions.tagFundraiser) ||
        !marker.tags.includes("Fundraiser")) &&
      ((marker.tags.includes("Needticket") && filterOptions.tagNeedTicket) ||
        !marker.tags.includes("Needticket"))
    );
  }

  // Try to get events from 'Events' collection from the Firebase
  const fetchEvents = async () => {
    const response = db.collection("Events");
    const data = await response.get();

    const fetchedData = [];

    // Iterate throw the collections
    data.docs.forEach((item) => {
      // Push the fetched object to fetchedData array

      if (item.type === 1 && !filter.type1) {
      } else {
        fetchedData.push(item.data());

        fbArray.storage
          .ref(item.data().pictureName)
          .getDownloadURL()
          .then((url) => {
            // set a new Marker based on the iterating item
            setMarkers((current) => [
              ...current,
              {
                lat: item.data().latitude,
                lng: item.data().longitude,
                date: item.data().date.toDate().toLocaleString().split(",")[0], //toDateString()
                author: item.data().author,
                title: item.data().title,
                context: item.data().context,
                type: item.data().type,
                key: item.id,
                id: item.id,
                tags: item.data().tags,
                rating: item.data().rating,
                pictureName: item.data().pictureName,
                pictureURL: url,
                size: 70
              },
            ]);
          });
      }
    });
    // set Events with fetchedDate array
    setEvents(fetchedData);
  };

  // useEffect fetch events when the page renders
  useEffect(() => {
    fetchEvents();
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  // simple function to differentiate types
  function getLogoType(type) {
    if (type === 0) {
      return `/school.png`;
    } else if (type === 1) {
      return `/building.png`;
    } else return `/graduates.png`;
  }

  return (
    <>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        onClick={() => {
          setSelected(null);
        }}
        onLoad={onMapLoad}
      >
        {markers
          .filter(
            (marker) =>
              filterByType(marker) &&
              filterByTag(marker) &&
              filterByDate(marker)
          )
          .map((marker) => (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                setSelected(marker);
              }}
              onMouseOver={() => {
                setMarkers(
                  markers.map(item => 
                      item.id === marker.id 
                      ? {...item, size : 80} 
                      : item 
                ))              
              }}
              onMouseOut={() => {
                setMarkers(
                  markers.map(item => 
                      item.id === marker.id 
                      ? {...item, size : 70} 
                      : item 
                )) 
              }}  

              icon={{
                url: getLogoType(marker.type),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(marker.size, marker.size),
              }}
            />
          ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <EventMarker
              title={selected.title}
              author={selected.author}
              context={selected.context}
              lat={selected.lat}
              lng={selected.lng}
              docID={selected.key}
              building={selected.building}
              room={selected.room}
              date={selected.date}
              enddate={selected.enddate}
              link={selected.link}
              savedEvents={savedEvents} 
              setSavedEvents={setSavedEvents}
            />
            
          </InfoWindow>
        ) : null}
      </GoogleMap>
      <div className={classes.filterButton}>
        <Fab variant="extended" color="primary" aria-label="add" className={classes.margin}>
            <SettingsIcon className={classes.extendedIcon} />
            Filter
        </Fab>
      </div>

      {/* <div className={classes.button}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SettingsIcon />}
          onClick={toggleDrawer(true)}
        >
          Filter
        </Button>

        <Drawer
          anchor="bottom"
          open={bottomOption}
          onClose={toggleDrawer(false)}
        >
          <Filter
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            markers={markers}
            panTo={panTo}
            filterByDate={filterByDate}
            filterByType={filterByType}
            filterByTag={filterByTag}
            setSelected={setSelected}
            setBottomOption={setBottomOption}
            setMarkers={setMarkers}
          />
        </Drawer>
      </div> */}
    </>
  );
};

export default Map;
