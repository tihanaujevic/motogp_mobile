import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Winners from './components/winners';
import Statistics from './components/statistics';
import HorizontalBarChart from './components/points2022';
import Circuits from './components/circuitsMap';
import RadarChart from './components/radar';
import HomeScreen from './components/home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'MotoGP' }}
        />
        <Stack.Screen
          name="Winners"
          component={Winners}
          options={{ title: 'Winners' }}
        />
        <Stack.Screen
          name="Statistics"
          component={Statistics}
          options={{ title: 'Statictics' }}
        />
        <Stack.Screen
          name="HorizontalBarChart"
          component={HorizontalBarChart}
          options={{ title: 'MotoGP points in 2022' }}
        />
        <Stack.Screen
          name="Circuits"
          component={Circuits}
          options={{ title: 'Circuits' }}
        />
        <Stack.Screen
          name="RadarChart"
          component={RadarChart}
          options={{ title: 'Riders head-to-head' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
