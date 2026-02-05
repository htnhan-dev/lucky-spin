// ============================================
// DỮ LIỆU MẪU - LUCKY SPIN SỰ KIỆN TẾT
// ============================================

// Danh sách người tham gia sự kiện (100 người để test scroll)
const firstNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Vũ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Ngô",
  "Dương",
  "Lý",
];
const middleNames = [
  "Văn",
  "Thị",
  "Hoàng",
  "Minh",
  "Thanh",
  "Hữu",
  "Đức",
  "Quang",
  "Hồng",
  "Kim",
];
const lastNames = [
  "An",
  "Bình",
  "Cường",
  "Dung",
  "Em",
  "Phương",
  "Giang",
  "Hà",
  "Hùng",
  "Lan",
  "Minh",
  "Nga",
  "Oanh",
  "Phúc",
  "Quân",
  "Sơn",
  "Tâm",
  "Uyên",
  "Vân",
  "Xuân",
  "Yến",
  "Đạt",
  "Linh",
  "Tuấn",
  "Thảo",
];

export const SAMPLE_USERS = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `${firstNames[i % firstNames.length]} ${middleNames[i % middleNames.length]} ${lastNames[i % lastNames.length]}`,
  avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  department: [
    "Kinh Doanh",
    "Marketing",
    "Công Nghệ",
    "Nhân Sự",
    "Tài Chính",
    "Vận Hành",
  ][i % 6],
}));

// Danh sách giải thưởng theo yêu cầu
// Cơ cấu: Đặc biệt (6), Nhất (6), Nhì (28), Ba (36), Tư (60)
// TRỌNG SỐ NGHỊCH: Giải càng lớn → weight càng THẤP → xác suất càng THẤP
export const SAMPLE_PRIZES = [
  {
    id: "prize-special",
    name: "Giải Đặc Biệt",
    description: "iPhone 16 Pro Max",
    icon: "Trophy",
    color: "#FFD700",
    quantity: 6,
    weight: 1, // Xác suất thấp nhất
    tier: 5, // Tier cao nhất (dùng cho max prize ceiling)
  },
  {
    id: "prize-first",
    name: "Giải Nhất",
    description: "MacBook Air M3",
    icon: "Award",
    color: "#C0C0C0",
    quantity: 6,
    weight: 2, // Xác suất thấp
    tier: 4,
  },
  {
    id: "prize-second",
    name: "Giải Nhì",
    description: "iPad Air 2024",
    icon: "Medal",
    color: "#CD7F32",
    quantity: 28,
    weight: 5, // Xác suất trung bình
    tier: 3,
  },
  {
    id: "prize-third",
    name: "Giải Ba",
    description: "Apple Watch SE",
    icon: "Gift",
    color: "#F97316",
    quantity: 36,
    weight: 10, // Xác suất cao
    tier: 2,
  },
  {
    id: "prize-fourth",
    name: "Giải Tư",
    description: "Voucher 500K",
    icon: "Sparkles",
    color: "#10B981",
    quantity: 60,
    weight: 20, // Xác suất cao nhất
    tier: 1,
  },
];

// Helper: Lấy ngẫu nhiên users
export const getRandomUsers = (count = 4) => {
  const shuffled = [...SAMPLE_USERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper: Chọn giải TRẦN từ vòng quay (max prize ceiling)
// Vòng quay chỉ định giải cao nhất có thể trúng trong lượt này
export const selectMaxPrizeTier = (prizes) => {
  // Tính tổng weight
  const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);

  // Random số từ 0 đến totalWeight
  let random = Math.random() * totalWeight;

  // Duyệt qua từng giải để tìm giải trần
  for (const prize of prizes) {
    random -= prize.weight;
    if (random <= 0) {
      return prize.tier; // Trả về tier của giải (1-5)
    }
  }

  // Fallback: trả về tier thấp nhất
  return 1;
};

// Helper: Chọn giải thưởng thực tế dựa trên giải trần (ceiling)
// Giải thực tế phải <= giải trần
export const selectPrizeWithinCeiling = (prizes, maxTier) => {
  // Lọc các giải có tier <= maxTier (không vượt trần)
  const eligiblePrizes = prizes.filter(
    (p) => p.tier <= maxTier && p.quantity > 0,
  );

  if (eligiblePrizes.length === 0) {
    // Nếu không còn giải nào, lấy giải thấp nhất còn lại
    const remaining = prizes.filter((p) => p.quantity > 0);
    return remaining[remaining.length - 1] || prizes[prizes.length - 1];
  }

  // Tính tổng weight của các giải đủ điều kiện
  const totalWeight = eligiblePrizes.reduce(
    (sum, prize) => sum + prize.weight,
    0,
  );

  // Random trong phạm vi weight
  let random = Math.random() * totalWeight;

  // Chọn giải
  for (const prize of eligiblePrizes) {
    random -= prize.weight;
    if (random <= 0) {
      return prize;
    }
  }

  // Fallback: trả về giải đầu tiên đủ điều kiện
  return eligiblePrizes[0];
};

// Helper: Reset số lượng giải thưởng
export const resetPrizes = () => {
  return SAMPLE_PRIZES.map((prize) => ({
    ...prize,
    remaining: prize.quantity,
  }));
};

// Helper: Phân bổ 4 giải cho 4 users dựa trên giải trần
export const allocatePrizesForUsers = (users, prizes, maxTier) => {
  // Lọc các giải có tier <= maxTier và còn số lượng
  const eligiblePrizes = prizes.filter(
    (p) => p.tier <= maxTier && p.quantity > 0,
  );

  if (eligiblePrizes.length === 0) {
    // Fallback: nếu không còn giải nào, lấy giải thấp nhất còn lại
    const remaining = prizes.filter((p) => p.quantity > 0);
    const fallbackPrize =
      remaining[remaining.length - 1] || prizes[prizes.length - 1];
    return users.map((user) => ({ user, prize: fallbackPrize }));
  }

  // Phân bổ 4 giải cho 4 users
  const allocations = [];
  const prizesCopy = eligiblePrizes.map((p) => ({ ...p })); // Copy để giảm quantity

  for (let i = 0; i < users.length; i++) {
    // Chọn giải theo weighted random
    const totalWeight = prizesCopy.reduce(
      (sum, p) => sum + (p.quantity > 0 ? p.weight : 0),
      0,
    );
    let random = Math.random() * totalWeight;

    let selectedPrize = null;
    for (const prize of prizesCopy) {
      if (prize.quantity > 0) {
        random -= prize.weight;
        if (random <= 0) {
          selectedPrize = prize;
          break;
        }
      }
    }

    // Fallback nếu không chọn được
    if (!selectedPrize) {
      selectedPrize = prizesCopy.find((p) => p.quantity > 0) || prizesCopy[0];
    }

    allocations.push({
      user: users[i],
      prize: selectedPrize,
    });

    // Giảm quantity (trong copy, không ảnh hưởng state gốc)
    selectedPrize.quantity = Math.max(0, selectedPrize.quantity - 1);
  }

  return allocations;
};
