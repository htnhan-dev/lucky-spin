// ============================================
// CONSTANTS - LUCKY SPIN SỰ KIỆN CAO CẤP
// ============================================

// Trạng thái game - REDESIGN theo flow mới
export const GAME_STATE = {
  IDLE: "idle", // Chưa bắt đầu - chờ chọn users
  AUTO_PICKING: "auto_picking", // Đang tự động chọn user (animation scroll)
  READY_TO_SPIN: "ready_to_spin", // Đã đủ 4 user, sẵn sàng quay vòng
  SPINNING: "spinning", // Đang quay vòng để chọn giải trần
  PRIZES_ALLOCATED: "prizes_allocated", // Đã phân bổ xong 4 giải, 4 bao shake (chờ mở)
  REVEALING: "revealing", // Đang mở bao để reveal giải
  ROUND_COMPLETE: "round_complete", // Hoàn thành 1 round (đã mở hết 4 bao)
};

// Trạng thái người chơi
export const USER_STATE = {
  WAITING: "waiting",
  SELECTED: "selected",
  WINNER: "winner",
};

// Màu sắc Tết Việt Nam - Truyền thống & Hiện đại
export const COLORS = {
  primary: {
    red: "#C81E1E", // đỏ lì xì
    darkRed: "#8B0000", // đỏ đậm
    gold: "#FFD700", // vàng kim
    lightGold: "#FFECB3", // vàng nhạt highlight
  },

  accent: {
    amber: "#F59E0B", // vàng amber cho highlight
    orange: "#F97316", // cam
  },

  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    dark: "#1F2937",
    gray: "#6B7280",
    lightGray: "#9CA3AF",
  },

  effect: {
    glow: "rgba(255, 215, 0, 0.6)",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
};

// Câu đối Tết Việt Nam
export const TET_GREETINGS = {
  left: "Phúc Lộc Thọ",
  right: "Tài Lộc Đông Đầy",
  top: "CHÚC MỪNG NĂM MỚI",
};

// Cấu hình animation - REDESIGN
export const ANIMATION_CONFIG = {
  autoPickUser: {
    duration: 0.8, // Animation mỗi user được chọn
    delay: 0.5, // Delay giữa các lần chọn
  },
  envelopeReveal: {
    duration: 0.6, // Animation bao lì xì mở
  },
  spin: {
    duration: 6, // FIXED 6s để đảm bảo timing sync chính xác (không còn giật)
    easing: [0.22, 1, 0.36, 1], // Ease out mượt mà: chậm dần tự nhiên như vòng quay thật
    rotations: 15, // 15 vòng quay để tăng độ kịch tính (nhiều vòng hơn)
  },
  winnerHighlight: {
    duration: 1.5, // Highlight người trúng
    delay: 0.3, // Delay sau khi wheel dừng
  },
  confetti: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  },
};

// Cấu hình vòng quay
export const WHEEL_CONFIG = {
  segments: 4,
  radius: 200,
  centerSize: 70,
  strokeWidth: 3,
};

// Vị trí bao lì xì (1 hàng ngang)
export const ENVELOPE_POSITIONS = [0, 1, 2, 3];
