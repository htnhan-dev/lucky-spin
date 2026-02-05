import { RefreshCw, RotateCw } from "lucide-react";

import { COLORS } from "../utils/constants";
import { FallingEnvelopes } from "../components/FallingEnvelopes";
import { LuckyWheel } from "../components/LuckyWheel";
import { PrizeList } from "../components/PrizeList";
import { RedEnvelope } from "../components/RedEnvelope";
import { SAMPLE_USERS } from "../utils/mockData";
import { UserList } from "../components/UserList";
import { motion } from "framer-motion";
import { usePrizes } from "../contexts/PrizeContext";
import { useSpinGame } from "../hooks/useSpinGame";

/**
 * Lucky Spin - Modern Clean Layout
 * Layout: UserList (left) | Wheel + Envelopes (center) | PrizeList (right)
 */
export const LuckySpinPage = () => {
  const { prizes } = usePrizes();

  const {
    gameState,
    selectedUsers,
    currentWinner,
    spinHistory,
    availablePrizes,
    isAnimating,
    highlightedUserId,
    highlightedEnvelopeIndex,
    startGame,
    spinWheel,
    resetGame,
    canPickUser,
    canSpin,
    isSpinning,
    hasWinner,
  } = useSpinGame(SAMPLE_USERS, prizes);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Celebration Animation */}
      <FallingEnvelopes trigger={hasWinner} />

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
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
          <div
            className="flex flex-col items-center px-6 py-20"
            style={{
              backgroundColor: "#C81D25",
              border: "4px solid #FACC15",
              borderLeft: "none",
              borderTopRightRadius: "32px",
              borderBottomRightRadius: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {["NĂM", "MỚI", "BÌNH", "AN"].map((word) => (
              <div
                key={word}
                style={{
                  color: "#FACC15",
                  fontWeight: 900,
                  fontSize: "28px",
                  lineHeight: "1.2",
                  marginBottom: "10px",
                  textShadow: "2px 2px 0 rgba(0,0,0,0.4)",
                  fontFamily: "'Noto Serif', 'Playfair Display', serif",
                  letterSpacing: "0.05em",
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT BANNER - Vertical Text */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-20">
          <div
            className="flex flex-col items-center px-6 py-20"
            style={{
              backgroundColor: "#C81D25",
              border: "4px solid #FACC15",
              borderRight: "none",
              borderTopLeftRadius: "32px",
              borderBottomLeftRadius: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {["AN", "KHANG", "THỊNH", "VƯỢNG"].map((word) => (
              <div
                key={word}
                style={{
                  color: "#FACC15",
                  fontWeight: 900,
                  fontSize: "28px",
                  lineHeight: "1.2",
                  marginBottom: "10px",
                  textShadow: "2px 2px 0 rgba(0,0,0,0.4)",
                  fontFamily: "'Noto Serif', 'Playfair Display', serif",
                  letterSpacing: "0.05em",
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-7xl font-black tracking-tight"
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
              <>👉 Click "Quay vòng quay" to spin the lucky wheel</>
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
                  users={SAMPLE_USERS}
                  selectedUsers={selectedUsers}
                  highlightedUserId={highlightedUserId}
                />
              </motion.div>
            </div>

            {/* CENTER: Wheel + 4 Envelopes + Buttons */}
            <div className="col-span-6 flex flex-col items-center justify-center gap-8">
              {/* Lucky Wheel */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <LuckyWheel
                  prizes={prizes}
                  selectedUsers={selectedUsers}
                  currentWinner={currentWinner}
                  isSpinning={isSpinning}
                />
              </motion.div>

              {/* 4 Red Envelopes - Horizontal */}
              <div className="flex items-center justify-center gap-6">
                {[0, 1, 2, 3].map((index) => (
                  <RedEnvelope
                    key={index}
                    index={index}
                    user={selectedUsers[index] || null}
                    isWinner={
                      currentWinner &&
                      selectedUsers[index] &&
                      currentWinner.id === selectedUsers[index].id
                    }
                    isSelected={!!selectedUsers[index]}
                    onClick={startGame}
                    canClick={canPickUser && !selectedUsers[index]}
                    isHighlighted={highlightedEnvelopeIndex === index}
                  />
                ))}
              </div>

              {/* Message khi chưa chọn đủ */}
              {selectedUsers.length < 4 && selectedUsers.length > 0 && (
                <motion.div
                  className="text-center px-6 py-3 rounded-xl bg-amber-100 border-2 border-amber-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-amber-800 font-bold text-sm">
                    ⏳ Chọn đủ 4 người để bắt đầu quay ({selectedUsers.length}
                    /4)
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                {/* Quay vòng quay */}
                <motion.button
                  onClick={spinWheel}
                  disabled={!canSpin}
                  className="px-14 py-6 rounded-2xl font-black text-2xl flex items-center gap-4 shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: canSpin
                      ? `linear-gradient(135deg, ${COLORS.primary.gold} 0%, #DAA520 100%)`
                      : "#9CA3AF",
                    color: "#1F2937",
                    border: `4px solid ${canSpin ? "#FFF" : "#6B7280"}`,
                  }}
                  whileHover={canSpin ? { scale: 1.08, y: -2 } : {}}
                  whileTap={canSpin ? { scale: 0.98 } : {}}
                  initial={{ scale: 0 }}
                  animate={{ scale: canSpin ? 1 : 0.9 }}
                >
                  <RotateCw
                    className={`w-8 h-8 ${isSpinning ? "animate-spin" : ""}`}
                  />
                  Quay vòng quay
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

      {/* Winner Modal - Modern */}
      {hasWinner && currentWinner && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-12 max-w-xl w-full text-center shadow-2xl relative overflow-hidden"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Decorative gradient overlay */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(90deg, ${COLORS.primary.red}, ${COLORS.primary.gold}, ${COLORS.primary.red})`,
              }}
            />

            {/* Content */}
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              🎉
            </motion.div>

            <h2
              className="text-5xl font-black mb-6"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.gold} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CHÚC MỪNG!
            </h2>

            <div className="text-4xl font-bold mb-3 text-gray-900">
              {currentWinner.name}
            </div>

            <p className="text-xl text-gray-600 mb-2">
              Trúng giải:{" "}
              <span
                className="font-black text-3xl block mt-2"
                style={{
                  color: COLORS.primary.gold,
                  textShadow: `0 2px 10px ${COLORS.primary.gold}40`,
                }}
              >
                {spinHistory[spinHistory.length - 1]?.prize?.description ||
                  spinHistory[spinHistory.length - 1]?.prize?.name ||
                  "N/A"}
              </span>
            </p>

            <p className="text-sm text-gray-500 mb-8">
              🎁 {spinHistory[spinHistory.length - 1]?.prize?.name || ""}
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={spinWheel}
                disabled={!canSpin}
                className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50"
                style={{
                  background: canSpin
                    ? `linear-gradient(135deg, ${COLORS.primary.gold} 0%, #DAA520 100%)`
                    : "#9CA3AF",
                  color: "#1F2937",
                  border: "2px solid #FFF",
                }}
                whileHover={canSpin ? { scale: 1.05 } : {}}
                whileTap={canSpin ? { scale: 0.95 } : {}}
              >
                Quay Lại
              </motion.button>

              <motion.button
                onClick={resetGame}
                className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                style={{
                  background: "#FFF",
                  color: COLORS.primary.red,
                  border: `2px solid ${COLORS.primary.gold}`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Chơi Lượt Mới
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
