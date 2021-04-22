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
import MaterialButton from '@material-ui/core/Button';
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';


import Map from "./Map";
import ProfileCard from "./ProfileCard";
import EventsList from "./EventsList";

import { useState ,useRef } from "react";



import fbArray from '../apis/firebase.js';

//auth (login/signup) stuff//
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Alert } from "react-bootstrap";

//get firebase stuff
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
    '& > *': {
      margin: theme.spacing(0.5),
    },
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

    
  const [filter, setFilter] = useState({
    type1: true,
    type2: true,
    type3: true,
    filterTagFree: true,
    filterTagSports: true,
    filterTagArts: true,
    filterTagClub: true,
    filterTagFundraiser: true,
    filterTagNeedTicket: true,
  });

  // used in the left side bar, passed to the map which passes to EventMarker
  const [savedEvents, setSavedEvents] = useState([]);

  const mapRef = useRef();

  //////USER AUTHENTICATION//////... these all communicate with AuthContext.js
  const [signupShow, signupSetShow] = useState(false);
  const [signupOrgShow, signupOrgSetShow] = useState(false);
  const [loginShow, loginSetShow] = useState(false);

  //handle visibility of the login or signup modals
  const handleSignupClose = () => signupSetShow(false);
  const handleSignupShow = () => signupSetShow(true);
  const handleSignupOrgClose = () => signupOrgSetShow(false);
  const handleSignupOrgShow = () => signupOrgSetShow(true);
  const handleLoginClose = () => loginSetShow(false);
  const handleLoginShow = () => loginSetShow(true);

  //stored variables for authentication
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const usernameRef = useRef();
  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const signupConfPasswordRef = useRef();
  const orgnameRef = useRef();
  const signupOrgEmailRef = useRef();
  const signupOrgPasswordRef = useRef();
  const signupOrgConfPasswordRef = useRef();
  const {signup, login, logout} = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //this signs people up with the stuff from the signup form
  async function handleSignup(event) {
    console.log("Sign Up Button was clicked!");
    event.preventDefault();

    //this just makes sure the passwords match
    if (signupPasswordRef.current.value !== signupConfPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    //this will attempt to signup user based on input and catch an error that occurs
    //this blocks further input after the submit button is first clicked, so you can't spam create 
    //the same account
    try {
      setError("");
      setLoading(true);
      await signup(signupEmailRef.current.value, signupPasswordRef.current.value, usernameRef.current.value, "user");
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  //this signs up ORGANIZATIONS from the org signup form
  async function handleSignupOrg(event) {
    console.log("Sign Up Button was clicked!");
    event.preventDefault();

    //this just makes sure the passwords match
    if (signupOrgPasswordRef.current.value !== signupOrgConfPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    //this will attempt to signup user based on input and catch an error that occurs
    //this blocks further input after the submit button is first clicked, so you can't spam create 
    //the same account
    try {
      setError("");
      setLoading(true);
      var errorMessage = await signup(signupOrgEmailRef.current.value, signupOrgPasswordRef.current.value, orgnameRef.current.value, "org");
      console.log(errorMessage);
    } catch {
      setError(errorMessage);
    }

    setLoading(false);
  }

  //this logs people in with the stuff from the login form
  async function handleLogin(event) {
    console.log("Login Button was clicked!");
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(loginEmailRef.current.value, loginPasswordRef.current.value);
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  //this handles logging out
  async function handleLogout() {
    setError("");

    try {
      setLoading(true);
      await logout();
      //history.push("/login");
    } catch {
      setError("Failed to log out");
    }
    setLoading(false);
  }
  /////////////////////////////////////////////////////////////////////////////

  function viewSavedEventsButton() {

    // get current user
    let user = auth.currentUser;
    // if user exists (you are signed in)
    if (user) {
      // access the correct document in "users"
      db.collection("users").doc(user.uid).get().then(doc => {
        let myEvents = doc.data().savedevents;
        //console.log(myEvents);
        // loop through event uids saved in the savedevents array
        if (!(myEvents === undefined)) {
          console.log(user.email);
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
    <>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ backgroundColor: "#11a608" }}>
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
          <span role="img" aria-label="mapemoji">🗺️</span> GMU EventScope <span role="img" aria-label="megaphoneemoji">📢</span>
          </Typography>
          <section className={classes.rightToolbar}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              // aria-controls={}
              aria-haspopup="true"
              // onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <MaterialButton variant="outlined" color="inherit" onClick={handleLoginShow}>
            Login/SignUp
            </MaterialButton>
            <MaterialButton variant="outlined" color="inherit" onClick={handleLogout}>
            Log Out
            </MaterialButton>
            <MaterialButton variant="outlined" color="inherit" onClick={viewSavedEventsButton}>
            View Saved Events
            </MaterialButton>
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
        <EventsList mapRef={mapRef} savedEvents={savedEvents} setSavedEvents={setSavedEvents}/>

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
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Map mapRef={mapRef} filter={filter} setFilter={setFilter} savedEvents={savedEvents} setSavedEvents={setSavedEvents}/>
      </main>
{/********AUTHENTICATION MODALS********/}
    {/*Non-organization Accounts*/}
    <Modal show={signupShow} onHide={handleSignupClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSignup}>
        <Form.Group id="username">
            <Form.Label>User Name (Seen by other users)</Form.Label>
            <Form.Control type="username" ref={usernameRef} required />
          </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={signupEmailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={signupPasswordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={signupConfPasswordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" style={{backgroundColor: "#006633"}} type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 text-center">
            Already have an Account?
            <Button style={{margin: "4px"}} onClick={() => {handleSignupClose(); handleLoginShow();}}>Log In</Button>
          </div>
          <div className="w-100 text-center">
            Are you an Organization?
            <Button style={{margin: "4px"}} onClick={() => {handleSignupClose(); handleSignupOrgShow();}}>Organization Sign Up</Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={loginShow} onHide={handleLoginClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={loginEmailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={loginPasswordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" style={{backgroundColor: "#006633"}} type="submit">
              Log In
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 text-center">
            Need an Account?
            <Button style={{margin: "4px"}} onClick={() => {handleLoginClose(); handleSignupShow();}}>Sign Up</Button>
          </div>
        </Modal.Footer>
      </Modal>

    {/*Organization Accounts*/}
      <Modal show={signupOrgShow} onHide={handleSignupOrgClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Organization Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignupOrg}>
          <Form.Group id="username">
            <Form.Label>Organization Name (Seen by other users)</Form.Label>
            <Form.Control type="username" ref={orgnameRef} required />
          </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={signupOrgEmailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={signupOrgPasswordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={signupOrgConfPasswordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" style={{backgroundColor: "#006633"}} type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 text-center">
            Already have an Organization Account?
            <Button style={{margin: "4px"}} onClick={() => {handleSignupOrgClose(); handleLoginShow();}}>Log In</Button>
          </div>
          <div className="w-100 text-center">
            Not an Organization?
            <Button style={{margin: "4px"}} onClick={() => {handleSignupOrgClose(); handleSignupShow();}}>Sign Up</Button>
          </div>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
}