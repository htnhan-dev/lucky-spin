// Test kiểm tra bug: giải hết hàng vẫn xuất hiện

import {
  SAMPLE_PRIZES,
  allocatePrizesForUsers,
  getRandomUsers,
  selectMaxPrizeTier,
  selectPrizeWithinCeiling,
} from "./mockData.js";

// TEST: Kiểm tra giải hết hàng không xuất hiện lại

// Tạo bản copy prizes với giải 50k hết hàng
const testPrizes = SAMPLE_PRIZES.map((p) => ({
  ...p,
  quantity: p.id === "prize-fourth" ? 0 : p.quantity, // Giải Tư (50k) = 0
}));

testPrizes.forEach((p) => {
  // 상태 검사: { name, quantity }
});

// Test 1: selectMaxPrizeTier không quay ra tier 1 (50k) cho lượt 4 users
const maxTier = selectMaxPrizeTier(testPrizes, 4);
const selectedMaxPrize = testPrizes.find((p) => p.tier === maxTier);

// Test 2: selectPrizeWithinCeiling không chọn giải Tư nếu hết hàng
const prizeWithin = selectPrizeWithinCeiling(testPrizes, 1);

// Test 3: Phân bổ giải cho 3 users (lượt cuối)
const users = getRandomUsers(3);
// Test 3: Cho lượt cuối 3 users → requiredCount = 3
const maxTier3 = selectMaxPrizeTier(testPrizes, users.length);
const allocations = allocatePrizesForUsers(users, testPrizes, maxTier3);
allocations.forEach((a, i) => {
  // allocation check
});

const hasExpiredPrize = allocations.some((a) => a.prize.quantity === 0);

// Test 4: 131 users (32 lượt 4 users + 1 lượt 3 users)
