import { COLORS, TET_BLESSINGS } from "../utils/constants";
import {
  Calendar,
  Download,
  History,
  RefreshCw,
  RotateCw,
  Trophy,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useCallback, useEffect, useState } from "react";

import { BlessingCouplet } from "../components/BlessingCouplet";
import { Button } from "../components/ui/button";
import { FallingEnvelopes } from "../components/FallingEnvelopes";
import { LuckyWheel } from "../components/LuckyWheel";
import { PrizeList } from "../components/PrizeList";
import { RedEnvelope } from "../components/RedEnvelope";
import { SAMPLE_USERS } from "../utils/mockData";
import { UserImportModal } from "../components/UserImportModal";
import { UserList } from "../components/UserList";
import bgColumn from "../assets/bg-column2.png";
import bgImage from "../assets/bg.png";
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
  const [showHistory, setShowHistory] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [blessingModal, setBlessingModal] = useState({
    show: false,
    message: "",
    userName: "",
    prizeName: "",
  });

  // Auto-hide blessing couplet sau 2 giây
  useEffect(() => {
    if (blessingModal.show) {
      const timer = setTimeout(() => {
        setBlessingModal((prev) => ({ ...prev, show: false }));
      }, 1250); // 2 giây

      return () => clearTimeout(timer);
    }
  }, [blessingModal.show]);

  const handleImportUsers = (importedUsers) => {
    setUsers(importedUsers);
    setShowImportModal(false);
  };

  const handleResetAll = () => {
    if (confirm("Bạn có chắc muốn reset tất cả giải thưởng và game?")) {
      resetPrizes(); // Reset prizes về mặc định
      resetGame(); // Reset game state
      window.location.reload(); // Reload để apply changes
      // xóa localStorage
      localStorage.clear();
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
    currentSpinDuration,
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
    allEnvelopesRevealed,
  } = useSpinGame(users, prizes, updatePrizeQuantity);

  // Wrapper function to show blessing modal when revealing envelope
  const handleRevealEnvelope = useCallback(
    (index) => {
      const allocation = userPrizes[index];
      if (allocation) {
        // Get random blessing message - safe in event handler
        const randomIndex = Math.floor(Math.random() * TET_BLESSINGS.length);
        const randomBlessing = TET_BLESSINGS[randomIndex];

        // Show blessing modal
        setBlessingModal({
          show: true,
          message: randomBlessing,
          userName: allocation.user.name,
          prizeName:
            allocation.prize.displayValue ||
            allocation.prize.description ||
            allocation.prize.name,
        });

        // Call original reveal function
        revealEnvelope(index);
      }
    },
    [userPrizes, revealEnvelope],
  );

  return (
    //from-slate-50 via-orange-50 to-red-50 - bg old
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center -35px",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
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
        {/* TOP LEFT - Khối Sáng Tạo Sản Phẩm */}
        <motion.div
          className="fixed left-6 top-6 z-20"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div
            className="px-8 py-4 relative overflow-hidden"
            style={{
              backgroundColor: "#C81D25",
              border: "4px solid #FACC15",
              borderRadius: "20px",
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                color: "#FACC15",
                fontWeight: 900,
                fontSize: "24px",
                textShadow:
                  "2px 2px 0 rgba(0,0,0,0.4), 0 0 10px rgba(250, 204, 21, 0.5)",
                fontFamily: "'Noto Serif', 'Playfair Display', serif",
                letterSpacing: "0.05em",
                position: "relative",
                zIndex: 1,
                whiteSpace: "nowrap",
              }}
            >
              Khối Sáng Tạo Sản Phẩm
            </motion.div>
          </div>
        </motion.div>

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
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 12px 0 20px rgba(250,204,21,0.25)",
                borderTopRightRadius: "32px",
                borderBottomRightRadius: "32px",
              }}
            />
            {/* Shimmer effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
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

        {/* Header */}
        {/* 
           <motion.div
          className="text-center pt-2!"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-5xl font-black tracking-tight pt-1!"
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
          */}

        {/* 3-Column Grid Layout - Fixed width with padding for banners */}
        <div className="flex-1 px-6 pb-8 pt-22! m-auto flex items-center justify-center">
          <div className="grid grid-cols-12 gap-6 h-full max-w-7xl">
            {/* LEFT: User List - Scrollable với bg-column */}
            <div className="col-span-3">
              <motion.div
                className="rounded-2xl h-full overflow-hidden relative"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  backgroundImage: `url(${bgColumn})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Overlay để làm mờ background một chút */}
                {/* <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" /> */}

                {/* Content */}
                <div className="relative z-10 h-full">
                  <UserList
                    users={users}
                    selectedUsers={selectedUsers}
                    highlightedUserId={highlightedUserId}
                    onRemoveSelectedUser={removeSelectedUser}
                  />
                </div>
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
                  spinDuration={currentSpinDuration}
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
                      onReveal={() => handleRevealEnvelope(index)}
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
              <div className="flex items-center gap-4">
                {/* Quay vòng quay - Đặc biệt */}
                <Button
                  onClick={spinWheel}
                  disabled={!canSpin || isSpinning}
                  size="lg"
                  className="px-16 py-8 text-xl font-black bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  <RotateCw
                    className={`w-6 h-6 mr-3 ${isSpinning ? "animate-spin" : ""}`}
                  />
                  {isSpinning ? "Đang quay..." : "Quay vòng quay"}
                </Button>

                {/* Chơi vòng mới - Hiển thị khi mở hết 4 bao lì xì */}
                {allEnvelopesRevealed && (
                  <Button
                    onClick={resetGame}
                    size="lg"
                    variant="outline"
                    className="px-12 py-8 text-xl font-bold border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <RefreshCw className="w-6 h-6 mr-3" />
                    Chơi vòng mới
                  </Button>
                )}
              </div>
            </div>

            {/* RIGHT: Prize List với bg-column */}
            <div className="col-span-3">
              <motion.div
                className="rounded-2xl  h-full overflow-hidden relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Overlay để làm mờ background một chút */}
                {/* <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" /> */}

                {/* Content */}
                <div className="relative z-10 h-full">
                  <PrizeList
                    prizes={availablePrizes}
                    spinHistory={spinHistory}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons - Fixed góc phải dưới màn hình */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Nhập danh sách - Gradient tím */}
        <Button
          onClick={() => setShowImportModal(true)}
          className="px-6 py-6 font-bold shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 text-white"
          style={{
            background: `linear-gradient(135deg, #9333EA 0%, #C026D3 100%)`,
          }}
        >
          <Upload className="w-5 h-5 mr-2" />
          Nhập danh sách
        </Button>

        {/* Xem lịch sử - Gradient xanh dương */}
        <Button
          onClick={() => setShowHistory(true)}
          className="px-6 py-6 font-bold shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 text-white"
          style={{
            background: `linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)`,
          }}
        >
          <History className="w-5 h-5 mr-2" />
          Lịch sử ({spinHistory.length})
        </Button>

        {/* Reset All - Gradient đỏ */}
        <Button
          onClick={handleResetAll}
          className="px-6 py-6 font-bold shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-110 text-white"
          style={{
            background: `linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)`,
          }}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Reset Tất Cả
        </Button>
      </div>

      {/* Modal Import Users */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent>
          <UserImportModal onImportUsers={handleImportUsers} />
        </DialogContent>
      </Dialog>

      {/* Modal lịch sử - Shadcn Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
          {/* Header - Minimalist */}
          <DialogHeader className="px-6! py-5! border-b bg-white">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <History className="w-6 h-6 text-gray-700" />
              Lịch sử quay thưởng
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] px-6! py-6! bg-gray-50">
            {spinHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-2">
                  Chưa có lịch sử quay thưởng
                </p>
                <p className="text-sm text-gray-500">
                  Hãy bắt đầu quay vòng quay để ghi lại lịch sử
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {spinHistory
                  .slice()
                  .reverse()
                  .map((entry, idx) => (
                    <motion.div
                      key={spinHistory.length - idx - 1}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group bg-white rounded-lg border border-gray-200 p-4! hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-6">
                        {/* Left: Number & User */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
                            #{idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-base text-gray-900 truncate">
                                {entry.user.name}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {new Date(entry.timestamp).toLocaleString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Right: Prize */}
                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 border border-red-200 mb-1">
                            <Trophy className="w-4 h-4 text-red-600" />
                            <span className="font-bold text-sm text-red-700">
                              {entry.prize.name}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium">
                            {entry.prize.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer - Minimalist */}
          <DialogFooter className="px-6! py-4! border-t bg-white flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 mr-10!">
              <span className="font-medium">Tổng số:</span>
              <span className="font-bold text-gray-900">
                {spinHistory.length}
              </span>
            </div>

            <Button
              onClick={() => {
                const csv = exportHistoryCSV();
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `lich-su-quay-thuong-${Date.now()}.csv`;
                a.click();
              }}
              variant="outline"
              className="font-semibold ml-8"
              disabled={spinHistory.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blessing Couplet - Hiển thị lời chúc Tết khi mở bao lì xì */}
      <BlessingCouplet
        isVisible={blessingModal.show}
        message={blessingModal.message}
        userName={blessingModal.userName}
        prizeName={blessingModal.prizeName}
      />

      {/* REMOVED: Winner Modal - Không cần nữa vì paper scroll đã hiển thị giải */}
    </div>
  );
};
