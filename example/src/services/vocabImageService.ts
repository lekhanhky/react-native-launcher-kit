/**
 * Vocab Image Service - Real-World 3D & Photography Edition
 * Cung cấp hình ảnh 3D chân thực đời thật và ảnh chụp studio cô lập cho trẻ em.
 * Đặc điểm:
 * - 100% hình ảnh thực tế ngoài đời (Real-Life Photorealistic Imagery), KHÔNG hoạt hình, KHÔNG cartoon emojis.
 * - Hỗ trợ gói ảnh local siêu nét (Dog, Cat, Lion, Elephant, Apple, Car, Butterfly, Caterpillar, Chameleon).
 * - Kho ảnh thực tế đa dạng cho toàn bộ các danh mục từ vựng (Động vật, Rau củ, Phương tiện, Vũ trụ, Trường học...).
 * - Hỗ trợ ưu tiên link ảnh thực tế tùy biến trên từng thẻ (card.image3dUrl).
 */

import { VocabCard } from '../data/oxfordKidsVocabulary';

// 1. Core Bundled Local 3D Assets (Ultra-fast, zero network latency, 100% offline)
const LOCAL_3D_ASSETS: Record<string, any> = {
  dog: require('../assets/images/dog_3d.jpg'),
  cat: require('../assets/images/cat_3d.jpg'),
  lion: require('../assets/images/lion_3d.jpg'),
  elephant: require('../assets/images/baby_elephant_3d.jpg'),
  tiger: require('../assets/images/tiger_3d.jpg'),
  cow: require('../assets/images/cow_3d.jpg'),
  monkey: require('../assets/images/monkey_3d.jpg'),
  panda: require('../assets/images/panda_3d.jpg'),
  dolphin: require('../assets/images/dolphin_3d.jpg'),
  pig: require('../assets/images/pig_3d.jpg'),
  sheep: require('../assets/images/sheep_3d.jpg'),
  rabbit: require('../assets/images/rabbit_3d.jpg'),
  penguin: require('../assets/images/penguin_3d.jpg'),
  butterfly: require('../assets/images/butterfly_3d.jpg'),
  caterpillar: require('../assets/images/caterpillar_3d.jpg'),
  chameleon: require('../assets/images/chameleon_3d.jpg'),
  apple: require('../assets/images/apple_3d.jpg'),
  car: require('../assets/images/car_3d.jpg'),
};

// 2. Kho hình ảnh thực tế đời thật chuẩn xác (Real-World High-Definition Photography & 3D Realism)
const REAL_WORLD_IMAGE_BY_WORD_ID: Record<string, string> = {
  // --- ĐỘNG VẬT & THÚ CƯNG (ANIMALS & PETS) ---
  dog: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/640px-YellowLabradorLooking_new.jpg',
  cat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg',
  lion: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg',
  elephant: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg',
  monkey: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/640px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg',
  tiger: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/640px-Walking_tiger_female.jpg',
  giraffe: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/640px-Giraffe_Mikumi_National_Park.jpg',
  zebra: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Equus_quagga_burchellii_-_Etosha%2C_2014.jpg/640px-Equus_quagga_burchellii_-_Etosha%2C_2014.jpg',
  kangaroo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kangaroo_Australia_01_11_2008_-_retouch.JPG/640px-Kangaroo_Australia_01_11_2008_-_retouch.JPG',
  bear: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2010-kodiak-bear-1.jpg/640px-2010-kodiak-bear-1.jpg',
  hippo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hippopotamus_amphibius_in_Serengeti.jpg/640px-Hippopotamus_amphibius_in_Serengeti.jpg',
  wolf: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Eurasian_wolf_2.jpg/640px-Eurasian_wolf_2.jpg',
  fox: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg/640px-Fox_-_British_Wildlife_Centre_%2817429406401%29.jpg',
  deer: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/White-tailed_deer.jpg/640px-White-tailed_deer.jpg',
  dolphin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/640px-Tursiops_truncatus_01.jpg',
  whale: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Humpback_Whale_underwater_shot.jpg/640px-Humpback_Whale_underwater_shot.jpg',
  shark: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg',
  penguin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg/640px-South_Shetland-2016-Deception_Island%E2%80%93Chinstrap_penguin_%28Pygoscelis_antarctica%29_04.jpg',
  panda: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/640px-Grosser_Panda.JPG',
  rabbit: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/640px-Oryctolagus_cuniculus_Rcdo.jpg',
  cow: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/640px-Cow_female_black_white.jpg',
  horse: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/640px-Nokota_Horses_cropped.jpg',
  pig: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Sow_with_piglet.jpg/640px-Sow_with_piglet.jpg',
  sheep: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flock_of_sheep.jpg/640px-Flock_of_sheep.jpg',
  chicken: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Male_and_female_chicken_sitting_together.jpg/640px-Male_and_female_chicken_sitting_together.jpg',
  duck: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/640px-Anas_platyrhynchos_male_female_quadrat.jpg',
  owl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Athene_noctua_%28cropped%29.jpg/640px-Athene_noctua_%28cropped%29.jpg',
  eagle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/About_to_Launch_%28260797665%29.jpeg/640px-About_to_Launch_%28260797665%29.jpeg',
  frog: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Rana_temporaria_align1.jpg/640px-Rana_temporaria_align1.jpg',
  turtle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Florida_Box_Turtle_Digon_W3.jpg/640px-Florida_Box_Turtle_Digon_W3.jpg',
  fish: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Clown_fish_in_coral.jpg/640px-Clown_fish_in_coral.jpg',
  octopus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Octopus2.jpg/640px-Octopus2.jpg',
  crab: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Cancer_pagurus.jpg/640px-Cancer_pagurus.jpg',
  bee: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/640px-Apis_mellifera_Western_honey_bee.jpg',
  ant: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ant_Receiving_Honeydew_from_Aphid.jpg/640px-Ant_Receiving_Honeydew_from_Aphid.jpg',
  butterfly: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Monarch_In_May.jpg/640px-Monarch_In_May.jpg',
  caterpillar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Monarch_Butterfly_Caterpillar.jpg/640px-Monarch_Butterfly_Caterpillar.jpg',
  chameleon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Chamaeleo_calyptratus_male.jpg/640px-Chamaeleo_calyptratus_male.jpg',

  // --- TRÁI CÂY & RAU CỦ (FRUITS & VEGETABLES) ---
  apple: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/640px-Red_Apple.jpg',
  banana: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/640px-Bananas.jpg',
  orange: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/640px-Orange-Fruit-Pieces.jpg',
  mango: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/640px-Hapus_Mango.jpg',
  watermelon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Watermelon_cross_section.jpg/640px-Watermelon_cross_section.jpg',
  strawberry: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/640px-PerfectStrawberry.jpg',
  grape: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Table_grapes_on_white.jpg/640px-Table_grapes_on_white.jpg',
  pineapple: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/640px-Pineapple_and_cross_section.jpg',
  coconut: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Coconut_on_white_background.jpg/640px-Coconut_on_white_background.jpg',
  peach: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Autumn_Red_peaches.jpg/640px-Autumn_Red_peaches.jpg',
  lemon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Lemon.jpg/640px-Lemon.jpg',
  carrot: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/13-08-31-wien-redaktionstreffen-n3-by-RalfR-088.jpg/640px-13-08-31-wien-redaktionstreffen-n3-by-RalfR-088.jpg',
  tomato: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/640px-Tomato_je.jpg',
  potato: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/640px-Patates.jpg',
  broccoli: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/640px-Broccoli_and_cross_section_edit.jpg',
  cucumber: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Curcumis_sativus.jpg/640px-Curcumis_sativus.jpg',
  corn: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Corncobs.jpg/640px-Corncobs.jpg',
  onion: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/640px-Onion_on_White.JPG',
  mushroom: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/ChampignonMushroom.jpg/640px-ChampignonMushroom.jpg',
  pumpkin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Cucurbita_pepo_2011_G1.jpg/640px-Cucurbita_pepo_2011_G1.jpg',

  // --- PHƯƠNG TIỆN GIAO THÔNG (VEHICLES & TRANSPORT) ---
  car: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_W222_Fl_1X7A6242.jpg/640px-Mercedes-Benz_W222_Fl_1X7A6242.jpg',
  bus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/LT_471_%28LTZ_1471%29_Arriva_London_New_Routemaster_%2819596399273%29.jpg/640px-LT_471_%28LTZ_1471%29_Arriva_London_New_Routemaster_%2819596399273%29.jpg',
  bicycle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Left_side_of_Flying_Pigeon.jpg/640px-Left_side_of_Flying_Pigeon.jpg',
  train: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/British_Rail_Class_390_390112_Virgin_Pioneer_at_Carlisle.jpg/640px-British_Rail_Class_390_390112_Virgin_Pioneer_at_Carlisle.jpg',
  airplane: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Air_France_A380_F-HPJA_landing_at_Washington_Dulles.jpg/640px-Air_France_A380_F-HPJA_landing_at_Washington_Dulles.jpg',
  helicopter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/EC-135_P2%2B_D-HZSK_Luftrettung_Christoph_2.jpg/640px-EC-135_P2%2B_D-HZSK_Luftrettung_Christoph_2.jpg',
  rocket: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/STS120_launch.jpg/640px-STS120_launch.jpg',
  boat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Motorboat_at_Kootenay_Lake.jpg/640px-Motorboat_at_Kootenay_Lake.jpg',
  ship: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Allure_of_the_Seas_%28ship%2C_2010%29_001.jpg/640px-Allure_of_the_Seas_%28ship%2C_2010%29_001.jpg',
  ambulance: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ambulance_du_SAMU_93.JPG/640px-Ambulance_du_SAMU_93.JPG',
  firetruck: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Emergency-One_Typhoon_pumper_in_Chambly.jpg/640px-Emergency-One_Typhoon_pumper_in_Chambly.jpg',
  fire_truck: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Emergency-One_Typhoon_pumper_in_Chambly.jpg/640px-Emergency-One_Typhoon_pumper_in_Chambly.jpg',
  police_car: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/2013_Ford_Police_Interceptor_%2812260275525%29.jpg/640px-2013_Ford_Police_Interceptor_%2812260275525%29.jpg',
  motorcycle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Norton_Commando_Interstate_1973.jpg/640px-Norton_Commando_Interstate_1973.jpg',
  truck: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Kenworth_W900_semi-truck.jpg/640px-Kenworth_W900_semi-truck.jpg',
  tractor: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Fendt_936_Vario.jpg/640px-Fendt_936_Vario.jpg',

  // --- VŨ TRỤ & TỰ NHIÊN (NATURE & SPACE) ---
  sun: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/640px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
  moon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/640px-FullMoon2010.jpg',
  star: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Starsinthesky.jpg/640px-Starsinthesky.jpg',
  earth: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/640px-The_Earth_seen_from_Apollo_17.jpg',
  planet: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/640px-Saturn_during_Equinox.jpg',
  saturn: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/640px-Saturn_during_Equinox.jpg',
  mountain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp-1997.jpg/640px-Everest_North_Face_toward_Base_Camp-1997.jpg',
  ocean: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Wave_crop.jpg/640px-Wave_crop.jpg',
  volcano: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Augustine_Volcano_Jan_12_2006.jpg/640px-Augustine_Volcano_Jan_12_2006.jpg',
  rainbow: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Double-alaskan-rainbow.jpg/640px-Double-alaskan-rainbow.jpg',
  cloud: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Cumulus_clouds_in_fair_weather.jpeg/640px-Cumulus_clouds_in_fair_weather.jpeg',
  rain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Rain_drops_on_window_02_2008.jpg/640px-Rain_drops_on_window_02_2008.jpg',
  snow: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Schneeflocke.jpg/640px-Schneeflocke.jpg',
  tree: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Ash_Tree_-_geograph.org.uk_-_590710.jpg/640px-Ash_Tree_-_geograph.org.uk_-_590710.jpg',
  flower: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rosa_Precious_platinum.jpg/640px-Rosa_Precious_platinum.jpg',

  // --- HỌC TẬP & ĐỒ VẬT HÀNG NGÀY (SCHOOL & EVERYDAY) ---
  book: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/640px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg',
  pencil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pencil_isolated.jpg/640px-Pencil_isolated.jpg',
  backpack: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mochila.JPG/640px-Mochila.JPG',
  clock: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Alarm_Clock.jpg/640px-Alarm_Clock.jpg',
  camera: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Canon_EOS_400D_18-55.jpg/640px-Canon_EOS_400D_18-55.jpg',
  microscope: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Compound_microscope_with_digital_camera.jpg/640px-Compound_microscope_with_digital_camera.jpg',
  telescope: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Telescope_at_the_Observatory_Astronomico_del_Teide.jpg/640px-Telescope_at_the_Observatory_Astronomico_del_Teide.jpg',
  guitar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GuitareClassique5.png/640px-GuitareClassique5.png',
  piano: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Grand_piano.jpg/640px-Grand_piano.jpg',
  chair: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Side_chair_MET_DP111244.jpg/640px-Side_chair_MET_DP111244.jpg',
  house: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Modern_House_in_Salinas.jpg/640px-Modern_House_in_Salinas.jpg',
  light_bulb: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gluehlampe_01_KMJ.png/640px-Gluehlampe_01_KMJ.png',
  umbrella: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Umbrella.jpg/640px-Umbrella.jpg',
  doctor: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Dr_Naresh_Trehan_with_his_patient.jpg/640px-Dr_Naresh_Trehan_with_his_patient.jpg',
  soccer: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Soccerball.svg/640px-Soccerball.svg.png',
  water: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Wave_crop.jpg/640px-Wave_crop.jpg',
};

// Map biểu tượng hoặc ID danh mục sang từ khóa hình ảnh thực tế
const CATEGORY_ICON_MAP: Record<string, string> = {
  // Emojis from categories
  '🦁': 'lion',
  '🍎': 'apple',
  '🚗': 'car',
  '🎒': 'backpack',
  '🏠': 'house',
  '👤': 'doctor',
  '🎨': 'pencil',
  '👕': 'backpack',
  '🍕': 'apple',
  '👨‍👩‍👧': 'house',
  '👨‍⚕️': 'doctor',
  '😃': 'dog',
  '🏃': 'car',
  '🪐': 'saturn',
  '🐛': 'caterpillar',
  '🧸': 'cat',
  '⚽': 'soccer',
  '⛅': 'cloud',
  '🛋️': 'chair',
  '🏖️': 'ocean',
  '🧼': 'water',
  '🎪': 'lion',
  '🎃': 'pumpkin',
  '🎵': 'guitar',
  '🧭': 'mountain',
  '📅': 'clock',
  '🏥': 'doctor',
  '🐙': 'octopus',
  '🔬': 'microscope',
  '⚖️': 'telescope',
  // Category IDs
  'animals': 'lion',
  'fruits_veggies': 'apple',
  'vehicles': 'car',
  'school': 'backpack',
  'house': 'house',
  'space': 'saturn',
  'bugs': 'butterfly',
  'nature': 'tree',
  'sea_animals': 'dolphin',
  'science': 'microscope',
};

export interface WordVisualResult {
  localAsset?: any;
  remote3dUrl?: string;
  emoji: string;
  is3d: boolean;
  isRealLife: boolean;
}

export const vocabImageService = {
  /**
   * Truy xuất tài nguyên hình ảnh thực tế chất lượng cao cho thẻ từ vựng:
   * 1. Ưu tiên 1: card.image3dUrl nếu thẻ có link ảnh thực tế riêng.
   * 2. Ưu tiên 2: Ảnh 3D thực tế đóng gói cục bộ (Offline local bundled assets).
   * 3. Ưu tiên 3: Kho ảnh thực tế đời thật (Real-World Photography & 3D Realism CDN).
   * 4. Fallback: Emoji làm placeholder tạm thời khi mạng chưa tải xong.
   */
  getWordVisual(card: VocabCard): WordVisualResult {
    const cleanId = card.id ? card.id.toLowerCase().trim() : '';

    // Check 1: Custom image URL directly defined in card
    if (card.image3dUrl && card.image3dUrl.trim().length > 0) {
      return {
        remote3dUrl: card.image3dUrl,
        emoji: card.emoji,
        is3d: true,
        isRealLife: true,
      };
    }

    // Check 2: Local bundled realistic 3D asset
    if (LOCAL_3D_ASSETS[cleanId]) {
      return {
        localAsset: LOCAL_3D_ASSETS[cleanId],
        emoji: card.emoji,
        is3d: true,
        isRealLife: true,
      };
    }

    // Check 3: Real-World authentic photograph / 3D realistic render
    if (REAL_WORLD_IMAGE_BY_WORD_ID[cleanId] && REAL_WORLD_IMAGE_BY_WORD_ID[cleanId].length > 0) {
      return {
        remote3dUrl: REAL_WORLD_IMAGE_BY_WORD_ID[cleanId],
        emoji: card.emoji,
        is3d: true,
        isRealLife: true,
      };
    }

    // Fallback
    return {
      emoji: card.emoji || '⭐',
      is3d: false,
      isRealLife: false,
    };
  },

  /**
   * Trả về link ảnh thực tế đại diện cho chủ đề (Category icon)
   * Nhận vào category icon (emoji) hoặc category ID
   */
  getCategoryRealIcon(iconOrId: string): string | null {
    if (!iconOrId) return null;
    const clean = iconOrId.toLowerCase().trim();
    if (REAL_WORLD_IMAGE_BY_WORD_ID[clean]) {
      return REAL_WORLD_IMAGE_BY_WORD_ID[clean];
    }
    const mappedKey = CATEGORY_ICON_MAP[iconOrId] || CATEGORY_ICON_MAP[clean];
    if (mappedKey && REAL_WORLD_IMAGE_BY_WORD_ID[mappedKey]) {
      return REAL_WORLD_IMAGE_BY_WORD_ID[mappedKey];
    }
    return null;
  },

  /**
   * Backward-compatibility alias cho getCategoryRealIcon
   */
  getCategory3DIcon(iconOrId: string): string | null {
    return this.getCategoryRealIcon(iconOrId);
  },
};

