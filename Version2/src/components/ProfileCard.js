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

export default function ProfileCard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar alt="InsertNameHere" src="./patriotlogo.png" />
      <Typography variant="h4" gutterBottom>
        Hello, User!
      </Typography>
    </div>
  );
}