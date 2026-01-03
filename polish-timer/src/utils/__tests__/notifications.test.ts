describe('NotificationManager', () => {
  let notificationManager: any;
  let mockAudio: any;
  let mockHaptics: any;
  let mockSound: any;

  describe('Native Platform', () => {
    beforeEach(() => {
      jest.resetModules();
      
      // Mock React Native Platform
      jest.doMock('react-native', () => ({
        Platform: { OS: 'ios', select: (objs: any) => objs.ios },
      }));

      // Mock Sound object
      mockSound = {
        unloadAsync: jest.fn().mockResolvedValue(undefined),
        playAsync: jest.fn().mockResolvedValue(undefined),
        replayAsync: jest.fn().mockResolvedValue(undefined),
      };

      // Mock Audio
      mockAudio = {
        Sound: {
          createAsync: jest.fn().mockResolvedValue({ sound: mockSound }),
        },
        setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
      };

      // Mock Haptics
      mockHaptics = {
        notificationAsync: jest.fn().mockResolvedValue(undefined),
        NotificationFeedbackType: { Success: 'success' },
      };

      jest.doMock('expo-av', () => ({ Audio: mockAudio }));
      jest.doMock('expo-haptics', () => mockHaptics);

      // Require module
      notificationManager = require('../notifications').notificationManager;
    });

    it('should initialize and load sound on native', async () => {
      await notificationManager.initialize();
      expect(mockAudio.setAudioModeAsync).toHaveBeenCalled();
      expect(mockAudio.Sound.createAsync).toHaveBeenCalled();
    });

    it('should play sound when enabled', async () => {
      await notificationManager.initialize();
      await notificationManager.playSound(true);
      expect(mockSound.replayAsync).toHaveBeenCalled();
    });

    it('should not play sound when disabled', async () => {
      await notificationManager.initialize();
      await notificationManager.playSound(false);
      expect(mockSound.replayAsync).not.toHaveBeenCalled();
    });

    it('should vibrate when enabled', async () => {
      await notificationManager.vibrate(true);
      expect(mockHaptics.notificationAsync).toHaveBeenCalledWith(mockHaptics.NotificationFeedbackType.Success);
    });

    it('should not vibrate when disabled', async () => {
      await notificationManager.vibrate(false);
      expect(mockHaptics.notificationAsync).not.toHaveBeenCalled();
    });

    it('should cleanup resources', async () => {
      await notificationManager.initialize();
      await notificationManager.cleanup();
      expect(mockSound.unloadAsync).toHaveBeenCalled();
    });
  });

  describe('Web Platform', () => {
    let mockAudioContext: any;
    let mockOscillator: any;
    let originalWindow: any;

    beforeEach(() => {
      jest.resetModules();
      originalWindow = global.window;

      // Mock React Native Platform
      jest.doMock('react-native', () => ({
        Platform: { OS: 'web', select: (objs: any) => objs.web },
      }));

      // Mock Web Audio API
      mockOscillator = {
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        frequency: { value: 0 },
        type: 'sine',
      };
      
      mockAudioContext = {
        createOscillator: jest.fn(() => mockOscillator),
        createGain: jest.fn(() => ({
          connect: jest.fn(),
          gain: {
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn(),
          },
        })),
        currentTime: 100,
        destination: {},
      };

      // Mock global window
      global.window = {
        ...global.window,
        AudioContext: jest.fn(() => mockAudioContext),
      } as any;
      (global as any).AudioContext = global.window.AudioContext;

      // Mock expo-av (createAsync might fail or not be called depending on implementation)
      mockAudio = {
        Sound: {
          createAsync: jest.fn().mockRejectedValue(new Error('Web fallback')),
        },
        setAudioModeAsync: jest.fn(),
      };
      
      mockHaptics = {
        notificationAsync: jest.fn(),
      };

      jest.doMock('expo-av', () => ({ Audio: mockAudio }));
      jest.doMock('expo-haptics', () => mockHaptics);

      notificationManager = require('../notifications').notificationManager;
    });

    afterEach(() => {
      global.window = originalWindow;
      delete (global as any).AudioContext;
    });

    it('should initialize without calling setAudioModeAsync', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await notificationManager.initialize();
      expect(mockAudio.setAudioModeAsync).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should use Web Audio API for sound', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await notificationManager.initialize();
      await notificationManager.playSound(true);
      
      expect(window.AudioContext).toHaveBeenCalled();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should not vibrate', async () => {
      await notificationManager.vibrate(true);
      expect(mockHaptics.notificationAsync).not.toHaveBeenCalled();
    });
  });
});
