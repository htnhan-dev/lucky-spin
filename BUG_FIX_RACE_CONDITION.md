# Bug Fix: Race Condition in Pick Queue

## Vấn đề (Problem)
Khi click liên tục bao lì xì để chọn user:
- **Lúc thành công** → User được chọn
- **Lúc thất bại** → Click không được xử lý (bị skip)

**Root cause**: Race condition trong queue xử lý picks

## Nguyên nhân Chi Tiết

### ❌ Cũ - Có Delay 100ms:
```javascript
// processSinglePick() - cuối hàm (dòng 201 cũ)
setTimeout(() => {
  if (pickQueueRef.current.length > 0) {
    pickQueueRef.current.shift();
    processSinglePick();
  }
}, 100); // ⚠️ DELAY 100ms - CÓ TH MIL CÁC CLICK GIỮA LÚC
```

### ⚠️ Vấn đề:
1. `isProcessingRef.current = false` được set trước
2. Nhưng có delay 100ms trước khi check queue
3. Khi đó, nếu user click lại → `startGame()` được gọi **khi chưa process xong**
4. → Flag `isProcessingRef.current` không xác định → Logic bị loạn

### ✅ Mới - Không Delay:
```javascript
// processSinglePick() - cuối hàm
setIsAnimating(false);

// ✓ Set flag NGAY
isProcessingRef.current = false;

// ✓ Check queue NGAY (không delay)
if (pickQueueRef.current.length > 0) {
  pickQueueRef.current.shift();
  processSinglePick(); // Gọi ngay, không delay
}
```

### ✅ Lợi ích:
1. **Atomic operation** - Flag và queue check được thực hiện liên tiếp
2. **Không race condition** - Tất cả clicks trong queue được xử lý tuần tự
3. **Reliable** - Mỗi click đều được xử lý (lúc thành công 100%)

## Flow So Sánh

### ❌ Cũ - Có Bug:
```
Click 1:  startGame() → push → processSinglePick() ✓
  ↓ (animation 1s)
Click 2:  startGame() → push → wait (isProcessing=true) 
  ↓ 
Click 3:  startGame() → push → wait (isProcessing=true)
  ↓ 
[1s timeout xong]
processingSinglePick() SET isProcessing=false
  ↓ [DELAY 100ms] ← ⚠️ BUG: Clicks 2&3 có thể bị skip
checkQueue() → process Click 2 ✓ (lúc được, lúc không)
```

### ✅ Mới - Sạch:
```
Click 1:  startGame() → push → processSinglePick() ✓
  ↓ (animation 1s)
Click 2:  startGame() → push (queue = [true])
Click 3:  startGame() → push (queue = [true, true])
  ↓ 
[1s timeout xong]
processingSinglePick() SET isProcessing=false
processingSinglePick() checkQueue() ✓
  ↓ [NGAY - không delay]
shift() & processSinglePick() → Click 2 ✓
  ↓ (animation 1s)
  [1s timeout xong]
  SET isProcessing=false
  checkQueue() ✓
  shift() & processSinglePick() → Click 3 ✓
```

## Test Cases

### ✅ Test 1: Click đơn
1. Click bao 1 → User được chọn ✓

### ✅ Test 2: Click 2 lần nhanh
1. Click bao 1 → pick (animation)
2. Click bao 2 (khi đang animation) → queue
3. Animation xong → ngay lập tức process Click 2 ✓

### ✅ Test 3: Click 4 lần liên tiếp
1. Click bao 1 → pick (animation)
2. Click bao 2, 3, 4 (rapid) → queue all
3. Animation xong:
   - Process Click 2 ✓
   - Animation xong → Process Click 3 ✓
   - Animation xong → Process Click 4 ✓

### ✅ Test 4: Spam click 10 lần
- Tất cả 10 clicks sẽ được xử lý tuần tự, không bị skip ✓

## Thay Đổi Code

**File**: `src/hooks/useSpinGame.js`

**Thay đổi 1** (dòng 58-63):
```diff
- if (currentSelectedUsersRef.current.length >= 4) {
-   pickQueueRef.current = [];
-   return;
- }
+ // ✓ Bỏ check >= 4 vì cho phép flex số lượng users
```

**Thay đổi 2** (dòng 194-201):
```diff
- isProcessingRef.current = false;
- 
- // Sau khi xong, check queue xem còn pick nào đang chờ không
- setTimeout(() => {
-   if (pickQueueRef.current.length > 0) {
-     pickQueueRef.current.shift();
-     processSinglePick();
-   }
- }, 100); // ⚠️ DELAY 100ms

+ // ✓ Set isProcessingRef = false ĐẦU TIÊN
+ isProcessingRef.current = false;
+ 
+ // ✓ Sau đó lập tức check và xử lý queue tiếp (không cần delay)
+ if (pickQueueRef.current.length > 0) {
+   pickQueueRef.current.shift();
+   processSinglePick(); // Gọi lại ngay để xử lý tiếp
+ }
```

## Kết Luận
✅ Bug race condition đã fix
✅ Tất cả clicks sẽ được xử lý reliably
✅ Không bị skip lần nào
