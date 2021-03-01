import React from 'react'

import {Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const Marker = (props) => {
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
          <Button variant="primary mr-2">Reserve</Button>
          <Button variant="info mr-2">RemindMe</Button>

          <Button variant="danger mr-2">Report</Button>
        </Card.Body>
      </Card>
      </div>
    )
}

export default Marker
