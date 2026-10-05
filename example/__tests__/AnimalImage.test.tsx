import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimalImage } from '../src/components/AnimalImage';
import { animalLibrary } from '../src/libraries/animalLibrary';

describe('AnimalImage Component', () => {
  it('renders correctly with an animal ID that has local 3D asset', () => {
    const { getByTestId } = render(<AnimalImage id="lion" testID="lion-image" size={80} />);
    const container = getByTestId('lion-image');
    expect(container).toBeTruthy();
  });

  it('renders correctly with rounded prop', () => {
    const size = 100;
    const { getByTestId } = render(<AnimalImage id="tiger" rounded size={size} testID="tiger-image" />);
    const container = getByTestId('tiger-image');
    expect(container).toBeTruthy();
  });

  it('renders fallback emoji when invalid ID is provided', () => {
    const { getByTestId, getByText } = render(<AnimalImage id="dragon_xyz" testID="invalid-animal" />);
    const fallback = getByTestId('invalid-animal-fallback');
    expect(fallback).toBeTruthy();
    expect(getByText('🐾')).toBeTruthy();
  });

  it('handles onPress callback properly', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <AnimalImage id="dog" onPress={onPressMock} testID="clickable-dog" />
    );
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders badge emoji when showBadge is enabled', () => {
    const { getByText } = render(<AnimalImage id="panda" showBadge testID="panda-badge" />);
    expect(getByText('🐼')).toBeTruthy();
  });
});
