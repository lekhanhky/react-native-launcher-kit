import { Stack } from 'expo-router';
import { COLORS } from '../../src/styles/theme';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surfaceDark,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 16,
        },
        contentStyle: {
          backgroundColor: COLORS.bgDark,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="categories/index"
        options={{
          title: 'Quản Lý Danh Mục & Con Vật',
        }}
      />
      <Stack.Screen
        name="animal-sounds/index"
        options={{
          title: 'Âm Thanh MP3 Con Vật',
        }}
      />
      <Stack.Screen
        name="math-generator/index"
        options={{
          title: 'Sinh Đề Toán Tự Động',
        }}
      />
      <Stack.Screen
        name="app-catalog/index"
        options={{
          title: 'Kho App An Toàn',
        }}
      />
      <Stack.Screen
        name="youtube-curator/index"
        options={{
          title: 'Duyệt YouTube Kids',
        }}
      />
      <Stack.Screen
        name="backup/index"
        options={{
          title: 'Sao Lưu & Phục Hồi',
        }}
      />
    </Stack>
  );
}
