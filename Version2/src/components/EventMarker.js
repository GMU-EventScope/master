import React from 'react'

const Marker = (props) => {
    return (
        <div>
        <h2>
          <span role="img" aria-label="event">
            🎉Event🎉 - {props.title}
          </span>{" "}
        </h2>
        <p><h3>Posted:</h3> {props.author} - {props.date}</p>
        <p><h3>Description:</h3> {props.context}</p>
        <p>{props.lat} / {props.lng}</p>
        {/*<Markers events = {events}/>*/}
      </div>
    )
}

export default Marker
