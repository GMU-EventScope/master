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
      east: center.lng + 0.01,
      north: center.lat + 0.008,
      south: center.lat - 0.005, 
      west: center.lng - 0.025,
    },
    strictBounds: true,
  },
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

      
        fbArray.storage.ref(item.data().pictureName)
        .getDownloadURL().then( url => {
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
            },
          ]);
        })
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
        {markers.filter(marker => 
        (marker.type === 0 && filterOptions.bySchool) || (marker.type === 1 && filterOptions.byOrganizer) || (marker.type === 2 && filterOptions.byStudent) 
        && ( (marker.tags.includes('Free') && filterOptions.tagFree) || (marker.tags.includes('Sports') && filterOptions.tagSports) || (marker.tags.includes('Arts') && filterOptions.tagArts)
                  || (marker.tags.includes('Club') && filterOptions.tagClub) || (marker.tags.includes('Fundraiser') && filterOptions.tagFundraiser) || (marker.tags.includes('NeedTicket') && filterOptions.tagNeedTicket) )
        ).map((marker) => (

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
            <Filter filter={testVisible} setFilter={settestVisible} toggleDrawer={toggleDrawer} filterOptions={filterOptions} setFilterOptions={setFilterOptions} markers={markers}/>
          </Drawer>

          
          </div>
      </>
    </>
  );
};

export default Map;
