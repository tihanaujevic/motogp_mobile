import React from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/moto.jpg')}
        style={styles.image}
        resizeMode='center'
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="All-time winners"
            onPress={() => navigation.navigate('Winners')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Statistics"
            onPress={() => navigation.navigate('Statistics')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="MotoGP points in 2022"
            onPress={() => navigation.navigate('HorizontalBarChart')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Circuits map"
            onPress={() => navigation.navigate('Circuits')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Riders head-to-head"
            onPress={() => navigation.navigate('RadarChart')}
          />
        </View>
      </View>
      <Image
        source={require('../assets/moto.jpg')}
        style={styles.image}
        resizeMode='center'
      />
    </View>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 280,
  },
  button: {
    marginBottom: 10,
  },
});
