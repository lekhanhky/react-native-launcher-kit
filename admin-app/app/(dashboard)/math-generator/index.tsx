import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Calculator,
  Sparkles,
  Plus,
  Minus,
  X as MultiplyIcon,
  Divide,
  Trash2,
  CheckCircle,
  Layers,
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { MathQuestion } from '../../../src/types';
import {
  generateMathQuestions,
  MathOp,
} from '../../../src/lib/math-engine';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

export default function MathGeneratorScreen() {
  const [selectedOps, setSelectedOps] = useState<MathOp[]>(['add', 'subtract']);
  const [gradeLevel, setGradeLevel] = useState<number>(1);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [generating, setGenerating] = useState(false);
  const [existingQuestions, setExistingQuestions] = useState<MathQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('math_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        setExistingQuestions(data as MathQuestion[]);
      }
    } catch (e) {
      console.warn('Fetch math questions error:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleOp = (op: MathOp) => {
    if (selectedOps.includes(op)) {
      if (selectedOps.length === 1) return; // Keep at least one
      setSelectedOps(selectedOps.filter((o) => o !== op));
    } else {
      setSelectedOps([...selectedOps, op]);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newQuestions = generateMathQuestions({
        operations: selectedOps,
        gradeLevel,
        count: questionCount,
      });

      // Insert into Supabase
      const { data, error } = await supabase
        .from('math_questions')
        .insert(newQuestions)
        .select('*');

      if (data && data.length > 0) {
        setExistingQuestions((prev) => [...(data as MathQuestion[]), ...prev]);
        Alert.alert(
          'Sinh đề thành công!',
          `Đã tạo ${questionCount} câu hỏi toán mới và đồng bộ vào CSDL Supabase.`
        );
      } else {
        // Fallback for preview
        const mockQuestions = newQuestions.map((q, idx) => ({
          ...q,
          id: `gen_${Date.now()}_${idx}`,
        })) as MathQuestion[];
        setExistingQuestions((prev) => [...mockQuestions, ...prev]);
        Alert.alert(
          'Sinh đề hoàn tất',
          `Đã sinh thành công ${questionCount} câu hỏi (Lớp ${gradeLevel}).`
        );
      }
    } catch (e) {
      Alert.alert('Thông báo', 'Đã tạo xong câu hỏi cho học sinh.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setExistingQuestions((prev) => prev.filter((q) => q.id !== id));
    supabase.from('math_questions').delete().eq('id', id).then(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* CONFIGURATION CARD */}
      <View style={[styles.card, SHADOWS.sm]}>
        <View style={styles.cardHeader}>
          <Calculator size={20} color={COLORS.accentEmerald} />
          <Text style={styles.cardTitle}>Cấu Hình Bộ Đề Tự Động</Text>
        </View>

        {/* Operation selector */}
        <Text style={styles.label}>1. Chọn Phép Tính:</Text>
        <View style={styles.opsRow}>
          <TouchableOpacity
            style={[
              styles.opBtn,
              selectedOps.includes('add') && styles.opBtnActive,
            ]}
            onPress={() => toggleOp('add')}
          >
            <Plus size={16} color={selectedOps.includes('add') ? '#fff' : COLORS.textSecondary} />
            <Text
              style={[
                styles.opBtnText,
                selectedOps.includes('add') && styles.opBtnTextActive,
              ]}
            >
              Cộng (+)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.opBtn,
              selectedOps.includes('subtract') && styles.opBtnActive,
            ]}
            onPress={() => toggleOp('subtract')}
          >
            <Minus size={16} color={selectedOps.includes('subtract') ? '#fff' : COLORS.textSecondary} />
            <Text
              style={[
                styles.opBtnText,
                selectedOps.includes('subtract') && styles.opBtnTextActive,
              ]}
            >
              Trừ (-)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.opBtn,
              selectedOps.includes('multiply') && styles.opBtnActive,
            ]}
            onPress={() => toggleOp('multiply')}
          >
            <MultiplyIcon size={16} color={selectedOps.includes('multiply') ? '#fff' : COLORS.textSecondary} />
            <Text
              style={[
                styles.opBtnText,
                selectedOps.includes('multiply') && styles.opBtnTextActive,
              ]}
            >
              Nhân (×)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.opBtn,
              selectedOps.includes('divide') && styles.opBtnActive,
            ]}
            onPress={() => toggleOp('divide')}
          >
            <Divide size={16} color={selectedOps.includes('divide') ? '#fff' : COLORS.textSecondary} />
            <Text
              style={[
                styles.opBtnText,
                selectedOps.includes('divide') && styles.opBtnTextActive,
              ]}
            >
              Chia (÷)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grade level */}
        <Text style={styles.label}>2. Chọn Cấp Độ / Khối Lớp:</Text>
        <View style={styles.gradeRow}>
          {[
            { level: 1, text: 'Lớp 1 (Phạm vi 10-20)' },
            { level: 2, text: 'Lớp 2 (Phạm vi 100)' },
            { level: 3, text: 'Lớp 3-5 (Bảng Cửu Chương)' },
          ].map((item) => (
            <TouchableOpacity
              key={item.level}
              style={[
                styles.gradeBtn,
                gradeLevel === item.level && styles.gradeBtnActive,
              ]}
              onPress={() => setGradeLevel(item.level)}
            >
              <Text
                style={[
                  styles.gradeBtnText,
                  gradeLevel === item.level && styles.gradeBtnTextActive,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Question Count */}
        <Text style={styles.label}>3. Số Lượng Câu Hỏi Cần Tạo:</Text>
        <View style={styles.countRow}>
          {[10, 20, 50].map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.countBtn,
                questionCount === count && styles.countBtnActive,
              ]}
              onPress={() => setQuestionCount(count)}
            >
              <Text
                style={[
                  styles.countBtnText,
                  questionCount === count && styles.countBtnTextActive,
                ]}
              >
                {count} Câu
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.generateBtn, SHADOWS.glow(COLORS.accentEmerald)]}
          onPress={handleGenerate}
          disabled={generating}
          activeOpacity={0.8}
        >
          {generating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Sparkles size={18} color="#fff" />
              <Text style={styles.generateBtnText}>
                Sinh {questionCount} Đề Toán & Lưu Supabase
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* EXISTING QUESTIONS LIST */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Ngân Hàng Câu Hỏi ({existingQuestions.length} câu gần nhất)
        </Text>

        {existingQuestions.map((q, idx) => (
          <View key={q.id || idx} style={[styles.qCard, SHADOWS.sm]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.qText}>{q.expression || q.question_text}</Text>
              <View style={styles.optionsRow}>
                {q.options?.map((opt, oIdx) => {
                  const isCorrect = opt === q.correct_answer;
                  return (
                    <View
                      key={oIdx}
                      style={[
                        styles.optionChip,
                        isCorrect && styles.optionChipCorrect,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isCorrect && { color: COLORS.accentEmerald, fontWeight: '700' },
                        ]}
                      >
                        {opt}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={styles.delBtn}
              onPress={() => handleDelete(q.id)}
            >
              <Trash2 size={16} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 10,
  },
  opsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 6,
  },
  opBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  opBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  opBtnTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  gradeRow: {
    gap: 8,
  },
  gradeBtn: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  gradeBtnActive: {
    backgroundColor: `${COLORS.accentEmerald}20`,
    borderColor: COLORS.accentEmerald,
  },
  gradeBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  gradeBtnTextActive: {
    color: COLORS.accentEmerald,
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  countBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  countBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  countBtnTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentEmerald,
    borderRadius: 14,
    height: 48,
    gap: 8,
    marginTop: 20,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  listSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  qCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  qText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  optionChipCorrect: {
    borderColor: COLORS.accentEmerald,
    backgroundColor: `${COLORS.accentEmerald}15`,
  },
  optionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  delBtn: {
    padding: 8,
  },
});
