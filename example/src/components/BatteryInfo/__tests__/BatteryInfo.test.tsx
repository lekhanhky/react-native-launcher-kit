import React from 'react';
import {render} from '@testing-library/react-native';
import BatteryInfo from '..';

describe('BatteryInfo', () => {
  it('renders battery level', () => {
    const {getByText} = render(
      <BatteryInfo battery={{level: 85, isCharging: false}} />,
    );
    expect(getByText('85%')).toBeTruthy();
  });

  it('shows Charging when isCharging is true', () => {
    const {getByText} = render(
      <BatteryInfo battery={{level: 50, isCharging: true}} />,
    );
    expect(getByText('Charging')).toBeTruthy();
  });

  it('shows Not Charging when isCharging is false', () => {
    const {getByText} = render(
      <BatteryInfo battery={{level: 50, isCharging: false}} />,
    );
    expect(getByText('Not Charging')).toBeTruthy();
  });

  it('shows LIVE badge', () => {
    const {getByText} = render(
      <BatteryInfo battery={{level: 100, isCharging: true}} />,
    );
    expect(getByText('LIVE')).toBeTruthy();
  });
});
