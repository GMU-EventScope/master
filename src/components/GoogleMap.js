import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import PatriotImage1 from "../images/patriots1.jpg";
import PatriotImage2 from "../images/patriots2.jpg";
import PatriotImage3 from "../images/patriots3.jpg";
// Retrived from https://mapstyle.withgoogle.com/
import mapStyle from "../json/mapStyle.json"


export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    mapCenter: {
      lat: 38.82983163592364,
      lng: -77.30731177687473,
    },
  };
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };


  
   _mapLoaded(mapProps, map) {
      map.setOptions({
         styles: mapStyle
      })
   }

   
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={16}


        initialCenter={{
          lat: this.state.mapCenter.lat,
          lng: this.state.mapCenter.lng,
        }}
        onClick={this.onMapClicked}

        onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={"This Place is GMU"}
          title={"GMU-EventScope"}
        />

        <Marker
          onClick={this.onMarkerClick}
          name={"Possible Event At SUB"}
          context={"SUB has some event boys"}
          image={PatriotImage1}
          position={{
            lat: 38.83145722653085,
            lng: -77.30903911943275,
          }}
        />

        <Marker
          onClick={this.onMarkerClick}
          name={"Event at StarBucks"}
          context={"Who hates coffes?"}
          image={PatriotImage2}
          position={{
            lat: 38.83382084527606,
            lng: -77.30683169818607,
          }}
        />

        <Marker
          onClick={this.onMarkerClick}
          name={"Reading Event at Library"}
          context={"Books Books Books"}
          image={PatriotImage3}
          position={{
            lat: 38.83218045572573,
            lng: -77.30711825512631,
          }}
        />

        
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
            <img src={this.state.selectedPlace.image}></img>
            <br />
            <h2>{this.state.selectedPlace.context}</h2>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDkjlyNY1-N3yB70i_dH4qecMy8HaPreg8",
})(MapContainer);
