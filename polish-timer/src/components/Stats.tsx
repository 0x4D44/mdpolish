/**
 * Stats Component - Displays session statistics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsProps {
  iterations: number;
  totalTimeSeconds: number;
}

export function Stats({ iterations, totalTimeSeconds }: StatsProps) {
  // Format seconds into human-readable time
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (minutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statRow}>
        <Text style={styles.label}>Total Iterations: </Text>
        <Text style={styles.value}>{iterations}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.label}>Total Time: </Text>
        <Text style={styles.value}>{formatTime(totalTimeSeconds)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '700',
  },
});