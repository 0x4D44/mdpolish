import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Settings } from '../Settings';

// Mock Slider with implementation to test interaction
jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  
  return (props: any) => {
    return (
      <View testID="slider-mock">
        <Text onPress={() => props.onValueChange && props.onValueChange(5)}>Change Value</Text>
        <Text onPress={() => props.onSlidingComplete && props.onSlidingComplete(5)}>Complete Slide</Text>
      </View>
    );
  };
});

describe('Settings Component', () => {
  const mockConfig = {
    timerDurationSeconds: 180,
    soundEnabled: true,
    vibrationEnabled: true,
  };

  const mockHandlers = {
    onClose: jest.fn(),
    onConfigChange: jest.fn(),
    onNewSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible', () => {
    const { getByText } = render(
      <Settings visible={true} config={mockConfig} {...mockHandlers} />
    );
    
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('3:00')).toBeTruthy();
  });

  it('should update timer duration via slider', () => {
    const { getByText } = render(
      <Settings visible={true} config={mockConfig} {...mockHandlers} />
    );
    
    fireEvent.press(getByText('Change Value'));
    // Slider sets value to 5 minutes = 300 seconds
    
    fireEvent.press(getByText('Save'));
    
    expect(mockHandlers.onConfigChange).toHaveBeenCalledWith(expect.objectContaining({
      timerDurationSeconds: 300,
    }));
  });

  it('should handle sliding complete', () => {
    const { getByText } = render(
        <Settings visible={true} config={mockConfig} {...mockHandlers} />
      );
      
      fireEvent.press(getByText('Complete Slide'));
      // Just verifies the handler is called without error
  });

  it('should call onClose when close button is pressed', () => {
    const { getByText } = render(
      <Settings visible={true} config={mockConfig} {...mockHandlers} />
    );
    
    fireEvent.press(getByText('✕'));
    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  it('should call onNewSession when pressed', () => {
    const { getByText } = render(
      <Settings visible={true} config={mockConfig} {...mockHandlers} />
    );
    
    fireEvent.press(getByText('New Session'));
    expect(mockHandlers.onNewSession).toHaveBeenCalled();
    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  it('should save config changes', () => {
    const { getByText } = render(
      <Settings visible={true} config={mockConfig} {...mockHandlers} />
    );
    
    // Simulate changing a switch (we verify it renders, but updating switch state in test requires finding it)
    // Finding switch by accessibility role is better if available.
    // For now we just test that Save calls callback with current state (which matches props initially)
    
    fireEvent.press(getByText('Save'));
    expect(mockHandlers.onConfigChange).toHaveBeenCalledWith({
      timerDurationSeconds: 180,
      soundEnabled: true,
      vibrationEnabled: true,
    });
    expect(mockHandlers.onClose).toHaveBeenCalled();
  });
});
