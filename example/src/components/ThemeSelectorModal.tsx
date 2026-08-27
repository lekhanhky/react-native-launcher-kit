import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { ThemeConfig, ThemeId, themeService } from '../services/themes';

interface ThemeSelectorModalProps {
  visible: boolean;
  currentThemeId: ThemeId;
  onSelectTheme: (theme: ThemeConfig) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  visible,
  currentThemeId,
  onSelectTheme,
  onClose,
}) => {
  const themes = themeService.getAllThemes();

  const handleSelect = (theme: ThemeConfig) => {
    themeService.saveTheme(theme.id);
    onSelectTheme(theme);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.titleEmoji}>🎨</Text>
                <Text style={styles.title}>CHỌN GIAO DIỆN YÊU THÍCH</Text>
                <Text style={styles.subtitle}>
                  Bé hãy chọn thế giới màu sắc mà bé yêu thích nhất nhé!
                </Text>
              </View>

              {/* Danh sách 5 Themes */}
              <ScrollView
                style={styles.scrollList}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              >
                {themes.map((theme) => {
                  const isSelected = theme.id === currentThemeId;
                  return (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeItem,
                        {
                          borderColor: isSelected
                            ? theme.previewColor
                            : '#E2E8F0',
                          backgroundColor: isSelected
                            ? theme.backgroundColor
                            : '#FFFFFF',
                          borderWidth: isSelected ? 2.5 : 1,
                        },
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleSelect(theme)}
                    >
                      {/* Avatar preview */}
                      <View
                        style={[
                          styles.avatarPreview,
                          {
                            backgroundColor: theme.previewColor,
                            borderRadius: theme.iconBorderRadius,
                          },
                        ]}
                      >
                        <Text style={styles.avatarEmoji}>{theme.emoji}</Text>
                      </View>

                      {/* Thông tin Theme */}
                      <View style={styles.themeInfo}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.themeName,
                              {
                                color: isSelected
                                  ? theme.greetingColor
                                  : '#0F172A',
                              },
                            ]}
                          >
                            {theme.name}
                          </Text>
                          {isSelected && (
                            <View
                              style={[
                                styles.activeBadge,
                                { backgroundColor: theme.previewColor },
                              ]}
                            >
                              <Text style={styles.activeBadgeText}>Đang dùng ✔</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.themeDesc}>{theme.subtitle}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Nút đóng */}
              <TouchableOpacity
                style={styles.closeBtn}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Text style={styles.closeBtnText}>Đóng lại</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollList: {
    maxHeight: 340,
  },
  listContent: {
    gap: 10,
    paddingVertical: 4,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatarPreview: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  themeInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  themeName: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  themeDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
});
