import { RefreshCw, RotateCw } from "lucide-react";
import { useState } from "react";

import { COLORS } from "../utils/constants";
import { FallingEnvelopes } from "../components/FallingEnvelopes";
import { LuckyWheel } from "../components/LuckyWheel";
import { PrizeList } from "../components/PrizeList";
import { RedEnvelope } from "../components/RedEnvelope";
import { SAMPLE_USERS } from "../utils/mockData";
import { UserList } from "../components/UserList";
import { UserImportModal } from "../components/UserImportModal";
import { motion } from "framer-motion";
import { usePrizes } from "../contexts/PrizeContext";
import { useSpinGame } from "../hooks/useSpinGame";

/**
 * Lucky Spin - Modern Clean Layout
 * Layout: UserList (left) | Wheel + Envelopes (center) | PrizeList (right)
 */
export const LuckySpinPage = () => {
  const { prizes, updatePrizeQuantity, resetPrizes } = usePrizes();
  const [users, setUsers] = useState(SAMPLE_USERS);

  const handleImportUsers = (importedUsers) => {
    setUsers(importedUsers);
  };

  const handleResetAll = () => {
    if (confirm("Bạn có chắc muốn reset tất cả giải thưởng và game?")) {
      resetPrizes(); // Reset prizes về mặc định
      resetGame(); // Reset game state
      window.location.reload(); // Reload để apply changes
    }
  };

  const {
    gameState,
    selectedUsers,
    currentWinner,
    spinHistory,
    availablePrizes,
    isAnimating,
    highlightedUserId,
    highlightedEnvelopeIndex,
    maxPrizeTier,
    userPrizes,
    openedEnvelopes,
    revealingEnvelope,
    startGame,
    spinWheel,
    resetGame,
    canPickUser,
    canSpin,
    isSpinning,
    hasWinner,
    removeSelectedUser,
    exportHistoryCSV,
    revealEnvelope,
    canRevealEnvelopes,
  } = useSpinGame(users, prizes, updatePrizeQuantity);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Celebration Animation - Trigger khi vòng quay xong (PRIZES_ALLOCATED) */}
      <FallingEnvelopes trigger={canRevealEnvelopes} />

      {/* Subtle Background Pattern */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, ${COLORS.primary.gold} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* LEFT BANNER - Vertical Text */}
        <motion.div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-20"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="flex flex-col items-center px-6 py-20 relative overflow-hidden"
            style={{
              backgroundColor: "#C81D25",
              border: "4px solid #FACC15",
              borderLeft: "none",
              borderTopRightRadius: "32px",
              borderBottomRightRadius: "32px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.35), inset 0 0 20px rgba(250, 204, 21, 0.2)",
            }}
          >
            {/* Shimmer effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />

            {["Xuân", "sang", "vạn", "sự", "lành"].map((word, index) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  color: "#FACC15",
                  fontWeight: 900,
                  fontSize: "28px",
                  lineHeight: "1.2",
                  marginBottom: "10px",
                  textShadow:
                    "2px 2px 0 rgba(0,0,0,0.4), 0 0 10px rgba(250, 204, 21, 0.5)",
                  fontFamily: "'Noto Serif', 'Playfair Display', serif",
                  letterSpacing: "0.05em",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {word}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT BANNER - Vertical Text */}
        <motion.div
          className="fixed right-0 top-1/2 -translate-y-1/2 z-20"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="flex flex-col items-center px-6 py-20 relative overflow-hidden"
            style={{
              backgroundColor: "#C81D25",
              border: "4px solid #FACC15",
              borderRight: "none",
              borderTopLeftRadius: "32px",
              borderBottomLeftRadius: "32px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.35), inset 0 0 20px rgba(250, 204, 21, 0.2)",
            }}
          >
            {/* Shimmer effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />

            {["Tết", "đến", "muôn", "điều", "tốt"].map((word, index) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{
                  color: "#FACC15",
                  fontWeight: 900,
                  fontSize: "20px",
                  lineHeight: "1.2",
                  marginBottom: "10px",
                  textShadow:
                    "2px 2px 0 rgba(0,0,0,0.4), 0 0 10px rgba(250, 204, 21, 0.5)",
                  fontFamily: "'Noto Serif', 'Playfair Display', serif",
                  letterSpacing: "0.05em",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {word}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center pt-2!"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-5xl font-black tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.gold} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VÒNG QUAY MAY MẮN
          </h1>
          <p className="text-lg mt-3 text-gray-600 font-medium">
            {currentWinner ? (
              <>
                🎉{" "}
                <span className="font-bold text-red-600">
                  Congratulations to {currentWinner.name}!
                </span>{" "}
                🎉
              </>
            ) : (
              <> Khai xuân mở vận – Bứt phá thành công</>
            )}
          </p>
        </motion.div>

        {/* 3-Column Grid Layout - Fixed width with padding for banners */}
        <div className="flex-1 px-6 pb-8 m-auto flex items-center justify-center">
          <div className="grid grid-cols-12 gap-6 h-full max-w-7xl">
            {/* LEFT: User List - Scrollable */}
            <div className="col-span-3">
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl h-full overflow-hidden border border-gray-200"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <UserList
                  users={users}
                  selectedUsers={selectedUsers}
                  highlightedUserId={highlightedUserId}
                  onRemoveSelectedUser={removeSelectedUser}
                  onImportUsers={handleImportUsers}
                />
              </motion.div>
            </div>

            {/* CENTER: Wheel + 4 Envelopes + Buttons */}
            <div className="col-span-6 flex flex-col items-center justify-center gap-5">
              {/* Lucky Wheel */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <LuckyWheel
                  prizes={prizes}
                  maxPrizeTier={maxPrizeTier}
                  isSpinning={isSpinning}
                />
              </motion.div>

              {/* Message khi chưa chọn đủ */}
              {/* {selectedUsers.length < 4 && selectedUsers.length > 0 && (
                
              )} */}
              <motion.div
                className="text-center px-6! py-1! rounded-xl bg-amber-100 border-2 border-amber-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-amber-800 font-bold text-sm">
                  ⏳ Chọn đủ 4 người để bắt đầu quay ({selectedUsers.length}
                  /4)
                </p>
              </motion.div>

              {/* 4 Red Envelopes - Horizontal */}
              <div className="flex items-center justify-center gap-6">
                {[0, 1, 2, 3].map((index) => {
                  const allocation = userPrizes[index]; // { user, prize }
                  return (
                    <RedEnvelope
                      key={index}
                      index={index}
                      user={selectedUsers[index] || null}
                      prize={allocation?.prize || null}
                      isSelected={!!selectedUsers[index]}
                      onClick={startGame}
                      onReveal={() => revealEnvelope(index)}
                      onRemove={
                        selectedUsers[index]
                          ? () => removeSelectedUser(selectedUsers[index].id)
                          : null
                      }
                      canClick={canPickUser && !selectedUsers[index]}
                      canReveal={
                        canRevealEnvelopes && !openedEnvelopes.includes(index)
                      }
                      isRevealing={revealingEnvelope === index}
                      isRevealed={openedEnvelopes.includes(index)}
                      isHighlighted={highlightedEnvelopeIndex === index}
                    />
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                {/* Quay vòng quay */}
                <motion.button
                  onClick={spinWheel}
                  disabled={!canSpin || isSpinning}
                  className="
    relative
    px-16 py-7
    rounded-3xl
    font-black
    text-2xl
    flex items-center gap-4
    transition-all
    disabled:opacity-40
    disabled:cursor-not-allowed
    overflow-hidden
  "
                  style={{
                    background: canSpin
                      ? `linear-gradient(135deg, ${COLORS.primary.gold} 0%, #E6B800 50%, #C99700 100%)`
                      : "#9CA3AF",
                    color: "#1F2937",
                    border: `4px solid ${canSpin ? "#FFF7CC" : "#6B7280"}`,
                    boxShadow: canSpin
                      ? `
        inset 0 2px 0 rgba(255,255,255,0.6),
        inset 0 -4px 0 rgba(0,0,0,0.2),
        0 18px 35px rgba(0,0,0,0.35),
        0 0 25px ${COLORS.primary.gold}80
      `
                      : "0 10px 20px rgba(0,0,0,0.25)",
                  }}
                  whileHover={
                    canSpin
                      ? {
                          scale: 1.1,
                          y: -4,
                          boxShadow: `
            inset 0 2px 0 rgba(255,255,255,0.7),
            inset 0 -4px 0 rgba(0,0,0,0.25),
            0 25px 45px rgba(0,0,0,0.45),
            0 0 40px ${COLORS.primary.gold}
          `,
                        }
                      : {}
                  }
                  whileTap={canSpin ? { scale: 0.96, y: 0 } : {}}
                  initial={{ scale: 0 }}
                  animate={{ scale: canSpin ? 1 : 0.9 }}
                >
                  {/* Shine chạy ngang */}
                  {canSpin && !isSpinning && (
                    <motion.span
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
                      }}
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  )}

                  {/* Nội dung */}
                  <RotateCw
                    className={`w-9 h-9 z-10 ${
                      isSpinning ? "animate-spin text-red-700" : ""
                    }`}
                  />
                  <span className="z-10 tracking-wide">
                    {isSpinning ? "Đang quay..." : "Quay vòng quay"}
                  </span>
                </motion.button>

                {/* Chơi lại */}
                {hasWinner && (
                  <motion.button
                    onClick={resetGame}
                    className="px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.darkRed} 100%)`,
                      color: "#FFF",
                      border: `3px solid ${COLORS.primary.gold}`,
                    }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <RefreshCw className="w-6 h-6" />
                    Chơi lại
                  </motion.button>
                )}
              </div>
            </div>

            {/* RIGHT: Prize List */}
            <div className="col-span-3">
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl h-full border border-gray-200"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <PrizeList prizes={availablePrizes} spinHistory={spinHistory} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset All Button - Fixed góc phải cuối màn hình */}
      <motion.button
        onClick={handleResetAll}
        className="fixed bottom-6 right-6 z-30 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.darkRed} 100%)`,
          color: "#FFF",
          border: `2px solid ${COLORS.primary.gold}`,
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <RefreshCw className="w-5 h-5" />
        Reset Tất Cả
      </motion.button>

      {/* REMOVED: Winner Modal - Không cần nữa vì paper scroll đã hiển thị giải */}
    </div>
  );
};
