import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { generateQRCodeMatrix } from '../utils/qrCodeGenerator';

export interface QRCodeViewProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 200,
  color = '#000000',
  backgroundColor = '#FFFFFF',
  testID,
  style,
}) => {
  const matrix = useMemo(() => {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    try {
      return generateQRCodeMatrix(value);
    } catch {
      return null;
    }
  }, [value]);

  if (!matrix || matrix.length === 0) {
    return (
      <View
        testID={testID}
        style={[
          styles.container,
          {
            width: size,
            height: size,
            backgroundColor: backgroundColor,
          },
          style,
        ]}
      />
    );
  }

  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: backgroundColor,
        },
        style,
      ]}
    >
      {matrix.map((row, rIdx) => (
        <View key={`r-${rIdx}`} style={styles.row}>
          {row.map((cell, cIdx) => (
            <View
              key={`c-${cIdx}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? color : backgroundColor,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});

export default QRCodeView;
