# Giải Thích Logic Xác Suất Spin Reward

## Xác Suất Mong Muốn (Ban Đầu)
```
- Đặc biệt (tier 5): 8%    → weight: 8
- Nhất (tier 4):     17%   → weight: 17
- Nhì (tier 3):      23%   → weight: 23
- Ba (tier 2):       27%   → weight: 27
- Tư (tier 1):       25%   → weight: 25
────────────────────────
Tổng:                100%   → weight: 100
```

## Công Thức Tính Xác Suất
```
Xác suất(giải X) = weight(X) / tổng_weight * 100%
```

Ví dụ:
- Xác suất(Tư) = 25 / 100 = 25% ✓
- Xác suất(Ba) = 27 / 100 = 27% ✓
- Xác suất(Nhì) = 23 / 100 = 23% ✓
- Xác suất(Nhất) = 17 / 100 = 17% ✓
- Xác suất(Đặc biệt) = 8 / 100 = 8% ✓

## Logic Spin Hiện Tại

### Bước 1: Quay Ra Giải Trần (selectMaxPrizeTier)
**MỚI**: Chỉ quay từ những giải **còn hàng > 3** (quantity > 3)
- Vì 4 bao lì xì sẽ được chia cho 4 users trong lượt quay này
- Nên giải trần phải còn **≥ 4** để đảm bảo đủ

Ví dụ: Nếu giải Ba chỉ còn 3 giải
- Giải Ba **không thể** là giải trần vì 3 ≤ 4 ❌
- Các giải đủ điều kiện: Đặc biệt (6), Nhất (6), Nhì (28), Tư (60)
- Chỉ quay random từ 4 giải này
- Nếu quay ra maxTier ≥ 3 (Ba), sẽ tự động hạ xuống giải thấp hơn

### Bước 2: Chọn Giải Thực Tế (selectPrizeWithinCeiling)
**Quy tắc**: Giải thực tế phải `<= giải trần` và **còn hàng**

Ví dụ: Quay trúng maxTier = 2 (Ba)
- Các giải đủ điều kiện: Tư (tier 1), Ba (tier 2) - cả 2 đều còn hàng
- Chọn random từ 2 giải này dựa trên weight

**Trường hợp đặc biệt**: Giải Ba hết hàng (chỉ còn 3), quay ra maxTier = 2
- Vì Ba chỉ còn 3 (≤ 4), nên **không được quay ra tier 3 (Ba)**
- Các giải đủ điều kiện: Tư (tier 1) 
- Tự động hạ xuống Tư ✓

## Chú Ý Quan Trọng

⚠️ **Xác suất thực tế sẽ thay đổi theo thời gian** vì:
1. Số lượng giải giảm → weight tối đa tính lại
2. Giải hết hàng sớm → xác suất các giải khác tăng lên

Ví dụ thực tế:
- Ban đầu: weight tổng = 100
- Sau khi giải Ba hết: weight tổng = 100 (không đổi vì tất cả còn hàng)
- Nhưng khi chọn giải thực tế, nếu Ba hết → chỉ có thể chọn từ giải thấp hơn

## Kiểm Tra

✅ **Công thức xác suất ban đầu ĐÚNG**
✅ **Logic hạ giải khi hết hàng ĐÚNG** (đã fix)
✅ **Phân bổ 4 giải cho 4 users ĐÚNG** (có fallback)

