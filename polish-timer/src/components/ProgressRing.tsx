/**
 * Progress Ring Component - Circular progress indicator for the timer
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  radius: number;
  strokeWidth: number;
  progress: number; // 0 to 1
  color: string;
  backgroundColor?: string;
}

export function ProgressRing({
  radius,
  strokeWidth,
  progress,
  color,
  backgroundColor = '#E0E0E0',
}: ProgressRingProps) {
  const animatedValue = useRef(new Animated.Value(progress)).current;

  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [progress, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        style={styles.svg}
      >
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          {/* Background circle */}
          <Circle
            stroke={backgroundColor}
            fill="none"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <AnimatedCircle
            stroke={color}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{ rotateZ: '270deg' }],
  },
});