/**
 * A styled action button with primary/secondary variants.
 * Uses Android ripple effect for touch feedback.
 */
import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

interface AppButtonProps {
  /** Callback fired when the button is pressed. */
  onPress: () => void;
  /** Button label text. */
  title: string;
  /** Visual variant — 'primary' (purple) or 'secondary' (gray). Defaults to 'primary'. */
  variant?: 'primary' | 'secondary';
}

const AppButton: React.FC<AppButtonProps> = ({onPress, title, variant = 'primary'}) => (
  <Pressable
    android_ripple={{color: variant === 'primary' ? '#523680' : '#D1D1D6', radius: 200}}
    style={[styles.button, variant === 'secondary' && styles.buttonSecondary]}
    onPress={onPress}>
    <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    backgroundColor: '#6C3FBF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#F2F2F7',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  textSecondary: {
    color: '#1C1C1E',
  },
});

export default AppButton;
