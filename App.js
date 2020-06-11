import React, { useState, useEffect, Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapContainer from './Map';


function App() {
  const [currentStores, setCurrentStores] = useState(0);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/get-all-stores').then(res => res.json()).then(data => {
      setCurrentStores(data);
        });
     }, []);

    console.log(currentStores)

  return (
    <View style={styles.container}>
      <MapContainer/>
    </View>
  );
}

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

export default App;