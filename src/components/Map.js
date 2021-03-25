import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

import EventMarker from "./EventMarker";
import fbArray from "../apis/firebase.js";
import { useState, useEffect, useCallback, useRef } from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Filter from './Filter'


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center"
    
  },
}));

// get firebase stuff
const db = fbArray.db;
const libraries = ["places"];
const mapContainerStyle = {
  height: "85vh",
  width: "100%",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  restriction: {
    latLngBounds: {
      east: -77.299341,
      north: 38.838761,
      south: 38.823618,
      west: -77.318182,
    },
    strictBounds: true,
  },
};

//GMU Location
const center = {
  lat: 38.82982569870483,
  lng: -77.30736763569308,
};

const Map = ({ mapRef, filter, setFilter }) => {
  const classes = useStyles();
const theme = useTheme();
  // Load the google map api key from .env file by useLoadScript function
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const [bottomOption, setBottomOption] = useState(false);

  // const mapRef = useRef();

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
  const [testVisible, settestVisible] = useState(true);


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setBottomOption(open);
  };

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
        // set a new Marker based on the iterating item
        setMarkers((current) => [
          ...current,
          {
            lat: item.data().latitude,
            lng: item.data().longitude,
            date: item.data().date.toDate().toDateString(),
            author: item.data().author,
            title: item.data().title,
            context: item.data().context,
            type: item.data().type,
            key: item.id,
          },
        ]);
      }
    });
    // set Events with fetchedDate array
    setEvents(fetchedData);
    console.log(`map rendered again !`);
  };

  // useEffect fetch events when the page renders
  useEffect(() => {
    fetchEvents();
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  // simple function to differentiate types
  function getLogoType(type) {
    if (type == 1) {
      return `/patriotlogo.png`;
    } else if (type == 2) {
      return `/gmustar.png`;
    } else return `/wearemason.png`;
  }

  return (
    <>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        //onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.filter(marker => (marker.type !== 1 && testVisible) || !testVisible).map((marker) => (

              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  setSelected(marker);
                }}
                icon={{
                  url: getLogoType(marker.type),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                  scaledSize: new window.google.maps.Size(70, 70),
                }}
              />
              
            ))
}

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
            />
          </InfoWindow>
        ) : null}
      </GoogleMap>

      <>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => {
            settestVisible(!testVisible);
          }}
        >
          Primary
        </Button>
        {testVisible.toString()} */}
        <div class={classes.button}>
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
            <Filter filter={testVisible} setFilter={settestVisible} toggleDrawer={toggleDrawer}/>
          </Drawer>
          {bottomOption.toString()}
          </div>
      </>
    </>
  );
};

export default Map;
