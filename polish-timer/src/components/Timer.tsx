/**
 * Timer Component - Displays the countdown timer with animations
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { TimerStatus } from '../types';
import { ProgressRing } from './ProgressRing';

interface TimerProps {
  remainingSeconds: number;
  status: TimerStatus;
  totalSeconds?: number;
}

export function Timer({ remainingSeconds, status, totalSeconds = 180 }: TimerProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress (1 = full, 0 = empty)
  const progress = remainingSeconds / totalSeconds;

  // Pulse animation for running state
  useEffect(() => {
    if (status === 'running') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status, pulseAnim]);

  // Status change animations
  useEffect(() => {
    if (status === 'completed') {
      // Celebration animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (status === 'paused') {
      // Fade animation for paused state
      Animated.timing(opacityAnim, {
        toValue: 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset opacity for other states
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [status, scaleAnim, opacityAnim]);

  // Determine ring color based on status and time remaining
  const getRingColor = () => {
    if (status === 'completed') return '#4CAF50';
    if (status === 'paused') return '#9E9E9E';
    if (remainingSeconds <= 10) return '#FF5722'; // Red when time is running out
    if (remainingSeconds <= 30) return '#FF9800'; // Orange warning
    return '#1a237e'; // Navy blue normal
  };

  // Determine text color based on status
  const getTextColor = () => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // Green for completed
      case 'paused':
        return '#9E9E9E'; // Gray for paused
      case 'running':
        return remainingSeconds <= 10 ? '#FF5722' : '#1a237e'; // Red when urgent
      default:
        return '#1a237e'; // Navy blue for idle
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressRing
          radius={140}
          strokeWidth={8}
          progress={progress}
          color={getRingColor()}
          backgroundColor="#E8EAF6"
        />
        <Animated.View
          style={[
            styles.timerContent,
            {
              transform: [
                { scale: status === 'running' ? pulseAnim : scaleAnim }
              ],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text
            style={[
              styles.timerText,
              {
                color: getTextColor(),
              }
            ]}
          >
            {formatTime(remainingSeconds)}
          </Text>
          {status === 'completed' && (
            <Animated.Text
              style={[
                styles.completeText,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              Complete! ✨
            </Animated.Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  completeText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: '600',
  },
});