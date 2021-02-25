import React from 'react'
import Marker from './Marker'

const Markers = ({events}) => {

    return (
        <div>
        {
            console.log(events)
        }
        {events.map( (event) => (<Marker key={event.key} title = {event.title} context = {event.context} />))}
        </div>
    )
}

export default Markers
