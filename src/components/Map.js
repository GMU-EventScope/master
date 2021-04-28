import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

import EventMarker from "./EventMarker";
import fbArray from "../apis/firebase.js";
import { useState, useEffect, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Filter from "./Filter";
import './Map.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
}));

// get firebase stuff
const db = fbArray.db;
const libraries = ["places"];
const mapContainerStyle = {
  height: "85vh",
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
      north: center.lat + 0.01,
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

    // Iterate through the collections
    data.docs.forEach((item) => {
      // Push the fetched object to fetchedData array

      if (item.type === 1 && !filter.type1) {
      } else {
        fetchedData.push(item.data());

        let reference = fbArray.storage
          .ref(`profile/${item.data().pictureName}`);
        if (!reference) {
          return;
        }
          console.log(item.data().title);
          reference.getDownloadURL()
          .then((url) => {

            // ensure clean data
            let picNames = [];
            if (item.data().picNames) {
              picNames = [...item.data().picNames];
            }

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
                size: 70,
                hostID: item.data().hostID,
                picNames: picNames,
                picUrls: []
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

  // gets the image urls for an event and stores them in the event
  function getImageUrls(marker) {
    console.log("called getImageUrls - " + marker.picUrls.length + " : " + marker.picNames.length);
    // only query if needed (no images loaded, and there are images to load)
    if ((marker.picUrls.length < 1) && (marker.picNames.length >= 1)) {
      // loop through each filename
      marker.picNames.forEach(name => {
        //console.log(`eventpics/${props.docID}/${name}`);
        let reference = fbArray.storage.ref(`eventpics/${marker.id}/${name}`);
        reference.getDownloadURL().then((url) => {
          // URL obtained, add to the reactive array so it can be used for rendering
          console.log("returned url:" + url);
          marker.picUrls = [...marker.picUrls, url];
        });
      });
    }
    // get default image
    if (marker.picNames.length == 0) {
      let reference = fbArray.storage.ref(`eventpics/default.jpg`);
      reference.getDownloadURL().then((url) => {
        // URL obtained, add to the reactive array so it can be used for rendering
        console.log("returned url:" + url);
        marker.picUrls = [...marker.picUrls, url];
      });
      marker.picNames = ["default"];
    }

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
                getImageUrls(marker);
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
              hostID={selected.hostID}
              picNames={selected.picNames}
              picUrls={selected.picUrls}
            />
            
          </InfoWindow>
        ) : null}
      </GoogleMap>

      <div className={classes.button}>
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
      </div>
    </>
  );
};

export default Map;
