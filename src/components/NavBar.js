import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import Button from "@material-ui/core/Button";

import Collapse from "@material-ui/core/Collapse";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import Map from "./Map";
import ProfileCard from "./ProfileCard";
import EventsList from "./EventsList";
import Popup from "./Popup";

import { useState, useEffect, useCallback, useRef } from "react";

import fbArray from '../apis/firebase.js';
// get firebase stuff
const db = fbArray.db;
const auth = fbArray.auth;

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openFolder, setOpenFolder] = React.useState(false);

  const handleClick = () => {
    setOpenFolder(!openFolder);
  };

  const mapRef = useRef();

  // functions for account-related features
  function signinButton() {
    console.log("Sign-in Button was clicked!");
    console.log("Enter user email and then password")
    const email = prompt();
    const password = prompt();

    auth.signInWithEmailAndPassword(email, password).then(cred => {
      console.log(cred.user.email);
      console.log("Signed in!");
    })

  }

  function logoutButton() {
    console.log("Logout Button was clicked!")
    auth.signOut().then(() => {
      // function that runs when the user is signed out
      console.log("user signed out");
  })
  }

  function viewSavedEventsButton() {
    console.log("Here are your saved events:");
    // get current user
    var user = auth.currentUser;
    // if user exists (you are signed in)
    if (user) {
      // access the correct document in "users"
      db.collection("users").doc(user.uid).get().then(doc => {
        var myEvents = doc.data().savedevents;
        //console.log(myEvents);
        // loop through event uids saved in the savedevents array
        if (!(myEvents === undefined)) {
          console.log("Your saved event titles: ");
          myEvents.forEach(id => {
            db.collection("Events").doc(id).get().then(doc2 => {
              // doc2 is the event document from Events
              //console.log(doc2);
              if (doc2.exists) {
                console.log(doc2.data().title);
              }
              else {
                console.log(`Doc with id ${id} not found`);
              }
            });
          });
        }
        else {
          console.log("No events found");
        }
      });
    }
    else {
      console.log("You are not signed in. Sign in to view saved events");
    }
  }


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ backgroundColor: "#0fba06" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            GMU EventScope📢
          </Typography>
          <section className={classes.rightToolbar}>
            <button type="button" className="btn btn-signIn" onClick={signinButton}> Sign-In</button>
            <button type="button" className="btn btn-logout" onClick={logoutButton}> Log Out</button>
            <button type="button" className="btn btn-viewSavedEvents" onClick={viewSavedEventsButton}> View Saved Events</button>
          </section>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>

        <Divider />

        <ProfileCard />

        <Divider />
        <EventsList mapRef={mapRef} />

        <Divider />
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="List of Boxes" />
          {openFolder ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openFolder} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Inside of Nest !" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Another one" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="And Another one" />
            </ListItem>
          </List>
        </Collapse>
        {/* 
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Map mapRef={mapRef} />
      </main>
    </div>
  );
}
