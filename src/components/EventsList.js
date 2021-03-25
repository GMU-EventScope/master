import fbArray from "../apis/firebase.js";

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
        },
      ]);
    });
    // set Events with fetchedDate array
    setEvents(fetchedData);
  };

  // set up real-time listener
  db.collection("users")
    .orderBy("bio")
    .onSnapshot((snapshot) => {
      // console.log("real-time listener fired");

      let changes = snapshot.docChanges();
      // loop through each change
      changes.forEach((change) => {
        if (change.type == "modified") {
          //console.log("modified detected");
          console.log(change.doc.id);
          // check if current user was modified
          if (change.doc.id == auth.currentUser.uid) {
            console.log("you changed something for this account");
            //setEvents(change.doc.data().savedevents);
            // TODO do something here that changes the left side bar
            // this whole listener might need to be in another file
          }
        }
      });
    });

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
        <React.Fragment key={`${marker.lat}-${marker.lng}`}>
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
        </React.Fragment>
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
