
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

import EventMarker from './components/EventMarker'
import db from './apis/firebase.js';
import {useState,useEffect, useCallback, useRef} from 'react';

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  restriction: {
    latLngBounds: {
      east: -77.299341,
      north: 38.838761,
      south: 38.823618,
      west: -77.318182
    },
    strictBounds: true
  }
};

//GMU Location
const center = {
  lat: 38.82982569870483,
  lng: -77.30736763569308,
};

export default function App() {

  // Load the google map api key from .env file by useLoadScript function
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });


  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const mapRef = useRef();

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
  const [events,setEvents] = useState([])

  // Try to get events from 'Events' collection from the Firebase
  const fetchEvents=async()=>{
    const response=db.collection('Events');
    const data = await response.get();

    const fetchedData = [];

    // Iterate throw the collections
    data.docs.forEach(item=>{
      // Push the fetched object to fetchedData array 
      fetchedData.push(item.data())

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
          type: item.data().type
        },
      ]);
    })
    // set Events with fetchedDate array
    setEvents(fetchedData);
  }


  // useEffect fetch events when the page renders
  useEffect(() => {
    fetchEvents();
  }, [])

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  // simple function to differentiate types
  function getLogoType(type){
    if(type == 1){
      return `/patriotlogo.png`
    }
    else if(type == 2){
      return `/gmustar.png`
    }
    else
    return `/wearemason.png`
    
  }

  // the actual jsx part
  return (
    <div>
      <h1>
        <span role="img" aria-label="eventscope">
          🛴GMU EventScope📢
        </span>
      </h1>

      <Locate panTo={panTo} />
      <Search panTo={panTo} />

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
            <EventMarker title={selected.title} author={selected.author} context ={selected.context} lat={selected.lat} lng={selected.lng} />
            
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}


// Locate function
function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/gmulogo.png" alt="gmu logo"/>
    </button>
  );
}

// Search function
function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
