import React from 'react';
import {render} from '@testing-library/react-native';
import QRCodeView from '../src/components/QRCodeView';
import * as qrGen from '../src/utils/qrCodeGenerator';

describe('QRCodeView', () => {
  it('renders successfully with valid value and default props', () => {
    const {getByTestId} = render(<QRCodeView value="HELLO" testID="qr-code" />);
    const qrContainer = getByTestId('qr-code');
    expect(qrContainer).toBeTruthy();
    expect(qrContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 200,
          height: 200,
          backgroundColor: '#FFFFFF',
        }),
      ])
    );
  });

  it('renders with custom size, color, and backgroundColor', () => {
    const customSize = 210;
    const customColor = '#123456';
    const customBg = '#ABCDEF';
    const {getByTestId} = render(
      <QRCodeView
        value="https://example.com"
        size={customSize}
        color={customColor}
        backgroundColor={customBg}
        testID="qr-code-custom"
      />
    );

    const qrContainer = getByTestId('qr-code-custom');
    expect(qrContainer).toBeTruthy();
    expect(qrContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: customSize,
          height: customSize,
          backgroundColor: customBg,
        }),
      ])
    );
  });

  it('renders a safe placeholder when value is empty', () => {
    const size = 150;
    const {getByTestId} = render(
      <QRCodeView value="" size={size} testID="qr-empty" />
    );

    const placeholder = getByTestId('qr-empty');
    expect(placeholder).toBeTruthy();
    expect(placeholder.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: size,
          height: size,
        }),
      ])
    );
  });

  it('handles generator errors gracefully without crashing', () => {
    const spy = jest.spyOn(qrGen, 'generateQRCodeMatrix').mockImplementation(() => {
      throw new Error('QR generation error');
    });

    const {getByTestId} = render(
      <QRCodeView value="throw-test" size={180} testID="qr-error" />
    );

    const fallback = getByTestId('qr-error');
    expect(fallback).toBeTruthy();
    expect(fallback.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 180,
          height: 180,
        }),
      ])
    );

    spy.mockRestore();
  });

  it('calculates dynamic cell sizes and renders the full matrix rows', () => {
    const size = 210;
    const {getByTestId} = render(
      <QRCodeView value="V1" size={size} testID="qr-matrix" />
    );

    const qrContainer = getByTestId('qr-matrix');
    // Version 1 is 21x21 modules
    expect(qrContainer.children.length).toBe(21);
  });
});
