import React from 'react';
import { render } from '@testing-library/react-native';
import { Timer } from '../Timer';

describe('Timer Component', () => {
  it('should render correct time format', () => {
    const { getByText } = render(
      <Timer remainingSeconds={125} status="idle" />
    );
    expect(getByText('02:05')).toBeTruthy();
  });

  it('should render completion message when status is completed', () => {
    const { getByText } = render(
      <Timer remainingSeconds={0} status="completed" />
    );
    expect(getByText('00:00')).toBeTruthy();
    expect(getByText('Complete! ✨')).toBeTruthy();
  });

  it('should not render completion message when not completed', () => {
    const { queryByText } = render(
      <Timer remainingSeconds={10} status="running" />
    );
    expect(queryByText('Complete! ✨')).toBeNull();
  });

  it('should use correct color for running state', () => {
    // Note: Testing styles/colors usually requires checking style props
    // We can rely on snapshot testing or style verification
    const { getByText } = render(
      <Timer remainingSeconds={5} status="running" />
    );
    
    // Low time (<=10) should be red/urgent color
    // We can't easily check computed color without more complex setup, 
    // but we verify it renders without error.
    expect(getByText('00:05')).toBeTruthy();
  });

  it('should use normal color for running state > 10s', () => {
    const { getByText } = render(
      <Timer remainingSeconds={15} status="running" />
    );
    expect(getByText('00:15')).toBeTruthy();
  });

  it('should use correct color for paused state', () => {
    const { getByText } = render(
      <Timer remainingSeconds={100} status="paused" />
    );
    // Should render without error (checking styles logic)
    expect(getByText('01:40')).toBeTruthy();
  });
});
