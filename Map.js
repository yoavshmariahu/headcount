import React, { useState, useEffect, Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import googleMapsAPIKey from './constants';

const containerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%'
}



export class MapContainer extends Component {
  render() {
    return (
      <Map google={this.props.google} zoom={14}
      containerStyle={containerStyle}>

        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />

        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              
            </div>
        </InfoWindow>
      </Map>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: ('AIzaSyDHvKuzXq8mAJpTe6ZMvcau0Y4R_7VvTHA')
})(MapContainer)