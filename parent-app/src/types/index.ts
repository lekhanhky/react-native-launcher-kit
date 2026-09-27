export interface ChildDevice {
  id: string;                 // parent_devices id hoặc device_id
  deviceId: string;           // Hardware device_id
  childName: string;          // Tên bé
  childAvatar: string;        // Emoji avatar: 👦, 👧, 🧒, 🐱, 🐻
  deviceModel?: string;       // Model máy (Samsung Tab, v.v.)
  isEmergencyLocked: boolean; // Trạng thái khóa khẩn cấp
  isPaired: boolean;
  parentPin?: string;
  lastSeen?: string;
}

export interface QrPairingPayload {
  type: 'KIDS_LAUNCHER_PAIRING';
  deviceId: string;
  deviceName?: string;
  timestamp: number;
}

export interface EmergencyLockPayload {
  type: 'EMERGENCY_LOCK';
  isLocked: boolean;
  reason?: string;
  timestamp: number;
}

export interface ParentalPolicy {
  id: string;
  deviceId: string;
  policyMode: 'whitelist' | 'blacklist';
  packageList: string[];
  parentPin: string;
  isEmergencyLocked: boolean;
  updatedAt: string;
}
