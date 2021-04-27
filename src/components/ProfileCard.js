import fbArray from "../apis/firebase.js";
import { useAuth } from "../contexts/AuthContext.js";
import React from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

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
  //get the user data from AuthContext
  const [username, setUsername] = useState("User");
  const classes = useStyles();

  const currUser = auth.currentUser;
  const fetchUsername = () => {
    if (currUser) {
      // User is signed in.
      db.collection("users").doc(currUser.uid).get().then((doc) => {
        if (doc.exists) {
            setUsername(doc.get("username"));
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    } else {
      // No user is signed in.
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