import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Timer } from './src/components/Timer';
import { Controls } from './src/components/Controls';
import { Stats } from './src/components/Stats';
import { Settings } from './src/components/Settings';
import { useTimer } from './src/hooks/useTimer';
import { useSession } from './src/hooks/useSession';
import { useConfig } from './src/hooks/useConfig';
import { notificationManager } from './src/utils/notifications';

export default function App() {
  const { config, loading: configLoading, updateConfig } = useConfig();
  const timer = useTimer(config.timerDurationSeconds);
  const session = useSession();
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Initialize notifications on mount
  useEffect(() => {
    notificationManager.initialize();
    return () => {
      notificationManager.cleanup();
    };
  }, []);

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
