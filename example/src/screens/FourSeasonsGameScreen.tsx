import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Easing,
  Dimensions,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

// ============================================================
// 🦋 DATA: Nhân vật Luna — Bướm Hoa Bốn Mùa
// ============================================================

interface SeasonConfig {
  id: string;
  nameVi: string;
  emoji: string;
  bgStart: string;
  bgEnd: string;
  headerColor: string;
  particleEmojis: string[];
  lunaOutfit: string; // Emoji phụ kiện theo mùa
  lunaGreeting: string;
}

const SEASONS: SeasonConfig[] = [
  {
    id: 'spring',
    nameVi: 'Mùa Xuân',
    emoji: '🌸',
    bgStart: '#FFE4E1',
    bgEnd: '#E8F5E9',
    headerColor: '#C2185B',
    particleEmojis: ['🌸', '🌺', '🌷', '🌼', '💮'],
    lunaOutfit: '🌸',
    lunaGreeting: 'Mùa Xuân đến rồi! Cây cối đâm chồi nảy lộc, chúng mình cùng khám phá nhé!',
  },
  {
    id: 'summer',
    nameVi: 'Mùa Hạ',
    emoji: '☀️',
    bgStart: '#FFF9C4',
    bgEnd: '#FFE0B2',
    headerColor: '#E65100',
    particleEmojis: ['☀️', '✨', '💫', '🌟', '⭐'],
    lunaOutfit: '🌻',
    lunaGreeting: 'Mùa Hạ nóng bức nhưng thật vui! Có nhiều bạn mới đang chờ bé khám phá!',
  },
  {
    id: 'autumn',
    nameVi: 'Mùa Thu',
    emoji: '🍂',
    bgStart: '#FBE9E7',
    bgEnd: '#EFEBE9',
    headerColor: '#BF360C',
    particleEmojis: ['🍂', '🍁', '🍃', '🌰', '🎃'],
    lunaOutfit: '🍁',
    lunaGreeting: 'Mùa Thu lá vàng rơi! Chúng mình cùng thu hoạch và chuẩn bị cho mùa đông nhé!',
  },
  {
    id: 'winter',
    nameVi: 'Mùa Đông',
    emoji: '❄️',
    bgStart: '#E3F2FD',
    bgEnd: '#FAFAFA',
    headerColor: '#0D47A1',
    particleEmojis: ['❄️', '🌨️', '⛄', '💎', '🤍'],
    lunaOutfit: '🧣',
    lunaGreeting: 'Mùa Đông lạnh lắm! Bé hãy giúp các bạn động vật giữ ấm nhé!',
  },
];

// ============================================================
// 🎮 DATA: 12 Màn chơi (3 màn × 4 mùa)
// ============================================================

interface LevelStep {
  instruction: string;
  emoji: string;
  soundPhrase: string;
  reactionEmojis: string[];
}

interface Level {
  id: string;
  seasonId: string;
  nameVi: string;
  sceneEmoji: string;
  description: string;
  funFact: string;
  bgAccent: string;
  creatures: string[]; // Sinh vật thu thập được
  steps: LevelStep[];
  completionPhrase: string;
  starsReward: number;
}

const LEVELS: Level[] = [
  // ═══════════════ 🌸 MÙA XUÂN ═══════════════
  {
    id: 'spring_1',
    seasonId: 'spring',
    nameVi: 'Hạt Giống Nảy Mầm',
    sceneEmoji: '🌱',
    description: 'Gieo hạt giống và xem cây nảy mầm!',
    funFact: 'Một hạt giống nhỏ xíu có thể mọc thành cây cao hàng chục mét!',
    bgAccent: '#C8E6C9',
    creatures: ['🌱', '🌿', '🌻'],
    steps: [
      { instruction: 'Xới đất tơi xốp nào!', emoji: '⛏️', soundPhrase: 'Đất đã tơi xốp rồi! Giỏi lắm bé!', reactionEmojis: ['💪', '⛏️', '🌍', '✨', '⭐'] },
      { instruction: 'Gieo hạt giống vào đất!', emoji: '🌰', soundPhrase: 'Hạt giống đã nằm ngoan dưới đất!', reactionEmojis: ['🌰', '🤎', '💛', '✨', '⭐'] },
      { instruction: 'Tưới nước cho hạt nảy mầm!', emoji: '💧', soundPhrase: 'Nước mát lành giúp hạt nảy mầm!', reactionEmojis: ['💧', '🫧', '💦', '🌊', '⭐'] },
      { instruction: 'Sưởi nắng ấm áp cho mầm cây!', emoji: '☀️', soundPhrase: 'Ánh nắng giúp mầm cây lớn nhanh!', reactionEmojis: ['☀️', '🌤️', '✨', '💛', '⭐'] },
    ],
    completionPhrase: 'Tuyệt vời! Hạt giống đã nảy mầm thành cây xanh tươi! Bé là nhà vườn giỏi nhất!',
    starsReward: 3,
  },
  {
    id: 'spring_2',
    seasonId: 'spring',
    nameVi: 'Chim Non Ra Đời',
    sceneEmoji: '🐣',
    description: 'Giúp chim mẹ chăm sóc chim non!',
    funFact: 'Chim mẹ phải bay đi bắt sâu hàng trăm lần mỗi ngày để nuôi con!',
    bgAccent: '#FFF9C4',
    creatures: ['🐣', '🐦', '🪺'],
    steps: [
      { instruction: 'Ấp trứng cho ấm nào!', emoji: '🥚', soundPhrase: 'Trứng đang ấm dần, sắp nở rồi!', reactionEmojis: ['🥚', '💛', '🤍', '✨', '⭐'] },
      { instruction: 'Trứng nở rồi! Chào bé chim non!', emoji: '🐣', soundPhrase: 'Chíp chíp! Chim non chào đời rồi!', reactionEmojis: ['🐣', '🎉', '💕', '✨', '⭐'] },
      { instruction: 'Bón mồi cho chim non đói bụng!', emoji: '🐛', soundPhrase: 'Chim non ăn no bụng rồi! Ngon quá!', reactionEmojis: ['🐛', '😋', '💚', '🌿', '⭐'] },
      { instruction: 'Chim non tập bay! Vỗ cánh nào!', emoji: '🕊️', soundPhrase: 'Chim con đã biết bay! Giỏi quá!', reactionEmojis: ['🕊️', '🦅', '💨', '🎊', '⭐'] },
    ],
    completionPhrase: 'Hoan hô! Nhờ bé mà chim non đã lớn khôn và biết bay! Bé thật dịu dàng!',
    starsReward: 3,
  },
  {
    id: 'spring_3',
    seasonId: 'spring',
    nameVi: 'Sâu Biến Thành Bướm',
    sceneEmoji: '🦋',
    description: 'Theo dõi hành trình kỳ diệu từ sâu thành bướm!',
    funFact: 'Bướm phải trải qua 4 giai đoạn: Trứng → Sâu → Nhộng → Bướm!',
    bgAccent: '#F3E5F5',
    creatures: ['🐛', '🪹', '🦋'],
    steps: [
      { instruction: 'Cho sâu bướm ăn lá xanh!', emoji: '🍃', soundPhrase: 'Sâu ăn lá ngon lành! Sâu lớn nhanh lắm!', reactionEmojis: ['🍃', '🐛', '💚', '🌿', '⭐'] },
      { instruction: 'Sâu cuộn mình làm kén!', emoji: '🪹', soundPhrase: 'Sâu đang ngủ trong kén ấm áp!', reactionEmojis: ['🪹', '💤', '🤍', '✨', '⭐'] },
      { instruction: 'Chờ đợi điều kỳ diệu!', emoji: '✨', soundPhrase: 'Kén đang rung rung! Có gì bên trong nhỉ?', reactionEmojis: ['✨', '💫', '🌟', '⭐', '🎵'] },
      { instruction: 'Mở cánh bướm xinh đẹp!', emoji: '🦋', soundPhrase: 'Ôi! Bướm xinh đẹp đã chào đời! Kỳ diệu quá!', reactionEmojis: ['🦋', '🌸', '🌈', '💖', '🎉'] },
    ],
    completionPhrase: 'Kỳ diệu chưa! Từ chú sâu nhỏ đã biến thành bướm xinh đẹp! Thiên nhiên thật tuyệt vời!',
    starsReward: 3,
  },

  // ═══════════════ ☀️ MÙA HẠ ═══════════════
  {
    id: 'summer_1',
    seasonId: 'summer',
    nameVi: 'Cánh Đồng Hướng Dương',
    sceneEmoji: '🌻',
    description: 'Khám phá bí mật của hoa hướng dương!',
    funFact: 'Hoa hướng dương luôn xoay theo hướng mặt trời mọc!',
    bgAccent: '#FFF9C4',
    creatures: ['🌻', '🐝', '🦗'],
    steps: [
      { instruction: 'Trồng hạt hướng dương xuống đất!', emoji: '🌰', soundPhrase: 'Hạt hướng dương đã được gieo!', reactionEmojis: ['🌰', '🌍', '💛', '✨', '⭐'] },
      { instruction: 'Tưới nước cho hoa lớn nhanh!', emoji: '💧', soundPhrase: 'Cây hướng dương vươn cao! Tuyệt vời!', reactionEmojis: ['💧', '🌱', '💚', '🌿', '⭐'] },
      { instruction: 'Kéo mặt trời lên cao!', emoji: '☀️', soundPhrase: 'Hoa hướng dương xoay theo mặt trời! Thật kỳ diệu!', reactionEmojis: ['☀️', '🌻', '✨', '💛', '⭐'] },
      { instruction: 'Thu hoạch hạt hướng dương!', emoji: '🧺', soundPhrase: 'Hạt hướng dương thơm ngon! Thu hoạch thành công!', reactionEmojis: ['🧺', '🌻', '😋', '🎉', '⭐'] },
    ],
    completionPhrase: 'Bé giỏi quá! Hoa hướng dương nở rộ khắp cánh đồng! Đẹp tuyệt vời!',
    starsReward: 3,
  },
  {
    id: 'summer_2',
    seasonId: 'summer',
    nameVi: 'Tổ Ong Mật',
    sceneEmoji: '🐝',
    description: 'Giúp ong mật thu phấn hoa!',
    funFact: 'Một con ong phải bay qua 2 triệu bông hoa để làm nửa kí mật ong!',
    bgAccent: '#FFE082',
    creatures: ['🐝', '🍯', '🌺'],
    steps: [
      { instruction: 'Dẫn ong đến bông hoa hồng!', emoji: '🌹', soundPhrase: 'Ong bay đến hoa hồng! Vo vo vo!', reactionEmojis: ['🌹', '🐝', '💗', '✨', '⭐'] },
      { instruction: 'Ong lấy phấn từ hoa cúc!', emoji: '🌼', soundPhrase: 'Phấn hoa vàng óng! Ong siêng năng quá!', reactionEmojis: ['🌼', '🐝', '💛', '✨', '⭐'] },
      { instruction: 'Ong bay về tổ làm mật!', emoji: '🏠', soundPhrase: 'Ong về tổ! Sắp có mật ong thơm rồi!', reactionEmojis: ['🏠', '🐝', '🍯', '💫', '⭐'] },
      { instruction: 'Thu hoạch mật ong ngọt lịm!', emoji: '🍯', soundPhrase: 'Mật ong vàng óng thơm lừng! Ngon quá!', reactionEmojis: ['🍯', '😋', '🤤', '🎊', '⭐'] },
    ],
    completionPhrase: 'Tuyệt vời! Nhờ những chú ong siêng năng mà chúng mình có mật ong ngọt ngào!',
    starsReward: 3,
  },
  {
    id: 'summer_3',
    seasonId: 'summer',
    nameVi: 'Hồ Sen Mùa Hạ',
    sceneEmoji: '🪷',
    description: 'Khám phá hồ sen với chuồn chuồn và ếch!',
    funFact: 'Hoa sen mọc từ bùn lầy nhưng vẫn nở hoa thơm ngát và tinh khiết!',
    bgAccent: '#B2EBF2',
    creatures: ['🪷', '🐸', '🦟'],
    steps: [
      { instruction: 'Thả hạt sen xuống hồ nước!', emoji: '🫘', soundPhrase: 'Hạt sen chìm xuống đáy hồ mát mẻ!', reactionEmojis: ['🫘', '💧', '🌊', '✨', '⭐'] },
      { instruction: 'Lá sen mọc lên mặt nước!', emoji: '🍃', soundPhrase: 'Lá sen xanh tròn như chiếc dù xinh!', reactionEmojis: ['🍃', '🪷', '💚', '💧', '⭐'] },
      { instruction: 'Hoa sen nở rộ! Đẹp quá!', emoji: '🪷', soundPhrase: 'Hoa sen hồng nở giữa hồ! Thơm ngát quá!', reactionEmojis: ['🪷', '🌸', '💗', '✨', '⭐'] },
      { instruction: 'Ếch nhảy lên lá sen ca hát!', emoji: '🐸', soundPhrase: 'Ộp ộp! Ếch nhảy lên lá sen hát vang!', reactionEmojis: ['🐸', '🎵', '🪷', '🎶', '⭐'] },
    ],
    completionPhrase: 'Hồ sen mùa hạ thật đẹp! Bé đã khám phá thế giới dưới nước tuyệt vời!',
    starsReward: 3,
  },

  // ═══════════════ 🍂 MÙA THU ═══════════════
  {
    id: 'autumn_1',
    seasonId: 'autumn',
    nameVi: 'Vườn Quả Chín',
    sceneEmoji: '🍎',
    description: 'Thu hoạch trái cây chín mọng trong vườn!',
    funFact: 'Mùa thu là mùa thu hoạch! Nhiều loại trái cây chín đỏ mọng nhất vào mùa này!',
    bgAccent: '#FFCCBC',
    creatures: ['🍎', '🍐', '🍇'],
    steps: [
      { instruction: 'Hái táo đỏ chín mọng!', emoji: '🍎', soundPhrase: 'Táo đỏ thơm lừng! Giòn tan!', reactionEmojis: ['🍎', '😋', '💚', '✨', '⭐'] },
      { instruction: 'Hái lê vàng ngọt lịm!', emoji: '🍐', soundPhrase: 'Lê vàng mọng nước! Ngọt quá!', reactionEmojis: ['🍐', '💛', '😋', '✨', '⭐'] },
      { instruction: 'Hái nho tím căng tròn!', emoji: '🍇', soundPhrase: 'Nho tím tím xinh xinh! Ngon quá!', reactionEmojis: ['🍇', '💜', '😋', '✨', '⭐'] },
      { instruction: 'Xếp trái cây vào giỏ!', emoji: '🧺', soundPhrase: 'Giỏ trái cây đầy ắp! Bé thu hoạch giỏi lắm!', reactionEmojis: ['🧺', '🍎', '🍐', '🍇', '🎉'] },
    ],
    completionPhrase: 'Hoan hô! Bé đã thu hoạch đầy một giỏ trái cây tươi ngon! Mùa thu thật tuyệt!',
    starsReward: 3,
  },
  {
    id: 'autumn_2',
    seasonId: 'autumn',
    nameVi: 'Sóc Tích Trữ Hạt',
    sceneEmoji: '🐿️',
    description: 'Giúp sóc nhỏ tích trữ hạt cho mùa đông!',
    funFact: 'Sóc có thể nhớ vị trí hàng nghìn hạt dẻ mà chúng đã chôn giấu!',
    bgAccent: '#D7CCC8',
    creatures: ['🐿️', '🌰', '🍂'],
    steps: [
      { instruction: 'Tìm hạt dẻ dưới lá khô!', emoji: '🍂', soundPhrase: 'Tìm thấy hạt dẻ rồi! Sóc vui lắm!', reactionEmojis: ['🍂', '🌰', '🐿️', '✨', '⭐'] },
      { instruction: 'Nhặt thêm hạt óc chó!', emoji: '🌰', soundPhrase: 'Hạt óc chó to tròn! Ngon lắm đây!', reactionEmojis: ['🌰', '🤎', '💛', '✨', '⭐'] },
      { instruction: 'Giúp sóc mang hạt về tổ!', emoji: '🐿️', soundPhrase: 'Sóc ôm hạt chạy nhanh! Siêng năng quá!', reactionEmojis: ['🐿️', '🌰', '💨', '🏃', '⭐'] },
      { instruction: 'Cất hạt vào kho an toàn!', emoji: '🏠', soundPhrase: 'Kho hạt đầy ắp! Mùa đông không lo đói nữa!', reactionEmojis: ['🏠', '🌰', '🐿️', '🎊', '⭐'] },
    ],
    completionPhrase: 'Giỏi lắm bé! Nhờ bé mà sóc nhỏ đã tích đủ thức ăn cho mùa đông lạnh giá!',
    starsReward: 3,
  },
  {
    id: 'autumn_3',
    seasonId: 'autumn',
    nameVi: 'Rừng Lá Phong Đỏ',
    sceneEmoji: '🍁',
    description: 'Ngắm lá phong đỏ rực rỡ trong rừng thu!',
    funFact: 'Lá cây đổi màu vào mùa thu vì chất diệp lục xanh mất đi, để lộ màu vàng cam đỏ bên trong!',
    bgAccent: '#FFAB91',
    creatures: ['🍁', '🦔', '🦉'],
    steps: [
      { instruction: 'Hứng lá phong đỏ rơi!', emoji: '🍁', soundPhrase: 'Lá phong đỏ rực bay trong gió! Đẹp quá!', reactionEmojis: ['🍁', '🍂', '🌬️', '✨', '⭐'] },
      { instruction: 'Xếp lá thành bức tranh!', emoji: '🎨', soundPhrase: 'Bức tranh lá thu thật nghệ thuật! Bé sáng tạo lắm!', reactionEmojis: ['🎨', '🍁', '🍂', '💛', '⭐'] },
      { instruction: 'Tìm bạn nhím dưới đống lá!', emoji: '🦔', soundPhrase: 'Ô! Bạn nhím đang trốn trong đống lá ấm áp!', reactionEmojis: ['🦔', '🍂', '😊', '💕', '⭐'] },
      { instruction: 'Nghe cú mèo hát bài ca mùa thu!', emoji: '🦉', soundPhrase: 'Hú hú! Cú mèo hát bài ca mùa thu thật hay!', reactionEmojis: ['🦉', '🎵', '🌙', '✨', '⭐'] },
    ],
    completionPhrase: 'Mùa thu thật đẹp và yên bình! Bé đã khám phá khu rừng lá phong tuyệt vời!',
    starsReward: 3,
  },

  // ═══════════════ ❄️ MÙA ĐÔNG ═══════════════
  {
    id: 'winter_1',
    seasonId: 'winter',
    nameVi: 'Bãi Tuyết Trắng',
    sceneEmoji: '⛄',
    description: 'Nặn người tuyết và chơi đùa trên tuyết!',
    funFact: 'Không có hai bông tuyết nào giống hệt nhau! Mỗi bông tuyết đều là duy nhất!',
    bgAccent: '#BBDEFB',
    creatures: ['⛄', '🐧', '🐇'],
    steps: [
      { instruction: 'Vê quả cầu tuyết to!', emoji: '⚪', soundPhrase: 'Quả cầu tuyết trắng tròn vo! To quá!', reactionEmojis: ['⚪', '❄️', '🤍', '✨', '⭐'] },
      { instruction: 'Chồng thêm quả cầu tuyết nhỏ!', emoji: '☃️', soundPhrase: 'Hai quả cầu chồng lên nhau rồi!', reactionEmojis: ['☃️', '⚪', '🤍', '✨', '⭐'] },
      { instruction: 'Đặt mũi cà rốt cho người tuyết!', emoji: '🥕', soundPhrase: 'Người tuyết có mũi cà rốt cam xinh!', reactionEmojis: ['🥕', '⛄', '😊', '🧡', '⭐'] },
      { instruction: 'Đội mũ và quàng khăn cho bạn tuyết!', emoji: '🧣', soundPhrase: 'Người tuyết ấm áp và đáng yêu quá! Xong rồi!', reactionEmojis: ['🧣', '🎩', '⛄', '🎉', '⭐'] },
    ],
    completionPhrase: 'Tuyệt vời! Bé đã nặn một người tuyết xinh xắn nhất! Bạn tuyết rất vui!',
    starsReward: 3,
  },
  {
    id: 'winter_2',
    seasonId: 'winter',
    nameVi: 'Gấu Ngủ Đông',
    sceneEmoji: '🐻',
    description: 'Giúp các bạn động vật chuẩn bị ngủ đông!',
    funFact: 'Gấu có thể ngủ đông suốt 5 tháng mà không ăn gì! Tim gấu chỉ đập 8 lần mỗi phút!',
    bgAccent: '#C5CAE9',
    creatures: ['🐻', '🦔', '🐸'],
    steps: [
      { instruction: 'Lót rơm ấm cho hang gấu!', emoji: '🌾', soundPhrase: 'Hang gấu ấm áp với rơm khô! Êm ái quá!', reactionEmojis: ['🌾', '🏠', '🤎', '✨', '⭐'] },
      { instruction: 'Đắp chăn lá cho gấu!', emoji: '🐻', soundPhrase: 'Gấu cuộn tròn trong chăn lá! Ngủ ngon nhé!', reactionEmojis: ['🐻', '😴', '💤', '💚', '⭐'] },
      { instruction: 'Giúp nhím tìm nơi trú đông!', emoji: '🦔', soundPhrase: 'Nhím cuộn tròn như quả bóng! Ấm áp quá!', reactionEmojis: ['🦔', '🍂', '😴', '💤', '⭐'] },
      { instruction: 'Ếch nhỏ chui xuống bùn ngủ!', emoji: '🐸', soundPhrase: 'Ếch ngủ đông dưới lớp bùn ấm! Ngủ ngon nhé bạn!', reactionEmojis: ['🐸', '💤', '🌍', '😴', '⭐'] },
    ],
    completionPhrase: 'Bé thật chu đáo! Tất cả các bạn động vật đã ngủ đông ấm áp nhờ bé!',
    starsReward: 3,
  },
  {
    id: 'winter_3',
    seasonId: 'winter',
    nameVi: 'Lễ Hội Mùa Đông',
    sceneEmoji: '🎄',
    description: 'Trang trí cây thông và đón lễ hội!',
    funFact: 'Cây thông Noel cao nhất thế giới cao tới 67 mét, bằng tòa nhà 20 tầng!',
    bgAccent: '#A5D6A7',
    creatures: ['🎄', '⭐', '🎅'],
    steps: [
      { instruction: 'Trồng cây thông xanh!', emoji: '🌲', soundPhrase: 'Cây thông xanh mướt thẳng tắp!', reactionEmojis: ['🌲', '💚', '🌿', '✨', '⭐'] },
      { instruction: 'Treo quả cầu lấp lánh!', emoji: '🔴', soundPhrase: 'Quả cầu đỏ vàng lấp lánh trên cây thông!', reactionEmojis: ['🔴', '🟡', '💫', '✨', '⭐'] },
      { instruction: 'Quấn dây đèn lung linh!', emoji: '💡', soundPhrase: 'Dây đèn nhấp nháy đủ sắc màu! Lung linh quá!', reactionEmojis: ['💡', '✨', '🌟', '💫', '⭐'] },
      { instruction: 'Đặt ngôi sao vàng trên đỉnh!', emoji: '⭐', soundPhrase: 'Ngôi sao vàng tỏa sáng trên đỉnh cây! Hoàn hảo!', reactionEmojis: ['⭐', '🌟', '🎄', '🎉', '🎊'] },
    ],
    completionPhrase: 'Hoan hô! Cây thông Noel đẹp nhất! Mọi bạn trong vườn cùng đón lễ hội vui vẻ!',
    starsReward: 5, // Bonus cho màn cuối
  },
];

// ============================================================
// 📊 Helper: Lấy levels theo mùa
// ============================================================

const getLevelsBySeason = (seasonId: string): Level[] =>
  LEVELS.filter((l) => l.seasonId === seasonId);

const getSeasonById = (id: string): SeasonConfig =>
  SEASONS.find((s) => s.id === id) || SEASONS[0]!;

// ============================================================
// 🎮 MAIN COMPONENT
// ============================================================

type GameView = 'seasonMap' | 'levelList' | 'playing' | 'levelComplete';

export const FourSeasonsGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // ── Navigation State ──
  const [currentView, setCurrentView] = useState<GameView>('seasonMap');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('spring');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('spring_1');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // ── Progress State ──
  const [totalStars, setTotalStars] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [collectedCreatures, setCollectedCreatures] = useState<string[]>([]);

  // ── Animation State ──
  const [floatingEmojis, setFloatingEmojis] = useState<
    { id: number; emoji: string; x: number }[]
  >([]);
  const [seasonParticles, setSeasonParticles] = useState<
    { id: number; emoji: string; x: number; delay: number }[]
  >([]);

  // ── Animation Refs ──
  const lunaWingAnim = useRef(new Animated.Value(0)).current;
  const lunaBounce = useRef(new Animated.Value(1)).current;
  const sceneScale = useRef(new Animated.Value(0)).current;
  const stepBounce = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const starPop = useRef(new Animated.Value(0)).current;
  const floatAnims = useRef<Map<number, Animated.Value>>(new Map());
  const particleAnims = useRef<Map<number, Animated.Value>>(new Map());
  let emojiCounter = useRef(0);

  // ── Derived Data ──
  const currentSeason = getSeasonById(selectedSeasonId);
  const currentLevel = LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0]!;
  const currentStep = currentLevel.steps[currentStepIdx];
  const seasonLevels = getLevelsBySeason(selectedSeasonId);

  // ── Luna wing flap animation (idle) ──
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(lunaWingAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(lunaWingAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ── Seasonal particles ──
  useEffect(() => {
    if (currentView !== 'playing' && currentView !== 'seasonMap') return;
    const particles: { id: number; emoji: string; x: number; delay: number }[] = [];
    const emojis = currentSeason.particleEmojis;
    const screenW = Dimensions.get('window').width;

    for (let i = 0; i < 8; i++) {
      const id = Date.now() + i;
      particles.push({
        id,
        emoji: emojis[i % emojis.length]!,
        x: Math.random() * (screenW - 40),
        delay: i * 600,
      });

      const anim = new Animated.Value(0);
      particleAnims.current.set(id, anim);

      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 600),
          Animated.timing(anim, {
            toValue: 1,
            duration: 4000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    setSeasonParticles(particles);

    return () => {
      particleAnims.current.forEach((a) => a.stopAnimation());
      particleAnims.current.clear();
      setSeasonParticles([]);
    };
  }, [currentView, selectedSeasonId]);

  // ── Welcome speech ──
  useEffect(() => {
    soundManager.speak(
      'Chào bé! Chúng mình cùng bướm Luna khám phá Khu Vườn Bốn Mùa nhé! Hãy chọn một mùa để bắt đầu!',
      'vi'
    );
  }, []);

  // ── Scene enter animation ──
  useEffect(() => {
    if (currentView === 'playing') {
      sceneScale.setValue(0);
      Animated.spring(sceneScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [currentView, selectedLevelId]);

  // ══════════════════════════════════════════
  // HANDLERS
  // ══════════════════════════════════════════

  const handleSelectSeason = useCallback(
    (seasonId: string) => {
      setSelectedSeasonId(seasonId);
      setCurrentView('levelList');
      const season = getSeasonById(seasonId);
      soundManager.speak(season.lunaGreeting, 'vi');
    },
    []
  );

  const handleSelectLevel = useCallback(
    (levelId: string) => {
      setSelectedLevelId(levelId);
      setCurrentStepIdx(0);
      setCurrentView('playing');
      const level = LEVELS.find((l) => l.id === levelId)!;
      soundManager.speak(
        `${level.nameVi}! ${level.description}`,
        'vi'
      );
    },
    []
  );

  const handleStepAction = useCallback(() => {
    if (!currentStep) return;

    // 1. Luna bounce animation
    Animated.sequence([
      Animated.spring(lunaBounce, {
        toValue: 1.25,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.spring(lunaBounce, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Step button bounce
    Animated.sequence([
      Animated.timing(stepBounce, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(stepBounce, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Heart pop
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Star pop
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(starPop, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(starPop, {
        toValue: 0,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Floating emojis
    const newEmojis = currentStep.reactionEmojis.map((em) => {
      const id = ++emojiCounter.current;
      const anim = new Animated.Value(0);
      floatAnims.current.set(id, anim);

      Animated.timing(anim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        floatAnims.current.delete(id);
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
      });

      return {
        id,
        emoji: em,
        x: Math.random() * 260 + 30,
      };
    });
    setFloatingEmojis((prev) => [...prev, ...newEmojis]);

    // 6. Add star
    setTotalStars((prev) => prev + 1);

    // 7. Sound
    soundManager.speak(currentStep.soundPhrase, 'vi');

    // 8. Advance step or complete level
    const nextStepIdx = currentStepIdx + 1;
    if (nextStepIdx >= currentLevel.steps.length) {
      // Level complete!
      setTimeout(() => {
        setCompletedLevels((prev) =>
          prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]
        );
        setCollectedCreatures((prev) => {
          const newOnes = currentLevel.creatures.filter((c) => !prev.includes(c));
          return [...prev, ...newOnes];
        });
        setTotalStars((prev) => prev + currentLevel.starsReward);
        setCurrentView('levelComplete');
        soundManager.speak(currentLevel.completionPhrase, 'vi');
      }, 1200);
    } else {
      setTimeout(() => {
        setCurrentStepIdx(nextStepIdx);
        const nextStep = currentLevel.steps[nextStepIdx];
        if (nextStep) {
          soundManager.speak(nextStep.instruction, 'vi');
        }
      }, 800);
    }
  }, [currentStep, currentStepIdx, currentLevel]);

  const handleBackToSeasonMap = useCallback(() => {
    setCurrentView('seasonMap');
  }, []);

  const handleBackToLevelList = useCallback(() => {
    setCurrentView('levelList');
  }, []);

  const handleNextLevel = useCallback(() => {
    const currentIdx = LEVELS.findIndex((l) => l.id === selectedLevelId);
    if (currentIdx < LEVELS.length - 1) {
      const nextLevel = LEVELS[currentIdx + 1]!;
      // Check if next level is in the same season
      if (nextLevel.seasonId !== selectedSeasonId) {
        setSelectedSeasonId(nextLevel.seasonId);
      }
      handleSelectLevel(nextLevel.id);
    } else {
      handleBackToSeasonMap();
    }
  }, [selectedLevelId, selectedSeasonId]);

  // ══════════════════════════════════════════
  // Computed
  // ══════════════════════════════════════════
  const lunaScale = lunaWingAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1],
  });

  const lunaRotate = lunaWingAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '3deg', '0deg', '-3deg', '0deg'],
  });

  const getProgressForSeason = (seasonId: string): number => {
    const sLevels = getLevelsBySeason(seasonId);
    const completed = sLevels.filter((l) => completedLevels.includes(l.id)).length;
    return sLevels.length > 0 ? completed / sLevels.length : 0;
  };

  // ══════════════════════════════════════════
  // RENDER: Season Map
  // ══════════════════════════════════════════
  const renderSeasonMap = () => (
    <View style={styles.mapContainer}>
      {/* Luna Character */}
      <Animated.View
        style={[
          styles.lunaContainer,
          { transform: [{ scale: lunaScale }, { rotate: lunaRotate }] },
        ]}
      >
        <Text style={styles.lunaEmoji}>🦋</Text>
        <Text style={styles.lunaName}>Luna</Text>
      </Animated.View>

      <Text style={[styles.mapTitle, { color: '#5D4037' }]}>
        Chọn một mùa để khám phá!
      </Text>

      {/* Season Cards */}
      <View style={styles.seasonGrid}>
        {SEASONS.map((season) => {
          const progress = getProgressForSeason(season.id);
          const isComplete = progress >= 1;
          return (
            <TouchableOpacity
              key={season.id}
              style={[
                styles.seasonCard,
                {
                  backgroundColor: season.bgStart,
                  borderColor: isComplete ? '#4CAF50' : season.headerColor + '40',
                },
              ]}
              activeOpacity={0.7}
              onPress={() => handleSelectSeason(season.id)}
            >
              <Text style={styles.seasonCardEmoji}>{season.emoji}</Text>
              <Text style={[styles.seasonCardName, { color: season.headerColor }]}>
                {season.nameVi}
              </Text>
              {/* Progress bar */}
              <View style={styles.seasonProgressBar}>
                <View
                  style={[
                    styles.seasonProgressFill,
                    {
                      backgroundColor: season.headerColor,
                      width: `${progress * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.seasonProgressText, { color: season.headerColor + 'AA' }]}>
                {Math.round(progress * 3)}/3 ⭐
              </Text>
              {isComplete && <Text style={styles.seasonCompleteBadge}>✅</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Collection Counter */}
      <View style={styles.collectionBar}>
        <Text style={styles.collectionIcon}>📔</Text>
        <Text style={styles.collectionText}>
          Bộ sưu tập: {collectedCreatures.length} sinh vật
        </Text>
        <Text style={styles.collectionEmojis}>
          {collectedCreatures.slice(-6).join(' ')}
        </Text>
      </View>
    </View>
  );

  // ══════════════════════════════════════════
  // RENDER: Level List
  // ══════════════════════════════════════════
  const renderLevelList = () => (
    <View style={[styles.levelListContainer, { backgroundColor: currentSeason.bgEnd }]}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={handleBackToSeasonMap}
        activeOpacity={0.7}
      >
        <Text style={[styles.backBtnText, { color: currentSeason.headerColor }]}>
          ← Quay lại
        </Text>
      </TouchableOpacity>

      <Text style={[styles.levelListTitle, { color: currentSeason.headerColor }]}>
        {currentSeason.emoji} {currentSeason.nameVi}
      </Text>

      <ScrollView contentContainerStyle={styles.levelListScroll}>
        {seasonLevels.map((level, idx) => {
          const isCompleted = completedLevels.includes(level.id);
          const isLocked = idx > 0 && !completedLevels.includes(seasonLevels[idx - 1]!.id);
          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                {
                  backgroundColor: isLocked
                    ? '#E0E0E0'
                    : isCompleted
                    ? level.bgAccent
                    : '#FFFFFF',
                  borderColor: isCompleted
                    ? '#4CAF50'
                    : isLocked
                    ? '#BDBDBD'
                    : currentSeason.headerColor + '30',
                  opacity: isLocked ? 0.6 : 1,
                },
              ]}
              activeOpacity={isLocked ? 1 : 0.7}
              onPress={() => {
                if (isLocked) {
                  soundManager.speak(
                    'Bé cần hoàn thành màn trước để mở khóa màn này nhé!',
                    'vi'
                  );
                  return;
                }
                handleSelectLevel(level.id);
              }}
            >
              <Text style={styles.levelCardEmoji}>
                {isLocked ? '🔒' : level.sceneEmoji}
              </Text>
              <View style={styles.levelCardInfo}>
                <Text
                  style={[
                    styles.levelCardName,
                    { color: isLocked ? '#9E9E9E' : currentSeason.headerColor },
                  ]}
                >
                  Màn {idx + 1}: {level.nameVi}
                </Text>
                <Text
                  style={[
                    styles.levelCardDesc,
                    { color: isLocked ? '#BDBDBD' : '#757575' },
                  ]}
                >
                  {level.description}
                </Text>
              </View>
              {isCompleted && (
                <Text style={styles.levelCompletedBadge}>✅</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // ══════════════════════════════════════════
  // RENDER: Playing Scene
  // ══════════════════════════════════════════
  const renderPlaying = () => {
    const stepProgress = currentLevel.steps.length > 0
      ? (currentStepIdx / currentLevel.steps.length) * 100
      : 0;

    return (
      <Animated.View
        style={[
          styles.playContainer,
          {
            backgroundColor: currentSeason.bgEnd,
            transform: [{ scale: sceneScale }],
          },
        ]}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.playBackBtn}
          onPress={handleBackToLevelList}
          activeOpacity={0.7}
        >
          <Text style={[styles.playBackBtnText, { color: currentSeason.headerColor }]}>
            ←
          </Text>
        </TouchableOpacity>

        {/* Level Title */}
        <Text style={[styles.playTitle, { color: currentSeason.headerColor }]}>
          {currentLevel.sceneEmoji} {currentLevel.nameVi}
        </Text>

        {/* Progress indicator */}
        <View style={styles.stepProgressBar}>
          <View
            style={[
              styles.stepProgressFill,
              {
                backgroundColor: currentSeason.headerColor,
                width: `${stepProgress}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.stepProgressText, { color: currentSeason.headerColor + 'AA' }]}>
          Bước {currentStepIdx + 1}/{currentLevel.steps.length}
        </Text>

        {/* Scene Area */}
        <View style={[styles.sceneRoom, { backgroundColor: currentLevel.bgAccent + '40' }]}>
          {/* Fun Fact */}
          <View style={styles.funFactBubble}>
            <Text style={[styles.funFactText, { color: currentSeason.headerColor }]}>
              💡 {currentLevel.funFact}
            </Text>
          </View>

          {/* Main Scene Emoji */}
          <View style={styles.sceneCenter}>
            <Animated.Text
              style={[
                styles.sceneBigEmoji,
                {
                  transform: [{ scale: lunaBounce }],
                },
              ]}
            >
              {currentLevel.sceneEmoji}
            </Animated.Text>

            {/* Luna flying beside */}
            <Animated.View
              style={[
                styles.lunaFlying,
                {
                  transform: [{ scale: lunaScale }, { rotate: lunaRotate }],
                },
              ]}
            >
              <Text style={styles.lunaFlyingEmoji}>🦋</Text>
              <Text style={styles.lunaFlyingOutfit}>{currentSeason.lunaOutfit}</Text>
            </Animated.View>

            {/* Heart reaction */}
            <Animated.Text
              style={[
                styles.heartReaction,
                {
                  transform: [{ scale: heartScale }],
                  opacity: heartScale,
                },
              ]}
            >
              💖
            </Animated.Text>

            {/* Star popup */}
            <Animated.View
              style={[
                styles.starPopup,
                {
                  transform: [
                    { scale: starPop },
                    {
                      translateY: starPop.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, -10],
                      }),
                    },
                  ],
                  opacity: starPop,
                },
              ]}
            >
              <Text style={styles.starPopupText}>+1 ⭐</Text>
            </Animated.View>

            {/* Floating emojis */}
            {floatingEmojis.map((item) => {
              const anim = floatAnims.current.get(item.id);
              if (!anim) return null;
              return (
                <Animated.Text
                  key={item.id}
                  style={[
                    styles.floatingEmoji,
                    {
                      left: item.x,
                      transform: [
                        {
                          translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -180],
                          }),
                        },
                        {
                          scale: anim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.5, 1.2, 0.3],
                          }),
                        },
                      ],
                      opacity: anim.interpolate({
                        inputRange: [0, 0.3, 0.8, 1],
                        outputRange: [0, 1, 0.8, 0],
                      }),
                    },
                  ]}
                >
                  {item.emoji}
                </Animated.Text>
              );
            })}
          </View>
        </View>

        {/* Current Step Action Button */}
        {currentStep && (
          <Animated.View style={{ transform: [{ scale: stepBounce }] }}>
            <TouchableOpacity
              style={[
                styles.stepActionBtn,
                {
                  backgroundColor: currentSeason.bgStart,
                  borderColor: currentSeason.headerColor,
                },
              ]}
              activeOpacity={0.7}
              onPress={handleStepAction}
            >
              <Text style={styles.stepActionEmoji}>{currentStep.emoji}</Text>
              <Text style={[styles.stepActionText, { color: currentSeason.headerColor }]}>
                {currentStep.instruction}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  // ══════════════════════════════════════════
  // RENDER: Level Complete
  // ══════════════════════════════════════════
  const renderLevelComplete = () => (
    <View style={styles.completeOverlay}>
      <Text style={styles.completeEmojis}>🎉 🦋 ⭐</Text>
      <Text style={styles.completeTitle}>BÉ GIỎI QUÁ!</Text>
      <Text style={styles.completeSubtitle}>
        Bé đã hoàn thành "{currentLevel.nameVi}"!
      </Text>
      <Text style={styles.completeStars}>
        +{currentLevel.starsReward} ⭐ | Tổng: {totalStars} ⭐
      </Text>

      {/* Collected creatures */}
      <View style={styles.completeCreatures}>
        <Text style={styles.completeCreaturesLabel}>Sinh vật mới thu thập:</Text>
        <Text style={styles.completeCreaturesEmojis}>
          {currentLevel.creatures.join('  ')}
        </Text>
      </View>

      {/* Fun Fact */}
      <View style={styles.completeFunFact}>
        <Text style={styles.completeFunFactText}>
          💡 {currentLevel.funFact}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.completeBtnRow}>
        <TouchableOpacity
          style={[styles.completeBtn, { backgroundColor: '#FF9800' }]}
          onPress={handleBackToLevelList}
          activeOpacity={0.8}
        >
          <Text style={styles.completeBtnText}>📋 Danh Sách</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.completeBtn, { backgroundColor: '#4CAF50' }]}
          onPress={handleNextLevel}
          activeOpacity={0.8}
        >
          <Text style={styles.completeBtnText}>▶️ Màn Tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ══════════════════════════════════════════
  // RENDER: Main
  // ══════════════════════════════════════════
  const bgColor =
    currentView === 'levelComplete'
      ? 'rgba(15, 23, 42, 0.92)'
      : currentView === 'seasonMap'
      ? '#FFF8E1'
      : currentSeason.bgStart;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={currentView === 'levelComplete' ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />

      {/* ═══════ HEADER ═══════ */}
      {currentView !== 'levelComplete' && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={currentView === 'seasonMap' ? onClose : handleBackToSeasonMap}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.closeBtnText,
                {
                  color:
                    currentView === 'seasonMap'
                      ? '#5D4037'
                      : currentSeason.headerColor,
                },
              ]}
            >
              {currentView === 'seasonMap' ? '✕' : '🏠'}
            </Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.titleText,
                {
                  color:
                    currentView === 'seasonMap'
                      ? '#5D4037'
                      : currentSeason.headerColor,
                },
              ]}
            >
              🦋 Khu Vườn Bốn Mùa
            </Text>
            <Text
              style={[
                styles.subtitleText,
                {
                  color:
                    currentView === 'seasonMap'
                      ? '#8D6E63'
                      : currentSeason.headerColor + 'AA',
                },
              ]}
            >
              ⭐ {totalStars} Sao | 📔 {collectedCreatures.length} sinh vật
            </Text>
          </View>
          <TouchableOpacity
            style={styles.soundBtn}
            onPress={() => {
              if (currentView === 'playing') {
                soundManager.speak(
                  `Đây là màn ${currentLevel.nameVi}! ${currentLevel.funFact}`,
                  'vi'
                );
              } else {
                soundManager.speak(
                  `Bé đã thu thập ${collectedCreatures.length} sinh vật và ${totalStars} ngôi sao!`,
                  'vi'
                );
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.soundBtnText}>🔊</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ═══════ SEASONAL PARTICLES ═══════ */}
      {(currentView === 'playing' || currentView === 'seasonMap') &&
        seasonParticles.map((p) => {
          const anim = particleAnims.current.get(p.id);
          if (!anim) return null;
          return (
            <Animated.Text
              key={p.id}
              style={[
                styles.seasonParticle,
                {
                  left: p.x,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, Dimensions.get('window').height + 20],
                      }),
                    },
                  ],
                  opacity: anim.interpolate({
                    inputRange: [0, 0.1, 0.9, 1],
                    outputRange: [0, 0.7, 0.7, 0],
                  }),
                },
              ]}
            >
              {p.emoji}
            </Animated.Text>
          );
        })}

      {/* ═══════ MAIN CONTENT ═══════ */}
      {currentView === 'seasonMap' && renderSeasonMap()}
      {currentView === 'levelList' && renderLevelList()}
      {currentView === 'playing' && renderPlaying()}
      {currentView === 'levelComplete' && renderLevelComplete()}
    </SafeAreaView>
  );
};

// ============================================================
// 🎨 STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ─── HEADER ───
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 6,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeBtnText: {
    fontSize: 22,
    fontWeight: '900',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  soundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  soundBtnText: {
    fontSize: 20,
  },

  // ─── SEASONAL PARTICLES ───
  seasonParticle: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 1,
    pointerEvents: 'none',
  },

  // ─── SEASON MAP ───
  mapContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  lunaContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  lunaEmoji: {
    fontSize: 70,
  },
  lunaName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#7B1FA2',
    marginTop: 2,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  seasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  seasonCard: {
    width: '45%',
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 2.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  seasonCardEmoji: {
    fontSize: 44,
    marginBottom: 6,
  },
  seasonCardName: {
    fontSize: 15,
    fontWeight: '900',
  },
  seasonProgressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  seasonProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  seasonProgressText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  seasonCompleteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 18,
  },
  collectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  collectionIcon: {
    fontSize: 22,
  },
  collectionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5D4037',
  },
  collectionEmojis: {
    fontSize: 16,
    marginLeft: 'auto',
  },

  // ─── LEVEL LIST ───
  levelListContainer: {
    flex: 1,
    padding: 14,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  levelListTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  levelListScroll: {
    gap: 10,
    paddingBottom: 20,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    gap: 12,
  },
  levelCardEmoji: {
    fontSize: 40,
  },
  levelCardInfo: {
    flex: 1,
  },
  levelCardName: {
    fontSize: 15,
    fontWeight: '900',
  },
  levelCardDesc: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  levelCompletedBadge: {
    fontSize: 22,
  },

  // ─── PLAYING SCENE ───
  playContainer: {
    flex: 1,
    padding: 14,
  },
  playBackBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  playBackBtnText: {
    fontSize: 28,
    fontWeight: '900',
  },
  playTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  stepProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  stepProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepProgressText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 6,
  },
  sceneRoom: {
    flex: 1,
    borderRadius: 28,
    padding: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  funFactBubble: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    elevation: 1,
  },
  funFactText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  sceneCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sceneBigEmoji: {
    fontSize: 120,
  },
  lunaFlying: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'center',
  },
  lunaFlyingEmoji: {
    fontSize: 44,
  },
  lunaFlyingOutfit: {
    fontSize: 18,
    marginTop: -6,
  },
  heartReaction: {
    position: 'absolute',
    top: 10,
    right: 60,
    fontSize: 40,
  },
  starPopup: {
    position: 'absolute',
    top: 5,
    left: 30,
    backgroundColor: '#FDE047',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  starPopupText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 28,
    bottom: 80,
  },

  // ─── STEP ACTION BUTTON ───
  stepActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 3,
    marginTop: 10,
    marginHorizontal: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    gap: 12,
  },
  stepActionEmoji: {
    fontSize: 36,
  },
  stepActionText: {
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
  },

  // ─── LEVEL COMPLETE ───
  completeOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completeEmojis: {
    fontSize: 56,
    marginBottom: 12,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FDE047',
    textShadowColor: 'rgba(253,224,71,0.4)',
    textShadowRadius: 10,
  },
  completeSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  completeStars: {
    color: '#FDE047',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  completeCreatures: {
    marginTop: 16,
    alignItems: 'center',
  },
  completeCreaturesLabel: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
  },
  completeCreaturesEmojis: {
    fontSize: 36,
    marginTop: 6,
  },
  completeFunFact: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 14,
    maxWidth: '90%',
  },
  completeFunFactText: {
    color: '#E0E0E0',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
  },
  completeBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  completeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default FourSeasonsGameScreen;
