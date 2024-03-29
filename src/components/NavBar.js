import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme, fade } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MaterialButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";


import Map from "./Map";
import ProfileCard from "./ProfileCard";
import EventsList from "./EventsList";

import { useState, useRef } from "react";

import fbArray from "../apis/firebase.js";

//auth (login/signup) stuff//
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../contexts/AuthContext";
import { Form } from "react-bootstrap";

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
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
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

  // const [openFolder, setOpenFolder] = React.useState(false);

  // const handleClick = () => {
  //   setOpenFolder(!openFolder);
  // };

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

  // current profile pic
  const [curProfPic, setCurProfPic] = useState([]);

  const mapRef = useRef();

  //////USER AUTHENTICATION//////... these all communicate with AuthContext.js
  const [signupShow, signupSetShow] = useState(false);
  const [signupOrgShow, signupOrgSetShow] = useState(false);
  const [loginShow, loginSetShow] = useState(false);
  const [uploadShow, uploadSetShow] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuCloseWithSnackBar = (message, severity) => {
    handleSnackBarClick(message, severity);
    setAnchorEl(null);
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem
        onClick={() => handleMenuCloseWithSnackBar("Profile Clicked", "error")}
      >
        <ListItemIcon>
          <FaceIcon />
        </ListItemIcon>
        <Typography variant="inherit">Profile</Typography>
      </MenuItem>
      <MenuItem
        onClick={() =>
          handleMenuCloseWithSnackBar("My account Clicked", "warning")
        }
      >
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <Typography variant="inherit">My account</Typography>
      </MenuItem>
      <MenuItem
        onClick={() =>
          handleMenuCloseWithSnackBar("View Saved Events Clicked", "info")
        }
      >
        <ListItemIcon>
          <EventIcon />
        </ListItemIcon>
        <Typography variant="inherit">View Saved Events</Typography>
      </MenuItem> */}
      <MenuItem
        onClick={() => {
          handleLogout();
          handleMenuCloseWithSnackBar("You have been logged out", "success");
        }}
      >
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <Typography variant="inherit">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const [snackbarOpen, setSnackbaropen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const handleSnackBarClick = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbaropen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbaropen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  //handle visibility of the login or signup modals
  const handleSignupClose = () => signupSetShow(false);
  const handleSignupShow = () => signupSetShow(true);
  const handleSignupOrgClose = () => signupOrgSetShow(false);
  const handleSignupOrgShow = () => signupOrgSetShow(true);
  const handleLoginClose = () => loginSetShow(false);
  const handleLoginShow = () => loginSetShow(true);
  const handleUploadClose = () => uploadSetShow(false);
  // const handleUploadShow = () => uploadSetShow(true);

  //stored values for authentication
  //normal auth
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const usernameRef = useRef();
  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const signupConfPasswordRef = useRef();
  //org auth
  const orgnameRef = useRef();
  const signupOrgEmailRef = useRef();
  const signupOrgPasswordRef = useRef();
  const signupOrgConfPasswordRef = useRef();

  const { signup, login, logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //this signs people up with the stuff from the signup form
  async function handleSignup(event) {
    console.log("Sign Up Button was clicked!");
    event.preventDefault();

    //this just makes sure the passwords match
    if (
      signupPasswordRef.current.value !== signupConfPasswordRef.current.value
    ) {
      return setError("Passwords do not match");
    }

    //this will attempt to signup user based on input and catch an error that occurs
    //this blocks further input after the submit button is first clicked, so you can't spam create
    //the same account
    try {
      setError("");
      setLoading(true);
      await signup(
        signupEmailRef.current.value,
        signupPasswordRef.current.value,
        usernameRef.current.value,
        "user"
      );
      handleSignupClose();
      setLoggedIn(true);
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
    if (
      signupOrgPasswordRef.current.value !==
      signupOrgConfPasswordRef.current.value
    ) {
      return setError("Passwords do not match");
    }

    //this will attempt to signup user based on input and catch an error that occurs
    //this blocks further input after the submit button is first clicked, so you can't spam create
    //the same account
    try {
      setError("");
      setLoading(true);
      await signup(
        signupOrgEmailRef.current.value,
        signupOrgPasswordRef.current.value,
        orgnameRef.current.value,
        "org"
      );
      handleSignupOrgClose();
      setLoggedIn(true);
    } catch {
      setError("Failed to log in");
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

      handleLoginClose();
      handleMenuCloseWithSnackBar("You have been logged In", "success");
      setLoggedIn(true);
    } catch {
      handleMenuCloseWithSnackBar("You have been Failed to log in", "error");
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
      setLoggedIn(false);
    } catch {
      setError("Failed to log out");
    }
    setLoading(false);
  }
  /////////////////////////////////////////////////////////////////////////////

  // function viewSavedEventsButton() {
  //   // get current user
  //   let user = auth.currentUser;
  //   // if user exists (you are signed in)
  //   if (user) {
  //     // access the correct document in "users"
  //     db.collection("users")
  //       .doc(user.uid)
  //       .get()
  //       .then((doc) => {
  //         let myEvents = doc.data().savedevents;
  //         //console.log(myEvents);
  //         // loop through event uids saved in the savedevents array
  //         if (!(myEvents === undefined)) {
  //           console.log(user.email);
  //           console.log("Your saved event titles: ");
  //           myEvents.forEach((id) => {
  //             db.collection("Events")
  //               .doc(id)
  //               .get()
  //               .then((doc2) => {
  //                 // doc2 is the event document from Events
  //                 //console.log(doc2);
  //                 if (doc2.exists) {
  //                   console.log(doc2.data().title);
  //                 } else {
  //                   console.log(`Doc with id ${id} not found`);
  //                 }
  //               });
  //           });
  //         } else {
  //           console.log("No events found");
  //         }
  //       });
  //   } else {
  //     console.log("You are not signed in. Sign in to view saved events");
  //   }
  // }

  // image being uploaded
  let uploadingImage = {};
  // uploads an image to storage profile/user.uid
  async function handleUpload(event) {
    console.log("pp click");
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await fbArray.storage
        .ref("profile/" + auth.currentUser.uid + ".jpg")
        .put(uploadingImage);
      uploadSetShow(false); // close modal if successful
    } catch {
      setError("Failed to upload image");
    }
    setLoading(false);
  }
  // used to get the image and store in uploadingImage
  function chooseFile(e) {
    uploadingImage = e.target.files[0];
  }

  function getCurrentProfPic() {
    if (!auth.currentUser) {
      return;
    }
    const reference = fbArray.storage.ref(
      `profile/${auth.currentUser.uid}.jpg`
    );
    reference
      .getDownloadURL()
      .then((url) => {
        setCurProfPic(url);
      })
      .catch((e) => {
        console.log(e.message);
        const reference2 = fbArray.storage.ref(`profile/169-logo.png`);
        reference2
          .getDownloadURL()
          .then((url2) => {
            setCurProfPic(url2);
          })
          .catch((e2) => {
            console.log(e2.message);
          });
      });
    return curProfPic;
  }
  getCurrentProfPic();

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
              <span role="img" aria-label="mapemoji">
                🗺️
              </span>{" "}
              GMU EventScope{" "}
              <span role="img" aria-label="megaphoneemoji">
                📢
              </span>
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
            <section className={classes.rightToolbar}>
              {loggedIn ? (
                <>
                  {/* <IconButton
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={() =>
                      handleSnackBarClick("infobox Clicked !", "success")
                    }
                  >
                    <Badge badgeContent={1} color="secondary">
                      <MailIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={() => handleSnackBarClick("Bell Clicked", "error")}
                  >
                    <Badge badgeContent={5} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton> */}
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    // aria-controls={}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  {/* 
                  <MaterialButton
                    variant="outlined"
                    color="inherit"
                    onClick={handleLogout}
                  >
                    Log Out
                  </MaterialButton>
                  <MaterialButton
                    variant="outlined"
                    color="inherit"
                    onClick={viewSavedEventsButton}
                  >
                    View Saved Events
                  </MaterialButton> */}
                </>
              ) : (
                <MaterialButton
                  variant="outlined"
                  color="inherit"
                  onClick={handleLoginShow}
                >
                  Login/SignUp
                </MaterialButton>
              )}
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
          <EventsList
            mapRef={mapRef}
            savedEvents={savedEvents}
            setSavedEvents={setSavedEvents}
          />

          <Divider />
          {/* <ListItem button onClick={handleClick}>
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
          </Collapse> */}
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Map
            mapRef={mapRef}
            filter={filter}
            setFilter={setFilter}
            savedEvents={savedEvents}
            setSavedEvents={setSavedEvents}
            handleMenuCloseWithSnackBar={handleMenuCloseWithSnackBar}
          />
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
                <Form.Control
                  type="password"
                  ref={signupPasswordRef}
                  required
                />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={signupConfPasswordRef}
                  required
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100"
                style={{ color: "white", backgroundColor: "#006633" }}
                type="submit"
              >
                Sign Up
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 text-center">
              Already have an Account?
              <Button
                style={{ margin: "4px" }}
                onClick={() => {
                  handleSignupClose();
                  handleLoginShow();
                }}
              >
                Log In
              </Button>
            </div>
            <div className="w-100 text-center">
              Are you an Organization?
              <Button
                style={{ margin: "4px" }}
                onClick={() => {
                  handleSignupClose();
                  handleSignupOrgShow();
                }}
              >
                Organization Sign Up
              </Button>
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
              <Button
                disabled={loading}
                className="w-100"
                style={{ backgroundColor: "#006633" }}
                type="submit"
              >
                Log In
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 text-center">
              Need an Account?
              <Button
                style={{ margin: "4px" }}
                onClick={() => {
                  handleLoginClose();
                  handleSignupShow();
                }}
              >
                Sign Up
              </Button>
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
                <Form.Control
                  type="password"
                  ref={signupOrgPasswordRef}
                  required
                />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={signupOrgConfPasswordRef}
                  required
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100"
                style={{ backgroundColor: "#006633" }}
                type="submit"
              >
                Sign Up
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100 text-center">
              Already have an Organization Account?
              <Button
                style={{ margin: "4px" }}
                onClick={() => {
                  handleSignupOrgClose();
                  handleLoginShow();
                }}
              >
                Log In
              </Button>
            </div>
            <div className="w-100 text-center">
              Not an Organization?
              <Button
                style={{ margin: "4px" }}
                onClick={() => {
                  handleSignupOrgClose();
                  handleSignupShow();
                }}
              >
                Sign Up
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Profile Picture Upload Modal*/}
        <Modal show={uploadShow} onHide={handleUploadClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload Profile Picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Current Profile Picture: </p>
            <img src={curProfPic} style={{ height: "200px" }}></img>
            <Form onSubmit={handleUpload}>
              <Form.Group id="image">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => chooseFile(e)}
                  required
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100"
                style={{ backgroundColor: "#006633" }}
                type="submit"
                onClick={handleUpload}
              >
                Upload
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {renderMenu}
    </>
  );
}
