  import React from 'react'
  import {Button, Card, ListGroup, ListGroupItem} from 'react-bootstrap'
  import 'bootstrap/dist/css/bootstrap.min.css';
  //import './EventMarker.css';
  import useButtonLoader from './Buttons.js';
  import fbArray from '../apis/firebase.js';

  // get firebase stuff
  const db = fbArray.db;
  const auth = fbArray.auth;

  //adds artificial delay for loading (cuz too fast, user can't see loading msg)
  function loadingDelay(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  //buttons help: https://react-bootstrap.github.io/components/buttons/
  //Followed this for loading buttons: https://www.youtube.com/watch?v=nCEnqQABC5A via hooks
  const Marker = (props) => {
    //button hook thing, name the buttons here (static text, loading text)
    //useButtonLoader is in Button.js (for loading buttons)
    const [Button1Load,setLoadingButton1] = useButtonLoader("Attend","Updating..");
    const [Button2Load,setLoadingButton2] = useButtonLoader("Save Event","Saving..");
    const [Button3Load,setLoadingButton3] = useButtonLoader("Report","Getting Report Ready..");
    
    // used to display the end date, but only if it is entered
    let useLocation = "";
    if (props.building) {
      useLocation = "Located in " + props.building
      if (props.room) {
        useLocation += " room " + props.room;
      }
    }
    
    //I'm here
    const Button1 = () => {
      //loading
      setLoadingButton1(true);
      loadingDelay(220).then(() => {
        console.log("This does nothing right now, need to figure out the best way to store this data.")

        //stops loading
        setLoadingButton1(false);
      }); 
    };

    //Save Event
    const Button2 = () => {
      //loading
      setLoadingButton2(true);
      loadingDelay(420).then(() => {
        // find current user doc in firestore
        const user = auth.currentUser;
        if (!user) {
          // user is not signed in
          // TODO this should show the log-in menu
          setLoadingButton2(false);
          return;
        }
        // get current event reference
        const curEvent = props.docID;
        db.collection("users").doc(user.uid).get().then(doc => {
            // check if doc exists
            if (!doc.exists) {
              // create new document
              db.collection("users").doc(user.uid).set( {
                savedevents: curEvent
              })
            }
            else {
              // get current list of events
              let myEvents = doc.data().savedevents;

              if (myEvents === undefined) {
                myEvents = [];
              }
              // check if the event is already saved
              // TODO move this to a server-side function
              let found = false;
              myEvents.forEach(eventID => {
                if (eventID === curEvent) {
                  console.log("Event is already saved")
                  found = true;
                }
              });
              if (!found) {
                // add to list
                myEvents.push(curEvent);
                // replace old list on db with new list
                db.collection("users").doc(user.uid).update({
                  savedevents: myEvents
                });
              props.setSavedEvents(savedEvents => [...savedEvents, {
                  author: props.author,
                  title: props.title,
                  context: props.context,
                  type: props.type,
                  docID: props.docID
              }]);
              console.log("done saving event");
              }
              else {
                // TEMPORARY code to unsave an event
                myEvents.splice(myEvents.indexOf(curEvent), 1);
                // replace old list on db with new list
                db.collection("users").doc(user.uid).update({
                  savedevents: myEvents
                });

                props.setSavedEvents(props.savedEvents.filter(item => item.docID != curEvent));
              }
            } 
        });
        
        //stops loading
        setLoadingButton2(false);
      });
    };

    //Report
    const Button3 = () => {
      //loading
      setLoadingButton3(true);
      loadingDelay(420).then(() => {
        //fetch stuff is placeholder
        fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          //stops loading
          setLoadingButton3(false);
        });
      });
    };

    // gets a nice looking x:xx xm output
    function getTimeString(input) {
      let date = input.toDate();
      let hoursString = date.getHours();
      let ampm = "am"
      if (parseInt(hoursString) >= 12) {
        ampm = "pm";
        if (parseInt(hoursString) > 12) {
          hoursString = (parseInt(hoursString)-12).toString();
        }
      }
      if (parseInt(hoursString) == 0) {
        hoursString = "12";
      }
      let minutes = date.getMinutes().toString();
      //console.log(minutes.length)
      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }
      return hoursString + ":" + minutes + " " + ampm;
    }

    //<Card.Img letiant="top" src="/gmulogo.png" />
    return (
        <div>
          <Card style={{ width: '25rem'}} bg={"Light"} >   
          <Card.Header>
            <Card.Text size="18">
              <h3>{props.title}</h3> Hosted by <b>{props.author}</b>
            </Card.Text>
          </Card.Header> 
          <Card.Body>
            {props.date &&
              <div>
              <Card.Subtitle><u>Starting: </u></Card.Subtitle>
              <Card.Text style={{fontSize: 18}}><p>{props.date}</p></Card.Text>
              </div>
            }
            {props.enddate &&
              <div>
              <Card.Subtitle><u>Ending: </u></Card.Subtitle>
              <Card.Text style={{fontSize: 18}}><p>{props.enddate}</p></Card.Text>
              </div>
            }
            {props.context &&
              <div>
                <Card.Subtitle><u>Description</u></Card.Subtitle>
                <Card.Text><p>{props.context}</p></Card.Text>
              </div>
            }
            {useLocation &&
              <div>
                <Card.Subtitle>Location:</Card.Subtitle>
                <Card.Text><p>{useLocation}</p></Card.Text>
              </div>
            }
            {props.link &&
              <div>
                <Card.Subtitle><u>Link:</u></Card.Subtitle>
                <Card.Link style={{fontSize: 18}} href={props.link} target="_blank"><p>Event Link</p></Card.Link>
              </div>
            }
            <Button letiant="primary mr-2" size='lg' onClick={Button1} ref={Button1Load}>
            </Button>
            <Button letiant="info mr-2" size='lg' onClick={Button2} ref={Button2Load}>
            </Button>
            <Button letiant="danger mr-2" size='lg' onClick={Button3} ref={Button3Load}>
            </Button>
            <a href="" className="btn btn-outline-success btn-sm">Read More</a>
          </Card.Body>
        </Card>
        </div>
      )
  }

  export default Marker
