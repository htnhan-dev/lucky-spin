import { ANIMATION_CONFIG, GAME_STATE } from "../utils/constants";
import { allocatePrizesForUsers, selectMaxPrizeTier } from "../utils/mockData";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "spin_reward_history_v1";

export const useSpinGame = (users, prizes, updatePrizeQuantity) => {
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [spinHistory, setSpinHistory] = useState([]);
  const [availablePrizes, setAvailablePrizes] = useState(prizes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const [highlightedEnvelopeIndex, setHighlightedEnvelopeIndex] =
    useState(null);

  // NEW: State cho flow mới
  const [maxPrizeTier, setMaxPrizeTier] = useState(null); // Giải trần từ vòng quay
  const [userPrizes, setUserPrizes] = useState([]); // 4 giải đã phân bổ cho 4 users
  const [openedEnvelopes, setOpenedEnvelopes] = useState([]); // Các bao đã mở
  const [revealingEnvelope, setRevealingEnvelope] = useState(null); // Bao đang mở
  const [currentSpinDuration, setCurrentSpinDuration] = useState(null); // Duration của lần quay hiện tại

  // NGÔI SAO HI VỌNG
  const [luckyStarCount, setLuckyStarCount] = useState(0); // Số ngôi sao đã phát (max 6)
  const [luckyStarUser, setLuckyStarUser] = useState(null); // User trúng sao trong lượt này (1 lượt chỉ 1 user)

  const timeoutRefs = useRef([]);
  const pickQueueRef = useRef([]); // Queue để lưu các lần pick đang chờ
  const isProcessingRef = useRef(false); // Flag để biết có đang xử lý không
  const currentSelectedUsersRef = useRef([]); // Track selected users hiện tại (real-time)

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  }, []);

  // Sync selectedUsers vào ref
  useEffect(() => {
    currentSelectedUsersRef.current = selectedUsers;
  }, [selectedUsers]);

  // Load persisted history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSpinHistory(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Hàm thực hiện animation pick 1 user
  const processSinglePick = useCallback(() => {
    if (isProcessingRef.current) return; // Đang xử lý rồi

    // ✓ Bỏ check >= 4 vì cho phép flex số lượng users
    // if (currentSelectedUsersRef.current.length >= 4) {
    //   pickQueueRef.current = [];
    //   return;
    // }

    isProcessingRef.current = true;

    // Lấy danh sách users chưa được chọn VÀ chưa trúng giải trong lịch sử
    // QUAN TRỌNG: Check cả ID và TÊN để tránh trùng lặp
    const winnersIdSet = new Set(spinHistory.map((h) => h.user.id));
    const winnersNameSet = new Set(
      spinHistory.map((h) => h.user.name.trim().toLowerCase()),
    );

    console.log("🔍 Debug Pick User:", {
      totalUsers: users.length,
      currentSelectedUsersLength: currentSelectedUsersRef.current.length, // Dùng ref
      historyLength: spinHistory.length,
      winnersIds: Array.from(winnersIdSet),
      winnersNames: Array.from(winnersNameSet),
    });

    const availableUsers = users.filter(
      (u) =>
        !currentSelectedUsersRef.current.some((su) => su.id === u.id) && // Dùng ref thay vì state
        !winnersIdSet.has(u.id) && // Chưa trúng giải trong lịch sử (check ID)
        !winnersNameSet.has(u.name.trim().toLowerCase()), // Chưa trúng giải trong lịch sử (check TÊN)
    );

    console.log(
      "✅ Available users:",
      availableUsers.length,
      availableUsers.map((u) => ({ id: u.id, name: u.name })),
    );

    // Nếu không còn user khả dụng (tất cả đã trúng) → Hiển thị cảnh báo
    if (availableUsers.length === 0) {
      setGameState(GAME_STATE.IDLE);
      setIsAnimating(false);
      isProcessingRef.current = false;
      pickQueueRef.current = []; // Clear queue

      alert(
        "⚠️ ĐÃ HẾT NGƯỜI CHƠI!\n\n" +
          `Tất cả ${users.length} người đã trúng giải.\n\n` +
          "Vui lòng:\n" +
          "• Bấm nút 'Reset All' để xóa lịch sử và chơi lại từ đầu\n" +
          "• Hoặc import thêm danh sách người mới",
      );
      return;
    }

    setGameState(GAME_STATE.AUTO_PICKING);
    setIsAnimating(true);

    // Chọn user cuối cùng ngay từ đầu
    const finalUser =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    // Animation: Nhảy RANDOM qua các users
    let currentScroll = 0;
    const scrollSpeed = 200;
    const minScrolls = 3;
    const maxScrolls = 7;

    const totalScrolls =
      Math.floor(Math.random() * (maxScrolls - minScrolls + 1)) + minScrolls;
    const maxStep = 8;

    let currentIndex = Math.floor(Math.random() * availableUsers.length);

    const scrollInterval = setInterval(() => {
      const progress = currentScroll / totalScrolls;
      const dynamicMaxStep = Math.max(1, Math.floor((1 - progress) * maxStep));
      const step = Math.floor(Math.random() * dynamicMaxStep) + 1;
      const direction = Math.random() < 0.5 ? -1 : 1;

      currentIndex =
        (currentIndex + step * direction + availableUsers.length) %
        availableUsers.length;

      const nextUser = availableUsers[currentIndex];
      setHighlightedUserId(nextUser.id);

      currentScroll++;

      if (currentScroll >= totalScrolls) {
        clearInterval(scrollInterval);
        setHighlightedUserId(finalUser.id);

        setTimeout(() => {
          setSelectedUsers((prev) => {
            const newUsers = [...prev, finalUser];

            // QUAN TRỌNG: Sync ngay vào ref để lần pick tiếp theo biết
            currentSelectedUsersRef.current = newUsers;

            // NGÔI SAO HI VỌNG: Nếu đủ 4 users → Check xem user nào trúng sao
            if (newUsers.length === 4) {
              const luckyStarPosition =
                sessionStorage.getItem("luckyStarPosition");
              if (
                luckyStarPosition !== null &&
                luckyStarCount < 6 &&
                !luckyStarUser
              ) {
                const position = parseInt(luckyStarPosition);
                const luckyUser = newUsers[position];
                console.log(
                  `⭐ User "${luckyUser.name}" at position ${position} won the lucky star!`,
                );
                setLuckyStarUser(luckyUser);
                setLuckyStarCount((prev) => prev + 1);
                sessionStorage.removeItem("luckyStarPosition");
              }
              setTimeout(() => setGameState(GAME_STATE.READY_TO_SPIN), 500);
            } else if (newUsers.length >= 1) {
              // ✓ Cho phép quay ngay khi có >= 1 user (không cần đợi 4 người)
              setTimeout(() => setGameState(GAME_STATE.READY_TO_SPIN), 500);
            } else {
              setGameState(GAME_STATE.IDLE);
            }

            return newUsers;
          });

          setHighlightedUserId(null);
          setIsAnimating(false);

          // ✓ Set isProcessingRef = false ĐẦU TIÊN
          isProcessingRef.current = false;

          // ✓ Sau đó lập tức check và xử lý queue tiếp (không cần delay)
          if (pickQueueRef.current.length > 0) {
            pickQueueRef.current.shift(); // Bỏ item đầu
            processSinglePick(); // Gọi lại ngay để xử lý tiếp
          }
        }, 1000);
      }
    }, scrollSpeed);

    timeoutRefs.current.push(scrollInterval);
  }, [users, spinHistory, luckyStarCount, luckyStarUser]);

  const startGame = useCallback(() => {
    // Click vào bao lì xì → Thêm vào queue
    if (gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.AUTO_PICKING)
      return;
    // Cho phép pick unlimited (không giới hạn 4 người, lượt cuối có thể 3 người)
    // if (selectedUsers.length >= 4) return; // ✓ Bỏ logic này

    // NGÔI SAO HI VỌNG: Nếu là lượt mới (chưa chọn ai) → Random xem có phát sao không
    if (selectedUsers.length === 0 && luckyStarCount < 6 && !luckyStarUser) {
      // Tính số lượt quay = tổng users ÷ 4
      const totalRounds = Math.ceil(users.length / 4);
      // Xác suất phát sao = 6 ngôi sao ÷ số lượt quay
      const starChance = 6 / totalRounds; // VD: 136 người = 34 lượt → 6/34 = ~17.6%

      const shouldGiveStar = Math.random() < starChance;
      console.log(
        `⭐ Star chance: ${(starChance * 100).toFixed(1)}% (${totalRounds} rounds for ${users.length} users) → ${shouldGiveStar ? "YES" : "NO"}`,
      );

      if (shouldGiveStar) {
        // Random 1 user trong 4 users sẽ được pick để trúng sao (25% mỗi vị trí)
        const randomPosition = Math.floor(Math.random() * 4); // 0-3
        // Lưu vị trí này để sau khi pick đủ 4 users sẽ gán sao
        sessionStorage.setItem("luckyStarPosition", randomPosition.toString());
      } else {
        sessionStorage.removeItem("luckyStarPosition");
      }
    }

    // Thêm vào queue
    pickQueueRef.current.push(true);

    // Nếu chưa đang xử lý thì bắt đầu
    if (!isProcessingRef.current) {
      pickQueueRef.current.shift(); // Bỏ item vừa thêm vì sẽ xử lý ngay
      processSinglePick();
    }
  }, [
    gameState,
    selectedUsers,
    processSinglePick,
    luckyStarCount,
    luckyStarUser,
    users,
  ]);
  const spinWheel = useCallback(() => {
    console.log("🎰 spinWheel called", {
      gameState,
      selectedUsersLength: selectedUsers.length,
      availablePrizesLength: availablePrizes.length,
      availablePrizes: availablePrizes.map((p) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
      })),
    });

    if (
      gameState !== GAME_STATE.READY_TO_SPIN &&
      gameState !== GAME_STATE.PRIZES_ALLOCATED
    ) {
      console.log("❌ Wrong gameState:", gameState);
      return;
    }
    // Cho phép quay với số lượng users >= 1 (không yêu cầu chính xác 4)
    if (selectedUsers.length < 1) {
      console.log("❌ Not enough users:", selectedUsers.length);
      return;
    }

    // Calculate dynamic duration (function or static value) - TÍNH 1 LẦN DUY NHẤT
    const spinDuration =
      typeof ANIMATION_CONFIG.spin.duration === "function"
        ? ANIMATION_CONFIG.spin.duration()
        : ANIMATION_CONFIG.spin.duration;

    // QUAN TRỌNG: Chọn giải trần TRƯỚC khi bắt đầu animation
    const tierFromWheel = selectMaxPrizeTier(availablePrizes);

    // Lưu duration và maxPrizeTier để pass xuống LuckyWheel component
    setCurrentSpinDuration(spinDuration);
    setMaxPrizeTier(tierFromWheel); // Set NGAY để wheel biết đích đến
    setIsAnimating(true);
    setGameState(GAME_STATE.SPINNING);

    // Vòng quay để chọn GIẢI TRẦN (max prize tier)
    setTimeout(() => {
      // QUAN TRỌNG: Set isAnimating = false TRƯỚC để wheel dừng animation
      setIsAnimating(false);
      setGameState(GAME_STATE.PRIZES_ALLOCATED);

      // Bước 2: Phân bổ 4 giải cho 4 users dựa trên giải trần
      const allocations = allocatePrizesForUsers(
        selectedUsers,
        availablePrizes,
        tierFromWheel,
      );

      // Bước 3: Set userPrizes (CHƯA trừ số lượng - đợi mở hết 4 bao)
      setUserPrizes(allocations);
    }, spinDuration * 1000); // Đợi animation vòng quay xong (25s)
  }, [gameState, selectedUsers, availablePrizes]);
  // Remove a selected user by id so another user can be chosen in their place
  const removeSelectedUser = useCallback((userId) => {
    setSelectedUsers((prev) => {
      const newUsers = prev.filter((u) => u.id !== userId);

      // Nếu không còn users sau khi xóa → reset về IDLE để có thể pick lại
      if (newUsers.length < 1) {
        setGameState(GAME_STATE.IDLE);
      }

      return newUsers;
    });

    // If the removed user was the current winner, clear winner
    setCurrentWinner((cw) => (cw && cw.id === userId ? null : cw));
  }, []);

  // Export history as CSV string
  const exportHistoryCSV = useCallback(() => {
    const header = [
      "timestamp",
      "userId",
      "userName",
      "prizeId",
      "prizeName",
    ].join(",");
    const rows = spinHistory.map((h) => {
      const t = new Date(h.timestamp).toISOString();
      const userName = (h.user.name || "").replace(/"/g, '""');
      const prizeName = (
        (h.prize && (h.prize.name || h.prize.description)) ||
        ""
      ).replace(/"/g, '""');
      return [t, h.user.id, `"${userName}"`, h.prize.id, `"${prizeName}"`].join(
        ",",
      );
    });
    return [header, ...rows].join("\n");
  }, [spinHistory]);

  // Mở bao lì xì để reveal giải thưởng
  const revealEnvelope = useCallback(
    (envelopeIndex) => {
      if (gameState !== GAME_STATE.PRIZES_ALLOCATED) return;
      if (openedEnvelopes.includes(envelopeIndex)) return; // Đã mở rồi

      // Set đang reveal
      setRevealingEnvelope(envelopeIndex);
      setGameState(GAME_STATE.REVEALING);

      // Animation mở bao + paper scroll ra
      setTimeout(() => {
        // Đánh dấu đã mở
        setOpenedEnvelopes((prev) => [...prev, envelopeIndex]);

        // Lưu vào history
        const allocation = userPrizes[envelopeIndex];
        if (allocation) {
          const newHistory = {
            user: allocation.user,
            prize: allocation.prize,
            timestamp: Date.now(),
          };
          setSpinHistory((prev) => {
            const next = [...prev, newHistory];
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch (e) {
              // ignore
            }
            return next;
          });
        }

        setRevealingEnvelope(null);

        // Kiểm tra đã mở hết bao lì xì chưa (linh hoạ theo số lượng users)
        if (openedEnvelopes.length + 1 >= selectedUsers.length) {
          setGameState(GAME_STATE.ROUND_COMPLETE);

          // ĐÃ MỞ HẾT 4 BAO → Bây giờ mới trừ số lượng tồn kho
          const updatedPrizes = availablePrizes
            .map((p) => {
              const usedCount = userPrizes.filter(
                (a) => a.prize.id === p.id,
              ).length;
              const newQuantity = Math.max(0, p.quantity - usedCount);

              // Update context để sync với wheel display
              if (updatePrizeQuantity && usedCount > 0) {
                updatePrizeQuantity(p.id, newQuantity);
              }

              return {
                ...p,
                quantity: newQuantity,
              };
            })
            .filter((p) => p.quantity > 0); // Loại bỏ giải hết

          setAvailablePrizes(updatedPrizes);
        } else {
          setGameState(GAME_STATE.PRIZES_ALLOCATED); // Quay lại state shake, chờ mở bao khác
        }
      }, 2000); // 2s cho animation paper scroll
    },
    [
      gameState,
      openedEnvelopes,
      userPrizes,
      availablePrizes,
      updatePrizeQuantity,
      selectedUsers,
    ],
  );

  // Reset vòng chơi hiện tại - GIỮ NGUYÊN history
  const resetRound = useCallback(() => {
    clearAllTimeouts();
    setGameState(GAME_STATE.IDLE);
    setSelectedUsers([]);
    setCurrentWinner(null);
    // KHÔNG reset spinHistory - giữ nguyên lịch sử
    // Reset availablePrizes về prizes gốc (vì prizes trong context đã được update rồi)
    setAvailablePrizes(prizes);
    setIsAnimating(false);
    setHighlightedUserId(null);
    setHighlightedEnvelopeIndex(null);
    setMaxPrizeTier(null);
    setUserPrizes([]);
    setOpenedEnvelopes([]);
    setRevealingEnvelope(null);
    setCurrentSpinDuration(null);
    // Reset lucky star user cho lượt mới (KHÔNG reset count)
    setLuckyStarUser(null);
    sessionStorage.removeItem("luckyStarPosition");
  }, [clearAllTimeouts, prizes]);

  // Reset toàn bộ game - BAO GỒM history
  const resetGame = useCallback(() => {
    clearAllTimeouts();
    setGameState(GAME_STATE.IDLE);
    setSelectedUsers([]);
    setCurrentWinner(null);
    setSpinHistory([]); // XÓA history
    setAvailablePrizes(prizes);
    setIsAnimating(false);
    setHighlightedUserId(null);
    setHighlightedEnvelopeIndex(null);
    setMaxPrizeTier(null);
    setUserPrizes([]);
    setOpenedEnvelopes([]);
    setRevealingEnvelope(null);
    setCurrentSpinDuration(null);
    // Reset lucky star
    setLuckyStarCount(0);
    setLuckyStarUser(null);
    sessionStorage.removeItem("luckyStarPosition");
  }, [prizes, clearAllTimeouts]);
  return {
    gameState,
    selectedUsers,
    currentWinner,
    spinHistory,
    availablePrizes,
    isAnimating,
    highlightedUserId,
    highlightedEnvelopeIndex,
    // NEW states
    maxPrizeTier,
    userPrizes,
    openedEnvelopes,
    revealingEnvelope,
    currentSpinDuration, // Duration của lần quay hiện tại (để sync với LuckyWheel)
    // Lucky Star
    luckyStarCount,
    luckyStarUser,
    // Functions
    startGame,
    spinWheel,
    resetRound, // Reset vòng chơi hiện tại (GIỮ history)
    resetGame, // Reset toàn bộ (XÓA history)
    removeSelectedUser,
    exportHistoryCSV,
    revealEnvelope,
    // Flags
    canPickUser:
      gameState === GAME_STATE.IDLE || gameState === GAME_STATE.AUTO_PICKING,
    canSpin: gameState === GAME_STATE.READY_TO_SPIN && selectedUsers.length > 0,
    isSpinning: gameState === GAME_STATE.SPINNING,
    hasWinner: currentWinner !== null,
    pickedCount: selectedUsers.length,
    needMoreUsers: selectedUsers.length < 1,
    canRevealEnvelopes: gameState === GAME_STATE.PRIZES_ALLOCATED,
    allEnvelopesRevealed: openedEnvelopes.length >= selectedUsers.length,
  };
};
