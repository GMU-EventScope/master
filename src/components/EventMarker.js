import React from 'react'
import {Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './EventMarker.css';
import useButtonLoader from './Buttons';

//TODOs: connect to firebase (card image,and just in general for buttons)

//adds artificial delay for loading (cuz too fast)
function loadingDelay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

//buttons help: https://react-bootstrap.github.io/components/buttons/
//Followed this for loading buttons: https://www.youtube.com/watch?v=nCEnqQABC5A via hooks
const Marker = (props) => {
  //button hook thing, name the buttons here
  const [Button1Load,setButton1] = useButtonLoader("I'm here","Updating..");
  const [Button2Load,setButton2] = useButtonLoader("Save Event","Saving..");
  const [Button3Load,setButton3] = useButtonLoader("Report","Getting Report Ready..");

  //eventually change placeholder stuff to connect to firebase
  
  //I'm here
  const Button1 = () => {
    setButton1(true);
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //delay no work
        loadingDelay();
        setButton1(false);
      });
  };
  //Set Reminder
  const Button2 = () => {
    setButton2(true);
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setButton2(false);
      });
  };
  //Report
  const Button3 = () => {
    setButton3(true);
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setButton3(false);
      });
  };

  // eventually want to make the Card.Img the user submitted one from db
  // Maybe for the "I'm here" button, disable the button and turn red after clicked (and loading)?
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
          <Button variant="info mr-2" block onClick={Button2} ref={Button2Load}>
           </Button>
          <Button variant="danger mr-2" block onClick={Button3} ref={Button3Load}>
           </Button>
        </Card.Body>
      </Card>
      </div>
    )
}


//BELOW HAS PROBLEM WHERE ALL BUTTONS WILL GET ACTIVATED

/*
function loadingDelay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

const Marker = (props) => {
  //Here is the code for switching a button to loading and normal state
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      loadingDelay().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => {setLoading(true); talkToFirebase();};

  
  // eventually want to make the Card.Img the user submitted one from db
  // Maybe for the "I'm here" button, disable button and turn red after clicked (and loading)?
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
          <Button variant="primary mr-2" size='lg' block disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ? "Updating..." : "I'm here!"}</Button>
          <Button variant="info mr-2" block disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ? "Setting Reminder..." : 'Remind Me'}</Button>
          <Button variant="danger mr-2" block disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ? "Getting Report Ready..." : 'Report'}</Button>
        </Card.Body>
      </Card>
      </div>
    )
}
*/

export default Marker
