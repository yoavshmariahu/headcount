import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { googleMapsAPIKey } from './constants'

console.log(googleMapsAPIKey)
 
export default class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: null,
      zoom: 12,
      markers: [
        {
          coordinate: {
            latitude: 37.221340,
            longitude: -121.97963,
          },
          title: 'Los Gatos',
          subtitle: '1234 Foo Drive'
        },
        {
          coordinate: {
            latitude: 37.3230,
            longitude: -122.0322,
          },
          title: 'Cupertino',
          subtitle: '1234 Foo Drive'
        },
      ],
    };
  }
 
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          region: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      })
    }
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsAPIKey }}
          defaultCenter={this.state.region}
          defaultZoom={this.state.zoom}
        >
        </GoogleMapReact>
      </div>
    );
  }
}