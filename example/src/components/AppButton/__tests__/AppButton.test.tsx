import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AppButton from '..';

describe('AppButton', () => {
  it('renders with the correct title', () => {
    const {getByText} = render(
      <AppButton onPress={() => {}} title="Test Button" />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <AppButton onPress={onPress} title="Press Me" />,
    );
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders primary variant by default', () => {
    const {getByText} = render(
      <AppButton onPress={() => {}} title="Primary" />,
    );
    const text = getByText('Primary');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({color: '#fff'})]),
    );
  });

  it('renders secondary variant when specified', () => {
    const {getByText} = render(
      <AppButton onPress={() => {}} title="Secondary" variant="secondary" />,
    );
    const text = getByText('Secondary');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({color: '#1C1C1E'})]),
    );
  });
});
