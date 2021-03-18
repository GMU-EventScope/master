import React from 'react'
import {Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
//import './EventMarker.css';
import useButtonLoader from './Buttons.js';
import fbArray from '../apis/firebase.js';

// get firebase stuff
const db = fbArray.db;
const auth = fbArray.auth;

//TODOs: connect to firebase (card image,and just in general for buttons)

//adds artificial delay for loading (cuz too fast, user can't see loading msg)
function loadingDelay(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

//buttons help: https://react-bootstrap.github.io/components/buttons/
//Followed this for loading buttons: https://www.youtube.com/watch?v=nCEnqQABC5A via hooks
const Marker = (props) => {
  //button hook thing, name the buttons here (static text, loading text)
  //useButtonLoader is in Button.js (for loading buttons)
  const [Button1Load,setLoadingButton1] = useButtonLoader("I'm here","Updating..");
  const [Button2Load,setLoadingButton2] = useButtonLoader("Save Event","Saving..");
  const [Button3Load,setLoadingButton3] = useButtonLoader("Report","Getting Report Ready..");

  //eventually change placeholder stuff to connect to firebase
  //would also need to modify and add user stuff (so ex. save event saves to right account)

  // might be a bad way of adding 0.420s delay (below in button consts)...
  // could fetch then do loadingDelay()?

  //I'm here
  const Button1 = () => {
    //essential
    setLoadingButton1(true);
    loadingDelay(220).then(() => {
      //fetch stuff is placeholder
      fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //esential
        setLoadingButton1(false);
      });
    }); 
  };

  //Save Event
  const Button2 = () => {
    //essential
    setLoadingButton2(true);
    loadingDelay(420).then(() => {
      // find current user doc in firestore
      const user = auth.currentUser;
      // get current event reference
      const curEvent = "placeholder value";
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
            var myEvents = doc.data().savedevents;
            
            // add to list
            myEvents.push(curEvent);
            // replace old list on db with new list
            db.collection("users").doc(user.uid).update({
              savedevents: myEvents
            });
            console.log("done saving event");
        }
      });
      
      //esential
      setLoadingButton2(false);
    });
  };

  //Report
  const Button3 = () => {
    //essential
    setLoadingButton3(true);
    loadingDelay(420).then(() => {
      //fetch stuff is placeholder
      fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //esential
        setLoadingButton3(false);
      });
    });
  };

  // eventually want to make the Card.Img the user uploaded one from db
  // Maybe for the "I'm here" button, disable the button and turn red after clicked (and loading)?
  // not sure how we are going to do it per user
  
  //Below is actual card
  //Title is like "Godzilla", author is "eminem"
  //Props.date not used yet?
  //props.context is description
  return (
      <div>
        <Card style={{ width: '22rem'}} bg={"success"} border={"warning"}>    
        <Card.Img variant="top" src="/gmulogo.png" />
        <Card.Body>
          <Card.Title>{props.title} - {props.author}</Card.Title>
          <Card.Text>
            <h3>{props.date}</h3>
            {props.context}
          </Card.Text>
          <Button variant="primary mr-2" size='lg' block onClick={Button1} ref={Button1Load}>
           </Button>
          <Button variant="info mr-2" size='lg' block onClick={Button2} ref={Button2Load}>
           </Button>
          <Button variant="danger mr-2" block onClick={Button3} ref={Button3Load}>
           </Button>
        </Card.Body>
      </Card>
      </div>
    )
}

export default Marker
