import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polygon, Text } from "react-native-svg";

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
  const radarData = [
    { value: 50, label: "Attribute 1" },
    { value: 100, label: "Attribute 2" },
    { value: 20, label: "Attribute 3" },
    { value: 80, label: "Attribute 4" },
    { value: 60, label: "Attribute 5" },
    { value: 85, label: "Attribute 6" }
  ];

  const radarData2 = [
    { value: 80, label: "Attribute 1" },
    { value: 60, label: "Attribute 2" },
    { value: 90, label: "Attribute 3" },
    { value: 30, label: "Attribute 4" },
    { value: 70, label: "Attribute 5" },
    { value: 45, label: "Attribute 6" }
  ];

  const maxValues = radarData.map((data, index) => data.value + radarData2[index].value);
  const maxSum = Math.max(...maxValues);

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
      <Svg height="100%" width="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <Circle
          cx={viewBoxCenter}
          cy={viewBoxCenter}
          r={radius}
          stroke="black"
          strokeOpacity="0.2"
          strokeWidth="0.5"
          fill="#ADFF2F"
        />

        {createArrayWithUndefinedValues(6).map((_, i) => {
          const [x, y] = calculateEdgePoint(i * 60, maxValues[i] / maxSum);
          const labelOffsetX = x < viewBoxCenter ? 0 : 5;
          const labelOffsetY = y < viewBoxCenter ? 0 : 5;
          return (
            <React.Fragment key={`label_${i}`}>
              <Line
                x1={viewBoxCenter}
                y1={viewBoxCenter}
                x2={x}
                y2={y}
                stroke="white"
                strokeWidth="0.5"
              />
              <Text
                x={x + labelOffsetX}
                y={y + labelOffsetY}
                fill="white"
                fontSize="5"
                textAnchor={x < viewBoxCenter ? "end" : "start"}
              >
                {radarData[i].label}
              </Text>
            </React.Fragment>
          );
        })}

        <Polygon
          stroke={"#50E2C2"}
          strokeWidth={1.2}
          fill={"#50E2C2"}
          fillOpacity={0.9}
          points={`${radarData.map((r, i) => {
            const scale = r.value / maxValues[i];
            const edgePoint = calculateEdgePoint(i * 60, scale);
            return `${edgePoint[0]},${edgePoint[1]}`;
          })}`}
        />

        <Polygon
          stroke={"#FFFF00"}
          strokeWidth={1.2}
          fill={"#FFFF00"}
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
                fill="black"
                fontSize="3"
                textAnchor="middle"
              >
                {r.value}
              </Text>
              <Text
                x={edgePoint2[0]}
                y={edgePoint2[1]}
                fill="black"
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
