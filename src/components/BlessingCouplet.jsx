import { AnimatePresence, motion } from "framer-motion";

import bgBlessing from "../assets/bg-blessing.png";

export const BlessingCouplet = ({
  isVisible,
  message,
  userName,
  prizeName,
  hasLuckyStar = false, // Flag để biết có trúng sao không
}) => {
  const [leftLine = "", rightLine = ""] = message
    ? message.split("\n").map((s) => s.trim())
    : [];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop – chỉ làm mờ nền app */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl"
              style={{
                aspectRatio: "16/9",
                maxHeight: "80vh",
              }}
            >
              {/* PURE BACKGROUND IMAGE */}
              <img
                src={bgBlessing}
                alt="Blessing Background"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col gap-3! items-center justify-center text-center px-12 py-2!">
                {/* Header */}
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">
                    CHÚC MỪNG
                  </h2>
                  <p className="text-5xl font-semibold text-white">
                    {userName}
                  </p>
                </div>

                {/* Prize */}
                <div className="mb-6">
                  <p className="text-white text-sm mb-1">Đã trúng bao lì xì</p>
                  <p className="text-4xl font-bold text-yellow-300">
                    {prizeName}
                  </p>

                  {/* Lucky Star */}
                  {hasLuckyStar && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="mt-4 flex items-center justify-center gap-2"
                    >
                      <span className="text-6xl">⭐</span>
                      <div className="text-left">
                        <p className="text-2xl font-black text-yellow-400">
                          NGÔI SAO HI VỌNG!
                        </p>
                        <p className="text-sm text-yellow-200">
                          Chúc mừng bạn đã trúng ngôi sao may mắn
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Blessing text */}
                <div className="space-y-2 max-w-2xl">
                  {leftLine && (
                    <p className="text-2xl font-medium text-white">
                      {leftLine}
                    </p>
                  )}
                  {rightLine && (
                    <p className="text-2xl font-medium text-white">
                      {rightLine}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
