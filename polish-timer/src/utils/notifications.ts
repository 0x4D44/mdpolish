/**
 * Notification utilities - Sound and vibration for timer completion
 */

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class NotificationManager {
  private sound: Audio.Sound | null = null;
  private isLoaded = false;

  /**
   * Initialize the notification system
   */
  async initialize() {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
        });
      }

      await this.loadSound();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  /**
   * Load the completion sound
   */
  private async loadSound() {
    try {
      // Create a simple beep sound using Audio API
      // For production, you'd load an actual sound file
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDBuwvDjmUQLD1+v5+6pWBUKPnzO392ZUSQFHVy/6fOvYRUKPHvN4N+eVvLnslANARpVe73m6JBHG2+rsdmNP0JPQ43PBo/0tWA5d5tCk/u38bVLNU6DnhF34KxgSkah5XixND4dVZ+1UIH47HNqVA5dZKfit2ArgLTspGFQN4TJv07jqV8RBClqx+TowVEuBFOo69mJXw4hBRw7frvvz29cOz9zn5+BfnODnpaZmZudlZOJcp2cj4SMm5N7loeSiYeWnZWMiopldJCfn5aBpaKTiYWQmpyge4mJlJSSlI+WnsGxCD0EW32tqI6EkJmYnoeIiJqVaXh+l5ueFZKRkJWSioOHipqXnoyPlIqGgpGXlnqbMGkhz6ePjppxCwMQV5vvy70vEgQvU+DozaUOE2v17rl7s19RfBgfDwgq8U7+oOCpABz8cgwQGfLxRPzR8Lkc1ch0HQgVL0793fGTBQzMlQM7RNj0/f0P9DqTFQYoUvHwRfzy9IUgCDyxIfnUQgVf9fHa9GwXJO87Zf3cRgLY35gg2f0b7kUfByAs8jr78AQHDyAJyfLP+SsBHBYcJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==' },
        { shouldPlay: false }
      );

      this.sound = sound;
      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading sound:', error);
      // Create a fallback for web using Web Audio API
      if (Platform.OS === 'web') {
        this.createWebBeep();
      }
    }
  }

  /**
   * Create a beep sound for web platform
   */
  private createWebBeep() {
    // Web Audio API fallback for browsers
    if (typeof window !== 'undefined' && window.AudioContext) {
      // We'll use the Web Audio API to create a beep
      this.isLoaded = true;
    }
  }

  /**
   * Play completion sound
   */
  async playSound(enabled: boolean = true) {
    if (!enabled) return;

    try {
      if (Platform.OS === 'web') {
        // Use Web Audio API for web platform
        this.playWebBeep();
      } else if (this.sound && this.isLoaded) {
        await this.sound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  /**
   * Play beep sound on web
   */
  private playWebBeep() {
    if (typeof window === 'undefined' || !window.AudioContext) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing web beep:', error);
    }
  }

  /**
   * Trigger haptic feedback (vibration)
   */
  async vibrate(enabled: boolean = true) {
    if (!enabled || Platform.OS === 'web') return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error triggering vibration:', error);
    }
  }

  /**
   * Play completion notification (sound + vibration)
   */
  async playCompletionNotification(soundEnabled: boolean = true, vibrationEnabled: boolean = true) {
    await Promise.all([
      this.playSound(soundEnabled),
      this.vibrate(vibrationEnabled),
    ]);
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
      this.isLoaded = false;
    }
  }
}

export const notificationManager = new NotificationManager();