/**
 * Controls Component - Timer control buttons with animations
 */

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { TimerStatus } from '../types';

interface ControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextIteration: () => void;
}

export function Controls({
  status,
  onStart,
  onPause,
  onReset,
  onNextIteration
}: ControlsProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animate buttons on status change
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [status, fadeAnim]);

  // Button press animation
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Render primary action button based on status
  const renderPrimaryButton = () => {
    const buttonConfig = {
      idle: { text: '▶️ Start', onPress: onStart, style: styles.primaryButton },
      running: { text: '⏸️ Pause', onPress: onPause, style: [styles.primaryButton, styles.pauseButton] },
      paused: { text: '▶️ Resume', onPress: onStart, style: styles.primaryButton },
      completed: { text: '✨ Next Iteration', onPress: onNextIteration, style: [styles.primaryButton, styles.nextButton] },
    };

    const config = buttonConfig[status];

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          style={config.style}
          onPress={config.onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>{config.text}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Show reset button when timer is not idle
  const showResetButton = status !== 'idle' && status !== 'completed';

  return (
    <View style={styles.container}>
      {renderPrimaryButton()}

      {showResetButton && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      )}

      {status === 'completed' && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
          <Text style={styles.secondaryButtonText}>New Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 35,
    minWidth: 220,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pauseButton: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#1a237e',
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
  },
  secondaryButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});