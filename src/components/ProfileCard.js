import fbArray from "../apis/firebase.js";
import React from 'react';
import { useState, useRef, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Form, Button, Alert } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

//get firebase stuff
const auth = fbArray.auth;
const db = fbArray.db;

export default function ProfileCard() {
  const classes = useStyles();
  /////USERNAME STUFF/////
  //stored variable for username
  const [username, setUsername] = useState("User");

  //display current user's username in the left sidebar
  const currUser = auth.currentUser;
  const fetchUsername = () => {
    if (currUser) {
      //user is signed in.
      db.collection("users").doc(currUser.uid).get().then((doc) => {
        if (doc.exists) {
            setUsername(doc.get("username"));
        } else {
            //doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    } else {
      //no user is signed in.
    }
  }

  useEffect(() => {
    fetchUsername();
  });

  
  return (
    <div className={classes.root}>
      <Avatar alt="InsertNameHere" src="./patriotlogo.png" />
      <Typography variant="h4" gutterBottom>
        Hello, {username}!
      </Typography>
    </div>
  );
}