import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import Fab from '@material-ui/core/Fab';
import EditLocationOutlinedIcon from '@material-ui/icons/EditLocationOutlined';
import { green } from '@material-ui/core/colors';
import mapStyles from "./mapStyles";
import './Map.css';

import EventMarker from "./EventMarker";
import fbArray from "../apis/firebase.js";
import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Alert } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Filter from "./Filter";
import './Map.css';
import { format } from "date-fns";
import { StrikethroughSRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: "1 1 auto",
  },
  button: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center"
  },
  filterButton: {
    position: "fixed",
    bottom: 30,
    right: 60,
  },
  margin: {
    margin: theme.spacing(1),
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  eventButton: {
    position: "fixed",
    top: 100,
    right: 0
  }
}));

// get firebase stuff
const auth = fbArray.auth;
const db = fbArray.db;
const libraries = ["places"];
const mapContainerStyle = {
  height:"calc(100vh - 64px)",
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
  //get the currently logged in user
  let currUser = useRef(auth.currentUser);

  /////EVENT CREATION STUFF/////
  //event modal toggler
  const [createEventShow, setCreateEventShow] = useState(false);
  const handleCreateEventClose = () => setCreateEventShow(false);
  const handleCreateEventShow = () => setCreateEventShow(true);
  
  //stored values for event creation
  const [rating, setRating] = useState();
  const eventNameRef = useRef("");
  const buildingRef = useRef("");
  const roomRef = useRef("");
  const contextRef = useRef("");
  const dateRef = useRef("");
  const imageRef = useRef("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  //const roomRef = useRef("");
  const [accountType, setAccountType] = useState("user");
  const [eventMode, setEventMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //get the user type
  const fetchAccountType = () => {
    if (currUser) {
      //user is signed in.
      db.collection("users").doc(currUser.uid).get().then((doc) => {
        if (doc.exists) {
          setAccountType(doc.get("accountType"));
        } else { //doc.data() = undefined
          console.log("No such document associated with the user!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    } else {
      //no user is signed in.
      setAccountType("user");
      setEventMode(false);
    }
  }
  
  const[] = React.useState(false)

  function createEvent(eventNameRef, buildingRef, roomRef, contextRef, dateRef,
                      ratingRef, latitudeRef, longitudeRef, imageRef) {
    if (currUser) {
      //user is signed in
      db.collection("Events").add({
        title: eventNameRef,
        building: buildingRef,
        room: roomRef,
        context: contextRef,
        date: dateRef,
        rating: ratingRef,
        latitude: latitudeRef,
        longitude: longitudeRef,
        picture: imageRef,
      }).then((docRef) => {
        console.log("Event document created with ID: ", docRef.id);
      }).catch((error) => {
        console.log("Error adding document: ", error);
      });
    } else {
      console.log("no user is signed in");
    }
  }

  async function handleEventSubmit(event) {
    console.log("Event Form was submitted!");
    event.preventDefault();

      setError("");
      setLoading(true);
      await createEvent(eventNameRef.current.value, buildingRef.current.value, roomRef.current.value, contextRef.current.value, dateRef.current.value, 
                        rating, latitude, longitude, imageRef.current.value);

    setLoading(false);
    handleCreateEventClose();
  }
  
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

  //Converts from this format 4/28/21 to this format April 28, 2021
  function convertDate(date){
    let d = (new Date(date));
    d = format(d, 'eee, MMM dd, yyyy');
    return d;
  }

  //displays the time in am/pm format
  function convertTime(time){
    let t = (new Date(time));
    t = format(t, "h:mm a");
    return t;
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
                date: convertDate(item.data().date.toDate().toLocaleString().split(",")[0]), //toDateString()
                time: convertTime(item.data().date.toDate()),
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
    const interval = setInterval(() => {
      currUser = auth.currentUser;
      fetchAccountType();
    }, 50);
    fetchEvents();
    return () => clearInterval(interval);
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
    <div className={classes.root}>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        onClick={(event) => {
          setSelected(null);
          //handleLatLng(event);
          setLatitude(event.latLng.lat());
          setLongitude(event.latLng.lng());
          setRating(0);
          if (eventMode) {
            handleCreateEventShow();
          }
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
              time={selected.time}
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
      <div className={classes.filterButton}>
        <Fab variant="extended" color="inherit" aria-label="add" className={classes.margin} onClick={toggleDrawer(true)}>
            <EditLocationOutlinedIcon className={classes.extendedIcon} />
            Filter
        </Fab>
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

      {/* Toggle Create Event Mode Button */}
      {accountType === "org" && (eventMode === false ? 
        (<div className={classes.eventButton}>
          <Button style={{margin: "4px", color: "white", backgroundColor: "#006633"}} onClick={() => {setEventMode(true)}}>Create Mode</Button>
        </div>)
        : 
        (<div className={classes.eventButton}>
          <Button style={{margin: "4px", color: "white", backgroundColor: "#006633"}} onClick={() => {setEventMode(false)}}>Exit Create Mode</Button>
        </div>) 
      )}

      {/*Event Creation Modal*/}
      <Modal show={createEventShow} onHide={handleCreateEventClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert letiant="danger">{error}</Alert>}
          <Form onSubmit={handleEventSubmit}>
          <Form.Group id="eventname">
            <Form.Label>Name Your Event</Form.Label>
            <Form.Control type="text" ref={eventNameRef} required />
          </Form.Group>
            <Form.Group id="location">
              <Form.Label>Building Or Location Of Event?</Form.Label>
              <Form.Control as="textarea" rows={2} ref={buildingRef} />
            </Form.Group>
            <Form.Group id="room">
              <Form.Label>Room Number If Applicable?</Form.Label>
              <Form.Control as="textarea" rows={1} ref={roomRef} />
            </Form.Group>
            <Form.Group id="context">
              <Form.Label>Information About Your Event</Form.Label>
              <Form.Control as="textarea" rows={3} ref={contextRef} required />
            </Form.Group>
            <Form.Group id="date">
              <Form.Label>Date Of Your Event</Form.Label>
              <Form.Control type="datetime-local" ref={dateRef} required />
            </Form.Group>
            <Form.Group id="image">
              <Form.Label>Upload An Event Image</Form.Label>
              <Form.File ref={imageRef} />
            </Form.Group>
            <Button disabled={loading} className="w-100" style={{backgroundColor: "#006633"}} type="submit">
              Create Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal> 
      
    </div>
  );
};

export default Map;
