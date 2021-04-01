import fbArray from '../apis/firebase.js';

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import ReportIcon from "@material-ui/icons/Report";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";

import { useState, useEffect, useCallback, useRef } from "react";

import Popup from "./Popup";

const db = fbArray.db;
const auth = fbArray.auth;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const EventsList = ({ mapRef }) => {
  // List of events as a useState
  const [events, setEvents] = useState([]);

  const [markers, setMarkers] = useState([]);

  // Use Callback to save a function that moves lat and lng and set Zoom to 14
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);
  
  // Try to get events from 'Events' collection from the Firebase
  const fetchEvents =  () => {

    // this first "get" does nothing but delay so that auth.currentUser does not always return null
    db.collection("users").get().then(() => {
      const currUser = auth.currentUser;
      console.log(currUser);
      // get user doc matching user uid
      if (currUser == null) {
        setEvents([]);
      }
      else {
        db.collection("users").doc(currUser.uid).get().then((userDoc) => {
          var myEvents = userDoc.data().savedevents;
          const fetchedData = [];
          myEvents.forEach((eventID) => {
            // get the document in Events matching the docID
            db.collection("Events").doc(eventID).get().then((eventDoc) => {
              
              fetchedData.push(eventDoc.data());
              
              setMarkers((current) => [
                ...current,
                {
                  lat: eventDoc.data().latitude,
                  lng: eventDoc.data().longitude,
                  date: eventDoc.data().date.toDate().toDateString(),
                  author: eventDoc.data().author,
                  title: eventDoc.data().title,
                  context: eventDoc.data().context,
                  type: eventDoc.data().type,
                },
              ]);
            })
          });
          setEvents(fetchedData);
        });
      }
    });
  };

  // useEffect fetch events when the page renders
  useEffect(() => {
    fetchEvents();
  }, []);

  function getImageType(type) {
    if (type == 1) {
      return <SentimentSatisfiedAltIcon />;
    } else if (type == 2) {
      return <ReportIcon />;
    } else return <ImageIcon />;
  }

  // simple function to differentiate types
  function getLogoType(type) {
    if (type == 1) {
      return `/patriotlogo.png`;
    } else if (type == 2) {
      return `/gmustar.png`;
    } else return `/wearemason.png`;
  }

  const [modalopen, setModalOpen] = useState(false);

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const [info, setInfo] = useState([]);

  const classes = useStyles();
  return (
    <List className={classes.root}>
      {modalopen ? (
        <Popup
          modalopen={modalopen}
          handleClose={handleClose}
          info={info}
          mapRef={mapRef}
        />
      ) : null}
      {markers.map((marker) => (
        <>
          <ListItem
            alignItems="flex-start"
            onClick={() => {
              handleOpen();
              setInfo(marker);
            }}
          >
            <ListItemAvatar>
              <Avatar alt={marker.author} src={getLogoType(marker.type)} />
            </ListItemAvatar>
            <ListItemText
              primary={marker.title}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {marker.author} -
                  </Typography>
                  {marker.context}
                </React.Fragment>
              }
            />
          </ListItem>
        </>
      ))}

      {/* <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Photos" secondary="Jan 9, 2014" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <WorkIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Work" secondary="Jan 7, 2014" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Vacation" secondary="July 20, 2014" />
        </ListItem> */}
    </List>
  );
};

export default EventsList;
