import { Platform } from 'react-native';

describe('Storage Utility', () => {
  const TEST_KEY = 'test_key';
  const TEST_VALUE = { foo: 'bar' };

  describe('Native Platform', () => {
    let storage: any;
    let STORAGE_KEYS: any;
    let AsyncStorage: any;

    beforeEach(() => {
      jest.resetModules();
      Platform.OS = 'android';
      
      // Manually mock AsyncStorage for this test suite using doMock
      AsyncStorage = {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        multiRemove: jest.fn(),
        clear: jest.fn(),
      };
      
      jest.doMock('@react-native-async-storage/async-storage', () => AsyncStorage);
      
      const storageModule = require('../storage');
      storage = storageModule.storage;
      STORAGE_KEYS = storageModule.STORAGE_KEYS;
    });

    it('should save data using AsyncStorage', async () => {
      AsyncStorage.setItem.mockResolvedValue(undefined);
      const result = await storage.setItem(TEST_KEY, TEST_VALUE);
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify(TEST_VALUE));
    });

    it('should load data using AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(TEST_VALUE));

      const result = await storage.getItem(TEST_KEY);
      expect(result).toEqual(TEST_VALUE);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should return null if data is not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.getItem(TEST_KEY);
      expect(result).toBeNull();
    });

    it('should remove data using AsyncStorage', async () => {
      const result = await storage.removeItem(TEST_KEY);
      expect(result).toBe(true);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should clear specific keys', async () => {
      const result = await storage.clear();
      expect(result).toBe(true);
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(Object.values(STORAGE_KEYS));
    });

    it('should handle setItem errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storage.setItem(TEST_KEY, TEST_VALUE);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Web Platform', () => {
    let storage: any;
    let STORAGE_KEYS: any;
    let mockLocalStorage: any;

    beforeEach(() => {
      jest.resetModules();
      Platform.OS = 'web';
      
      mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };
      
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      });

      const storageModule = require('../storage');
      storage = storageModule.storage;
      STORAGE_KEYS = storageModule.STORAGE_KEYS;
    });

    it('should save data using localStorage', async () => {
      const result = await storage.setItem(TEST_KEY, TEST_VALUE);
      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify(TEST_VALUE));
    });

    it('should load data using localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(TEST_VALUE));

      const result = await storage.getItem(TEST_KEY);
      expect(result).toEqual(TEST_VALUE);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should return null if data is not found in localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await storage.getItem(TEST_KEY);
      expect(result).toBeNull();
    });

    it('should remove data using localStorage', async () => {
      const result = await storage.removeItem(TEST_KEY);
      expect(result).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should clear specific keys using localStorage', async () => {
      const result = await storage.clear();
      expect(result).toBe(true);
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(key);
      });
    });
    
    it('should handle localStorage errors during setItem', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLocalStorage.setItem.mockImplementation(() => { throw new Error('Quota exceeded'); });

      const result = await storage.setItem(TEST_KEY, TEST_VALUE);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle localStorage errors during getItem', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLocalStorage.getItem.mockImplementation(() => { throw new Error('Security error'); });

      const result = await storage.getItem(TEST_KEY);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle localStorage errors during removeItem', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLocalStorage.removeItem.mockImplementation(() => { throw new Error('Security error'); });

      const result = await storage.removeItem(TEST_KEY);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle localStorage errors during clear', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockLocalStorage.removeItem.mockImplementation(() => { throw new Error('Security error'); });

      const result = await storage.clear();
      expect(result).toBe(false); // Should fail if one fails? 
      // Actually storage.ts clear() loops and catches? 
      // Checking implementation:
      /* 
      async clear(): Promise<boolean> {
        try {
          if (this.isWeb ...) {
             Object.values(STORAGE_KEYS).forEach(key => {
                window.localStorage.removeItem(key);
             });
          } ...
          return true;
        } catch (error) {
          return false;
        }
      */
      // If forEach callback throws, it bubbles up if synchronous. localStorage is synchronous.
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});