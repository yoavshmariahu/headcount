import React, { useState, useEffect, Component} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: null,
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
      stores: [],
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
    fetch('http://127.0.0.1:5000//get-markers-info').then(res => res.json()).then(data => {
      this.setState({
        stores: data
      })
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.mapStyle} 
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {this.state.markers.map(marker => (
            <Marker
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.subtitle}
            >
              <View style={styles.marker}>
                <Text style={styles.text}>{marker.title}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }
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