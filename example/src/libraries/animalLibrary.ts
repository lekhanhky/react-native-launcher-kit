/**
 * Centralized Shared Animal Library (Thư Viện Động Vật Chuẩn Hóa Dùng Chung)
 * Single Source of Truth cho toàn bộ Games và Ứng dụng Giáo dục Trẻ em:
 * - Memory Game (Trí nhớ)
 * - Animal Sound Game (Âm thanh & Tiếng kêu)
 * - Jigsaw Puzzle Game (Ghép hình)
 * - Shadow Matching & Shadow Detective (Bóng động vật & Thám tử)
 * - Oxford Vocabulary 3D Flashcards (Thẻ bài từ vựng)
 *
 * Cung cấp dữ liệu đa tầng:
 * 1. 3D Pixar Animation Local Assets (Offline 100%, 0ms latency)
 * 2. High Definition Studio Photography (Cloud CDN Wikimedia / Unsplash)
 * 3. Fallback Pastel Badge & Big Emoji
 * 4. Bilingual Sound & Speech Service (Tiếng kêu thực tế & Giọng đọc Vi / En)
 */

import { soundManager } from '../components/SoundPlayer';

export type AnimalHabitat =
  | 'farm'        // Nông trại & Gia súc gia cầm
  | 'safari'      // Thảo nguyên & Động vật hoang dã
  | 'ocean'       // Đại dương sâu thẳm
  | 'forest'      // Rừng rậm & Vùng cao
  | 'polar'       // Vùng cực băng giá
  | 'sky_birds'   // Bầu trời & Loài chim
  | 'insects';    // Côn trùng & Bò sát nhỏ

export interface AnimalImageSource {
  local3D?: any;        // require('../assets/images/*_3d.jpg')
  photoHd: string;      // CDN URL ảnh chụp studio sắc nét
  thumbnail: string;    // CDN URL ảnh vuông tối ưu
  colorBg: string;      // Màu nền pastel nhận diện (vd: '#FEF3C7')
}

export interface AnimalSoundProfile {
  sfxUrl?: string;          // Tiếng kêu thực tế (MP3)
  voiceViUrl?: string;      // Giọng đọc tên tiếng Việt
  voiceEnUrl?: string;      // Giọng đọc tên tiếng Anh chuẩn IPA
  soundTextVi: string;      // Phiên âm tiếng kêu: "Gâu gâu!", "Ùm bòoo!"
  soundTextEn: string;      // Phiên âm tiếng kêu En: "Woof woof!", "Moo moo!"
}

export interface AnimalProfile {
  id: string;               // Mã định danh duy nhất (vd: 'dog', 'lion')
  nameVi: string;           // Tên tiếng Việt: "Chú Cún Con"
  nameEn: string;           // Tên tiếng Anh: "Puppy (Dog)"
  phoneticEn: string;       // Phiên âm IPA: "/ˈpʌp.i/"
  emoji: string;            // Biểu tượng cảm xúc: '🐶'
  habitat: AnimalHabitat;   // Phân loại môi trường sống
  habitatNameVi: string;    // "Nông Trại"
  habitatNameEn: string;    // "Farm"
  
  image: AnimalImageSource; // Nguồn hình ảnh 3 tầng
  sound: AnimalSoundProfile; // Âm thanh & Tiếng kêu

  funFactVi: string;        // Kiến thức thú vị cho bé bằng tiếng Việt
  funFactEn: string;        // Kiến thức thú vị bằng tiếng Anh
  exampleVi: string;        // Câu ví dụ tiếng Việt
  exampleEn: string;        // Câu ví dụ tiếng Anh
}

// ---------------------------------------------------------------------------
// 1. KHO TÀI NGUYÊN 3D LOCAL PIXAR (100% Offline, tải tức thì)
// ---------------------------------------------------------------------------
const LOCAL_3D_ASSETS: Record<string, any> = {
  dog: require('../assets/images/dog_3d.jpg'),
  cat: require('../assets/images/cat_3d.jpg'),
  cow: require('../assets/images/cow_3d.jpg'),
  pig: require('../assets/images/pig_3d.jpg'),
  sheep: require('../assets/images/sheep_3d.jpg'),
  lion: require('../assets/images/lion_3d.jpg'),
  elephant: require('../assets/images/baby_elephant_3d.jpg'),
  tiger: require('../assets/images/tiger_3d.jpg'),
  monkey: require('../assets/images/monkey_3d.jpg'),
  panda: require('../assets/images/panda_3d.jpg'),
  dolphin: require('../assets/images/dolphin_3d.jpg'),
  rabbit: require('../assets/images/rabbit_3d.jpg'),
  penguin: require('../assets/images/penguin_3d.jpg'),
  butterfly: require('../assets/images/butterfly_3d.jpg'),
  caterpillar: require('../assets/images/caterpillar_3d.jpg'),
  chameleon: require('../assets/images/chameleon_3d.jpg'),
};

// ---------------------------------------------------------------------------
// 2. DANH MỤC 38 LOÀI ĐỘNG VẬT CHUẨN HÓA (STANDARD ANIMAL CATALOG)
// ---------------------------------------------------------------------------
export const ANIMALS_CATALOG: AnimalProfile[] = [
  // =========================================================================
  // NHÓM 1: NÔNG TRẠI & THÚ CƯNG (FARM & PETS) - 8 loài
  // =========================================================================
  {
    id: 'dog',
    nameVi: 'Chú Cún Con',
    nameEn: 'Puppy Dog',
    phoneticEn: '/ˈpʌp.i dɒɡ/',
    emoji: '🐶',
    habitat: 'farm',
    habitatNameVi: 'Nông Trại & Gia Đình',
    habitatNameEn: 'Farm & Home',
    image: {
      local3D: LOCAL_3D_ASSETS.dog,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/640px-YellowLabradorLooking_new.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/320px-YellowLabradorLooking_new.jpg',
      colorBg: '#FEF3C7', // Pastel Amber
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/dog_barking.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/dog--_us_1.mp3',
      soundTextVi: 'Gâu gâu!',
      soundTextEn: 'Woof woof!',
    },
    funFactVi: 'Cún con có chiếc mũi siêu thính, ngửi mùi giỏi gấp 10.000 lần con người!',
    funFactEn: 'Dogs have an incredible sense of smell, up to 10,000 times stronger than humans!',
    exampleVi: 'Chú cún con vẫy đuôi mừng khi bé đi học về.',
    exampleEn: 'The happy puppy wags its tail when playing in the yard.',
  },
  {
    id: 'cat',
    nameVi: 'Mèo Con Dễ Thương',
    nameEn: 'Kitten Cat',
    phoneticEn: '/ˈkɪt.ən kæt/',
    emoji: '🐱',
    habitat: 'farm',
    habitatNameVi: 'Nông Trại & Gia Đình',
    habitatNameEn: 'Farm & Home',
    image: {
      local3D: LOCAL_3D_ASSETS.cat,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg',
      colorBg: '#FFE4E6', // Pastel Rose
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/cat_meow.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/cat--_us_1.mp3',
      soundTextVi: 'Meo meo!',
      soundTextEn: 'Meow meow!',
    },
    funFactVi: 'Mèo có thể nhảy cao gấp 6 lần chiều cao cơ thể của mình!',
    funFactEn: 'Cats can jump up to 6 times their body height in a single leap!',
    exampleVi: 'Mèo con cuộn tròn ngủ trưa dưới ánh nắng ấm áp.',
    exampleEn: 'The sweet kitten purrs softly while sleeping in the sun.',
  },
  {
    id: 'cow',
    nameVi: 'Bò Sữa',
    nameEn: 'Dairy Cow',
    phoneticEn: '/ˈdeə.ri kaʊ/',
    emoji: '🐮',
    habitat: 'farm',
    habitatNameVi: 'Nông Trại',
    habitatNameEn: 'Farm',
    image: {
      local3D: LOCAL_3D_ASSETS.cow,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/640px-Cow_female_black_white.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/320px-Cow_female_black_white.jpg',
      colorBg: '#E0F2FE', // Pastel Sky
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/cow_moo.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/cow--_us_1.mp3',
      soundTextVi: 'Ùm bòoo!',
      soundTextEn: 'Moo mooo!',
    },
    funFactVi: 'Bò sữa có tận 4 ngăn dạ dày để tiêu hóa cỏ thật tốt đấy!',
    funFactEn: 'Cows have 4 stomach compartments to help them digest grassy plants!',
    exampleVi: 'Cô bò sữa cho bé những ly sữa tươi thơm ngon mỗi ngày.',
    exampleEn: 'The friendly cow gives delicious fresh milk for breakfast.',
  },
  {
    id: 'pig',
    nameVi: 'Heo Con Hồng Hào',
    nameEn: 'Little Piglet',
    phoneticEn: '/ˈlɪt.əl ˈpɪɡ.lət/',
    emoji: '🐷',
    habitat: 'farm',
    habitatNameVi: 'Nông Trại',
    habitatNameEn: 'Farm',
    image: {
      local3D: LOCAL_3D_ASSETS.pig,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Sow_with_piglet.jpg/640px-Sow_with_piglet.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Sow_with_piglet.jpg/320px-Sow_with_piglet.jpg',
      colorBg: '#FCE7F3', // Pastel Pink
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/pig_grunt.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/pig--_us_1.mp3',
      soundTextVi: 'Ủn ỉn!',
      soundTextEn: 'Oink oink!',
    },
    funFactVi: 'Heo rất thông minh và thích tắm bùn mát để bảo vệ làn da khỏi ánh nắng.',
    funFactEn: 'Pigs are exceptionally smart and roll in cool mud to keep their skin healthy.',
    exampleVi: 'Chú heo con có chiếc đuôi xoăn tít trông thật ngộ nghĩnh.',
    exampleEn: 'The little pink piglet has a cute curly tail.',
  },
  {
    id: 'sheep',
    nameVi: 'Cừu Bông',
    nameEn: 'Fluffy Sheep',
    phoneticEn: '/ˈflʌf.i ʃiːp/',
    emoji: '🐑',
    habitat: 'farm',
    habitatNameVi: 'Nông Trại Đồi Cỏ',
    habitatNameEn: 'Meadow Farm',
    image: {
      local3D: LOCAL_3D_ASSETS.sheep,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flock_of_sheep.jpg/640px-Flock_of_sheep.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flock_of_sheep.jpg/320px-Flock_of_sheep.jpg',
      colorBg: '#F3E8FF', // Pastel Purple
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/sheep_bleat.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/sheep--_us_1.mp3',
      soundTextVi: 'Be beee!',
      soundTextEn: 'Baa baaa!',
    },
    funFactVi: 'Lông cừu xoăn bồng bềnh được dùng để đan áo len ấm áp cho mùa đông.',
    funFactEn: 'Sheep grow warm, fluffy wool that is spun into cozy winter sweaters.',
    exampleVi: 'Đàn cừu lông trắng thảnh thơi gặm cỏ xanh trên sườn đồi.',
    exampleEn: 'The woolly sheep grazes peacefully on the green hillside.',
  },
  {
    id: 'rooster',
    nameVi: 'Gà Trống Oai Vệ',
    nameEn: 'Rooster',
    phoneticEn: '/ˈruː.stər/',
    emoji: '🐔',
    habitat: 'farm',
    habitatNameVi: 'Nông Trại',
    habitatNameEn: 'Farm',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Male_and_female_chicken_sitting_together.jpg/640px-Male_and_female_chicken_sitting_together.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Male_and_female_chicken_sitting_together.jpg/320px-Male_and_female_chicken_sitting_together.jpg',
      colorBg: '#FFEDD5', // Pastel Orange
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/rooster_crowing.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/rooster--_us_1.mp3',
      soundTextVi: 'Ò ó o o!',
      soundTextEn: 'Cock-a-doodle-doo!',
    },
    funFactVi: 'Gà trống gáy vang vào mỗi sớm mai để đánh thức cả nông trại thức dậy.',
    funFactEn: 'Roosters crow bright and early to welcome the sunrise and wake the farm.',
    exampleVi: 'Chú gà trống có chiếc mào đỏ rực gáy vang báo trời sáng.',
    exampleEn: 'The proud rooster crows cheerfully as the morning sun rises.',
  },
  {
    id: 'duck',
    nameVi: 'Vịt Con Vàng',
    nameEn: 'Duckling',
    phoneticEn: '/ˈdʌk.lɪŋ/',
    emoji: '🦆',
    habitat: 'farm',
    habitatNameVi: 'Ao Nông Trại',
    habitatNameEn: 'Pond Farm',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/640px-Anas_platyrhynchos_male_female_quadrat.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/320px-Anas_platyrhynchos_male_female_quadrat.jpg',
      colorBg: '#FEF08A', // Soft Yellow
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/duck--_us_1.mp3',
      soundTextVi: 'Cạp cạp!',
      soundTextEn: 'Quack quack!',
    },
    funFactVi: 'Lông vịt có lớp dầu tự nhiên đặc biệt giúp chúng không bao giờ bị ướt khi bơi.',
    funFactEn: 'Duck feathers have a waterproof coating that keeps them warm and dry swimming!',
    exampleVi: 'Bầy vịt con nối đuôi theo mẹ bơi lội dưới làn nước trong.',
    exampleEn: 'The baby ducklings follow their mother swimming across the pond.',
  },
  {
    id: 'horse',
    nameVi: 'Chú Ngựa Nhanh Nhẹn',
    nameEn: 'Horse',
    phoneticEn: '/hɔːs/',
    emoji: '🐴',
    habitat: 'farm',
    habitatNameVi: 'Đồng Cỏ Nông Trại',
    habitatNameEn: 'Grassland Farm',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/640px-Nokota_Horses_cropped.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/320px-Nokota_Horses_cropped.jpg',
      colorBg: '#F1F5F9', // Pastel Slate
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/horse--_us_1.mp3',
      soundTextVi: 'Hí hí!',
      soundTextEn: 'Neigh neigh!',
    },
    funFactVi: 'Ngựa có thể đứng ngủ mà không hề bị ngã nhờ khớp chân đặc biệt!',
    funFactEn: 'Horses can sleep standing up thanks to a special lock mechanism in their legs.',
    exampleVi: 'Chú ngựa phi nước đại trên cánh đồng hoa lộng gió.',
    exampleEn: 'The swift horse gallops freely across the windy field.',
  },

  // =========================================================================
  // NHÓM 2: THẢO NGUYÊN HOANG DÃ (SAFARI & WILD JUNGLE) - 8 loài
  // =========================================================================
  {
    id: 'lion',
    nameVi: 'Sư Tử Chúa',
    nameEn: 'Lion King',
    phoneticEn: '/ˈlaɪ.ən kɪŋ/',
    emoji: '🦁',
    habitat: 'safari',
    habitatNameVi: 'Thảo Nguyên Hoang Dã',
    habitatNameEn: 'Wild Savanna',
    image: {
      local3D: LOCAL_3D_ASSETS.lion,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/320px-Lion_waiting_in_Namibia.jpg',
      colorBg: '#FEF3C7',
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/lion_roar.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/lion--_us_1.mp3',
      soundTextVi: 'Gaooo!',
      soundTextEn: 'Roaaar!',
    },
    funFactVi: 'Tiếng gầm dũng mãnh của sư tử có thể vang xa tới 8 cây số!',
    funFactEn: 'A lion’s mighty roar can be heard from up to 8 kilometers (5 miles) away!',
    exampleVi: 'Sư tử chúa oai phong có bờm vàng rực rỡ đứng trên mỏm đá.',
    exampleEn: 'The brave lion with a golden mane rests on the rock.',
  },
  {
    id: 'elephant',
    nameVi: 'Voi Khổng Lồ',
    nameEn: 'Baby Elephant',
    phoneticEn: '/ˈel.ɪ.fənt/',
    emoji: '🐘',
    habitat: 'safari',
    habitatNameVi: 'Thảo Nguyên Hoang Dã',
    habitatNameEn: 'Wild Savanna',
    image: {
      local3D: LOCAL_3D_ASSETS.elephant,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/320px-African_Bush_Elephant.jpg',
      colorBg: '#E2E8F0', // Soft Gray
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/elephant_trumpet.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/elephant--_us_1.mp3',
      soundTextVi: 'Éc éc!',
      soundTextEn: 'Pawoo! Trumpet!',
    },
    funFactVi: 'Chiếc vòi dài của chú voi có hơn 40.000 bó cơ, vừa hút nước vừa hái quả ngọt.',
    funFactEn: 'An elephant’s versatile trunk contains over 40,000 distinct muscles!',
    exampleVi: 'Bé voi thích dùng vòi phun nước mát rượi lên lưng.',
    exampleEn: 'The baby elephant sprays cool water with its long trunk.',
  },
  {
    id: 'tiger',
    nameVi: 'Hổ Vằn Dũng Mãnh',
    nameEn: 'Tiger',
    phoneticEn: '/ˈtaɪ.ɡər/',
    emoji: '🐯',
    habitat: 'safari',
    habitatNameVi: 'Rừng Nhiệt Đới & Thảo Nguyên',
    habitatNameEn: 'Jungle & Safari',
    image: {
      local3D: LOCAL_3D_ASSETS.tiger,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/640px-Walking_tiger_female.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/320px-Walking_tiger_female.jpg',
      colorBg: '#FFEDD5', // Pastel Orange
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/tiger_growl.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/tiger--_us_1.mp3',
      soundTextVi: 'Gầm gừ!',
      soundTextEn: 'Growl roar!',
    },
    funFactVi: 'Mỗi chú hổ có bộ sọc vằn duy nhất trên đời, giống hệt dấu vân tay con người.',
    funFactEn: 'Every tiger has a unique pattern of stripes, just like human fingerprints!',
    exampleVi: 'Chú hổ con có đôi mắt to tròn và những vệt sọc đen cam nổi bật.',
    exampleEn: 'The cute tiger cub walks gracefully through the tall grass.',
  },
  {
    id: 'giraffe',
    nameVi: 'Hươu Cao Cổ',
    nameEn: 'Giraffe',
    phoneticEn: '/dʒɪˈrɑːf/',
    emoji: '🦒',
    habitat: 'safari',
    habitatNameVi: 'Thảo Nguyên',
    habitatNameEn: 'Savanna',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/640px-Giraffe_Mikumi_National_Park.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/320px-Giraffe_Mikumi_National_Park.jpg',
      colorBg: '#FEF3C7',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/giraffe--_us_1.mp3',
      soundTextVi: 'Thầm lặng',
      soundTextEn: 'Gentle hum',
    },
    funFactVi: 'Hươu cao cổ là động vật cao nhất trên mặt đất, chiếc cổ dài giúp hái ngọn lá non.',
    funFactEn: 'Giraffes are the tallest land animals; their long necks easily reach high branches.',
    exampleVi: 'Chú hươu cao cổ vươn cổ thưởng thức những chiếc lá ngon ngọt trên ngọn cây.',
    exampleEn: 'The gentle giraffe eats tender green leaves from high trees.',
  },
  {
    id: 'zebra',
    nameVi: 'Ngựa Vằn Tinh Nghịch',
    nameEn: 'Zebra',
    phoneticEn: '/ˈzeb.rə/',
    emoji: '🦓',
    habitat: 'safari',
    habitatNameVi: 'Thảo Nguyên',
    habitatNameEn: 'Savanna',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Equus_quagga_burchellii_-_Etosha%2C_2014.jpg/640px-Equus_quagga_burchellii_-_Etosha%2C_2014.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Equus_quagga_burchellii_-_Etosha%2C_2014.jpg/320px-Equus_quagga_burchellii_-_Etosha%2C_2014.jpg',
      colorBg: '#F1F5F9',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/zebra--_us_1.mp3',
      soundTextVi: 'Khịt khịt!',
      soundTextEn: 'Barking neigh!',
    },
    funFactVi: 'Những sọc đen trắng của ngựa vằn làm rối mắt muỗi mòng, giúp chúng không bị đốt.',
    funFactEn: 'Zebra stripes confuse biting flies and help them stay cool under the hot sun.',
    exampleVi: 'Đàn ngựa vằn chạy đua vui vẻ trên đồng cỏ bao la.',
    exampleEn: 'The zebra runs happily alongside its herd on the plain.',
  },
  {
    id: 'monkey',
    nameVi: 'Khỉ Nhanh Nhẹn',
    nameEn: 'Playful Monkey',
    phoneticEn: '/ˈpleɪ.fəl ˈmʌŋ.ki/',
    emoji: '🐒',
    habitat: 'safari',
    habitatNameVi: 'Rừng Nhiệt Đới',
    habitatNameEn: 'Tropical Forest',
    image: {
      local3D: LOCAL_3D_ASSETS.monkey,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/640px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/320px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg',
      colorBg: '#FEF9C3', // Soft Amber Yellow
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/monkey_chatter.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/monkey--_us_1.mp3',
      soundTextVi: 'Khẹc khẹc!',
      soundTextEn: 'Ooh-aah!',
    },
    funFactVi: 'Khỉ dùng chiếc đuôi dẻo dai như cánh tay thứ năm để chuyền cành thoăn thoắt.',
    funFactEn: 'Monkeys use their dexterous tails like a fifth hand to swing between tree branches.',
    exampleVi: 'Chú khỉ con thích chuyền cành và ăn chuối chín thơm.',
    exampleEn: 'The playful monkey swings from tree to tree eating bananas.',
  },
  {
    id: 'hippo',
    nameVi: 'Hà Mã Múp Míp',
    nameEn: 'Hippo',
    phoneticEn: '/ˈhɪp.oʊ/',
    emoji: '🦛',
    habitat: 'safari',
    habitatNameVi: 'Sông Hồ Thảo Nguyên',
    habitatNameEn: 'Savanna River',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hippopotamus_amphibius_in_Serengeti.jpg/640px-Hippopotamus_amphibius_in_Serengeti.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hippopotamus_amphibius_in_Serengeti.jpg/320px-Hippopotamus_amphibius_in_Serengeti.jpg',
      colorBg: '#E0E7FF', // Indigo Pastel
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/hippopotamus--_us_1.mp3',
      soundTextVi: 'Ầm ầm!',
      soundTextEn: 'Grunt snort!',
    },
    funFactVi: 'Hà mã thích ngâm mình dưới nước cả ngày để giữ cho da luôn ẩm mát.',
    funFactEn: 'Hippos spend most of the daytime resting in cool river waters.',
    exampleVi: 'Bác hà mã bơi lội nhẹ nhàng dưới dòng sông mát lành.',
    exampleEn: 'The friendly hippo relaxes underwater on a sunny afternoon.',
  },
  {
    id: 'kangaroo',
    nameVi: 'Chuột Túi Nhảy Xa',
    nameEn: 'Kangaroo',
    phoneticEn: '/ˌkæŋ.ɡəˈruː/',
    emoji: '🦘',
    habitat: 'safari',
    habitatNameVi: 'Đồng Cỏ Nắng Gắt',
    habitatNameEn: 'Outback Bush',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kangaroo_Australia_01_11_2008_-_retouch.JPG/640px-Kangaroo_Australia_01_11_2008_-_retouch.JPG',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kangaroo_Australia_01_11_2008_-_retouch.JPG/320px-Kangaroo_Australia_01_11_2008_-_retouch.JPG',
      colorBg: '#FFEDD5',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/kangaroo--_us_1.mp3',
      soundTextVi: 'Bịch bịch!',
      soundTextEn: 'Thump thump!',
    },
    funFactVi: 'Chuột túi mẹ có chiếc túi ấm áp trước bụng để che chở cho em bé kangaroo.',
    funFactEn: 'Mother kangaroos carry their tiny joey inside a cozy front pouch.',
    exampleVi: 'Chú chuột túi nhảy từng bước thật xa bằng hai chân sau khỏe khoắn.',
    exampleEn: 'The kangaroo hops energetically across the vast grassland.',
  },

  // =========================================================================
  // NHÓM 3: ĐẠI DƯƠNG SÂU THẲM (OCEAN & SEA LIFE) - 6 loài
  // =========================================================================
  {
    id: 'dolphin',
    nameVi: 'Cá Heo Thông Minh',
    nameEn: 'Friendly Dolphin',
    phoneticEn: '/ˈdɒl.fɪn/',
    emoji: '🐬',
    habitat: 'ocean',
    habitatNameVi: 'Đại Dương Xanh',
    habitatNameEn: 'Deep Ocean',
    image: {
      local3D: LOCAL_3D_ASSETS.dolphin,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/640px-Tursiops_truncatus_01.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/320px-Tursiops_truncatus_01.jpg',
      colorBg: '#BAE6FD', // Pastel Sky Cyan
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/dolphin_clicks.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/dolphin--_us_1.mp3',
      soundTextVi: 'Chít chít!',
      soundTextEn: 'Click whistle!',
    },
    funFactVi: 'Cá heo dùng sóng âm siêu âm để trò chuyện và định vị dưới làn nước sâu.',
    funFactEn: 'Dolphins use echolocation clicks and whistles to talk to their pod members!',
    exampleVi: 'Bé cá heo tung mình nhào lộn trên sóng nước trong xanh.',
    exampleEn: 'The playful dolphin leaps happily above the ocean waves.',
  },
  {
    id: 'whale',
    nameVi: 'Cá Voi Xanh Khổng Lồ',
    nameEn: 'Blue Whale',
    phoneticEn: '/bluː weɪl/',
    emoji: '🐋',
    habitat: 'ocean',
    habitatNameVi: 'Đại Dương',
    habitatNameEn: 'Open Ocean',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Humpback_Whale_underwater_shot.jpg/640px-Humpback_Whale_underwater_shot.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Humpback_Whale_underwater_shot.jpg/320px-Humpback_Whale_underwater_shot.jpg',
      colorBg: '#DBEAFE', // Soft Ocean Blue
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/whale--_us_1.mp3',
      soundTextVi: 'Hát dưới biển',
      soundTextEn: 'Whale song',
    },
    funFactVi: 'Cá voi xanh là sinh vật to lớn nhất từng tồn tại trên Trái Đất!',
    funFactEn: 'Blue whales are the largest creatures known to have ever lived on Earth.',
    exampleVi: 'Cá voi phun cột nước trắng xóa vươn cao lên bầu trời đại dương.',
    exampleEn: 'The gentle blue whale spouts a tall stream of water into the air.',
  },
  {
    id: 'shark',
    nameVi: 'Cá Mập Đại Dương',
    nameEn: 'Shark',
    phoneticEn: '/ʃɑːk/',
    emoji: '🦈',
    habitat: 'ocean',
    habitatNameVi: 'Đại Dương',
    habitatNameEn: 'Ocean Depths',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/320px-White_shark.jpg',
      colorBg: '#E0F2FE',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/shark--_us_1.mp3',
      soundTextVi: 'Vút nước!',
      soundTextEn: 'Splash glide!',
    },
    funFactVi: 'Cá mập không có xương như cá thường, toàn bộ khung xương làm bằng sụn mềm dẻo.',
    funFactEn: 'Sharks have no bones; their flexible skeletons are made entirely of cartilage!',
    exampleVi: 'Cá mập bơi lội thoăn thoắt với chiếc vây lưng nổi trên mặt biển.',
    exampleEn: 'The ocean shark glides smoothly through crystal blue waters.',
  },
  {
    id: 'turtle',
    nameVi: 'Rùa Biển Hiền Hòa',
    nameEn: 'Sea Turtle',
    phoneticEn: '/siː ˈtɜː.təl/',
    emoji: '🐢',
    habitat: 'ocean',
    habitatNameVi: 'Rạn San Hô',
    habitatNameEn: 'Coral Reef',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Florida_Box_Turtle_Digon_W3.jpg/640px-Florida_Box_Turtle_Digon_W3.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Florida_Box_Turtle_Digon_W3.jpg/320px-Florida_Box_Turtle_Digon_W3.jpg',
      colorBg: '#DCFCE7', // Soft Emerald Green
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/turtle--_us_1.mp3',
      soundTextVi: 'Thong thả',
      soundTextEn: 'Gentle ripple',
    },
    funFactVi: 'Rùa biển có thể sống hơn 100 năm và bơi qua các đại dương mênh mông.',
    funFactEn: 'Sea turtles can live over a century and swim thousands of miles across oceans.',
    exampleVi: 'Bác rùa biển bơi thong thả bên cạnh những rạn san hô ngũ sắc.',
    exampleEn: 'The sea turtle glides gracefully near colorful coral reefs.',
  },
  {
    id: 'octopus',
    nameVi: 'Bạch Tuộc 8 Râu',
    nameEn: 'Octopus',
    phoneticEn: '/ˈɒk.tə.pəs/',
    emoji: '🐙',
    habitat: 'ocean',
    habitatNameVi: 'Đáy Biển Sâu',
    habitatNameEn: 'Deep Sea Reef',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Octopus2.jpg/640px-Octopus2.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Octopus2.jpg/320px-Octopus2.jpg',
      colorBg: '#FCE7F3', // Soft Coral
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/octopus--_us_1.mp3',
      soundTextVi: 'Phụt mực!',
      soundTextEn: 'Ink swish!',
    },
    funFactVi: 'Bạch tuộc có tận 3 quả tim và có thể đổi màu sắc để hòa vào cảnh vật!',
    funFactEn: 'An octopus has 3 hearts and can change colors and textures instantly!',
    exampleVi: 'Chú bạch tuộc thông minh mở nắp lọ để lấy thức ăn.',
    exampleEn: 'The clever octopus explores the seabed using its eight arms.',
  },
  {
    id: 'fish',
    nameVi: 'Cá Hề Nhỏ Xinh',
    nameEn: 'Clownfish',
    phoneticEn: '/ˈklaʊn.fɪʃ/',
    emoji: '🐠',
    habitat: 'ocean',
    habitatNameVi: 'Rạn San Hô',
    habitatNameEn: 'Coral Reef',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Clown_fish_in_coral.jpg/640px-Clown_fish_in_coral.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Clown_fish_in_coral.jpg/320px-Clown_fish_in_coral.jpg',
      colorBg: '#FFEDD5',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/fish--_us_1.mp3',
      soundTextVi: 'Tung tăng!',
      soundTextEn: 'Splish splash!',
    },
    funFactVi: 'Cá hề làm nhà an toàn bên trong những nhánh hải quỳ ngộ nghĩnh.',
    funFactEn: 'Clownfish live safely among sea anemones, which protect them from larger fish.',
    exampleVi: 'Bé cá hề màu cam sọc trắng bơi lội thoăn thoắt quanh san hô.',
    exampleEn: 'The bright orange clownfish plays merrily around sea anemones.',
  },

  // =========================================================================
  // NHÓM 4: RỪNG RẬM & VÙNG CAO (FOREST & MOUNTAINS) - 6 loài
  // =========================================================================
  {
    id: 'panda',
    nameVi: 'Gấu Trúc Dễ Thương',
    nameEn: 'Baby Panda',
    phoneticEn: '/ˈpæn.də/',
    emoji: '🐼',
    habitat: 'forest',
    habitatNameVi: 'Rừng Trúc Xanh',
    habitatNameEn: 'Bamboo Forest',
    image: {
      local3D: LOCAL_3D_ASSETS.panda,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/640px-Grosser_Panda.JPG',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/320px-Grosser_Panda.JPG',
      colorBg: '#DCFCE7', // Pastel Mint Green
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/panda--_us_1.mp3',
      soundTextVi: 'Nhai rộp rộp!',
      soundTextEn: 'Crunch bamboo!',
    },
    funFactVi: 'Gấu trúc có thể dành tới 12 tiếng mỗi ngày chỉ để ăn lá trúc non ngon lành.',
    funFactEn: 'Giant pandas can spend up to 12 hours a day happily munching on bamboo shoots.',
    exampleVi: 'Bé gấu trúc ôm cành trúc xanh cười tít mắt.',
    exampleEn: 'The adorable baby panda sits peacefully holding fresh green bamboo.',
  },
  {
    id: 'bear',
    nameVi: 'Gấu Nâu Ấm Áp',
    nameEn: 'Brown Bear',
    phoneticEn: '/braʊn beər/',
    emoji: '🐻',
    habitat: 'forest',
    habitatNameVi: 'Rừng Già Núi Cao',
    habitatNameEn: 'Highland Forest',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2010-kodiak-bear-1.jpg/640px-2010-kodiak-bear-1.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2010-kodiak-bear-1.jpg/320px-2010-kodiak-bear-1.jpg',
      colorBg: '#FEF3C7',
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/bear_growl.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/bear--_us_1.mp3',
      soundTextVi: 'Gừ gừ!',
      soundTextEn: 'Growl roar!',
    },
    funFactVi: 'Gấu nâu ngủ đông suốt cả mùa lạnh trong hang đá ấm áp.',
    funFactEn: 'Brown bears hibernate inside cozy dens throughout the cold winter months.',
    exampleVi: 'Chú gấu nâu thích bắt cá hồi và ăn mật ong rừng ngọt lịm.',
    exampleEn: 'The brown bear loves catching fish in clear mountain streams.',
  },
  {
    id: 'fox',
    nameVi: 'Cáo Đỏ Nhanh Trí',
    nameEn: 'Red Fox',
    phoneticEn: '/red fɒks/',
    emoji: '🦊',
    habitat: 'forest',
    habitatNameVi: 'Rừng Thu',
    habitatNameEn: 'Autumn Woods',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg/640px-Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg/320px-Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg',
      colorBg: '#FFEDD5',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/fox--_us_1.mp3',
      soundTextVi: 'Gâu khẽ!',
      soundTextEn: 'Yip bark!',
    },
    funFactVi: 'Chiếc đuôi xù ấm áp của cáo vừa giữ thăng bằng vừa làm chăn đắp khi ngủ.',
    funFactEn: 'A fox’s bushy tail helps with balance and serves as a warm blanket while resting.',
    exampleVi: 'Chú cáo đỏ có đôi tai vểnh lắng nghe tiếng lá rụng trong rừng.',
    exampleEn: 'The clever red fox navigates through autumn leaves with its bushy tail.',
  },
  {
    id: 'wolf',
    nameVi: 'Chó Sói Dũng Cảm',
    nameEn: 'Wolf',
    phoneticEn: '/wʊlf/',
    emoji: '🐺',
    habitat: 'forest',
    habitatNameVi: 'Rừng Sâu & Núi Tuyết',
    habitatNameEn: 'Pine Forest',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/640px-Eurasian_wolf_2.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/320px-Eurasian_wolf_2.jpg',
      colorBg: '#E2E8F0',
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/wolf_howl.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/wolf--_us_1.mp3',
      soundTextVi: 'Hú vang!',
      soundTextEn: 'Awoooo!',
    },
    funFactVi: 'Chó sói sống theo bầy đàn rất đoàn kết và hú vang dưới ánh trăng rằm.',
    funFactEn: 'Wolves live in close family packs and howl together under the moonlight.',
    exampleVi: 'Đầu đàn sói cất tiếng hú vang vọng qua những rặng thông bạt ngàn.',
    exampleEn: 'The noble wolf howls to its pack across the quiet snowy mountain.',
  },
  {
    id: 'deer',
    nameVi: 'Chú Hươu Sao',
    nameEn: 'Spotted Deer',
    phoneticEn: '/ˌspɒt.ɪd dɪər/',
    emoji: '🦌',
    habitat: 'forest',
    habitatNameVi: 'Rừng Xanh',
    habitatNameEn: 'Forest Woods',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/White-tailed_deer.jpg/640px-White-tailed_deer.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/White-tailed_deer.jpg/320px-White-tailed_deer.jpg',
      colorBg: '#FEF3C7',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/deer--_us_1.mp3',
      soundTextVi: 'Thoăn thoắt',
      soundTextEn: 'Gentle rustle',
    },
    funFactVi: 'Hươu đực thay sừng mới mỗi năm, cặp sừng tỏa nhánh như những cành cây.',
    funFactEn: 'Male deer shed and regrow their impressive antlers every single year!',
    exampleVi: 'Chú hươu sao nhẹ nhàng dạo bước trên thảm cỏ xanh mướt.',
    exampleEn: 'The graceful deer leaps lightly across the misty forest meadow.',
  },
  {
    id: 'rabbit',
    nameVi: 'Thỏ Ngọc Trắng',
    nameEn: 'White Bunny',
    phoneticEn: '/waɪt ˈbʌn.i/',
    emoji: '🐰',
    habitat: 'forest',
    habitatNameVi: 'Vườn Hoa & Bìa Rừng',
    habitatNameEn: 'Meadow Garden',
    image: {
      local3D: LOCAL_3D_ASSETS.rabbit,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/640px-Oryctolagus_cuniculus_Rcdo.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/320px-Oryctolagus_cuniculus_Rcdo.jpg',
      colorBg: '#FFE4E6', // Soft Coral Pink
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/rabbit--_us_1.mp3',
      soundTextVi: 'Nhảy nhót!',
      soundTextEn: 'Hop hop!',
    },
    funFactVi: 'Đôi tai dài của thỏ có thể xoay độc lập để nghe thấy mọi âm thanh nhỏ nhất.',
    funFactEn: 'Rabbits can rotate their ears independently up to 270 degrees to detect sounds!',
    exampleVi: 'Bé thỏ trắng ôm củ cà rốt ngon lành nhai nhồm nhoàm.',
    exampleEn: 'The fluffy white bunny nibbles happily on a sweet orange carrot.',
  },

  // =========================================================================
  // NHÓM 5: VÙNG CỰC BĂNG GIÁ (POLAR) - 2 loài
  // =========================================================================
  {
    id: 'penguin',
    nameVi: 'Chim Cánh Cụt',
    nameEn: 'Cute Penguin',
    phoneticEn: '/kjuːt ˈpeŋ.ɡwɪn/',
    emoji: '🐧',
    habitat: 'polar',
    habitatNameVi: 'Nam Cực Băng Giá',
    habitatNameEn: 'Polar Ice',
    image: {
      local3D: LOCAL_3D_ASSETS.penguin,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg/640px-South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg/320px-South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg',
      colorBg: '#BAE6FD', // Pastel Glacier Blue
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/penguin--_us_1.mp3',
      soundTextVi: 'Lạch bạch!',
      soundTextEn: 'Waddle waddle!',
    },
    funFactVi: 'Chim cánh cụt không biết bay trên trời nhưng bơi lội dưới nước nhanh như tên bắn.',
    funFactEn: 'Penguins cannot fly in the air, but they "fly" skillfully through cold polar water!',
    exampleVi: 'Chú cánh cụt bé xíu ngồi trên tảng băng trắng trôi bềnh bồng.',
    exampleEn: 'The baby penguin waddles playfully across the sparkling ice sheet.',
  },
  {
    id: 'polar_bear',
    nameVi: 'Gấu Bắc Cực',
    nameEn: 'Polar Bear',
    phoneticEn: '/ˈpəʊ.lər beər/',
    emoji: '🐻‍❄️',
    habitat: 'polar',
    habitatNameVi: 'Bắc Cực Băng Giá',
    habitatNameEn: 'Arctic Ice',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg/640px-Polar_Bear_-_Alaska_%28cropped%29.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg/320px-Polar_Bear_-_Alaska_%28cropped%29.jpg',
      colorBg: '#E0F2FE',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/polar_bear--_us_1.mp3',
      soundTextVi: 'Gầm gừ tuyết',
      soundTextEn: 'Deep arctic growl',
    },
    funFactVi: 'Lông gấu Bắc Cực thực ra trong suốt không màu, phản chiếu ánh sáng tuyết trắng!',
    funFactEn: 'Polar bear fur is actually clear and translucent, trapping sunlight to keep warm!',
    exampleVi: 'Gấu Bắc Cực bơi lội thoăn thoắt giữa những tảng băng trôi khổng lồ.',
    exampleEn: 'The polar bear walks majestically across the arctic snow.',
  },

  // =========================================================================
  // NHÓM 6: BẦU TRỜ & LOÀI CHIM (SKY & BIRDS) - 4 loài
  // =========================================================================
  {
    id: 'eagle',
    nameVi: 'Đại Bàng Oai Vệ',
    nameEn: 'Eagle',
    phoneticEn: '/ˈiː.ɡəl/',
    emoji: '🦅',
    habitat: 'sky_birds',
    habitatNameVi: 'Bầu Trời & Đỉnh Núi Cao',
    habitatNameEn: 'Sky & Mountain Peak',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/About_to_Launch_%28260797665%29.jpeg/640px-About_to_Launch_%28260797665%29.jpeg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/About_to_Launch_%28260797665%29.jpeg/320px-About_to_Launch_%28260797665%29.jpeg',
      colorBg: '#FEF3C7',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/eagle--_us_1.mp3',
      soundTextVi: 'Réo rắt!',
      soundTextEn: 'Screech scream!',
    },
    funFactVi: 'Mắt đại bàng tinh gấp 5 lần mắt người, nhìn thấy con mồi từ tít trên trời mây.',
    funFactEn: 'Eagles have eyesight up to 5 times sharper than humans, spotting prey miles away.',
    exampleVi: 'Đại bàng dang rộng sải cánh bay lượn trên nền trời xanh thẳm.',
    exampleEn: 'The majestic eagle soars high above the mountain clouds.',
  },
  {
    id: 'owl',
    nameVi: 'Cú Mèo Thông Thái',
    nameEn: 'Wise Owl',
    phoneticEn: '/waɪz aʊl/',
    emoji: '🦉',
    habitat: 'sky_birds',
    habitatNameVi: 'Rừng Đêm',
    habitatNameEn: 'Night Forest',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Athene_noctua_%28cropped%29.jpg/640px-Athene_noctua_%28cropped%29.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Athene_noctua_%28cropped%29.jpg/320px-Athene_noctua_%28cropped%29.jpg',
      colorBg: '#EDE9FE', // Soft Lavender
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/owl--_us_1.mp3',
      soundTextVi: 'Cú cú!',
      soundTextEn: 'Hoot hoot!',
    },
    funFactVi: 'Cú mèo có thể quay đầu tròn tới 270 độ mà không cần cử động thân mình.',
    funFactEn: 'Owls can turn their heads up to 270 degrees without moving their bodies!',
    exampleVi: 'Bác cú mèo chớp chớp đôi mắt to tròn đậu trên cành sồi đêm.',
    exampleEn: 'The wise owl watches over the quiet forest from a tree branch.',
  },
  {
    id: 'parrot',
    nameVi: 'Vẹt Sặc Sỡ',
    nameEn: 'Colorful Parrot',
    phoneticEn: '/ˈkʌl.ə.fəl ˈpær.ət/',
    emoji: '🦜',
    habitat: 'sky_birds',
    habitatNameVi: 'Rừng Nhiệt Đới',
    habitatNameEn: 'Rainforest Canopy',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ara_macao_%28foster_parrots%29-8.jpg/640px-Ara_macao_%28foster_parrots%29-8.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ara_macao_%28foster_parrots%29-8.jpg/320px-Ara_macao_%28foster_parrots%29-8.jpg',
      colorBg: '#DCFCE7',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/parrot--_us_1.mp3',
      soundTextVi: 'Chào bé!',
      soundTextEn: 'Squawk hello!',
    },
    funFactVi: 'Loài vẹt có thể học nhại giọng người và phân biệt nhiều màu sắc khác nhau.',
    funFactEn: 'Parrots are skilled mimics and can learn words, tunes, and human phrases.',
    exampleVi: 'Chú vẹt ngũ sắc đậu trên cành cất tiếng chào bé vui vẻ.',
    exampleEn: 'The bright parrot chirps and repeats playful words.',
  },
  {
    id: 'peacock',
    nameVi: 'Chim Công Lộng Lẫy',
    nameEn: 'Peacock',
    phoneticEn: '/ˈpiː.kɒk/',
    emoji: '🦚',
    habitat: 'sky_birds',
    habitatNameVi: 'Vườn Nhiệt Đới',
    habitatNameEn: 'Tropical Garden',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/640px-Peacock_Plumage.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/320px-Peacock_Plumage.jpg',
      colorBg: '#CCFBF1', // Soft Teal
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/peacock--_us_1.mp3',
      soundTextVi: 'Xòe đuôi hoa',
      soundTextEn: 'Ka-aao call',
    },
    funFactVi: 'Chiếc đuôi của công trống xòe rộng như một chiếc quạt hoa rực rỡ lấp lánh.',
    funFactEn: 'Male peacocks fan out dazzling tail feathers like an enormous colorful fan.',
    exampleVi: 'Chim công xòe đuôi ngũ sắc khiêu vũ dưới ánh ban mai.',
    exampleEn: 'The majestic peacock displays its spectacular patterned feathers.',
  },

  // =========================================================================
  // NHÓM 7: CÔN TRÙNG & BÒ SÁT NHỎ (INSECTS & MINI CREATURES) - 6 loài
  // =========================================================================
  {
    id: 'butterfly',
    nameVi: 'Bướm Xinh Rực Rỡ',
    nameEn: 'Butterfly',
    phoneticEn: '/ˈbʌt.ə.flaɪ/',
    emoji: '🦋',
    habitat: 'insects',
    habitatNameVi: 'Vườn Hoa',
    habitatNameEn: 'Flower Meadow',
    image: {
      local3D: LOCAL_3D_ASSETS.butterfly,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Monarch_Butterfly_In_Garden.jpg/640px-Monarch_Butterfly_In_Garden.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Monarch_Butterfly_In_Garden.jpg/320px-Monarch_Butterfly_In_Garden.jpg',
      colorBg: '#FCE7F3', // Soft Pink
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/butterfly--_us_1.mp3',
      soundTextVi: 'Rập rờn!',
      soundTextEn: 'Flutter flutter!',
    },
    funFactVi: 'Bướm nếm hương vị mật ngọt bằng chính các đầu ngón chân của mình đấy!',
    funFactEn: 'Butterflies actually taste sweet flower nectar using sensors in their feet!',
    exampleVi: 'Chú bướm xinh rập rờn đôi cánh ngũ sắc bên bông hoa thơm ngát.',
    exampleEn: 'The colorful butterfly flutters gently over blooming flowers.',
  },
  {
    id: 'caterpillar',
    nameVi: 'Sâu Bướm Ngộ Nghĩnh',
    nameEn: 'Caterpillar',
    phoneticEn: '/ˈkæt.ə.pɪl.ər/',
    emoji: '🐛',
    habitat: 'insects',
    habitatNameVi: 'Vườn Cây Lá',
    habitatNameEn: 'Garden Leaves',
    image: {
      local3D: LOCAL_3D_ASSETS.caterpillar,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Caterpillar_of_Papilio_machaon.jpg/640px-Caterpillar_of_Papilio_machaon.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Caterpillar_of_Papilio_machaon.jpg/320px-Caterpillar_of_Papilio_machaon.jpg',
      colorBg: '#DCFCE7', // Soft Lime
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/caterpillar--_us_1.mp3',
      soundTextVi: 'Bò ngo ngoe',
      soundTextEn: 'Wiggle wiggle',
    },
    funFactVi: 'Sâu bướm ăn thật nhiều lá non, rồi biến thành kén nhộng và hóa thành bướm xinh.',
    funFactEn: 'A caterpillar eats leaves, forms a chrysalis, and transforms into a butterfly!',
    exampleVi: 'Chú sâu bướm xanh bò ngo ngoe trên chiếc lá non mềm.',
    exampleEn: 'The tiny green caterpillar munches on a fresh green leaf.',
  },
  {
    id: 'chameleon',
    nameVi: 'Tắc Kè Hoa Đổi Màu',
    nameEn: 'Chameleon',
    phoneticEn: '/kəˈmiː.li.ən/',
    emoji: '🦎',
    habitat: 'insects',
    habitatNameVi: 'Cành Cây Rừng',
    habitatNameEn: 'Forest Canopy',
    image: {
      local3D: LOCAL_3D_ASSETS.chameleon,
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Furcifer_pardalis.jpg/640px-Furcifer_pardalis.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Furcifer_pardalis.jpg/320px-Furcifer_pardalis.jpg',
      colorBg: '#D1FAE5', // Soft Mint
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/chameleon--_us_1.mp3',
      soundTextVi: 'Búng lưỡi!',
      soundTextEn: 'Tongue snap!',
    },
    funFactVi: 'Tắc kè hoa có thể phóng chiếc lưỡi siêu dài nhanh hơn cả chớp mắt để bắt mồi.',
    funFactEn: 'A chameleon’s lightning-fast tongue can be twice the length of its body!',
    exampleVi: 'Tắc kè hoa đổi từ màu xanh lá sang vàng cam khi đổi cành cây.',
    exampleEn: 'The chameleon magically shifts color as it climbs onto a new branch.',
  },
  {
    id: 'frog',
    nameVi: 'Chú Ếch Xanh',
    nameEn: 'Green Tree Frog',
    phoneticEn: '/ɡriːn friː frɒɡ/',
    emoji: '🐸',
    habitat: 'insects',
    habitatNameVi: 'Ao Sen & Bờ Nước',
    habitatNameEn: 'Lily Pond',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rana_temporaria_align1.jpg/640px-Rana_temporaria_align1.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rana_temporaria_align1.jpg/320px-Rana_temporaria_align1.jpg',
      colorBg: '#DCFCE7',
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/frog_croaking.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/frog--_us_1.mp3',
      soundTextVi: 'Ộp ộp!',
      soundTextEn: 'Ribbit ribbit!',
    },
    funFactVi: 'Chú ếch có thể thở bằng cả lá phổi lẫn làn da ẩm ướt của mình.',
    funFactEn: 'Frogs can absorb oxygen directly through their smooth, moist skin!',
    exampleVi: 'Chú ếch xanh ngồi trên lá sen cất tiếng ộp ộp đón mưa rào.',
    exampleEn: 'The friendly frog leaps from one lily pad to another.',
  },
  {
    id: 'bee',
    nameVi: 'Ong Chăm Chỉ',
    nameEn: 'Honey Bee',
    phoneticEn: '/ˈhʌn.i biː/',
    emoji: '🐝',
    habitat: 'insects',
    habitatNameVi: 'Vườn Hoa Mật',
    habitatNameEn: 'Flowering Meadow',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/320px-Apis_mellifera_Western_honey_bee.jpg',
      colorBg: '#FEF08A',
    },
    sound: {
      sfxUrl: 'https://actions.google.com/sounds/v1/animals/bee_buzzing.ogg',
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/bee--_us_1.mp3',
      soundTextVi: 'Vo ve!',
      soundTextEn: 'Buzz buzz!',
    },
    funFactVi: 'Ong thợ giao tiếp với các bạn bằng điệu nhảy lắc mông để chỉ đường đến vườn hoa thơm.',
    funFactEn: 'Bees perform an extraordinary "waggle dance" to tell hive mates where nectar is!',
    exampleVi: 'Chú ong chăm chỉ bay lượn từ hoa này sang hoa khác để lấy mật ngọt.',
    exampleEn: 'The busy bee gathers sweet nectar to make delicious golden honey.',
  },
  {
    id: 'crab',
    nameVi: 'Chú Cua Biển',
    nameEn: 'Little Crab',
    phoneticEn: '/ˈlɪt.əl kræb/',
    emoji: '🦀',
    habitat: 'insects',
    habitatNameVi: 'Bãi Biển Cát Vàng',
    habitatNameEn: 'Sandy Beach',
    image: {
      photoHd: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Grapsus_grapsus_Galapagos_Islands.jpg/640px-Grapsus_grapsus_Galapagos_Islands.jpg',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Grapsus_grapsus_Galapagos_Islands.jpg/320px-Grapsus_grapsus_Galapagos_Islands.jpg',
      colorBg: '#FFE4E6',
    },
    sound: {
      voiceEnUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/crab--_us_1.mp3',
      soundTextVi: 'Bò ngang cọc cạch',
      soundTextEn: 'Click-clack scuttle',
    },
    funFactVi: 'Chú cua luôn bò ngang do các khớp chân uốn cong sang hai bên rất linh hoạt.',
    funFactEn: 'Crabs scuttle sideways because their leg joints flex horizontally!',
    exampleVi: 'Chú cua nhỏ giương hai chiếc càng xinh xắn đào hang trên cát biển.',
    exampleEn: 'The little crab scuttles sideways into its cozy sand burrow.',
  },
];

// Map lookup nhanh O(1) theo ID
const ANIMAL_BY_ID_MAP = new Map<string, AnimalProfile>();
ANIMALS_CATALOG.forEach((item) => ANIMAL_BY_ID_MAP.set(item.id.toLowerCase(), item));

// ---------------------------------------------------------------------------
// 3. SERVICE API TRUNG TÂM (CENTRAL SERVICE API)
// ---------------------------------------------------------------------------
export const animalLibrary = {
  /**
   * Lấy toàn bộ danh mục động vật chuẩn hóa
   */
  getAll(): AnimalProfile[] {
    return ANIMALS_CATALOG;
  },

  /**
   * Tìm kiếm động vật theo ID duy nhất (vd: 'dog', 'lion')
   */
  getById(id: string): AnimalProfile | undefined {
    if (!id) return undefined;
    return ANIMAL_BY_ID_MAP.get(id.toLowerCase());
  },

  /**
   * Lọc động vật theo môi trường sinh thái (habitat)
   */
  getByHabitat(habitat: AnimalHabitat): AnimalProfile[] {
    return ANIMALS_CATALOG.filter((item) => item.habitat === habitat);
  },

  /**
   * Lấy thông tin nguồn ảnh 3 tầng cho 1 con vật
   */
  getImageSource(id: string): {
    local3D?: any;
    photoHd: string;
    thumbnail: string;
    fallbackEmoji: string;
    colorBg: string;
  } {
    const animal = this.getById(id);
    if (!animal) {
      return {
        photoHd: '',
        thumbnail: '',
        fallbackEmoji: '🐾',
        colorBg: '#F3F4F6',
      };
    }

    return {
      local3D: animal.image.local3D,
      photoHd: animal.image.photoHd,
      thumbnail: animal.image.thumbnail,
      fallbackEmoji: animal.emoji,
      colorBg: animal.image.colorBg,
    };
  },

  /**
   * Kiểm tra xem con vật có sẵn ảnh 3D local không
   */
  hasLocal3D(id: string): boolean {
    const animal = this.getById(id);
    return Boolean(animal?.image?.local3D);
  },

  /**
   * Danh sách ID của các con vật hiện đã có ảnh 3D Pixar local
   */
  getAvailable3DIds(): string[] {
    return Object.keys(LOCAL_3D_ASSETS);
  },

  /**
   * Lấy ngẫu nhiên N con vật (dùng cho Quiz hoặc Game Mini)
   */
  getRandom(count = 4, excludeIds: string[] = []): AnimalProfile[] {
    const excludeSet = new Set(excludeIds.map((id) => id.toLowerCase()));
    const pool = ANIMALS_CATALOG.filter((item) => !excludeSet.has(item.id.toLowerCase()));
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  /**
   * Tìm kiếm động vật theo tên Vi / En hoặc đặc điểm
   */
  search(query: string): AnimalProfile[] {
    if (!query || !query.trim()) return ANIMALS_CATALOG;
    const q = query.toLowerCase().trim();
    return ANIMALS_CATALOG.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.nameVi.toLowerCase().includes(q) ||
        a.nameEn.toLowerCase().includes(q) ||
        a.sound.soundTextVi.toLowerCase().includes(q) ||
        a.habitatNameVi.toLowerCase().includes(q)
    );
  },

  /**
   * Phát âm thanh / tiếng kêu của con vật
   */
  playSound(id: string, mode: 'sfx' | 'nameVi' | 'nameEn' = 'sfx'): void {
    const animal = this.getById(id);
    if (!animal) return;

    try {
      if (mode === 'sfx') {
        if (animal.sound.sfxUrl) {
          soundManager.play(animal.sound.sfxUrl, animal.sound.soundTextVi);
        } else {
          soundManager.speak(animal.sound.soundTextVi, 'vi');
        }
      } else if (mode === 'nameVi') {
        soundManager.speak(animal.nameVi, 'vi');
      } else if (mode === 'nameEn') {
        if (animal.sound.voiceEnUrl) {
          soundManager.play(animal.sound.voiceEnUrl, animal.nameEn);
        } else {
          soundManager.speak(animal.nameEn, 'en');
        }
      }
    } catch {
      // Fail-safe: không bao giờ để crash app vì lỗi âm thanh
    }
  },
};

export default animalLibrary;
