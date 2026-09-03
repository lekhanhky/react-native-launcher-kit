import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
type Command = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'COLLECT';

interface Level {
  id: number;
  title: string;
  startX: number;
  startY: number;
  startDir: Direction;
  targetX: number;
  targetY: number;
  obstacles: Array<{ x: number; y: number; type: 'rock' | 'water' }>;
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Màn 1: Bước thẳng về phía trước',
    startX: 1, startY: 4, startDir: 'UP',
    targetX: 1, targetY: 1,
    obstacles: [{ x: 3, y: 2, type: 'rock' }],
  },
  {
    id: 2,
    title: 'Màn 2: Rẽ góc nhặt sao',
    startX: 0, startY: 4, startDir: 'UP',
    targetX: 3, targetY: 2,
    obstacles: [{ x: 1, y: 3, type: 'water' }, { x: 2, y: 3, type: 'rock' }],
  },
  {
    id: 3,
    title: 'Màn 3: Vượt chướng ngại vật',
    startX: 0, startY: 4, startDir: 'RIGHT',
    targetX: 4, targetY: 0,
    obstacles: [{ x: 2, y: 2, type: 'rock' }, { x: 2, y: 3, type: 'water' }, { x: 3, y: 1, type: 'water' }],
  },
];

export const RobotCoderGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const currentLevel = LEVELS[levelIdx];

  const [robotX, setRobotX] = useState(currentLevel.startX);
  const [robotY, setRobotY] = useState(currentLevel.startY);
  const [robotDir, setRobotDir] = useState<Direction>(currentLevel.startDir);
  const [commands, setCommands] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    resetToLevel(levelIdx);
    soundManager.speak('Chào mừng bé đến với Lập Trình Robot Tí Hon! Hãy xếp các câu lệnh để đưa Robot tới ngôi sao nhé!', 'vi');
  }, [levelIdx]);

  const resetToLevel = (idx: number) => {
    const lvl = LEVELS[idx];
    setRobotX(lvl.startX);
    setRobotY(lvl.startY);
    setRobotDir(lvl.startDir);
    setCommands([]);
    setIsRunning(false);
    setActiveStep(null);
    setIsSuccess(false);
  };

  const addCommand = (cmd: Command) => {
    if (isRunning || commands.length >= 10) return;
    setCommands((prev) => [...prev, cmd]);
    if (cmd === 'FORWARD') soundManager.speak('Tiến', 'vi');
    if (cmd === 'TURN_LEFT') soundManager.speak('Xoay trái', 'vi');
    if (cmd === 'TURN_RIGHT') soundManager.speak('Xoay phải', 'vi');
    if (cmd === 'COLLECT') soundManager.speak('Nhặt sao', 'vi');
  };

  const removeLastCommand = () => {
    if (isRunning) return;
    setCommands((prev) => prev.slice(0, -1));
  };

  const runCode = async () => {
    if (commands.length === 0 || isRunning) return;

    setIsRunning(true);
    soundManager.speak('Robot bắt đầu chạy các lệnh!', 'vi');

    let curX = currentLevel.startX;
    let curY = currentLevel.startY;
    let curDir = currentLevel.startDir;

    setRobotX(curX);
    setRobotY(curY);
    setRobotDir(curDir);

    for (let i = 0; i < commands.length; i++) {
      setActiveStep(i);
      const cmd = commands[i];

      await new Promise((r) => setTimeout(r, 650));

      if (cmd === 'FORWARD') {
        let nX = curX;
        let nY = curY;
        if (curDir === 'UP') nY -= 1;
        if (curDir === 'DOWN') nY += 1;
        if (curDir === 'LEFT') nX -= 1;
        if (curDir === 'RIGHT') nX += 1;

        // Check boundaries
        if (nX < 0 || nX >= 5 || nY < 0 || nY >= 5) {
          soundManager.speak('Ối! Robot đụng tường rồi! Bé hãy sửa lại lệnh nhé.', 'vi');
          setIsRunning(false);
          setActiveStep(null);
          return;
        }

        // Check obstacles
        const hitObstacle = currentLevel.obstacles.find((o) => o.x === nX && o.y === nY);
        if (hitObstacle) {
          soundManager.speak('Ôi! Robot gặp chướng ngại vật rồi! Cùng lập trình lại nào.', 'vi');
          setIsRunning(false);
          setActiveStep(null);
          return;
        }

        curX = nX;
        curY = nY;
        setRobotX(curX);
        setRobotY(curY);
      } else if (cmd === 'TURN_LEFT') {
        if (curDir === 'UP') curDir = 'LEFT';
        else if (curDir === 'LEFT') curDir = 'DOWN';
        else if (curDir === 'DOWN') curDir = 'RIGHT';
        else if (curDir === 'RIGHT') curDir = 'UP';
        setRobotDir(curDir);
      } else if (cmd === 'TURN_RIGHT') {
        if (curDir === 'UP') curDir = 'RIGHT';
        else if (curDir === 'RIGHT') curDir = 'DOWN';
        else if (curDir === 'DOWN') curDir = 'LEFT';
        else if (curDir === 'LEFT') curDir = 'UP';
        setRobotDir(curDir);
      } else if (cmd === 'COLLECT') {
        if (curX === currentLevel.targetX && curY === currentLevel.targetY) {
          setIsSuccess(true);
          soundManager.speak('Hoan hô bé! Robot đã nhặt được ngôi sao vàng lấp lánh!', 'vi');
          setIsRunning(false);
          setActiveStep(null);
          return;
        }
      }
    }

    setIsRunning(false);
    setActiveStep(null);

    // Final check if on star
    if (curX === currentLevel.targetX && curY === currentLevel.targetY) {
      setIsSuccess(true);
      soundManager.speak('Chúc mừng bé đã lập trình thành công đưa Robot về đích!', 'vi');
    } else {
      soundManager.speak('Chưa tới ngôi sao rồi! Bé hãy kiểm tra và thêm lệnh nhé!', 'vi');
    }
  };

  const getRobotIcon = () => {
    if (robotDir === 'UP') return '🤖⬆️';
    if (robotDir === 'RIGHT') return '🤖➡️';
    if (robotDir === 'DOWN') return '🤖⬇️';
    return '🤖⬅️';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🤖 Lập Trình Robot Tí Hon</Text>
          <Text style={styles.subtitleText}>{currentLevel.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => resetToLevel(levelIdx)}
          activeOpacity={0.7}
        >
          <Text style={styles.resetBtnText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* GRID MAP (5x5) */}
      <View style={styles.gridMap}>
        {Array.from({ length: 5 }).map((_, rIdx) => (
          <View key={rIdx} style={styles.gridRow}>
            {Array.from({ length: 5 }).map((_, cIdx) => {
              const isRobot = robotX === cIdx && robotY === rIdx;
              const isTarget = currentLevel.targetX === cIdx && currentLevel.targetY === rIdx;
              const obstacle = currentLevel.obstacles.find((o) => o.x === cIdx && o.y === rIdx);

              return (
                <View key={cIdx} style={styles.gridCell}>
                  {isRobot ? (
                    <Text style={styles.robotEmoji}>{getRobotIcon()}</Text>
                  ) : isTarget ? (
                    <Text style={styles.targetEmoji}>⭐</Text>
                  ) : obstacle ? (
                    <Text style={styles.obstacleEmoji}>{obstacle.type === 'rock' ? '🪨' : '🌊'}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* CODE QUEUE */}
      <View style={styles.codeQueueContainer}>
        <View style={styles.codeQueueHeader}>
          <Text style={styles.codeQueueTitle}>📜 Chuỗi Lệnh ({commands.length}/10):</Text>
          <TouchableOpacity onPress={removeLastCommand} disabled={isRunning || commands.length === 0}>
            <Text style={[styles.deleteBtnText, commands.length === 0 && { opacity: 0.4 }]}>⌫ Xóa</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.queueScroll}>
          {commands.map((cmd, idx) => (
            <View
              key={idx}
              style={[
                styles.commandBadge,
                activeStep === idx && styles.commandBadgeActive,
              ]}
            >
              <Text style={styles.commandBadgeEmoji}>
                {cmd === 'FORWARD' ? '⬆️' : cmd === 'TURN_LEFT' ? '⬅️' : cmd === 'TURN_RIGHT' ? '➡️' : '⭐'}
              </Text>
            </View>
          ))}
          {commands.length === 0 && (
            <Text style={styles.emptyQueueText}>Chạm các nút bên dưới để thêm lệnh!</Text>
          )}
        </ScrollView>
      </View>

      {/* COMMAND BLOCKS & RUN BUTTON */}
      <View style={styles.controlDeck}>
        <View style={styles.commandButtons}>
          <TouchableOpacity style={styles.cmdBtn} onPress={() => addCommand('FORWARD')} disabled={isRunning}>
            <Text style={styles.cmdBtnEmoji}>⬆️</Text>
            <Text style={styles.cmdBtnLabel}>Tiến</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cmdBtn} onPress={() => addCommand('TURN_LEFT')} disabled={isRunning}>
            <Text style={styles.cmdBtnEmoji}>⬅️</Text>
            <Text style={styles.cmdBtnLabel}>Trái</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cmdBtn} onPress={() => addCommand('TURN_RIGHT')} disabled={isRunning}>
            <Text style={styles.cmdBtnEmoji}>➡️</Text>
            <Text style={styles.cmdBtnLabel}>Phải</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cmdBtn} onPress={() => addCommand('COLLECT')} disabled={isRunning}>
            <Text style={styles.cmdBtnEmoji}>⭐</Text>
            <Text style={styles.cmdBtnLabel}>Nhặt</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.runBtn, isRunning && styles.runBtnDisabled]}
          onPress={runCode}
          disabled={isRunning || commands.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.runBtnText}>{isRunning ? '⏳ Đang Chạy...' : '🚀 CHẠY LỆNH'}</Text>
        </TouchableOpacity>
      </View>

      {/* SUCCESS MODAL */}
      {isSuccess && (
        <View style={styles.successModal}>
          <Text style={styles.successEmoji}>🎉 🤖 ⭐</Text>
          <Text style={styles.successTitle}>HOÀN THÀNH MÀN CHƠI!</Text>
          <Text style={styles.successSub}>Bé là một lập trình viên nhí cừ khôi!</Text>
          <TouchableOpacity
            style={styles.nextLevelBtn}
            onPress={() => {
              if (levelIdx + 1 < LEVELS.length) {
                setLevelIdx((prev) => prev + 1);
              } else {
                setLevelIdx(0);
              }
            }}
          >
            <Text style={styles.nextLevelText}>
              {levelIdx + 1 < LEVELS.length ? 'Màn Tiếp Theo ➡️' : 'Chơi Lại Từ Đầu 🔄'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 6,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 11,
    color: '#A5B4FC',
    marginTop: 2,
  },
  resetBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 18,
  },
  gridMap: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#334155',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  gridCell: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    backgroundColor: '#334155',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  robotEmoji: {
    fontSize: 20,
  },
  targetEmoji: {
    fontSize: 24,
  },
  obstacleEmoji: {
    fontSize: 22,
  },
  codeQueueContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  codeQueueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  codeQueueTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtnText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '800',
  },
  queueScroll: {
    gap: 6,
    minHeight: 36,
    alignItems: 'center',
  },
  commandBadge: {
    width: 34,
    height: 34,
    backgroundColor: '#4338CA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#818CF8',
  },
  commandBadgeActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#FDE047',
    transform: [{ scale: 1.15 }],
  },
  commandBadgeEmoji: {
    fontSize: 18,
  },
  emptyQueueText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
    paddingLeft: 6,
  },
  controlDeck: {
    backgroundColor: '#1E1B4B',
    padding: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 6,
  },
  commandButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cmdBtn: {
    backgroundColor: '#3730A3',
    paddingVertical: 6,
    borderRadius: 12,
    width: '22%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },
  cmdBtnEmoji: {
    fontSize: 22,
  },
  cmdBtnLabel: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  runBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  runBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#6B7280',
  },
  runBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  successModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 20,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FDE047',
  },
  successSub: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  nextLevelBtn: {
    marginTop: 20,
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  nextLevelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default RobotCoderGameScreen;
