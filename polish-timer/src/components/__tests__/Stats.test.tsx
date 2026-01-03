import React from 'react';
import { render } from '@testing-library/react-native';
import { Stats } from '../Stats';

describe('Stats Component', () => {
  it('should format seconds correctly', () => {
    const { getByText } = render(
      <Stats iterations={1} totalTimeSeconds={45} />
    );
    expect(getByText('45 secs')).toBeTruthy();
  });

  it('should format minutes correctly', () => {
    const { getByText } = render(
      <Stats iterations={1} totalTimeSeconds={125} />
    );
    expect(getByText('2 mins')).toBeTruthy();
  });

  it('should format hours correctly', () => {
    const { getByText } = render(
      <Stats iterations={1} totalTimeSeconds={3660} />
    );
    expect(getByText('1h 1m')).toBeTruthy();
  });

  it('should display iterations count', () => {
    const { getByText } = render(
      <Stats iterations={5} totalTimeSeconds={10} />
    );
    expect(getByText('5')).toBeTruthy();
  });
});
