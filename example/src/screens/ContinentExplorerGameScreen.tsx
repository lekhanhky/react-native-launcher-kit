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
// 🦅 DATA: 7 Châu Lục — Mỗi châu lục có palette riêng
// ============================================================

interface ContinentConfig {
  id: string;
  nameVi: string;
  emoji: string;
  globeEmoji: string;
  bgStart: string;
  bgEnd: string;
  headerColor: string;
  particleEmojis: string[];
  landmark: string;
  greeting: string;
}

const CONTINENTS: ContinentConfig[] = [
  {
    id: 'africa',
    nameVi: 'Châu Phi',
    emoji: '🌍',
    globeEmoji: '🦁',
    bgStart: '#E67E22',
    bgEnd: '#F39C12',
    headerColor: '#7B3F00',
    particleEmojis: ['☀️', '🌾', '🌅', '✨', '🌟'],
    landmark: '🏔️',
    greeting: 'Chào mừng đến Châu Phi! Thảo nguyên Serengeti rộng lớn với bao bạn thú hoang dã!',
  },
  {
    id: 'asia',
    nameVi: 'Châu Á',
    emoji: '🌏',
    globeEmoji: '🐼',
    bgStart: '#E74C3C',
    bgEnd: '#F1C40F',
    headerColor: '#8B0000',
    particleEmojis: ['🏮', '🎋', '🌸', '✨', '🎎'],
    landmark: '🏯',
    greeting: 'Chào mừng đến Châu Á! Rừng tre xanh mướt và những ngôi đền cổ kính đang chờ bé!',
  },
  {
    id: 'europe',
    nameVi: 'Châu Âu',
    emoji: '🌍',
    globeEmoji: '🦌',
    bgStart: '#2980B9',
    bgEnd: '#ECF0F1',
    headerColor: '#1A5276',
    particleEmojis: ['🏰', '⛪', '🌷', '❄️', '✨'],
    landmark: '🗼',
    greeting: 'Chào mừng đến Châu Âu! Những lâu đài cổ tích và núi tuyết Alps hùng vĩ!',
  },
  {
    id: 'north_america',
    nameVi: 'Bắc Mỹ',
    emoji: '🌎',
    globeEmoji: '🐻',
    bgStart: '#27AE60',
    bgEnd: '#A0522D',
    headerColor: '#1B4332',
    particleEmojis: ['🌲', '🍁', '🦅', '⛰️', '✨'],
    landmark: '🏜️',
    greeting: 'Chào mừng đến Bắc Mỹ! Grand Canyon hùng vĩ và rừng Sequoia khổng lồ!',
  },
  {
    id: 'south_america',
    nameVi: 'Nam Mỹ',
    emoji: '🌎',
    globeEmoji: '🦜',
    bgStart: '#2ECC71',
    bgEnd: '#F39C12',
    headerColor: '#0B5345',
    particleEmojis: ['🌺', '🦜', '🌴', '🌿', '✨'],
    landmark: '🏛️',
    greeting: 'Chào mừng đến Nam Mỹ! Rừng mưa Amazon — khu rừng nhiệt đới lớn nhất thế giới!',
  },
  {
    id: 'oceania',
    nameVi: 'Châu Úc',
    emoji: '🌏',
    globeEmoji: '🦘',
    bgStart: '#D35400',
    bgEnd: '#1ABC9C',
    headerColor: '#784212',
    particleEmojis: ['🪃', '🌊', '🐚', '☀️', '✨'],
    landmark: '🪨',
    greeting: 'Chào mừng đến Châu Úc! Vùng đất kỳ lạ với kangaroo và koala dễ thương!',
  },
  {
    id: 'polar',
    nameVi: 'Vùng Cực',
    emoji: '🌍',
    globeEmoji: '🐧',
    bgStart: '#AED6F1',
    bgEnd: '#FAFAFA',
    headerColor: '#1B4F72',
    particleEmojis: ['❄️', '🌨️', '🧊', '💎', '✨'],
    landmark: '🏔️',
    greeting: 'Chào mừng đến Vùng Cực! Băng giá và tuyết trắng mênh mông với những bạn thú dũng cảm!',
  },
];

// ============================================================
// 🎮 DATA: 7 Màn chơi — Mỗi màn 1 châu lục
// ============================================================

interface LevelStep {
  instruction: string;
  emoji: string;
  soundPhrase: string;
  reactionEmojis: string[];
}

interface Level {
  id: string;
  continentId: string;
  nameVi: string;
  sceneEmoji: string;
  description: string;
  funFact: string;
  bgAccent: string;
  animals: { emoji: string; nameVi: string; fact: string }[];
  steps: LevelStep[];
  completionPhrase: string;
  starsReward: number;
  stampEmoji: string;
}

const LEVELS: Level[] = [
  // ═══════ 🌍 CHÂU PHI ═══════
  {
    id: 'africa',
    continentId: 'africa',
    nameVi: 'Thảo Nguyên Serengeti',
    sceneEmoji: '🌅',
    description: 'Khám phá thảo nguyên hoang dã châu Phi!',
    funFact: 'Thảo nguyên Serengeti là nơi diễn ra cuộc đại di cư lớn nhất hành tinh với 2 triệu con vật!',
    bgAccent: '#FDEBD0',
    animals: [
      { emoji: '🦁', nameVi: 'Sư Tử', fact: 'Sư Tử là vua của muôn loài! Tiếng gầm vang xa 8 cây số!' },
      { emoji: '🦒', nameVi: 'Hươu Cao Cổ', fact: 'Hươu Cao Cổ cao tới 6 mét, là động vật cao nhất thế giới!' },
      { emoji: '🐘', nameVi: 'Voi', fact: 'Voi có trí nhớ siêu tốt và biết buồn khi mất bạn!' },
    ],
    steps: [
      { instruction: 'Ari bay đến thảo nguyên! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Ari đáp cánh xuống thảo nguyên Serengeti! Rộng lớn quá!', reactionEmojis: ['🦅', '🌾', '☀️', '✨', '⭐'] },
      { instruction: 'Gặp bạn Sư Tử! Chạm để chào!', emoji: '🦁', soundPhrase: 'Gầm! Xin chào! Mình là Sư Tử, vua của thảo nguyên!', reactionEmojis: ['🦁', '👑', '💛', '🌟', '⭐'] },
      { instruction: 'Gặp bạn Hươu Cao Cổ! Chạm để chào!', emoji: '🦒', soundPhrase: 'Xin chào từ trên cao! Mình là Hươu Cao Cổ, cao nhất thế giới!', reactionEmojis: ['🦒', '🌿', '💚', '✨', '⭐'] },
      { instruction: 'Gặp bạn Voi! Chạm để chào!', emoji: '🐘', soundPhrase: 'Phì phò! Mình là Voi! Mình nhớ tất cả các bạn!', reactionEmojis: ['🐘', '💧', '🤎', '💕', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Châu Phi!', emoji: '🛂', soundPhrase: 'Dấu Châu Phi đã được đóng vào hộ chiếu! Tuyệt vời!', reactionEmojis: ['🛂', '🌍', '🎉', '⭐', '🌟'] },
    ],
    completionPhrase: 'Hoan hô! Bé đã khám phá Châu Phi và gặp 3 bạn thú hoang dã! Hộ chiếu có thêm 1 stamp!',
    starsReward: 3,
    stampEmoji: '🦁',
  },

  // ═══════ 🌏 CHÂU Á ═══════
  {
    id: 'asia',
    continentId: 'asia',
    nameVi: 'Rừng Tre Châu Á',
    sceneEmoji: '🎋',
    description: 'Du hành đến rừng tre và ngôi đền cổ!',
    funFact: 'Tre có thể mọc cao thêm 90cm chỉ trong 1 ngày, nhanh nhất trong thế giới thực vật!',
    bgAccent: '#FADBD8',
    animals: [
      { emoji: '🐼', nameVi: 'Gấu Trúc', fact: 'Gấu Trúc ăn tre suốt 14 giờ mỗi ngày!' },
      { emoji: '🐅', nameVi: 'Hổ Bengal', fact: 'Hổ Bengal chạy nhanh 65 km/giờ và bơi rất giỏi!' },
      { emoji: '🐉', nameVi: 'Rồng Komodo', fact: 'Rồng Komodo dài 3 mét, là thằn lằn lớn nhất thế giới!' },
    ],
    steps: [
      { instruction: 'Ari bay đến rừng tre! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Ari đáp cánh bên rừng tre xanh mướt! Châu Á đẹp quá!', reactionEmojis: ['🦅', '🎋', '🏮', '✨', '⭐'] },
      { instruction: 'Gặp bạn Gấu Trúc! Chạm để chào!', emoji: '🐼', soundPhrase: 'Xin chào! Mình là Gấu Trúc! Mình đang ăn tre ngon lắm!', reactionEmojis: ['🐼', '🎋', '🤍', '🖤', '⭐'] },
      { instruction: 'Gặp bạn Hổ Bengal! Chạm để chào!', emoji: '🐅', soundPhrase: 'Gầm! Mình là Hổ Bengal! Mình rất mạnh nhưng hiền lắm!', reactionEmojis: ['🐅', '🧡', '🔥', '✨', '⭐'] },
      { instruction: 'Gặp bạn Rồng Komodo! Chạm để chào!', emoji: '🐉', soundPhrase: 'Xèo xèo! Mình là Rồng Komodo! Mình là thằn lằn to nhất!', reactionEmojis: ['🐉', '🦎', '💚', '🌿', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Châu Á!', emoji: '🛂', soundPhrase: 'Dấu Châu Á với hình Gấu Trúc đáng yêu! Tuyệt vời!', reactionEmojis: ['🛂', '🌏', '🎉', '⭐', '🏮'] },
    ],
    completionPhrase: 'Tuyệt vời! Bé đã khám phá Châu Á và gặp những bạn thú tuyệt vời! Bay tiếp thôi!',
    starsReward: 3,
    stampEmoji: '🐼',
  },

  // ═══════ 🌍 CHÂU ÂU ═══════
  {
    id: 'europe',
    continentId: 'europe',
    nameVi: 'Lâu Đài Châu Âu',
    sceneEmoji: '🏰',
    description: 'Bay qua những lâu đài cổ và núi tuyết Alps!',
    funFact: 'Châu Âu có hơn 10.000 lâu đài cổ! Nhiều lâu đài đã hàng nghìn năm tuổi!',
    bgAccent: '#D4E6F1',
    animals: [
      { emoji: '🦌', nameVi: 'Nai Sừng Tấm', fact: 'Sừng nai rụng và mọc lại mỗi năm, to hơn mỗi lần!' },
      { emoji: '🐺', nameVi: 'Sói Xám', fact: 'Sói sống theo bầy và hú để nói chuyện với nhau từ xa!' },
      { emoji: '🦢', nameVi: 'Thiên Nga', fact: 'Thiên Nga kết đôi suốt đời, rất thủy chung!' },
    ],
    steps: [
      { instruction: 'Ari bay qua dãy Alps! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Ari đáp cánh bên lâu đài cổ! Châu Âu thật đẹp và lãng mạn!', reactionEmojis: ['🦅', '🏰', '⛰️', '✨', '⭐'] },
      { instruction: 'Gặp bạn Nai Sừng Tấm! Chạm để chào!', emoji: '🦌', soundPhrase: 'Xin chào! Mình là Nai! Sừng mình to lắm phải không?', reactionEmojis: ['🦌', '🌲', '🤎', '✨', '⭐'] },
      { instruction: 'Gặp bạn Sói Xám! Chạm để chào!', emoji: '🐺', soundPhrase: 'Hú úuuuu! Mình là Sói! Mình hú để gọi bạn bè!', reactionEmojis: ['🐺', '🌙', '🌲', '🎵', '⭐'] },
      { instruction: 'Gặp Thiên Nga trên hồ! Chạm để chào!', emoji: '🦢', soundPhrase: 'Xin chào! Mình là Thiên Nga! Mình bơi uyển chuyển trên hồ!', reactionEmojis: ['🦢', '💧', '🤍', '💕', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Châu Âu!', emoji: '🛂', soundPhrase: 'Dấu Châu Âu với hình lâu đài! Thật hoàng gia!', reactionEmojis: ['🛂', '🌍', '🏰', '⭐', '🎉'] },
    ],
    completionPhrase: 'Tuyệt vời! Châu Âu thật đẹp với lâu đài và núi tuyết! Ari bay tiếp nhé!',
    starsReward: 3,
    stampEmoji: '🦌',
  },

  // ═══════ 🌎 BẮC MỸ ═══════
  {
    id: 'north_america',
    continentId: 'north_america',
    nameVi: 'Grand Canyon & Rừng Sequoia',
    sceneEmoji: '🏜️',
    description: 'Khám phá hẻm núi Grand Canyon và rừng cây khổng lồ!',
    funFact: 'Grand Canyon sâu gần 2 km và được dòng sông Colorado tạo ra suốt 6 triệu năm!',
    bgAccent: '#D5F5E3',
    animals: [
      { emoji: '🐻', nameVi: 'Gấu Nâu', fact: 'Gấu Nâu nặng tới 600 kg và bắt cá hồi rất giỏi!' },
      { emoji: '🦅', nameVi: 'Đại Bàng Đầu Trắng', fact: 'Đại Bàng Đầu Trắng là biểu tượng của nước Mỹ!' },
      { emoji: '🦫', nameVi: 'Hải Ly', fact: 'Hải Ly xây đập bằng cây, là kiến trúc sư giỏi nhất!' },
    ],
    steps: [
      { instruction: 'Ari bay qua Grand Canyon! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Ari bay qua hẻm núi sâu thẳm! Bắc Mỹ hùng vĩ quá!', reactionEmojis: ['🦅', '🏜️', '🌄', '✨', '⭐'] },
      { instruction: 'Gặp bạn Gấu Nâu! Chạm để chào!', emoji: '🐻', soundPhrase: 'Gầm gừ! Mình là Gấu Nâu! Mình vừa bắt được cá hồi!', reactionEmojis: ['🐻', '🐟', '🤎', '💪', '⭐'] },
      { instruction: 'Gặp Đại Bàng Đầu Trắng! Chạm để chào!', emoji: '🦅', soundPhrase: 'Xin chào đồng đội! Mình cũng là đại bàng như Ari!', reactionEmojis: ['🦅', '🤍', '🇺🇸', '✨', '⭐'] },
      { instruction: 'Gặp bạn Hải Ly! Chạm để chào!', emoji: '🦫', soundPhrase: 'Xin chào! Mình là Hải Ly! Nhìn cái đập mình xây kìa!', reactionEmojis: ['🦫', '🪵', '🏗️', '💧', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Bắc Mỹ!', emoji: '🛂', soundPhrase: 'Dấu Bắc Mỹ với hình Grand Canyon! Ấn tượng quá!', reactionEmojis: ['🛂', '🌎', '🏜️', '⭐', '🎉'] },
    ],
    completionPhrase: 'Hoan hô! Bắc Mỹ thật hùng vĩ! Bé đã gặp gấu, đại bàng và hải ly!',
    starsReward: 3,
    stampEmoji: '🐻',
  },

  // ═══════ 🌎 NAM MỸ ═══════
  {
    id: 'south_america',
    continentId: 'south_america',
    nameVi: 'Rừng Mưa Amazon',
    sceneEmoji: '🌴',
    description: 'Phiêu lưu vào rừng mưa Amazon bí ẩn!',
    funFact: 'Rừng Amazon tạo ra 20% lượng oxy cho toàn bộ Trái Đất, nên được gọi là Lá Phổi Xanh!',
    bgAccent: '#D4EFDF',
    animals: [
      { emoji: '🦜', nameVi: 'Vẹt Macaw', fact: 'Vẹt Macaw có bộ lông 7 sắc cầu vồng và sống tới 80 năm!' },
      { emoji: '🐆', nameVi: 'Báo Đốm', fact: 'Báo Đốm có lực cắn mạnh nhất trong họ mèo!' },
      { emoji: '🦥', nameVi: 'Con Lười', fact: 'Con Lười ngủ 20 giờ mỗi ngày và di chuyển rất chậm!' },
    ],
    steps: [
      { instruction: 'Ari bay vào rừng Amazon! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Ari lượn qua tán rừng mưa! Nam Mỹ xanh mướt quá!', reactionEmojis: ['🦅', '🌴', '🌿', '✨', '⭐'] },
      { instruction: 'Gặp bạn Vẹt Macaw! Chạm để chào!', emoji: '🦜', soundPhrase: 'Quạ quạ! Mình là Vẹt Macaw! Nhìn bộ lông cầu vồng đẹp không?', reactionEmojis: ['🦜', '🌈', '❤️', '💙', '⭐'] },
      { instruction: 'Gặp bạn Báo Đốm! Chạm để chào!', emoji: '🐆', soundPhrase: 'Gầm nhẹ! Mình là Báo Đốm! Mình rất nhanh và mạnh!', reactionEmojis: ['🐆', '🐾', '💛', '🖤', '⭐'] },
      { instruction: 'Gặp bạn Con Lười! Chạm để chào!', emoji: '🦥', soundPhrase: 'Zzz... Ồ xin chào... Mình là Con Lười... Mình hơi buồn ngủ...', reactionEmojis: ['🦥', '😴', '💤', '🌿', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Nam Mỹ!', emoji: '🛂', soundPhrase: 'Dấu Nam Mỹ với hình rừng mưa Amazon! Xanh tươi quá!', reactionEmojis: ['🛂', '🌎', '🌴', '⭐', '🎉'] },
    ],
    completionPhrase: 'Tuyệt vời! Rừng mưa Amazon thật kỳ diệu! Bé đã gặp vẹt, báo và con lười!',
    starsReward: 3,
    stampEmoji: '🦜',
  },

  // ═══════ 🌏 CHÂU ÚC ═══════
  {
    id: 'oceania',
    continentId: 'oceania',
    nameVi: 'Vùng Đất Kangaroo',
    sceneEmoji: '🪨',
    description: 'Khám phá vùng đất Uluru và rạn san hô!',
    funFact: 'Rạn san hô Great Barrier lớn đến mức có thể nhìn thấy từ ngoài vũ trụ!',
    bgAccent: '#FAD7A0',
    animals: [
      { emoji: '🦘', nameVi: 'Kangaroo', fact: 'Kangaroo nhảy xa tới 9 mét mỗi bước và mang con trong túi!' },
      { emoji: '🐨', nameVi: 'Koala', fact: 'Koala ngủ 22 giờ mỗi ngày và chỉ ăn lá bạch đàn!' },
      { emoji: '🐊', nameVi: 'Cá Sấu Nước Mặn', fact: 'Cá Sấu Nước Mặn dài tới 7 mét, là loài bò sát lớn nhất!' },
    ],
    steps: [
      { instruction: 'Ari bay đến Uluru! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Ari đáp cánh bên tảng đá Uluru khổng lồ! Châu Úc kỳ lạ quá!', reactionEmojis: ['🦅', '🪨', '☀️', '✨', '⭐'] },
      { instruction: 'Gặp bạn Kangaroo! Chạm để chào!', emoji: '🦘', soundPhrase: 'Nhảy nhảy! Mình là Kangaroo! Con mình đang ở trong túi!', reactionEmojis: ['🦘', '🤎', '💛', '🏃', '⭐'] },
      { instruction: 'Gặp bạn Koala! Chạm để chào!', emoji: '🐨', soundPhrase: 'Zzz... Ồ xin chào! Mình là Koala! Mình thích ôm cây ngủ!', reactionEmojis: ['🐨', '🌿', '😴', '💚', '⭐'] },
      { instruction: 'Gặp Cá Sấu Nước Mặn! Chạm để chào!', emoji: '🐊', soundPhrase: 'Ngáp! Mình là Cá Sấu! Mình rất to nhưng không cắn bé đâu!', reactionEmojis: ['🐊', '🌊', '💧', '💚', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Châu Úc!', emoji: '🛂', soundPhrase: 'Dấu Châu Úc với hình Kangaroo! Thú vị quá!', reactionEmojis: ['🛂', '🌏', '🦘', '⭐', '🎉'] },
    ],
    completionPhrase: 'Hoan hô! Châu Úc thật kỳ lạ và thú vị! Kangaroo, Koala đều rất dễ thương!',
    starsReward: 3,
    stampEmoji: '🦘',
  },

  // ═══════ 🌍 VÙNG CỰC ═══════
  {
    id: 'polar',
    continentId: 'polar',
    nameVi: 'Băng Giá Vùng Cực',
    sceneEmoji: '🧊',
    description: 'Khám phá Bắc Cực và Nam Cực lạnh giá!',
    funFact: 'Ở vùng cực, mùa hè mặt trời không bao giờ lặn, và mùa đông trời tối suốt cả ngày!',
    bgAccent: '#D6EAF8',
    animals: [
      { emoji: '🐧', nameVi: 'Cánh Cụt', fact: 'Bố Cánh Cụt ấp trứng trên chân suốt 2 tháng trong bão tuyết!' },
      { emoji: '🐻‍❄️', nameVi: 'Gấu Bắc Cực', fact: 'Gấu Bắc Cực có lông trắng nhưng da thực ra màu đen!' },
      { emoji: '🦭', nameVi: 'Hải Cẩu', fact: 'Hải Cẩu có thể nhịn thở dưới nước tới 2 giờ!' },
    ],
    steps: [
      { instruction: 'Ari bay đến Vùng Cực! Chạm để đáp cánh!', emoji: '🦅', soundPhrase: 'Brr! Lạnh quá! Ari đáp cánh trên biển băng! Trắng xóa quá!', reactionEmojis: ['🦅', '🧊', '❄️', '✨', '⭐'] },
      { instruction: 'Gặp bạn Cánh Cụt! Chạm để chào!', emoji: '🐧', soundPhrase: 'Quác quác! Mình là Cánh Cụt! Mình không biết bay nhưng bơi giỏi lắm!', reactionEmojis: ['🐧', '🧊', '🤍', '💙', '⭐'] },
      { instruction: 'Gặp Gấu Bắc Cực! Chạm để chào!', emoji: '🐻‍❄️', soundPhrase: 'Gầm nhẹ! Mình là Gấu Bắc Cực! Lông mình trắng như tuyết!', reactionEmojis: ['🐻‍❄️', '❄️', '🤍', '💪', '⭐'] },
      { instruction: 'Gặp bạn Hải Cẩu! Chạm để chào!', emoji: '🦭', soundPhrase: 'Ộp ộp! Mình là Hải Cẩu! Mình thích nằm phơi nắng trên băng!', reactionEmojis: ['🦭', '🧊', '💧', '😊', '⭐'] },
      { instruction: 'Đóng dấu hộ chiếu Vùng Cực — Hoàn thành!', emoji: '🛂', soundPhrase: 'Dấu cuối cùng! Hộ chiếu đầy đủ 7 châu lục! Phi công Ari tự hào lắm!', reactionEmojis: ['🛂', '🌍', '🎊', '🏆', '🎉'] },
    ],
    completionPhrase: 'HOAN HÔ! Bé đã bay qua tất cả 7 châu lục! Phi công Ari rất tự hào về bé! Bé là nhà thám hiểm vĩ đại!',
    starsReward: 5,
    stampEmoji: '🐧',
  },
];

// ============================================================
// 🎮 MAIN COMPONENT
// ============================================================

type GameView = 'globe' | 'playing' | 'levelComplete' | 'passport';

export const ContinentExplorerGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // ── Navigation State ──
  const [currentView, setCurrentView] = useState<GameView>('globe');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('africa');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // ── Progress State ──
  const [totalStars, setTotalStars] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [passportStamps, setPassportStamps] = useState<{ continentId: string; emoji: string }[]>([]);

  // ── Animation State ──
  const [floatingEmojis, setFloatingEmojis] = useState<
    { id: number; emoji: string; x: number }[]
  >([]);

  // ── Animation Refs ──
  const ariWingAnim = useRef(new Animated.Value(0)).current;
  const ariBounce = useRef(new Animated.Value(1)).current;
  const sceneScale = useRef(new Animated.Value(0)).current;
  const stepBounce = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const starPop = useRef(new Animated.Value(0)).current;
  const globeRotate = useRef(new Animated.Value(0)).current;
  const floatAnims = useRef<Map<number, Animated.Value>>(new Map());
  const particleAnims = useRef<Map<number, Animated.Value>>(new Map());
  let emojiCounter = useRef(0);

  // ── Derived Data ──
  const currentLevel = LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0]!;
  const currentContinent = CONTINENTS.find((c) => c.id === currentLevel.continentId) || CONTINENTS[0]!;
  const currentStep = currentLevel.steps[currentStepIdx];

  // ── Ari wing soar animation (idle) ──
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ariWingAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ariWingAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ── Globe spin animation ──
  useEffect(() => {
    if (currentView !== 'globe') return;
    const loop = Animated.loop(
      Animated.timing(globeRotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [currentView]);

  // ── Welcome speech ──
  useEffect(() => {
    soundManager.speak(
      'Chào bé! Mình là Đại Bàng Ari! Chúng mình cùng bay khám phá 7 châu lục trên thế giới nhé! Hãy chọn một châu lục!',
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

  const handleSelectLevel = useCallback((levelId: string) => {
    setSelectedLevelId(levelId);
    setCurrentStepIdx(0);
    setCurrentView('playing');
    const level = LEVELS.find((l) => l.id === levelId)!;
    const continent = CONTINENTS.find((c) => c.id === level.continentId)!;
    soundManager.speak(continent.greeting, 'vi');
  }, []);

  const handleStepAction = useCallback(() => {
    if (!currentStep) return;

    // 1. Ari bounce
    Animated.sequence([
      Animated.spring(ariBounce, { toValue: 1.25, friction: 3, tension: 200, useNativeDriver: true }),
      Animated.spring(ariBounce, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    // 2. Step button bounce
    Animated.sequence([
      Animated.timing(stepBounce, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.spring(stepBounce, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    // 3. Heart pop
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 0, duration: 600, delay: 800, useNativeDriver: true }),
    ]).start();

    // 4. Star pop
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(starPop, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(starPop, { toValue: 0, duration: 500, delay: 600, useNativeDriver: true }),
    ]).start();

    // 5. Floating emojis
    const newEmojis = currentStep.reactionEmojis.map((em) => {
      const id = ++emojiCounter.current;
      const anim = new Animated.Value(0);
      floatAnims.current.set(id, anim);
      Animated.timing(anim, {
        toValue: 1, duration: 1500, easing: Easing.out(Easing.ease), useNativeDriver: true,
      }).start(() => {
        floatAnims.current.delete(id);
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
      });
      return { id, emoji: em, x: Math.random() * 260 + 30 };
    });
    setFloatingEmojis((prev) => [...prev, ...newEmojis]);

    // 6. Add star
    setTotalStars((prev) => prev + 1);

    // 7. Sound
    soundManager.speak(currentStep.soundPhrase, 'vi');

    // 8. Advance step or complete level
    const nextStepIdx = currentStepIdx + 1;
    if (nextStepIdx >= currentLevel.steps.length) {
      setTimeout(() => {
        setCompletedLevels((prev) => prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]);
        setPassportStamps((prev) => {
          if (prev.some((s) => s.continentId === currentLevel.continentId)) return prev;
          return [...prev, { continentId: currentLevel.continentId, emoji: currentLevel.stampEmoji }];
        });
        setTotalStars((prev) => prev + currentLevel.starsReward);
        setCurrentView('levelComplete');
        soundManager.speak(currentLevel.completionPhrase, 'vi');
      }, 1200);
    } else {
      setTimeout(() => {
        setCurrentStepIdx(nextStepIdx);
        const nextStep = currentLevel.steps[nextStepIdx];
        if (nextStep) soundManager.speak(nextStep.instruction, 'vi');
      }, 800);
    }
  }, [currentStep, currentStepIdx, currentLevel]);

  const handleNextLevel = useCallback(() => {
    const currentIdx = LEVELS.findIndex((l) => l.id === selectedLevelId);
    if (currentIdx < LEVELS.length - 1) {
      handleSelectLevel(LEVELS[currentIdx + 1]!.id);
    } else {
      setCurrentView('passport');
      soundManager.speak('Hoan hô! Bé đã bay qua tất cả 7 châu lục! Hãy xem hộ chiếu tuyệt vời của bé!', 'vi');
    }
  }, [selectedLevelId]);

  // ══════════════════════════════════════════
  // Computed
  // ══════════════════════════════════════════
  const ariScale = ariWingAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });
  const ariRotate = ariWingAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '4deg', '0deg', '-4deg', '0deg'],
  });
  const globeSpin = globeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ══════════════════════════════════════════
  // RENDER: Globe (World Map)
  // ══════════════════════════════════════════
  const renderGlobe = () => (
    <View style={styles.globeContainer}>
      {/* Ari Character */}
      <Animated.View style={[styles.ariContainer, { transform: [{ scale: ariScale }, { rotate: ariRotate }] }]}>
        <Text style={styles.ariEmoji}>🦅</Text>
        <Text style={styles.ariName}>Phi Công Ari</Text>
      </Animated.View>

      <Text style={styles.globeTitle}>Chọn châu lục để bay tới!</Text>

      {/* Globe spinning */}
      <Animated.Text style={[styles.globeSpinEmoji, { transform: [{ rotate: globeSpin }] }]}>
        🌍
      </Animated.Text>

      {/* Continent Cards */}
      <ScrollView contentContainerStyle={styles.continentGrid} showsVerticalScrollIndicator={false}>
        {CONTINENTS.map((continent) => {
          const isCompleted = completedLevels.includes(continent.id);
          const levelIdx = LEVELS.findIndex((l) => l.continentId === continent.id);
          const isLocked = levelIdx > 0 && !completedLevels.includes(LEVELS[levelIdx - 1]!.id);
          return (
            <TouchableOpacity
              key={continent.id}
              style={[
                styles.continentCard,
                {
                  backgroundColor: isLocked ? '#E0E0E0' : continent.bgStart,
                  borderColor: isCompleted ? '#4CAF50' : continent.headerColor + '40',
                  opacity: isLocked ? 0.5 : 1,
                },
              ]}
              activeOpacity={isLocked ? 1 : 0.7}
              onPress={() => {
                if (isLocked) {
                  soundManager.speak('Bé cần hoàn thành châu lục trước để bay tiếp nhé!', 'vi');
                  return;
                }
                handleSelectLevel(continent.id);
              }}
            >
              <Text style={styles.continentCardEmoji}>
                {isLocked ? '🔒' : continent.globeEmoji}
              </Text>
              <Text style={[styles.continentCardName, { color: isLocked ? '#9E9E9E' : '#FFFFFF' }]}>
                {continent.nameVi}
              </Text>
              {isCompleted && <Text style={styles.continentCompleteBadge}>✅</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Passport counter */}
      <View style={styles.passportBar}>
        <Text style={styles.passportIcon}>🛂</Text>
        <Text style={styles.passportText}>
          Hộ chiếu: {passportStamps.length}/7 stamps
        </Text>
        <Text style={styles.passportStamps}>
          {passportStamps.map((s) => s.emoji).join(' ')}
        </Text>
      </View>
    </View>
  );

  // ══════════════════════════════════════════
  // RENDER: Playing Scene
  // ══════════════════════════════════════════
  const renderPlaying = () => {
    const stepProgress = currentLevel.steps.length > 0
      ? (currentStepIdx / currentLevel.steps.length) * 100 : 0;
    return (
      <Animated.View style={[styles.playContainer, { backgroundColor: currentContinent.bgEnd, transform: [{ scale: sceneScale }] }]}>
        {/* Back */}
        <TouchableOpacity style={styles.playBackBtn} onPress={() => setCurrentView('globe')} activeOpacity={0.7}>
          <Text style={[styles.playBackBtnText, { color: currentContinent.headerColor }]}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.playTitle, { color: currentContinent.headerColor }]}>
          {currentContinent.emoji} {currentLevel.nameVi}
        </Text>

        {/* Progress */}
        <View style={styles.stepProgressBar}>
          <View style={[styles.stepProgressFill, { backgroundColor: currentContinent.headerColor, width: `${stepProgress}%` }]} />
        </View>
        <Text style={[styles.stepProgressText, { color: currentContinent.headerColor + 'AA' }]}>
          Bước {currentStepIdx + 1}/{currentLevel.steps.length}
        </Text>

        {/* Scene Room */}
        <View style={[styles.sceneRoom, { backgroundColor: currentLevel.bgAccent + '60' }]}>
          {/* Fun Fact */}
          <View style={styles.funFactBubble}>
            <Text style={[styles.funFactText, { color: currentContinent.headerColor }]}>
              💡 {currentLevel.funFact}
            </Text>
          </View>

          {/* Animal cards row */}
          <View style={styles.animalRow}>
            {currentLevel.animals.map((animal, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.animalCard}
                activeOpacity={0.7}
                onPress={() => soundManager.speak(`${animal.nameVi}! ${animal.fact}`, 'vi')}
              >
                <Text style={styles.animalCardEmoji}>{animal.emoji}</Text>
                <Text style={[styles.animalCardName, { color: currentContinent.headerColor }]}>{animal.nameVi}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Scene Center */}
          <View style={styles.sceneCenter}>
            <Animated.Text style={[styles.sceneBigEmoji, { transform: [{ scale: ariBounce }] }]}>
              {currentLevel.sceneEmoji}
            </Animated.Text>

            {/* Ari flying */}
            <Animated.View style={[styles.ariFlying, { transform: [{ scale: ariScale }, { rotate: ariRotate }] }]}>
              <Text style={styles.ariFlyingEmoji}>🦅</Text>
              <Text style={styles.ariFlyingLabel}>🧣</Text>
            </Animated.View>

            {/* Heart */}
            <Animated.Text style={[styles.heartReaction, { transform: [{ scale: heartScale }], opacity: heartScale }]}>💖</Animated.Text>

            {/* Star popup */}
            <Animated.View style={[styles.starPopup, { transform: [{ scale: starPop }, { translateY: starPop.interpolate({ inputRange: [0, 1], outputRange: [20, -10] }) }], opacity: starPop }]}>
              <Text style={styles.starPopupText}>+1 ⭐</Text>
            </Animated.View>

            {/* Floating emojis */}
            {floatingEmojis.map((item) => {
              const anim = floatAnims.current.get(item.id);
              if (!anim) return null;
              return (
                <Animated.Text
                  key={item.id}
                  style={[styles.floatingEmoji, {
                    left: item.x,
                    transform: [
                      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -180] }) },
                      { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1.2, 0.3] }) },
                    ],
                    opacity: anim.interpolate({ inputRange: [0, 0.3, 0.8, 1], outputRange: [0, 1, 0.8, 0] }),
                  }]}
                >{item.emoji}</Animated.Text>
              );
            })}
          </View>
        </View>

        {/* Step Action Button */}
        {currentStep && (
          <Animated.View style={{ transform: [{ scale: stepBounce }] }}>
            <TouchableOpacity
              style={[styles.stepActionBtn, { backgroundColor: currentContinent.bgStart, borderColor: currentContinent.headerColor }]}
              activeOpacity={0.7}
              onPress={handleStepAction}
            >
              <Text style={styles.stepActionEmoji}>{currentStep.emoji}</Text>
              <Text style={[styles.stepActionText, { color: currentContinent.headerColor }]}>{currentStep.instruction}</Text>
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
      <Text style={styles.completeEmojis}>🎉 🦅 ⭐</Text>
      <Text style={styles.completeTitle}>BÉ GIỎI QUÁ!</Text>
      <Text style={styles.completeSubtitle}>
        Bé đã khám phá "{currentLevel.nameVi}"!
      </Text>
      <Text style={styles.completeStars}>+{currentLevel.starsReward} ⭐ | Tổng: {totalStars} ⭐</Text>

      {/* Passport stamp */}
      <View style={styles.completeStamp}>
        <Text style={styles.completeStampLabel}>🛂 Stamp mới trong hộ chiếu:</Text>
        <Text style={styles.completeStampEmoji}>{currentLevel.stampEmoji}</Text>
        <Text style={styles.completeStampName}>{currentContinent.nameVi}</Text>
      </View>

      {/* Animals met */}
      <View style={styles.completeAnimals}>
        <Text style={styles.completeAnimalsLabel}>Bạn thú đã gặp:</Text>
        <View style={styles.completeAnimalsRow}>
          {currentLevel.animals.map((a, idx) => (
            <View key={idx} style={styles.completeAnimalCard}>
              <Text style={styles.completeAnimalEmoji}>{a.emoji}</Text>
              <Text style={styles.completeAnimalName}>{a.nameVi}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.completeBtnRow}>
        <TouchableOpacity style={[styles.completeBtn, { backgroundColor: '#FF9800' }]} onPress={() => setCurrentView('globe')} activeOpacity={0.8}>
          <Text style={styles.completeBtnText}>🌍 Bản Đồ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.completeBtn, { backgroundColor: '#4CAF50' }]} onPress={handleNextLevel} activeOpacity={0.8}>
          <Text style={styles.completeBtnText}>✈️ Bay Tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ══════════════════════════════════════════
  // RENDER: Passport View
  // ══════════════════════════════════════════
  const renderPassport = () => (
    <View style={styles.passportView}>
      <Text style={styles.passportViewTitle}>🛂 HỘ CHIẾU CỦA BÉ</Text>
      <Text style={styles.passportViewSubtitle}>Nhà Thám Hiểm Thế Giới</Text>

      <View style={styles.passportStampGrid}>
        {CONTINENTS.map((continent) => {
          const stamp = passportStamps.find((s) => s.continentId === continent.id);
          return (
            <View
              key={continent.id}
              style={[
                styles.passportStampCard,
                {
                  backgroundColor: stamp ? continent.bgStart : '#E0E0E0',
                  borderColor: stamp ? continent.headerColor : '#BDBDBD',
                },
              ]}
            >
              <Text style={styles.passportStampCardEmoji}>
                {stamp ? stamp.emoji : '❓'}
              </Text>
              <Text style={[styles.passportStampCardName, { color: stamp ? '#FFFFFF' : '#9E9E9E' }]}>
                {continent.nameVi}
              </Text>
              {stamp && <Text style={styles.passportStampCheck}>✅</Text>}
            </View>
          );
        })}
      </View>

      <Text style={styles.passportViewStars}>⭐ Tổng: {totalStars} Sao</Text>

      <TouchableOpacity
        style={[styles.completeBtn, { backgroundColor: '#2196F3', marginTop: 16 }]}
        onPress={() => setCurrentView('globe')}
        activeOpacity={0.8}
      >
        <Text style={styles.completeBtnText}>🌍 Quay Về Bản Đồ</Text>
      </TouchableOpacity>
    </View>
  );

  // ══════════════════════════════════════════
  // RENDER: Main
  // ══════════════════════════════════════════
  const bgColor =
    currentView === 'levelComplete' || currentView === 'passport'
      ? 'rgba(15, 23, 42, 0.92)'
      : currentView === 'globe'
      ? '#E8F6F3'
      : currentContinent.bgStart;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={currentView === 'levelComplete' || currentView === 'passport' ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />

      {/* HEADER */}
      {currentView !== 'levelComplete' && currentView !== 'passport' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={currentView === 'globe' ? onClose : () => setCurrentView('globe')} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: currentView === 'globe' ? '#1B4F72' : currentContinent.headerColor }]}>
              {currentView === 'globe' ? '✕' : '🌍'}
            </Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { color: currentView === 'globe' ? '#1B4F72' : currentContinent.headerColor }]}>
              🦅 Bay Qua Lục Địa
            </Text>
            <Text style={[styles.subtitleText, { color: currentView === 'globe' ? '#5D6D7E' : currentContinent.headerColor + 'AA' }]}>
              ⭐ {totalStars} Sao | 🛂 {passportStamps.length}/7
            </Text>
          </View>
          <TouchableOpacity
            style={styles.soundBtn}
            onPress={() => {
              if (currentView === 'playing') {
                const animalNames = currentLevel.animals.map((a) => a.nameVi).join(', ');
                soundManager.speak(`Bé đang ở ${currentContinent.nameVi}! Có ${animalNames}!`, 'vi');
              } else {
                setCurrentView('passport');
                soundManager.speak(`Hộ chiếu của bé có ${passportStamps.length} stamps!`, 'vi');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.soundBtnText}>{currentView === 'globe' ? '🛂' : '🔊'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MAIN CONTENT */}
      {currentView === 'globe' && renderGlobe()}
      {currentView === 'playing' && renderPlaying()}
      {currentView === 'levelComplete' && renderLevelComplete()}
      {currentView === 'passport' && renderPassport()}
    </SafeAreaView>
  );
};

// ============================================================
// 🎨 STYLES
// ============================================================

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ─── HEADER ───
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 6,
  },
  closeBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  closeBtnText: { fontSize: 22, fontWeight: '900' },
  titleContainer: { alignItems: 'center' },
  titleText: { fontSize: 20, fontWeight: '900' },
  subtitleText: { fontSize: 12, fontWeight: '700', marginTop: 1 },
  soundBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  soundBtnText: { fontSize: 20 },

  // ─── GLOBE ───
  globeContainer: { flex: 1, padding: 16, alignItems: 'center' },
  ariContainer: { alignItems: 'center', marginBottom: 4 },
  ariEmoji: { fontSize: 60 },
  ariName: { fontSize: 14, fontWeight: '900', color: '#B7950B', marginTop: 2 },
  globeTitle: { fontSize: 16, fontWeight: '800', color: '#1B4F72', marginBottom: 8 },
  globeSpinEmoji: { fontSize: 50, marginBottom: 10 },
  continentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingBottom: 10 },
  continentCard: {
    width: '30%', paddingVertical: 14, paddingHorizontal: 8, borderRadius: 18,
    alignItems: 'center', borderWidth: 2.5, elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6,
  },
  continentCardEmoji: { fontSize: 34, marginBottom: 4 },
  continentCardName: { fontSize: 11, fontWeight: '900', textAlign: 'center' },
  continentCompleteBadge: { position: 'absolute', top: 4, right: 4, fontSize: 14 },
  passportBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginTop: 8,
    gap: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4,
  },
  passportIcon: { fontSize: 22 },
  passportText: { fontSize: 13, fontWeight: '800', color: '#1B4F72' },
  passportStamps: { fontSize: 16, marginLeft: 'auto' },

  // ─── PLAYING ───
  playContainer: { flex: 1, padding: 14 },
  playBackBtn: { paddingVertical: 4, paddingHorizontal: 4, alignSelf: 'flex-start', marginBottom: 2 },
  playBackBtnText: { fontSize: 28, fontWeight: '900' },
  playTitle: { fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  stepProgressBar: { height: 8, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginHorizontal: 10 },
  stepProgressFill: { height: '100%', borderRadius: 4 },
  stepProgressText: { fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 3, marginBottom: 6 },
  sceneRoom: {
    flex: 1, borderRadius: 28, padding: 14, overflow: 'hidden',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
  },
  funFactBubble: { backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', elevation: 1 },
  funFactText: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  animalRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10 },
  animalCard: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, elevation: 2 },
  animalCardEmoji: { fontSize: 30 },
  animalCardName: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  sceneCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  sceneBigEmoji: { fontSize: 100 },
  ariFlying: { position: 'absolute', top: 10, right: 10, alignItems: 'center' },
  ariFlyingEmoji: { fontSize: 40 },
  ariFlyingLabel: { fontSize: 16, marginTop: -4 },
  heartReaction: { position: 'absolute', top: 10, right: 60, fontSize: 40 },
  starPopup: { position: 'absolute', top: 5, left: 30, backgroundColor: '#FDE047', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 },
  starPopupText: { fontSize: 16, fontWeight: '900', color: '#92400E' },
  floatingEmoji: { position: 'absolute', fontSize: 28, bottom: 80 },

  // ─── STEP ACTION ───
  stepActionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, paddingHorizontal: 20, borderRadius: 22, borderWidth: 3,
    marginTop: 10, marginHorizontal: 10, elevation: 6,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, gap: 12,
  },
  stepActionEmoji: { fontSize: 36 },
  stepActionText: { fontSize: 15, fontWeight: '900', flex: 1 },

  // ─── LEVEL COMPLETE ───
  completeOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  completeEmojis: { fontSize: 56, marginBottom: 12 },
  completeTitle: { fontSize: 32, fontWeight: '900', color: '#FDE047', textShadowColor: 'rgba(253,224,71,0.4)', textShadowRadius: 10 },
  completeSubtitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 8, textAlign: 'center', lineHeight: 24 },
  completeStars: { color: '#FDE047', fontSize: 18, fontWeight: '900', marginTop: 8 },
  completeStamp: { marginTop: 16, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  completeStampLabel: { color: '#A7F3D0', fontSize: 14, fontWeight: '700' },
  completeStampEmoji: { fontSize: 50, marginTop: 6 },
  completeStampName: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginTop: 4 },
  completeAnimals: { marginTop: 14, alignItems: 'center' },
  completeAnimalsLabel: { color: '#A7F3D0', fontSize: 13, fontWeight: '700' },
  completeAnimalsRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  completeAnimalCard: { alignItems: 'center' },
  completeAnimalEmoji: { fontSize: 36 },
  completeAnimalName: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', marginTop: 2 },
  completeBtnRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  completeBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6 },
  completeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },

  // ─── PASSPORT ───
  passportView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  passportViewTitle: { fontSize: 28, fontWeight: '900', color: '#FDE047', textShadowColor: 'rgba(253,224,71,0.4)', textShadowRadius: 10 },
  passportViewSubtitle: { color: '#A7F3D0', fontSize: 16, fontWeight: '700', marginTop: 6 },
  passportStampGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20 },
  passportStampCard: { width: '28%', paddingVertical: 12, alignItems: 'center', borderRadius: 14, borderWidth: 2 },
  passportStampCardEmoji: { fontSize: 30 },
  passportStampCardName: { fontSize: 10, fontWeight: '800', marginTop: 4 },
  passportStampCheck: { position: 'absolute', top: 2, right: 2, fontSize: 12 },
  passportViewStars: { color: '#FDE047', fontSize: 20, fontWeight: '900', marginTop: 16 },
});

export default ContinentExplorerGameScreen;
