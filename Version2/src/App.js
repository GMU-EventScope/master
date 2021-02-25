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

import Markers from './components/Markers'
import db from './components/firebase.js';
import {useState,useEffect} from 'react';


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

//GMU
const center = {
  lat: 38.82982569870483,
  lng: -77.30736763569308,
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDkjlyNY1-N3yB70i_dH4qecMy8HaPreg8',
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    // setMarkers((current) => [
    //   ...current,
    //   {
    //     lat: e.latLng.lat(),
    //     lng: e.latLng.lng(),
    //     time: new Date(),
    //   },
    // ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const [events,setEvents] = useState([])

  const fetchEvents=async()=>{
    const response=db.collection('Events');
    const data = await response.get();

    const fetchedData = [];

    //console.log(data.docs)
    data.docs.forEach(item=>{
      //setEvents([...events, item.data()])
      fetchedData.push(item.data())
     //setEvents([...events, 'test 1'])
    //  console.log(JSON.stringify(events))
    //  console.log("event added next item")
    //  console.log(item.data())

      // setMarkers((current) => [
      //   ...current,
      //   {
      //     lat: e.latLng.lat(),
      //     lng: e.latLng.lng(),
      //     time: new Date(),
      //   },
      // ]);
      console.log(item.data().context)

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

    setEvents(fetchedData);
    console.log(fetchedData)
    
  }

  useEffect(() => {
    fetchEvents();
    console.log(events);

  }, [])

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  
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
        onClick={onMapClick}
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
            <div>
              <h2>
                <span role="img" aria-label="event">
                  🎉Event🎉 - {selected.title}
                </span>{" "}
              </h2>
              <p><h3>Posted:</h3> {selected.author} - {selected.date}</p>
              <p><h3>Description:</h3> {selected.context}</p>
              <p>{selected.lat} / {selected.lng}</p>
              {/*<Markers events = {events}/>*/}
            </div>
            
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

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
