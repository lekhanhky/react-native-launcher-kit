import React from 'react';
import {render} from '@testing-library/react-native';
import AppDetail from '..';

const mockApp = {
  packageName: 'com.example.app',
  label: 'Example App',
  icon: 'file:///icon.png',
  version: '1.2.3',
  accentColor: '#6C3FBF',
};

describe('AppDetail', () => {
  it('renders app name', () => {
    const {getByText} = render(<AppDetail app={mockApp} />);
    expect(getByText('Example App')).toBeTruthy();
  });

  it('renders package name', () => {
    const {getByText} = render(<AppDetail app={mockApp} />);
    expect(getByText('com.example.app')).toBeTruthy();
  });

  it('renders version when available', () => {
    const {getByText} = render(<AppDetail app={mockApp} />);
    expect(getByText('v1.2.3')).toBeTruthy();
  });

  it('does not render version when not available', () => {
    const appWithoutVersion = {...mockApp, version: undefined};
    const {queryByText} = render(<AppDetail app={appWithoutVersion} />);
    expect(queryByText(/^v/)).toBeNull();
  });

  it('renders accent color value', () => {
    const {getByText} = render(<AppDetail app={mockApp} />);
    expect(getByText('accentColor: #6C3FBF')).toBeTruthy();
  });
});
