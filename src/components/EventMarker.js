  import React from 'react'
  import {Button, Card, ListGroup, ListGroupItem,ButtonToolbar,ButtonGroup,Container,Row,Col,Carousel} from 'react-bootstrap'
  import 'bootstrap/dist/css/bootstrap.min.css';
  import useButtonLoader from './Buttons.js';
  import fbArray from '../apis/firebase.js';
  import './EventMarker.css';
  import { useState} from "react";

  // get firebase stuff
  const db = fbArray.db;
  const auth = fbArray.auth;
  const storage = fbArray.storage;

  //adds artificial delay for loading (cuz too fast, user can't see loading msg)
  function loadingDelay(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  /*
  // pics from firebase
  let picNames = [];
  let queryCount = 0;
  */

  //buttons help: https://react-bootstrap.github.io/components/buttons/
  //Followed this for loading buttons: https://www.youtube.com/watch?v=nCEnqQABC5A via hooks
  const Marker = (props) => {
    //useButtonLoader is in Button.js (for loading buttons)
    const [Button1Load,setLoadingButton1] = useButtonLoader("Attend","Updating..");
    const [Button2Load,setLoadingButton2] = useButtonLoader("✩","★");
    //const [Button3Load,setLoadingButton3] = useButtonLoader("Report","Reporting..");
    
    // used to display the end date, but only if it is entered
    let useLocation = "";
    if (props.building) {
      useLocation = "Located in " + props.building
      if (props.room) {
        useLocation += " room " + props.room;
      }
    }
    /*
    const [eventPicUrls, setEventPicUrls] = useState([]);
    // picNames is the array of the image filenames for each event
    if (props.picNames) {
      picNames = [...props.picNames];
    }
    // only query once
    if (queryCount < picNames.length) {
      // only query if the file can be found
      if (props.picNames && props.hostID){
        // loop through each filename
        picNames.forEach(name => {
          //console.log(`eventpics/${props.docID}/${name}`);
          let reference = storage.ref(`eventpics/${props.docID}/${name}`);
          reference.getDownloadURL().then((url) => {
            // URL obtained, add to the reactive array so it can be used for rendering
            console.log("returned url:" + url);
            setEventPicUrls(eventPicUrls => [...eventPicUrls, url]);
          });
        });
      }
      queryCount += 1;
    }
    */

    //I'm here
    const Button1 = () => {
      //loading
      setLoadingButton1(true);
      loadingDelay(320).then(() => {
        console.log("This does nothing right now, need to figure out the best way to store this data.")

        //stops loading
        setLoadingButton1(false);
      }); 
    };

    //Save Event
    const Button2 = () => {
      //loading
      setLoadingButton2(true);
      loadingDelay(320).then(() => {
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

                props.setSavedEvents(props.savedEvents.filter(item => item.docID !== curEvent));
              }
            } 
        });
        
        //stops loading
        setLoadingButton2(false);
      });
    };

    /*
    //Report
    const Button3 = () => {
      //loading
      setLoadingButton3(true);
      loadingDelay(320).then(() => {
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
    */

    // gets a nice looking x:xx xm output
    // function getTimeString(input) {
    //   let date = input.toDate();
    //   let hoursString = date.getHours();
    //   let ampm = "am"
    //   if (parseInt(hoursString) >= 12) {
    //     ampm = "pm";
    //     if (parseInt(hoursString) > 12) {
    //       hoursString = (parseInt(hoursString)-12).toString();
    //     }
    //   }
    //   if (parseInt(hoursString) == 0) {
    //     hoursString = "12";
    //   }
    //   let minutes = date.getMinutes().toString();
    //   //console.log(minutes.length)
    //   if (minutes.length < 2) {
    //     minutes = "0" + minutes;
    //   }
    //   return hoursString + ":" + minutes + " " + ampm;
    // }

    return (
        <div>
          <Card options={{
            pane: "overlayLayer",
            alignBottom: true,
            boxStyle: {
              boxShadow: 'none'
            }}} 
          style={{ width: '642px', height: '35.5rem'}} bg={"Light"}>   
          <Carousel style={{boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)"}} autoPlay={false} controls={false} indicators={true} interval={null}>
              {props.picUrls.map((url) =>(
                <Carousel.Item>
                <Card.Img variant="top" style={{ width: '640px', height: '360px'}} src={url} rounded fluid/>
                </Carousel.Item>
              ))}
          </Carousel>
          <Container fluid>
            <Row>
              <Col xs={8}>
                <Card.Text>
                <span style={{display:'block', height:'12px'}}></span> <h3>{props.title}</h3> <p>Hosted by <span class="name">{props.author}</span></p>
                </Card.Text>
                {props.context &&
                    <Card.Text><p className="desc">{props.context}</p></Card.Text>
                }
              </Col>
              <Col xs={4}>
               <Card.Body>
                  {props.context &&
                    <Card.Text style={{fontSize: 14}}><p><span class="name">{props.date+"\n"+(props.time)}</span></p></Card.Text>
                  }
                  {
                    <Card.Text><p className="otherinfo">👤 5 Attendees </p></Card.Text>
                  }
                  {
                    <Card.Text><p className="otherinfo">🏛️ Location stuff {useLocation}</p></Card.Text>
                  }
              </Card.Body>
              </Col>
            </Row>
            <Row>
                <Col xs={8} >
                  <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" variant="link" size='sm' className="learnmore-btn" style={{alignSelf:'right'}}>Learn More 🗗 </Button>
                </Col>
                <Col>
                  <ButtonToolbar>
                    <ButtonGroup className="ml-3">
                       <Button className='event-btn' size='m' onClick={Button1} ref={Button1Load}></Button>
                     </ButtonGroup>
                    <ButtonGroup className="ml-3">
                     <Button className='event-btn' size='m' onClick={Button2} ref={Button2Load}></Button>
                   </ButtonGroup>
                 </ButtonToolbar>
                </Col>
            </Row>
            </Container>
        </Card>
        </div>
      )
  }
  export default Marker
