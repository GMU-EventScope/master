import React,{ useEffect, useState } from 'react'

import {Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';


//buttons help: https://react-bootstrap.github.io/components/buttons/

//This function just simulates a delay of 2s?, eventually we want to send/retrieve from db here
function talkToFirebase() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}
const Marker = (props) => {
  //Here is the code for switching a button to loading and normal state
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      talkToFirebase().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);
  
  return (
      <div>
        <Card style={{ width: '25rem' }}>
        <Card.Img variant="top" src="/gmulogo.png" />
        <Card.Body>
          <Card.Title>{props.title} - {props.author}</Card.Title>
          <Card.Text>
            <h3>{props.date}</h3>
            {props.context}
          </Card.Text>
          <Button variant="success mr-2" size='lg' block disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ? "Mining some bitcoins..." : "I'm here!"}</Button>
          <Button variant="info mr-2" block disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ? "Mining some bitcoins..." : 'Remind Me'}</Button>
            &nbsp;
          <Button variant="outline-danger mr-2" size='sm' block disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ? "Mining some bitcoins..." : 'Report'}</Button>
        </Card.Body>
      </Card>
      </div>
    )
}

export default Marker
