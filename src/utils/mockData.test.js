// Test logic giải trần

import { SAMPLE_PRIZES, selectPrizeWithinCeiling } from "./mockData.js";

// Test case 1: Quay ra giải Nhì (tier 3, 200k)
const maxTier = 3; // Nhì

// Lọc giải đủ điều kiện
const eligible = SAMPLE_PRIZES.filter(
  (p) => p.tier <= maxTier && p.quantity > 0,
);

// Test case 2: Quay ra giải Nhất (tier 4, 500k)
const maxTier2 = 4; // Nhất

const eligible2 = SAMPLE_PRIZES.filter(
  (p) => p.tier <= maxTier2 && p.quantity > 0,
);

// Test case 3: Quay ra giải Tư (tier 1, 50k)
const maxTier3 = 1; // Tư

const eligible3 = SAMPLE_PRIZES.filter(
  (p) => p.tier <= maxTier3 && p.quantity > 0,
);
