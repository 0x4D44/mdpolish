import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, ImageBackground, Animated, Image } from 'react-native';
import { Timer } from './src/components/Timer';
import { Controls } from './src/components/Controls';
import { Stats } from './src/components/Stats';
import { Settings } from './src/components/Settings';
import { useTimer } from './src/hooks/useTimer';
import { useSession } from './src/hooks/useSession';
import { useConfig } from './src/hooks/useConfig';
import { notificationManager } from './src/utils/notifications';

// Import the background image
const backgroundImage = require('./assets/shoes.png');

export default function App() {
  const { config, loading: configLoading, updateConfig } = useConfig();
  const timer = useTimer(config.timerDurationSeconds);
  const session = useSession();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const breathingAnim = useRef(new Animated.Value(1)).current;

  // Initialize notifications on mount
  useEffect(() => {
    notificationManager.initialize();
    return () => {
      notificationManager.cleanup();
    };
  }, []);

  // Breathing animation for background when timer is running
  useEffect(() => {
    if (timer.state.status === 'running') {
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1.03,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );
      breathing.start();
      return () => breathing.stop();
    } else {
      Animated.timing(breathingAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [timer.state.status, breathingAnim]);

  // Handle timer completion
  useEffect(() => {
    if (timer.state.status === 'completed') {
      // Add the completed time to the session
      session.addTime(config.timerDurationSeconds);
      // Play completion notification
      notificationManager.playCompletionNotification(
        config.soundEnabled,
        config.vibrationEnabled
      );
    }
  }, [timer.state.status, config.timerDurationSeconds, config.soundEnabled, config.vibrationEnabled]);

  // Handle next iteration
  const handleNextIteration = useCallback(() => {
    session.incrementIteration();
    timer.complete();
    // Auto-start the next iteration
    setTimeout(() => timer.start(), 100);
  }, [session, timer]);

  // Handle new session
  const handleNewSession = useCallback(() => {
    session.resetSession();
    timer.reset();
  }, [session, timer]);

  // Show loading while config loads
  if (configLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a237e" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <Animated.View
        style={[
          styles.backgroundAnimationContainer,
          {
            transform: [{ scale: breathingAnim }],
          },
        ]}
      >
        <View style={styles.overlay} />
      </Animated.View>

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
        {/* Header with Settings Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Polish Timer</Text>
            <Text style={styles.iteration}>Iteration {timer.state.currentIteration}</Text>
          </View>
          <View style={styles.settingsButton} />
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Timer
            remainingSeconds={timer.state.remainingSeconds}
            status={timer.state.status}
            totalSeconds={config.timerDurationSeconds}
          />
        </View>

        {/* Control Buttons */}
        <Controls
          status={timer.state.status}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.state.status === 'completed' ? handleNewSession : timer.reset}
          onNextIteration={handleNextIteration}
        />
      </View>

      {/* Statistics */}
      <Stats
        iterations={session.iterations}
        totalTimeSeconds={session.totalTimeSeconds}
      />

      {/* Settings Modal */}
      <Settings
        visible={settingsVisible}
        config={config}
        onClose={() => setSettingsVisible(false)}
        onConfigChange={updateConfig}
        onNewSession={handleNewSession}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.6, // More prominent
    resizeMode: 'cover',
  },
  backgroundAnimationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Very minimal white overlay - quite dark
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Changed from white to transparent
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Space for stats component
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 8,
  },
  iteration: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  timerContainer: {
    marginVertical: 30,
  },
});
