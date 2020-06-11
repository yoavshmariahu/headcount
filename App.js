import React, { useState, useEffect, Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapContainer from './Map';


function App() {
  const [currentPeople, setCurrentPeople] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/people/trader-joes-1').then(res => res.json()).then(data => {
      setCurrentPeople(data.people);
    });
  }, []);

  console.log(currentPeople)

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