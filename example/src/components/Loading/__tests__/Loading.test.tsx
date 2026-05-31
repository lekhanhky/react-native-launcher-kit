import React from 'react';
import {render} from '@testing-library/react-native';
import Loading from '..';

describe('Loading', () => {
  it('renders loading text', () => {
    const {getByText} = render(<Loading />);
    expect(getByText('Loading apps...')).toBeTruthy();
  });

  it('renders an activity indicator', () => {
    const {UNSAFE_getByType} = render(<Loading />);
    const {ActivityIndicator} = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
