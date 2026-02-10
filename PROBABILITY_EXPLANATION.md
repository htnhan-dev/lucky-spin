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
**MỚI**: Chỉ quay từ những giải **còn hàng > 0** (quantity > 0)
- Không yêu cầu số lượng cụ thể
- Cho phép 4 users, 3 users (lượt cuối), hoặc số khác

Ví dụ: Nếu giải Ba chỉ còn 3 giải
- Giải Ba **vẫn có thể** là giải trần vì 3 > 0 ✓
- Các giải đủ điều kiện: Đặc biệt (6), Nhất (6), Nhì (28), Ba (3), Tư (55)

### Bước 2: Chọn Giải Thực Tế (selectPrizeWithinCeiling)
**Quy tắc**: Giải thực tế phải `<= giải trần` và **còn hàng > 0**

Ví dụ: Quay trúng maxTier = 2 (Ba, 100k)
- Các giải đủ điều kiện: Tư (tier 1, 50k), Ba (tier 2, 100k)
- Chỉ những giải còn hàng > 0 mới được chọn
- Chọn random từ 2 giải này dựa trên weight

**Trường hợp hết hàng**: Giải Ba hết (quantity = 0), quay ra maxTier = 2
- Các giải đủ điều kiện: Tư (tier 1, 50k) - vì Ba hết
- Tự động hạ xuống Tư ✓

### Bước 3: Phân Bổ Giải Cho Users
**Linh hoạt theo số lượng**: 4 users, 3 users (lượt cuối), hoặc số khác
- Với 131 users: 131 ÷ 4 = 32 lượt (4 users) + 1 lượt cuối (3 users)
- Mỗi user trong lượt nhận 1 giải từ các giải đủ điều kiện
- Đảm bảo không quay lại giải đã hết

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

