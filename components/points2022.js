import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import data from '../data/points2022.json';

const HorizontalBarChart = () => {
  const [raceIndex, setRaceIndex] = useState(0);
  const races = data.map(item => item.race);
  const racers = Object.keys(data[0].values);

  const maxValue = Math.max(
    ...data.map(item => Math.max(...Object.values(item.values)))
  );

  const renderBars = () => {
    const race = data[raceIndex];
    const totalWidth = 300;
    const totalHeight = 380;
    const barHeight = totalHeight / racers.length;
    const bars = [];
    const renderedLabels = new Set();
    const barGap = 5;
  
    racers.forEach((racer, index) => {
      const value = race.values[racer];
      const barWidth = (value / maxValue) * totalWidth;
      const x = 0;
      const y = index * barHeight + index * barGap;
  
      bars.push(
        <Rect
          key={`${racer}-bar`}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill="#008080"
        />
      );
  
      if (!renderedLabels.has(racer)) {
        bars.push(
          <SvgText
            key={`${racer}-text`}
            x={0}
            y={y + barHeight / 2 + 5}
            fontSize="11"
            fill="white"
          >
            {`${racer}: ${value}`}
          </SvgText>
        );
  
        renderedLabels.add(racer);
      }
    });
  
    return bars;
  };
  
  
  return (
    <View style={styles.container}>
      <Svg width={300} height={550}>
        {renderBars()}
      </Svg>
      <Text style={styles.label}> {races[raceIndex]}</Text>
      <Slider
        style={{ width: 250 }}
        minimumValue={0}
        maximumValue={races.length - 1}
        step={1}
        value={raceIndex}
        onValueChange={setRaceIndex}
      />
      <Text style={{fontSize: 12, fontStyle: 'italic'}}> Slide to see points change by race </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default HorizontalBarChart;
