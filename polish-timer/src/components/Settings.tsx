/**
 * Settings Component - Modal for app configuration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { AppConfig } from '../types';

interface SettingsProps {
  visible: boolean;
  config: AppConfig;
  onClose: () => void;
  onConfigChange: (config: Partial<AppConfig>) => void;
  onNewSession: () => void;
}

export function Settings({
  visible,
  config,
  onClose,
  onConfigChange,
  onNewSession,
}: SettingsProps) {
  const [timerMinutes, setTimerMinutes] = useState(config.timerDurationSeconds / 60);
  const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState(config.vibrationEnabled);

  // Update local state when config changes
  useEffect(() => {
    setTimerMinutes(config.timerDurationSeconds / 60);
    setSoundEnabled(config.soundEnabled);
    setVibrationEnabled(config.vibrationEnabled);
  }, [config]);

  // Snap to nearest 15 seconds (0.25 minutes)
  const snapToQuarterMinute = (value: number) => {
    const quarterMinutes = Math.round(value * 4) / 4; // Round to nearest 0.25
    return quarterMinutes;
  };

  // Format display time to show minutes:seconds
  const formatDisplayTime = (minutes: number) => {
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    const snappedMinutes = snapToQuarterMinute(timerMinutes);
    onConfigChange({
      timerDurationSeconds: Math.round(snappedMinutes * 60),
      soundEnabled,
      vibrationEnabled,
    });
    onClose();
  };

  const handleNewSession = () => {
    onNewSession();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Timer Duration Setting */}
          <View style={styles.settingSection}>
            <Text style={styles.settingLabel}>Timer Duration</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{formatDisplayTime(snapToQuarterMinute(timerMinutes))}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={timerMinutes}
                onValueChange={(value) => {
                  const snapped = snapToQuarterMinute(value);
                  setTimerMinutes(snapped);
                }}
                onSlidingComplete={(value) => {
                  const snapped = snapToQuarterMinute(value);
                  setTimerMinutes(snapped);
                }}
                step={0.25} // Step by 0.25 minutes (15 seconds)
                minimumTrackTintColor="#1a237e"
                maximumTrackTintColor="#CCC"
                thumbTintColor="#1a237e"
              />
            </View>
          </View>

          {/* Sound Notification Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Notifications</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#CCC', true: '#1a237e' }}
              thumbColor={soundEnabled ? '#ffd700' : '#f4f3f4'}
            />
          </View>

          {/* Vibration Toggle (Android only) */}
          {Platform.OS !== 'web' && (
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Vibration (Android)</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#CCC', true: '#1a237e' }}
                thumbColor={vibrationEnabled ? '#ffd700' : '#f4f3f4'}
              />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleNewSession}
            >
              <Text style={styles.secondaryButtonText}>New Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSave}
            >
              <Text style={styles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a237e',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
  },
  settingSection: {
    marginVertical: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  sliderContainer: {
    marginTop: 10,
  },
  sliderValue: {
    fontSize: 18,
    color: '#1a237e',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonSection: {
    marginTop: 30,
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1a237e',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#1a237e',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
  },
});