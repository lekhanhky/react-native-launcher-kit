import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { ThemeConfig, ThemeId, themeService } from '../services/themes';
import {
  KidsWallpaper,
  wallpaperService,
} from '../services/wallpapers';

interface ThemeSelectorModalProps {
  visible: boolean;
  currentThemeId: ThemeId;
  currentWallpaperId?: string;
  onSelectTheme: (theme: ThemeConfig) => void;
  onSelectWallpaper: (wallpaper: KidsWallpaper) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  visible,
  currentThemeId,
  currentWallpaperId = 'default',
  onSelectTheme,
  onSelectWallpaper,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'wallpapers'>('themes');
  const themes = themeService.getAllThemes();
  const wallpapers = wallpaperService.getAllWallpapers();

  const handleSelectTheme = (theme: ThemeConfig) => {
    themeService.saveTheme(theme.id);
    onSelectTheme(theme);
    onClose();
  };

  const handleSelectWallpaper = (wp: KidsWallpaper) => {
    wallpaperService.saveWallpaper(wp.id);
    onSelectWallpaper(wp);
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
                <Text style={styles.titleEmoji}>
                  {activeTab === 'themes' ? '🎨' : '🖼️'}
                </Text>
                <Text style={styles.title}>GIAO DIỆN & HÌNH NỀN</Text>
                <Text style={styles.subtitle}>
                  Chọn màu sắc và hình ảnh rực rỡ bé yêu thích nhất!
                </Text>
              </View>

              {/* Segmented Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'themes' && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab('themes')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'themes' && styles.tabTextActive,
                    ]}
                  >
                    🎨 Chủ Đề ({themes.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'wallpapers' && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab('wallpapers')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'wallpapers' && styles.tabTextActive,
                    ]}
                  >
                    🖼️ Hình Nền ({wallpapers.length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* TAB 1: DANH SÁCH CHỦ ĐỀ MÀU */}
              {activeTab === 'themes' && (
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
                        onPress={() => handleSelectTheme(theme)}
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
              )}

              {/* TAB 2: DANH SÁCH HÌNH NỀN SINH ĐỘNG */}
              {activeTab === 'wallpapers' && (
                <ScrollView
                  style={styles.scrollList}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                >
                  {wallpapers.map((wp) => {
                    const isSelected = wp.id === currentWallpaperId;
                    return (
                      <TouchableOpacity
                        key={wp.id}
                        style={[
                          styles.wallpaperItem,
                          {
                            borderColor: isSelected ? '#3B82F6' : '#E2E8F0',
                            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                            borderWidth: isSelected ? 2.5 : 1,
                          },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleSelectWallpaper(wp)}
                      >
                        {/* Thumbnail ảnh */}
                        {wp.imageUri ? (
                          <Image
                            source={{ uri: wp.previewThumbnail || wp.imageUri }}
                            style={styles.wallpaperThumbnail}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.defaultWallpaperBadge}>
                            <Text style={styles.defaultWallpaperEmoji}>🎨</Text>
                          </View>
                        )}

                        {/* Thông tin Hình nền */}
                        <View style={styles.themeInfo}>
                          <View style={styles.nameRow}>
                            <Text style={styles.wallpaperName}>
                              {wp.emoji} {wp.name}
                            </Text>
                            {isSelected && (
                              <View
                                style={[
                                  styles.activeBadge,
                                  { backgroundColor: '#3B82F6' },
                                ]}
                              >
                                <Text style={styles.activeBadgeText}>Đang dùng ✔</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.themeDesc}>{wp.subtitle}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

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
    marginBottom: 12,
  },
  titleEmoji: {
    fontSize: 34,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
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
  wallpaperName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
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
  wallpaperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  wallpaperThumbnail: {
    width: 60,
    height: 46,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#CBD5E1',
  },
  defaultWallpaperBadge: {
    width: 60,
    height: 46,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultWallpaperEmoji: {
    fontSize: 22,
  },
  closeBtn: {
    marginTop: 14,
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
