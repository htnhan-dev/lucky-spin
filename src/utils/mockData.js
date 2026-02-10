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
// Cơ cấu: Đặc biệt (6), Nhất (6), Nhì (28), Ba (36), Tư (55)
// Tổng giải: 131
// TRỌNG SỐ NGHỊCH: Giải càng lớn → weight càng THẤP → xác suất càng THẤP
/*
Xác suất mong muốn:
- Đặc biệt: 8%
- Nhất: 17%
- Nhì: 23%
- Ba: 27%
- Tư: 25%
*/

export const SAMPLE_PRIZES = [
  {
    id: "prize-special",
    name: "Giải Đặc Biệt",
    description: "Bao lì xì 1 triệu đồng",
    displayName: "Bao lì xì",
    displayValue: "1 triệu đồng",
    emoji: "🧧",
    icon: "Trophy",
    color: "#FFD700",
    quantity: 6,
    weight: 8,
    tier: 5,
  },
  {
    id: "prize-first",
    name: "Giải Nhất",
    description: "Bao lì xì 500 nghìn đồng",
    displayName: "Bao lì xì",
    displayValue: "500 nghìn",
    emoji: "🧧",
    icon: "Award",
    color: "#C0C0C0",
    quantity: 6,
    weight: 17,
    tier: 4,
  },
  {
    id: "prize-second",
    name: "Giải Nhì",
    description: "Bao lì xì 200 nghìn đồng",
    displayName: "Bao lì xì",
    displayValue: "200 nghìn",
    emoji: "🧧",
    icon: "Medal",
    color: "#CD7F32",
    quantity: 28,
    weight: 23,
    tier: 3,
  },
  {
    id: "prize-third",
    name: "Giải Ba",
    description: "Bao lì xì 100 nghìn đồng",
    displayName: "Bao lì xì",
    displayValue: "100 nghìn",
    emoji: "🧧",
    icon: "Gift",
    color: "#F97316",
    quantity: 36,
    weight: 27,
    tier: 2,
  },
  {
    id: "prize-fourth",
    name: "Giải Tư",
    description: "Bao lì xì 50 nghìn đồng",
    displayName: "Bao lì xì",
    displayValue: "50 nghìn",
    emoji: "🧧",
    icon: "Sparkles",
    color: "#10B981",
    quantity: 55,
    weight: 25,
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
// 🔴 QUAN TRỌNG: CHỈ chọn từ những giải còn hàng >= 4 (đủ để phân bổ cho 4 users)
// Nếu giải nào < 4, sẽ bỏ qua vì không đủ số lượng
export const selectMaxPrizeTier = (prizes, requiredCount = 4) => {
  // CHÚ Ý: requiredCount = số users sẽ được phân bổ trong lượt này
  // Bước 1: ưu tiên những giải có đủ số lượng >= requiredCount
  let candidates = prizes.filter((p) => p.quantity >= requiredCount);

  // Nếu không có giải đủ số lượng, hạ cấp: lấy tất cả giải còn > 0
  if (candidates.length === 0) {
    candidates = prizes.filter((p) => p.quantity > 0);
  }

  if (candidates.length === 0) {
    // Không còn giải nào, fallback trả về tier thấp nhất
    return 1;
  }

  // Tính weight động = baseWeight * (remaining / originalQuantity)
  const dynamicWeights = candidates.map((prize) => {
    const originalPrize = SAMPLE_PRIZES.find((p) => p.id === prize.id);
    const baseWeight = originalPrize?.weight || prize.weight;
    const originalQty = originalPrize?.quantity || prize.quantity || 1;
    const dynamicWeight = baseWeight * (prize.quantity / originalQty);
    return dynamicWeight;
  });

  // If total weight is zero for any reason, fall back to uniform weights
  let totalWeight = dynamicWeights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) {
    for (let i = 0; i < dynamicWeights.length; i++) dynamicWeights[i] = 1;
    totalWeight = dynamicWeights.length;
  }

  let random = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    random -= dynamicWeights[i];
    if (random <= 0) return candidates[i].tier;
  }

  return candidates[candidates.length - 1].tier;
};

// Helper: Chọn giải thưởng thực tế dựa trên giải trần (ceiling)
// Giải thực tế phải <= giải trần
// QUAN TRỌNG: Sử dụng weight động dựa trên số lượng giải còn lại
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

  // 🔴 MỚI: Tính weight động cho mỗi giải
  const dynamicWeights = eligiblePrizes.map((prize) => {
    // Lấy weight gốc từ SAMPLE_PRIZES
    const originalPrize = SAMPLE_PRIZES.find((p) => p.id === prize.id);
    const baseWeight = originalPrize?.weight || prize.weight;
    // Weight động: giảm tỷ lệ theo số lượng còn lại
    const dynamicWeight =
      baseWeight * (prize.quantity / originalPrize?.quantity || 1);
    return dynamicWeight;
  });

  // Tính tổng weight động
  const totalWeight = dynamicWeights.reduce((sum, w) => sum + w, 0);

  // Random trong phạm vi weight
  let random = Math.random() * totalWeight;

  // Chọn giải
  for (let i = 0; i < eligiblePrizes.length; i++) {
    random -= dynamicWeights[i];
    if (random <= 0) {
      return eligiblePrizes[i];
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

// Helper: Phân bổ giải cho users (số lượng users linh hoạt)
// Có thể là 4 users, 3 users (lượt cuối), hoặc số khác
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

  // Phân bổ giải cho users (số lượng linh hoạt)
  const allocations = [];
  const prizesCopy = eligiblePrizes.map((p) => ({ ...p })); // Copy để giảm quantity

  for (let i = 0; i < users.length; i++) {
    // Chọn giải theo weighted random từ những giải còn hàng
    const availablePrizesForThisRound = prizesCopy.filter(
      (p) => p.quantity > 0,
    );

    if (availablePrizesForThisRound.length === 0) {
      // Nếu hết giải trong vòng này, lấy giải thấp nhất
      const fallback = prizesCopy[prizesCopy.length - 1];
      allocations.push({
        user: users[i],
        prize: fallback,
      });
      continue;
    }

    // Tính weight ĐỘNG dựa trên remaining / originalQuantity
    const dynamicWeights = availablePrizesForThisRound.map((prize) => {
      const originalPrize = SAMPLE_PRIZES.find((p) => p.id === prize.id);
      const baseWeight = originalPrize?.weight || prize.weight;
      const originalQty = originalPrize?.quantity || prize.quantity || 1;
      return baseWeight * (prize.quantity / originalQty);
    });

    // Nếu tổng weight bằng 0 (edge case), fallback về uniform weights
    let totalWeight = dynamicWeights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) {
      for (let k = 0; k < dynamicWeights.length; k++) dynamicWeights[k] = 1;
      totalWeight = dynamicWeights.length;
    }

    let random = Math.random() * totalWeight;

    let selectedPrize = null;
    for (let j = 0; j < availablePrizesForThisRound.length; j++) {
      random -= dynamicWeights[j];
      if (random <= 0) {
        selectedPrize = availablePrizesForThisRound[j];
        break;
      }
    }

    // Fallback nếu không chọn được (không nên xảy ra)
    if (!selectedPrize) {
      selectedPrize = availablePrizesForThisRound[0];
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
