/**
 * Time Scheduler Service
 * Evaluates whether current time is within allowed working/playing hours.
 */

export interface ScheduleConfig {
  isEnabled: boolean;
  allowedStartTime: string; // "07:00:00"
  allowedEndTime: string;   // "21:00:00"
  daysOfWeek: number[];     // [1, 2, 3, 4, 5, 6, 7] - 1: Thứ 2 -> 7: Chủ Nhật
  lockMessage: string;
}

export interface ScheduleEvaluationResult {
  isBlocked: boolean;
  message: string;
}

/**
 * Checks if current time is outside the allowed hours.
 */
export const checkIsOutsideAllowedHours = (
  schedule: ScheduleConfig,
  testDate?: Date
): ScheduleEvaluationResult => {
  if (!schedule.isEnabled) {
    return { isBlocked: false, message: '' };
  }

  const now = testDate || new Date();
  // Chuyển getDay(): 0 (CN) -> 7, 1 (T2) -> 1, ..., 6 (T7) -> 6
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();

  if (!schedule.daysOfWeek.includes(currentDay)) {
    return {
      isBlocked: true,
      message: 'Hôm nay không nằm trong ngày được phép sử dụng thiết bị.',
    };
  }

  const [startH, startM] = schedule.allowedStartTime.split(':').map(Number);
  const [endH, endM] = schedule.allowedEndTime.split(':').map(Number);

  const start = new Date(now);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(now);
  end.setHours(endH, endM, 0, 0);

  if (now < start || now > end) {
    const formattedStart = schedule.allowedStartTime.slice(0, 5);
    const formattedEnd = schedule.allowedEndTime.slice(0, 5);
    return {
      isBlocked: true,
      message:
        schedule.lockMessage ||
        `Chỉ được phép sử dụng thiết bị từ ${formattedStart} đến ${formattedEnd}`,
    };
  }

  return { isBlocked: false, message: '' };
};
