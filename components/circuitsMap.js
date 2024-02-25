import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import locations from '../data/circuits.json';

const MyMapComponent = () => {
  const europeCenter = { latitude: 51.1657, longitude: 10.4515 };
  
  const zoomLevel = 50;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: europeCenter.latitude,
          longitude: europeCenter.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(location.Location.split(',')[0]),
              longitude: parseFloat(location.Location.split(',')[1]),
            }}
            title={location.Name}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MyMapComponent;
