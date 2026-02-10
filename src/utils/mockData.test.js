// Test logic giải trần

import { SAMPLE_PRIZES, selectPrizeWithinCeiling } from "./mockData.js";

// Test case 1: Quay ra giải Nhì (tier 3, 200k)
console.log("=== TEST: Quay ra giải Nhì (tier 3, 200k) ===");
const maxTier = 3; // Nhì
console.log("Max tier:", maxTier);

// Lọc giải đủ điều kiện
const eligible = SAMPLE_PRIZES.filter(
  (p) => p.tier <= maxTier && p.quantity > 0,
);
console.log("Giải đủ điều kiện:");
eligible.forEach((p) => {
  console.log(`  - ${p.name} (${p.displayValue}, tier ${p.tier})`);
});

console.log("\n✓ Kỳ vọng: Chỉ có Nhì (200k), Ba (100k), Tư (50k)");
console.log("✗ Không được có: Nhất (500k), Đặc biệt (1M)");

// Test case 2: Quay ra giải Nhất (tier 4, 500k)
console.log("\n=== TEST: Quay ra giải Nhất (tier 4, 500k) ===");
const maxTier2 = 4; // Nhất
console.log("Max tier:", maxTier2);

const eligible2 = SAMPLE_PRIZES.filter(
  (p) => p.tier <= maxTier2 && p.quantity > 0,
);
console.log("Giải đủ điều kiện:");
eligible2.forEach((p) => {
  console.log(`  - ${p.name} (${p.displayValue}, tier ${p.tier})`);
});

console.log("\n✓ Kỳ vọng: Nhất (500k), Nhì (200k), Ba (100k), Tư (50k)");
console.log("✗ Không được có: Đặc biệt (1M)");

// Test case 3: Quay ra giải Tư (tier 1, 50k)
console.log("\n=== TEST: Quay ra giải Tư (tier 1, 50k) ===");
const maxTier3 = 1; // Tư
console.log("Max tier:", maxTier3);

const eligible3 = SAMPLE_PRIZES.filter(
  (p) => p.tier <= maxTier3 && p.quantity > 0,
);
console.log("Giải đủ điều kiện:");
eligible3.forEach((p) => {
  console.log(`  - ${p.name} (${p.displayValue}, tier ${p.tier})`);
});

console.log("\n✓ Kỳ vọng: Chỉ có Tư (50k)");
