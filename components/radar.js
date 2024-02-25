import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polygon, Text } from "react-native-svg";
import { Picker } from '@react-native-picker/picker';
import riderInfo from '../data/riderInfoRadar.json';

const svgY = (degrees) => degrees + 180;

const calculateEdgePointFn = (center, radius) => (
  degree,
  scale = 1
) => {
  const degreeInRadians = (degree * Math.PI) / 180;
  const degreeInRadiansY = (svgY(degree) * Math.PI) / 180;
  return [
    center + Math.cos(degreeInRadians) * radius * scale,
    center + Math.sin(degreeInRadiansY) * radius * scale
  ];
};

const RadarChart = () => {
  const [selectedDriver1, setSelectedDriver1] = useState("ROSSI Valentino");
  const [selectedDriver2, setSelectedDriver2] = useState("AGOSTINI Giacomo");

  const radarData = riderInfo.find(r => r.name.toLowerCase() === selectedDriver1.toLowerCase()).data;
  const radarData2 = riderInfo.find(r => r.name.toLowerCase() === selectedDriver2.toLowerCase()).data;

  const maxValues = radarData.map((data, index) => Math.max(data.value, radarData2[index].value));

  const viewBoxSize = 180;
  const viewBoxCenter = viewBoxSize * 0.5;
  const radius = viewBoxSize * 0.4;

  const calculateEdgePoint = useMemo(() => calculateEdgePointFn(viewBoxCenter, radius), [radius]);

  const createArrayWithUndefinedValues = (length) => {
    return Array.from({ length });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <Picker
        selectedValue={selectedDriver1}
        style={{ height: 30, width: 300, marginTop: 150, color: "#483D8B" }}
        onValueChange={(itemValue) => setSelectedDriver1(itemValue)}
      >
        {riderInfo.map(driver => (
          <Picker.Item key={driver.name} label={driver.name} value={driver.name} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedDriver2}
        style={{ height: 30, width: 300, color: "#98FB98" }}
        onValueChange={(itemValue) => setSelectedDriver2(itemValue)}
      >
        {riderInfo.map(driver => (
          <Picker.Item key={driver.name} label={driver.name} value={driver.name} />
        ))}
      </Picker>

      <Svg height="100%" width="100%" viewBox={`0 0 180 270`}>
        <Circle
          cx={viewBoxCenter}
          cy={viewBoxCenter}
          r={radius}
          stroke="black"
          strokeOpacity="0.2"
          strokeWidth="0.5"
          fill="grey"
        />

        {createArrayWithUndefinedValues(6).map((_, i) => {
          const [x, y] = calculateEdgePoint(i * 60);
          const labelOffsetX = x < viewBoxCenter ? -3 : 5;
          const labelOffsetY = y < viewBoxCenter ? -3 : 7;
          let rotation = 0;
          let adjustedY = y + labelOffsetY;

          if (x === 18) {
            rotation = -90;
            adjustedY -= 10;
          }
          if (x === 162) {
            rotation = 90;
            adjustedY -= 16;
          }

          return (
            <React.Fragment key={`label_${i}`}>
              <Line
                x1={viewBoxCenter}
                y1={viewBoxCenter}
                x2={x}
                y2={y}
                stroke="black"
                strokeWidth="0.5"
              />
              <Text
                x={x + labelOffsetX}
                y={adjustedY} // Using the adjusted Y position
                fill="white"
                fontSize="5"
                textAnchor={x < viewBoxCenter ? "end" : "start"}
                transform={`rotate(${rotation} ${x + labelOffsetX} ${adjustedY})`}
              >
                {radarData[i].label}
              </Text>
            </React.Fragment>
          );
        })}



        <Polygon
          fill={"#483D8B"}
          fillOpacity={0.9}
          points={`${radarData.map((r, i) => {
            const scale = r.value / maxValues[i];
            const edgePoint = calculateEdgePoint(i * 60, scale);
            return `${edgePoint[0]},${edgePoint[1]}`;
          })}`}
        />

        <Polygon
          fill={"#98FB98"}
          fillOpacity={0.9}
          points={`${radarData2.map((r, i) => {
            const scale = r.value / maxValues[i];
            const edgePoint = calculateEdgePoint(i * 60, scale);
            return `${edgePoint[0]},${edgePoint[1]}`;
          })}`}
        />

        {/* Render labels for polygon values */}
        {radarData.map((r, i) => {
          const scale1 = r.value / maxValues[i];
          const scale2 = radarData2[i].value / maxValues[i];
          const edgePoint1 = calculateEdgePoint(i * 60, scale1);
          const edgePoint2 = calculateEdgePoint(i * 60, scale2);
          return (
            <React.Fragment key={`label_${i}`}>
              <Text
                x={edgePoint1[0]}
                y={edgePoint1[1]}
                fill="red"
                fontSize="3"
                textAnchor="middle"
              >
                {r.value}
              </Text>
              <Text
                x={edgePoint2[0]}
                y={edgePoint2[1]}
                fill="red"
                fontSize="3"
                textAnchor="middle"
              >
                {radarData2[i].value}
              </Text>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

export default RadarChart;
