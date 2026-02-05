import { ANIMATION_CONFIG, GAME_STATE } from "../utils/constants";
import { useCallback, useRef, useState, useEffect } from "react";

import { selectMaxPrizeTier, allocatePrizesForUsers } from "../utils/mockData";

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

  const timeoutRefs = useRef([]);
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  }, []);

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
  const startGame = useCallback(() => {
    // Click vào bao lì xì → Animation scroll qua users (slot machine)
    if (gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.AUTO_PICKING)
      return;
    if (selectedUsers.length >= 4) return;

    setGameState(GAME_STATE.AUTO_PICKING);
    setIsAnimating(true);

    // Lấy danh sách users chưa được chọn VÀ chưa trúng giải trong lịch sử
    const winnersSet = new Set(spinHistory.map((h) => h.user.id));
    const availableUsers = users.filter(
      (u) =>
        !selectedUsers.some((su) => su.id === u.id) && // Chưa được pick trong lần quay này
        !winnersSet.has(u.id), // Chưa trúng giải trong lịch sử
    );
    if (availableUsers.length === 0) return;

    // Chọn user cuối cùng ngay từ đầu
    const finalUser =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    // Animation: Nhảy RANDOM qua các users - NHANH HƠN để mượt mà
    let currentScroll = 0;
    const scrollSpeed = 250; // Nhanh hơn (500ms → 200ms)
    const minScrolls = 5; // Tăng số lần scroll để vẫn có hiệu ứng dài
    const maxScrolls = 10;

    const totalScrolls =
      Math.floor(Math.random() * (maxScrolls - minScrolls + 1)) + minScrolls;
    const maxStep = 10; // bước nhảy tối đa

    let currentIndex = Math.floor(Math.random() * availableUsers.length);

    const scrollInterval = setInterval(() => {
      // Tính tiến trình (0 → 1)
      const progress = currentScroll / totalScrolls;

      // Càng về cuối → bước càng nhỏ
      const dynamicMaxStep = Math.max(1, Math.floor((1 - progress) * maxStep));

      // Random bước nhảy
      const step = Math.floor(Math.random() * dynamicMaxStep) + 1;

      // Random hướng
      const direction = Math.random() < 0.5 ? -1 : 1;

      // Cập nhật index (có wrap)
      currentIndex =
        (currentIndex + step * direction + availableUsers.length) %
        availableUsers.length;

      const nextUser = availableUsers[currentIndex];
      setHighlightedUserId(nextUser.id);

      currentScroll++;

      // Kết thúc scroll
      if (currentScroll >= totalScrolls) {
        clearInterval(scrollInterval);

        // Highlight user trúng cuối cùng
        setHighlightedUserId(finalUser.id);

        setTimeout(() => {
          setSelectedUsers((prev) => {
            const newUsers = [...prev, finalUser];

            if (newUsers.length === 4) {
              setTimeout(() => setGameState(GAME_STATE.READY_TO_SPIN), 500);
            } else {
              setGameState(GAME_STATE.IDLE);
            }

            return newUsers;
          });

          setHighlightedUserId(null);
          setIsAnimating(false);
        }, 1000); // dừng 1s cho rõ
      }
    }, scrollSpeed);

    timeoutRefs.current.push(scrollInterval);
  }, [gameState, users, selectedUsers, spinHistory]);
  const spinWheel = useCallback(() => {
    if (
      gameState !== GAME_STATE.READY_TO_SPIN &&
      gameState !== GAME_STATE.PRIZES_ALLOCATED
    )
      return;
    if (selectedUsers.length !== 4) return;

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
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
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

        // Kiểm tra đã mở hết 4 bao chưa
        if (openedEnvelopes.length + 1 >= 4) {
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
    ],
  );

  const resetGame = useCallback(() => {
    clearAllTimeouts();
    setGameState(GAME_STATE.IDLE);
    setSelectedUsers([]);
    setCurrentWinner(null);
    setSpinHistory([]);
    setAvailablePrizes(prizes);
    setIsAnimating(false);
    setHighlightedUserId(null);
    setHighlightedEnvelopeIndex(null);
    setMaxPrizeTier(null);
    setUserPrizes([]);
    setOpenedEnvelopes([]);
    setRevealingEnvelope(null);
    setCurrentSpinDuration(null);
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
    // Functions
    startGame,
    spinWheel,
    resetGame,
    removeSelectedUser,
    exportHistoryCSV,
    revealEnvelope,
    // Flags
    canPickUser:
      (gameState === GAME_STATE.IDLE ||
        gameState === GAME_STATE.AUTO_PICKING) &&
      selectedUsers.length < 4,
    canSpin: gameState === GAME_STATE.READY_TO_SPIN,
    isSpinning: gameState === GAME_STATE.SPINNING,
    hasWinner: currentWinner !== null,
    pickedCount: selectedUsers.length,
    needMoreUsers: selectedUsers.length < 4,
    canRevealEnvelopes: gameState === GAME_STATE.PRIZES_ALLOCATED,
    allEnvelopesRevealed: openedEnvelopes.length >= 4,
  };
};
