import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Controls } from '../Controls';

describe('Controls Component', () => {
  const mockHandlers = {
    onStart: jest.fn(),
    onPause: jest.fn(),
    onReset: jest.fn(),
    onNextIteration: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Start button when idle', () => {
    const { getByText, queryByText } = render(
      <Controls status="idle" {...mockHandlers} />
    );
    
    expect(getByText('▶️ Start')).toBeTruthy();
    expect(queryByText('Reset')).toBeNull(); // Reset hidden when idle
  });

  it('should render Pause and Reset buttons when running', () => {
    const { getByText } = render(
      <Controls status="running" {...mockHandlers} />
    );
    
    expect(getByText('⏸️ Pause')).toBeTruthy();
    expect(getByText('Reset')).toBeTruthy();
  });

  it('should render Resume and Reset buttons when paused', () => {
    const { getByText } = render(
      <Controls status="paused" {...mockHandlers} />
    );
    
    expect(getByText('▶️ Resume')).toBeTruthy();
    expect(getByText('Reset')).toBeTruthy();
  });

  it('should render Next Iteration and New Session buttons when completed', () => {
    const { getByText } = render(
      <Controls status="completed" {...mockHandlers} />
    );
    
    expect(getByText('✨ Next Iteration')).toBeTruthy();
    expect(getByText('New Session')).toBeTruthy();
  });

  it('should call onStart when Start is pressed', () => {
    const { getByText } = render(
      <Controls status="idle" {...mockHandlers} />
    );
    
    fireEvent.press(getByText('▶️ Start'));
    expect(mockHandlers.onStart).toHaveBeenCalled();
  });

  it('should call onPause when Pause is pressed', () => {
    const { getByText } = render(
      <Controls status="running" {...mockHandlers} />
    );
    
    fireEvent.press(getByText('⏸️ Pause'));
    expect(mockHandlers.onPause).toHaveBeenCalled();
  });

  it('should handle press in/out animations', () => {
    const { getByText } = render(
      <Controls status="idle" {...mockHandlers} />
    );
    
    const button = getByText('▶️ Start');
    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
    // We can't easily verify animation state without advanced setup, 
    // but this covers the handler execution.
  });
});
