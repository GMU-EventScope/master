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
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

import EventMarker from "./EventMarker";
import fbArray from "../apis/firebase.js";
import { useState, useEffect, useCallback, useRef } from "react";

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



const Map = ( {mapRef} ) => {
  // Load the google map api key from .env file by useLoadScript function
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

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

  // Try to get events from 'Events' collection from the Firebase
  const fetchEvents = async () => {
    const response = db.collection("Events");
    const data = await response.get();

    const fetchedData = [];

    // Iterate throw the collections
    data.docs.forEach((item) => {
      // Push the fetched object to fetchedData array
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
          key: item.id
        },
      ]);
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
    if (type == 1) {
      return `/patriotlogo.png`;
    } else if (type == 2) {
      return `/gmustar.png`;
    } else return `/wearemason.png`;
  }
  return <>
            <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}

        options={options}
        //onClick={onMapClick}
        onLoad={onMapLoad}
      >
        
        {markers.map((marker) => (
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
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <EventMarker title={selected.title} author={selected.author} context ={selected.context} lat={selected.lat} lng={selected.lng} docID={selected.key} />
            
          </InfoWindow>
        ) : null}
      </GoogleMap>
  </>;
};

export default Map;
