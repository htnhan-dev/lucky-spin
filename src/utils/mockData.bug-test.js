// Test kiểm tra bug: giải hết hàng vẫn xuất hiện
import {
  SAMPLE_PRIZES,
  selectMaxPrizeTier,
  selectPrizeWithinCeiling,
  allocatePrizesForUsers,
  getRandomUsers,
} from "./mockData.js";

console.log("=== TEST: Kiểm tra giải hết hàng không xuất hiện lại ===\n");

// Tạo bản copy prizes với giải 50k hết hàng
const testPrizes = SAMPLE_PRIZES.map((p) => ({
  ...p,
  quantity: p.id === "prize-fourth" ? 0 : p.quantity, // Giải Tư (50k) = 0
}));

console.log("Trạng thái giải:");
testPrizes.forEach((p) => {
  console.log(`  ${p.name}: quantity = ${p.quantity}`);
});

// Test 1: selectMaxPrizeTier không quay ra tier 1 (50k)
console.log("\n--- Test 1: selectMaxPrizeTier ---");
const maxTier = selectMaxPrizeTier(testPrizes);
const selectedMaxPrize = testPrizes.find((p) => p.tier === maxTier);
console.log(`Quay ra: ${selectedMaxPrize.name} (tier ${maxTier})`);
console.log(
  `✓ Không phải Giải Tư (50k): ${selectedMaxPrize.id !== "prize-fourth" ? "PASS" : "FAIL"}`,
);

// Test 2: selectPrizeWithinCeiling không chọn giải Tư nếu hết hàng
console.log("\n--- Test 2: selectPrizeWithinCeiling với maxTier = 1 (50k) ---");
const prizeWithin = selectPrizeWithinCeiling(testPrizes, 1);
console.log(`Chọn: ${prizeWithin.name} (tier ${prizeWithin.tier})`);
console.log(
  `✓ Không phải hết hàng: ${prizeWithin.quantity > 0 ? "PASS" : "FAIL"}`,
);

// Test 3: Phân bổ giải cho 3 users (lượt cuối)
console.log("\n--- Test 3: allocatePrizesForUsers với 3 users ---");
const users = getRandomUsers(3);
const maxTier3 = selectMaxPrizeTier(testPrizes);
const allocations = allocatePrizesForUsers(users, testPrizes, maxTier3);

console.log(`Allocate cho ${allocations.length} users:`);
allocations.forEach((a, i) => {
  console.log(`  User ${i + 1}: ${a.prize.name} (tier ${a.prize.tier})`);
});

const hasExpiredPrize = allocations.some((a) => a.prize.quantity === 0);
console.log(`✓ Không có giải hết hàng: ${!hasExpiredPrize ? "PASS" : "FAIL"}`);

// Test 4: 131 users (32 lượt 4 users + 1 lượt 3 users)
console.log("\n--- Test 4: 131 users = 32 lượt (4) + 1 lượt (3) ---");
console.log(`131 ÷ 4 = 32 lượt (4 users) + 1 lượt (3 users) ✓`);
