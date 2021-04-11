import fbArray from "../apis/firebase.js";

import React from 'react';
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

const auth = fbArray.auth;

export default function ProfileCard() {


  const classes = useStyles();
  const currUser = auth.currentUser;
  let username = "User";

  if (currUser)
    username = currUser.name;

  return (
    <div className={classes.root}>
      <Avatar alt="InsertNameHere" src="./patriotlogo.png" />
      <Typography variant="h4" gutterBottom>
        Hello, {username}!
      </Typography>
    </div>
  );
}