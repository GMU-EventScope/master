import React from 'react'
import {Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './EventMarker.css';
import useButtonLoader from './Buttons.js';

//TODOs: connect to firebase (card image,and just in general for buttons), add artificial delay

//adds artificial delay for loading (cuz too fast, user can't see loading msg)
function loadingDelay() {
  return new Promise((resolve) => setTimeout(resolve, 420));
}

//buttons help: https://react-bootstrap.github.io/components/buttons/
//Followed this for loading buttons: https://www.youtube.com/watch?v=nCEnqQABC5A via hooks
const Marker = (props) => {
  //button hook thing, name the buttons here (static text, loading text)
  //useButtonLoader is in Button.js
  const [Button1Load,setButton1] = useButtonLoader("I'm here","Updating..");
  const [Button2Load,setButton2] = useButtonLoader("Save Event","Saving..");
  const [Button3Load,setButton3] = useButtonLoader("Report","Getting Report Ready..");

  //eventually change placeholder stuff to connect to firebase

  // might be a bad way of adding 0.5s delay (below in button consts)...
  // could fetch then do loadingDelay()?

  //I'm here
  const Button1 = () => {
    //essential
    setButton1(true);
    loadingDelay().then(() => {
      //fetch stuff is placeholder
      fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //esential
        setButton1(false);
      });
    });
  };

  //Save Event
  const Button2 = () => {
    //essential
    setButton2(true);
    loadingDelay().then(() => {
      //fetch stuff is placeholder
      fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //esential
        setButton2(false);
      });
    });
  };

  //Report
  const Button3 = () => {
    //essential
    setButton3(true);
    loadingDelay().then(() => {
      //fetch stuff is placeholder
      fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //esential
        setButton3(false);
      });
    });
  };

  // eventually want to make the Card.Img the user uploaded one from db
  // Maybe for the "I'm here" button, disable the button and turn red after clicked (and loading)?
  
  //Below is actual card
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
