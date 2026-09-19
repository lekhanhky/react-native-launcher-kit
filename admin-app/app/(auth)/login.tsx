import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SHADOWS } from '../../src/styles/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('superadmin@kidslauncher.com');
  const [password, setPassword] = useState('Admin@2026');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await signIn(email.trim(), password.trim());

    if (error) {
      // If error (e.g. wrong account in Supabase), in demo/dev mode give user option to bypass or show clear alert
      setErrorMessage(error.message || 'Đăng nhập không thành công. Kiểm tra lại thông tin.');
      setLoading(false);
    } else {
      setLoading(false);
      router.replace('/(dashboard)');
    }
  };

  const handleDevBypass = () => {
    // Quick entry for development
    router.replace('/(dashboard)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* LOGO & TITLE */}
        <View style={styles.headerBox}>
          <View style={[styles.logoIcon, SHADOWS.glow(COLORS.primary)]}>
            <Text style={styles.emojiLogo}>🛠️</Text>
          </View>
          <Text style={styles.brandTitle}>Admin Studio</Text>
          <Text style={styles.brandSubtitle}>Super Admin Mobile Dashboard</Text>
        </View>

        {/* LOGIN FORM CARD */}
        <View style={[styles.card, SHADOWS.md]}>
          <Text style={styles.cardHeader}>Đăng Nhập Quản Trị</Text>
          <Text style={styles.cardDesc}>
            Nhập tài khoản Super Admin kết nối với Supabase để truy cập hệ thống.
          </Text>

          {errorMessage && (
            <View style={styles.errorBox}>
              <ShieldAlert size={18} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Quản Trị</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="admin@example.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mật Khẩu</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, SHADOWS.glow(COLORS.primary)]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Đăng Nhập Hệ Thống</Text>
            )}
          </TouchableOpacity>

          {/* Dev Bypass Shortcut */}
          <TouchableOpacity
            style={styles.devBypassBtn}
            onPress={handleDevBypass}
            activeOpacity={0.7}
          >
            <Sparkles size={14} color={COLORS.accentAmber} />
            <Text style={styles.devBypassText}>Vào Nhanh Chế Độ Quản Trị (Dev Mode)</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Kids Launcher Ecosystem • 2026</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emojiLogo: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryLight,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardHeader: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: `${COLORS.danger}15`,
    borderWidth: 1,
    borderColor: `${COLORS.danger}40`,
    padding: 12,
    borderRadius: 14,
    marginBottom: 18,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  primaryButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  devBypassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    paddingVertical: 10,
  },
  devBypassText: {
    color: COLORS.accentAmber,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
