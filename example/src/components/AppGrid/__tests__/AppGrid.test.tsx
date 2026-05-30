import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AppGrid from '..';

const mockApps = [
  {
    packageName: 'com.example.app1',
    label: 'App One',
    icon: 'file:///icon1.png',
    accentColor: '#FF0000',
  },
  {
    packageName: 'com.example.app2',
    label: 'App Two',
    icon: 'file:///icon2.png',
    accentColor: '#00FF00',
  },
];

describe('AppGrid', () => {
  it('renders all apps', () => {
    const {getByText} = render(
      <AppGrid apps={mockApps} onAppPress={() => {}} />,
    );
    expect(getByText('App One')).toBeTruthy();
    expect(getByText('App Two')).toBeTruthy();
  });

  it('calls onAppPress with package name when tapped', () => {
    const onAppPress = jest.fn();
    const {getByText} = render(
      <AppGrid apps={mockApps} onAppPress={onAppPress} />,
    );
    fireEvent.press(getByText('App One'));
    expect(onAppPress).toHaveBeenCalledWith('com.example.app1');
  });

  it('calls onAppLongPress with app object when long-pressed', () => {
    const onAppLongPress = jest.fn();
    const {getByText} = render(
      <AppGrid
        apps={mockApps}
        onAppPress={() => {}}
        onAppLongPress={onAppLongPress}
      />,
    );
    fireEvent(getByText('App One'), 'longPress');
    expect(onAppLongPress).toHaveBeenCalledWith(mockApps[0]);
  });

  it('renders empty when no apps provided', () => {
    const {queryByText} = render(
      <AppGrid apps={[]} onAppPress={() => {}} />,
    );
    expect(queryByText('App One')).toBeNull();
  });
});
