import { ANIMATION_CONFIG, GAME_STATE } from "../utils/constants";
import { useCallback, useRef, useState } from "react";

import { selectPrizeByWeight } from "../utils/mockData";

export const useSpinGame = (users, prizes) => {
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [spinHistory, setSpinHistory] = useState([]);
  const [availablePrizes, setAvailablePrizes] = useState(prizes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedUserId, setHighlightedUserId] = useState(null); // Animation random highlight
  const [highlightedEnvelopeIndex, setHighlightedEnvelopeIndex] =
    useState(null); // Animation bao lì xì
  const timeoutRefs = useRef([]);
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  }, []);
  const startGame = useCallback(() => {
    // Click vào bao lì xì → Animation scroll qua users (slot machine)
    if (gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.AUTO_PICKING)
      return;
    if (selectedUsers.length >= 4) return;

    setGameState(GAME_STATE.AUTO_PICKING);
    setIsAnimating(true);

    // Lấy danh sách users chưa được chọn
    const availableUsers = users.filter(
      (u) => !selectedUsers.some((su) => su.id === u.id),
    );
    if (availableUsers.length === 0) return;

    // Chọn user cuối cùng ngay từ đầu
    const finalUser =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    // Animation: Scroll tuần tự qua từng user trong danh sách
    let currentIndex = 0;
    const scrollSpeed = 80; // Ban đầu scroll nhanh (80ms/item)
    const totalScrolls = 20; // Tổng số lần scroll

    const scrollInterval = setInterval(() => {
      // Highlight user hiện tại
      const userToHighlight =
        availableUsers[currentIndex % availableUsers.length];
      setHighlightedUserId(userToHighlight.id);

      currentIndex++;

      // Sau khi scroll đủ số lần, dừng tại finalUser
      if (currentIndex >= totalScrolls) {
        clearInterval(scrollInterval);

        // Dừng lại ở finalUser
        setHighlightedUserId(finalUser.id);

        setTimeout(() => {
          setSelectedUsers((prev) => {
            const newUsers = [...prev, finalUser];
            // Nếu đủ 4 user → chuyển sang READY_TO_SPIN
            if (newUsers.length === 4) {
              setTimeout(() => setGameState(GAME_STATE.READY_TO_SPIN), 500);
            } else {
              setGameState(GAME_STATE.IDLE);
            }
            return newUsers;
          });
          setHighlightedUserId(null);
          setIsAnimating(false);
        }, 600); // Dừng lại 0.6s để show user được chọn
      }
    }, scrollSpeed);

    timeoutRefs.current.push(scrollInterval);
  }, [gameState, users, selectedUsers]);
  const spinWheel = useCallback(() => {
    if (
      gameState !== GAME_STATE.READY_TO_SPIN &&
      gameState !== GAME_STATE.SPIN_RESULT
    )
      return;
    if (selectedUsers.length !== 4) return;

    setIsAnimating(true);
    setGameState(GAME_STATE.SPINNING);

    // Animation: 4 bao lì xì chạy qua chạy lại (slot machine effect)
    let envelopeRandomCount = 0;
    const maxEnvelopeRandoms = 20; // 20 lần random qua các bao lì xì
    const envelopeInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 4);
      setHighlightedEnvelopeIndex(randomIndex);
      envelopeRandomCount++;

      if (envelopeRandomCount >= maxEnvelopeRandoms) {
        clearInterval(envelopeInterval);

        // Chọn winner và giải thưởng theo weighted random
        const winnerIndex = Math.floor(Math.random() * 4);
        const winnerUser = selectedUsers[winnerIndex];

        // Chọn giải thưởng theo weight (tỷ trọng)
        const selectedPrize = selectPrizeByWeight(availablePrizes);

        setHighlightedEnvelopeIndex(winnerIndex);

        setTimeout(() => {
          // Gắn prizeId vào winner để LuckyWheel biết ô nào thắng
          const winnerWithPrize = {
            ...winnerUser,
            prizeId: selectedPrize.id,
          };

          setCurrentWinner(winnerWithPrize);
          setHighlightedEnvelopeIndex(null);
          setIsAnimating(false);
          setGameState(GAME_STATE.SPIN_RESULT);

          // Lưu lịch sử
          const newHistory = {
            user: winnerUser,
            prize: selectedPrize,
            timestamp: Date.now(),
          };
          setSpinHistory((prev) => [...prev, newHistory]);

          // Giảm số lượng giải thưởng còn lại
          setAvailablePrizes(
            (prev) =>
              prev
                .map((p) =>
                  p.id === selectedPrize.id && p.quantity > 0
                    ? { ...p, quantity: p.quantity - 1 }
                    : p,
                )
                .filter((p) => p.quantity > 0), // Loại bỏ giải hết
          );
        }, 800); // Dừng lại 0.8s để show winner
      }
    }, 100); // Mỗi 100ms random 1 bao lì xì

    timeoutRefs.current.push(envelopeInterval);
  }, [gameState, selectedUsers, availablePrizes]);
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
  }, [prizes, clearAllTimeouts]);
  return {
    gameState,
    selectedUsers,
    currentWinner,
    spinHistory,
    availablePrizes,
    isAnimating,
    highlightedUserId, // Thêm để UserList biết user nào đang được highlight
    highlightedEnvelopeIndex, // Thêm để RedEnvelope biết bao nào đang được highlight
    startGame,
    spinWheel,
    resetGame,
    canPickUser:
      (gameState === GAME_STATE.IDLE ||
        gameState === GAME_STATE.AUTO_PICKING) &&
      selectedUsers.length < 4,
    canSpin:
      gameState === GAME_STATE.READY_TO_SPIN ||
      gameState === GAME_STATE.SPIN_RESULT,
    isSpinning: gameState === GAME_STATE.SPINNING,
    hasWinner: currentWinner !== null,
    pickedCount: selectedUsers.length,
    needMoreUsers: selectedUsers.length < 4,
  };
};
