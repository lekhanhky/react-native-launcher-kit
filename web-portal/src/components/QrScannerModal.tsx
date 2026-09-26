'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Smartphone,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode';

export interface QrPairingPayload {
  action: string;
  v: number;
  device_id: string;
  device_name?: string;
  created_at?: number;
}

export interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (payload: QrPairingPayload) => void;
}

const QR_CONTAINER_ID = 'qr-reader-viewport';

export default function QrScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
}: QrScannerModalProps) {
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [scannedPayload, setScannedPayload] = useState<QrPairingPayload | null>(null);
  const [scanKey, setScanKey] = useState<number>(0);

  const scannerRef = useRef<Html5QrcodeType | null>(null);
  const isStoppingRef = useRef<boolean>(false);

  // Stop camera helper
  const safelyStopScanner = useCallback(async () => {
    if (!scannerRef.current || isStoppingRef.current) return;
    isStoppingRef.current = true;
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      try {
        scannerRef.current.clear();
      } catch {
        // ignore clear error
      }
    } catch (err) {
      console.warn('Error stopping Html5Qrcode scanner:', err);
    } finally {
      scannerRef.current = null;
      isStoppingRef.current = false;
    }
  }, []);

  // Close handler
  const handleModalClose = useCallback(async () => {
    await safelyStopScanner();
    setScannedPayload(null);
    setValidationError(null);
    setCameraError(null);
    onClose();
  }, [safelyStopScanner, onClose]);

  // Reset & Scan Again handler
  const handleResetScan = useCallback(async () => {
    await safelyStopScanner();
    setScannedPayload(null);
    setValidationError(null);
    setCameraError(null);
    setScanKey((k) => k + 1);
  }, [safelyStopScanner]);

  // Confirm Activation handler
  const handleConfirmActivation = useCallback(async () => {
    if (!scannedPayload) return;
    const payload = scannedPayload;
    await safelyStopScanner();
    onScanSuccess(payload);
    onClose();
  }, [scannedPayload, safelyStopScanner, onScanSuccess, onClose]);

  // Scanner lifecycle effect
  useEffect(() => {
    if (!isOpen) {
      safelyStopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      try {
        setIsLoadingCamera(true);
        setCameraError(null);

        // Dynamically import html5-qrcode to guarantee 100% SSR safety
        const { Html5Qrcode } = await import('html5-qrcode');

        if (!isMounted) return;

        // Ensure container exists
        const container = document.getElementById(QR_CONTAINER_ID);
        if (!container) {
          throw new Error('Không tìm thấy vùng hiển thị camera.');
        }

        // Clean up any stale scanner instance
        if (scannerRef.current) {
          await safelyStopScanner();
        }

        const scanner = new Html5Qrcode(QR_CONTAINER_ID);
        scannerRef.current = scanner;

        const onScanSuccessCallback = async (decodedText: string) => {
          // Immediately stop scanner upon capturing QR
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch (stopErr) {
            console.warn('Error stopping scanner after detection:', stopErr);
          }

          if (!isMounted) return;

          // Parse and validate QR payload
          try {
            const parsed = JSON.parse(decodedText);
            if (
              parsed &&
              typeof parsed === 'object' &&
              parsed.action === 'KIDS_LAUNCHER_PAIR' &&
              parsed.device_id &&
              typeof parsed.device_id === 'string' &&
              parsed.device_id.trim().length > 0
            ) {
              const payload: QrPairingPayload = {
                action: parsed.action,
                v: typeof parsed.v === 'number' ? parsed.v : 1,
                device_id: parsed.device_id.trim(),
                device_name: parsed.device_name ? String(parsed.device_name) : undefined,
                created_at: parsed.created_at ? Number(parsed.created_at) : undefined,
              };
              setScannedPayload(payload);
              setValidationError(null);
            } else {
              setValidationError(
                'Mã QR vừa quét không phải mã ghép nối của Kids Launcher hoặc dữ liệu bị thiếu.'
              );
              setScannedPayload(null);
            }
          } catch {
            setValidationError(
              'Dữ liệu mã QR không đúng định dạng JSON. Vui lòng quét mã trên ứng dụng Kids Launcher.'
            );
            setScannedPayload(null);
          }
        };

        const config = {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
        };

        // Try environment camera (rear camera) first, then fallback to user (front webcam)
        try {
          await scanner.start(
            { facingMode: 'environment' },
            config,
            onScanSuccessCallback,
            () => {
              // Ignore frame scan failures
            }
          );
        } catch {
          await scanner.start(
            { facingMode: 'user' },
            config,
            onScanSuccessCallback,
            () => {
              // Ignore frame scan failures
            }
          );
        }

        if (isMounted) {
          setIsLoadingCamera(false);
        }
      } catch (err: any) {
        console.error('Failed to start camera scanner:', err);
        if (isMounted) {
          setIsLoadingCamera(false);
          const errorMsg =
            err?.name === 'NotAllowedError' || err?.message?.includes('NotAllowedError')
              ? 'Trình duyệt bị từ chối quyền truy cập máy ảnh. Vui lòng mở quyền camera trong Cài đặt trình duyệt để tiếp tục.'
              : err?.message || 'Không thể kết nối máy ảnh. Vui lòng kiểm tra lại thiết bị của bạn.';
          setCameraError(errorMsg);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      safelyStopScanner();
    };
  }, [isOpen, scanKey, safelyStopScanner]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Quét Mã QR Thiết Bị
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kids Launcher Device Activation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STATE 1: SCANNING VIEWPORT (Active Camera) */}
        {!scannedPayload && !validationError && !cameraError && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
              Hướng camera vào mã QR hiển thị trên màn hình ứng dụng Kids Launcher của bé:
            </p>

            <div className="relative w-full aspect-square max-w-[300px] mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
              {/* HTML5 QR Container */}
              <div id={QR_CONTAINER_ID} className="w-full h-full" />

              {/* Viewfinder Target Frame Overlay */}
              {!isLoadingCamera && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative w-52 h-52 rounded-2xl border-2 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    {/* Modern Laser Corner Brackets */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />

                    {/* Animated Scanning Laser Beam */}
                    <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-laser" />
                  </div>
                </div>
              )}

              {/* Camera Initializing Overlay */}
              {isLoadingCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white gap-2.5">
                  <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    Đang khởi động máy ảnh...
                  </span>
                </div>
              )}
            </div>

            {/* Scanning Status Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Đang nhận diện mã QR trong khung ngắm...</span>
            </div>
          </div>
        )}

        {/* STATE 2: VALID QR SCANNED (Confirmation Card) */}
        {scannedPayload && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                Đã Nhận Diện Thiết Bị!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xác nhận thông tin thiết bị dưới đây trước khi liên kết:
              </p>
            </div>

            {/* Device Info Card */}
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-400 dark:text-slate-400">Tên thiết bị:</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {scannedPayload.device_name || 'Máy tính bảng của Bé'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Mã thiết bị (Device ID):</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                  {scannedPayload.device_id}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Giao thức ghép nối:</span>
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  KIDS_LAUNCHER_PAIR (v{scannedPayload.v})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmActivation}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Kích Hoạt & Liên Kết Ngay
              </button>

              <button
                type="button"
                onClick={handleResetScan}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl transition cursor-pointer text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Quét Lại
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: INVALID QR (Error Card) */}
        {validationError && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                Mã QR Không Hợp Lệ
              </h4>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 leading-relaxed text-center">
              {validationError}
            </div>

            <button
              type="button"
              onClick={handleResetScan}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-bold rounded-2xl transition cursor-pointer text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Quét Lại
            </button>
          </div>
        )}

        {/* STATE 4: CAMERA ERROR (Permission or Hardware error) */}
        {cameraError && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                <CameraOff className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                Không Thể Mở Máy Ảnh
              </h4>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed text-center">
              {cameraError}
            </div>

            <button
              type="button"
              onClick={handleResetScan}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Thử Lại
            </button>
          </div>
        )}

        {/* CSS for Scanner laser & camera video styling */}
        <style jsx global>{`
          @keyframes scanLaser {
            0% {
              top: 10%;
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
            100% {
              top: 90%;
              opacity: 0.3;
            }
          }
          .animate-laser {
            animation: scanLaser 2s ease-in-out infinite alternate;
          }
          #${QR_CONTAINER_ID} video {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 1rem;
          }
        `}</style>
      </div>
    </div>
  );
}
