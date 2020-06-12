import React, { useState, useEffect, Component , Fragment} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import googleMapsAPIKey from './constants';
import {Dimensions, StyleSheet, Text, View} from "react-native";

const containerStyle = {

  width: '100%',
  height: '100%'
}

const mapStyles = {
  width: '100%',
  height: '100%',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 5,
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
  }
});

export class MapContainer extends Component {
    constructor(props) {
    super(props);

    this.state = {
        stores: [],
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
      region: {},
        loading: true,
      zoom: 12,

    };
  }

  onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });

onClose = props => {
  if (this.state.showingInfoWindow) {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    });
  }
};

displayMarkers (stores) {
    return stores.map(mark => (

                        <Marker key={mark.key}
                          onClick={this.onMarkerClick}
                          name={mark.subtitle.toString()}
                          position={{lat: mark.latitude, lng: mark.longitude}}
                          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                          label={mark.title}
                        />))
  }


  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          region: {
            lat: parseFloat(position.coords.latitude),
            lng: parseFloat(position.coords.longitude)
          },
          loading: false
        })
      })
    }

    fetch('http://nikashkhanna.pythonanywhere.com/get-markers-info').then(res => res.json()).then(data => {
      this.setState({
        stores: data,
        loading: false,
      })
    });
  }
  render() {
        const { loading, region } = this.state;
        if (loading)
            return null

    //console.log(this.state.stores)
    return (
        <div className= "container">
            <div className="row">
                 <div className="col-md-12">
                  <Map google={this.props.google} zoom={12}
                  containerStyle={containerStyle}

                    center={this.state.region}
                       initialCenter={this.state.region}
                  >

                      {this.displayMarkers(this.state.stores)}
                        <InfoWindow onClose={this.onClose}
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}
                        >
                        <div>
                            <h4>{this.state.selectedPlace.label}</h4>
                            <h4>People:  {this.state.selectedPlace.name}</h4>
                        </div>
                        </InfoWindow>
                  </Map>
        </div>
        </div>
        </div>

    );
  }
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyDHvKuzXq8mAJpTe6ZMvcau0Y4R_7VvTHA'), libraries: ['places']
})(MapContainer)