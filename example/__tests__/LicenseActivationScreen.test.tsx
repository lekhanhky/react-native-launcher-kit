import React from 'react';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react-native';
import { LicenseActivationScreen } from '../src/screens/LicenseActivationScreen';
import { licenseService } from '../src/services/licenseService';
import { supabaseClient } from '../src/services/supabaseClient';

jest.setTimeout(25000);

// Mock licenseService
jest.mock('../src/services/licenseService', () => ({
  licenseService: {
    getDeviceUniqueId: jest.fn().mockResolvedValue('ANDR-TEST9999'),
    activateLicense: jest.fn().mockResolvedValue({ success: true, message: 'OK' }),
  },
}));

// Mock supabaseClient
jest.mock('../src/services/supabaseClient', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
  supabaseClient: {
    from: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

describe('LicenseActivationScreen', () => {
  let mockWebSocketInstances: any[] = [];
  const originalWebSocket = global.WebSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebSocketInstances = [];

    // Mock global WebSocket
    class MockWebSocket {
      url: string;
      readyState = 1; // WebSocket.OPEN
      onopen: (() => void) | null = null;
      onmessage: ((event: { data: string }) => void) | null = null;
      onerror: ((err: any) => void) | null = null;
      onclose: (() => void) | null = null;
      send = jest.fn();
      close = jest.fn(() => {
        this.readyState = 3;
        if (this.onclose) this.onclose();
      });

      constructor(url: string) {
        this.url = url;
        mockWebSocketInstances.push(this);
        setTimeout(() => {
          if (this.onopen && this.readyState === 1) this.onopen();
        }, 10);
      }
    }

    (global as any).WebSocket = MockWebSocket;
  });

  afterEach(() => {
    cleanup();
    (global as any).WebSocket = originalWebSocket;
  });

  it('hiển thị mã QR và thông tin thiết bị sau khi tải device ID', async () => {
    const onActivated = jest.fn();
    const { findByText, findByTestId, unmount } = render(
      <LicenseActivationScreen onActivated={onActivated} />
    );

    // Kiểm tra title và trạng thái chờ
    expect(await findByText('KÍCH HOẠT BẢN QUYỀN LAUNCHER')).toBeTruthy();
    expect(await findByText('Đang đợi phụ huynh quét mã...')).toBeTruthy();

    // Kiểm tra hiển thị mã thiết bị
    expect(await findByTestId('device-id-text')).toBeTruthy();
    expect(await findByText('ANDR-TEST9999')).toBeTruthy();

    // Kiểm tra QR code container
    expect(await findByTestId('qr-code-view')).toBeTruthy();

    unmount();
  });

  it('cho phép toggle hiển thị phần nhập mã bản quyền thủ công', async () => {
    const onActivated = jest.fn();
    const { getByTestId, queryByTestId, findByText, unmount } = render(
      <LicenseActivationScreen onActivated={onActivated} />
    );

    await findByText('ANDR-TEST9999');

    // Mặc định phần nhập mã thủ công bị thu gọn
    expect(queryByTestId('manual-input-wrapper')).toBeNull();

    // Bấm nút toggle mở rộng
    fireEvent.press(getByTestId('toggle-manual-btn'));
    expect(getByTestId('manual-input-wrapper')).toBeTruthy();
    expect(getByTestId('manual-license-input')).toBeTruthy();
    expect(getByTestId('manual-activate-btn')).toBeTruthy();

    // Bấm nút toggle thu gọn lại
    fireEvent.press(getByTestId('toggle-manual-btn'));
    expect(queryByTestId('manual-input-wrapper')).toBeNull();

    unmount();
  });

  it('kích hoạt bản quyền thành công qua nhập mã thủ công', async () => {
    const onActivated = jest.fn();
    const { getByTestId, findByText, unmount } = render(
      <LicenseActivationScreen onActivated={onActivated} />
    );

    await findByText('ANDR-TEST9999');

    // Mở phần nhập mã thủ công
    fireEvent.press(getByTestId('toggle-manual-btn'));

    // Nhập key và nhấn Kích hoạt
    fireEvent.changeText(getByTestId('manual-license-input'), 'LCK-DEMO');
    fireEvent.press(getByTestId('manual-activate-btn'));

    await waitFor(() => {
      expect(licenseService.activateLicense).toHaveBeenCalledWith('LCK-DEMO');
      expect(onActivated).toHaveBeenCalled();
    });

    unmount();
  });

  it('lắng nghe WebSocket và tự động kích hoạt khi nhận DEVICE_PAIRED_SUCCESS', async () => {
    const onActivated = jest.fn();
    const { findByText, unmount } = render(
      <LicenseActivationScreen onActivated={onActivated} />
    );

    await findByText('ANDR-TEST9999');

    // Chờ WebSocket kết nối
    await waitFor(() => {
      expect(mockWebSocketInstances.length).toBeGreaterThan(0);
    });

    const wsInstance = mockWebSocketInstances[0];

    // Giả lập phụ huynh quét mã và Supabase bắn broadcast sự kiện ghép nối thành công
    act(() => {
      if (wsInstance.onmessage) {
        wsInstance.onmessage({
          data: JSON.stringify({
            topic: 'realtime:device_pairing:ANDR-TEST9999',
            event: 'broadcast',
            payload: {
              type: 'broadcast',
              event: 'DEVICE_PAIRED_SUCCESS',
              payload: {
                device_id: 'ANDR-TEST9999',
                success: true,
              },
            },
          }),
        });
      }
    });

    await waitFor(
      () => {
        expect(licenseService.activateLicense).toHaveBeenCalledWith('QR-ACT-ANDR-TEST9999');
        expect(onActivated).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    unmount();
  });

  it('tự động kích hoạt khi Polling REST API phát hiện is_paired === true', async () => {
    (supabaseClient.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'devices') {
        return Promise.resolve({
          data: [{ device_id: 'ANDR-TEST9999', is_paired: true }],
          error: null,
        });
      }
      return Promise.resolve({ data: [], error: null });
    });

    const onActivated = jest.fn();
    const { unmount } = render(<LicenseActivationScreen onActivated={onActivated} />);

    await waitFor(
      () => {
        expect(licenseService.activateLicense).toHaveBeenCalledWith('QR-ACT-ANDR-TEST9999');
        expect(onActivated).toHaveBeenCalled();
      },
      { timeout: 7000 }
    );

    unmount();
  });
});
