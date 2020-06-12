import React, { useState, useEffect, Component} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class MapContainer extends Component {

  constructor(props) {

    super(props);


    this.state = {
      stores: [],
        loading: true,
      region: null,


    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          },

        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
    fetch('http://nikashkhanna.pythonanywhere.com/get-markers-info').then(response => response.json()).then(data => {
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
      <View style={styles.container}>
        <MapView 
          style={styles.mapStyle} 
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          {this.state.stores.map(marker => (
            <Marker
              coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
              title={marker.title}
              description={marker.subtitle.toString()}
            >
              <View style={styles.marker}>
                <Text style={styles.text}>{marker.title}</Text>
                <Text style={styles.text}>People: {marker.subtitle.toString()}</Text>
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