import { useEffect, useRef } from "react";

import { COLORS } from "../utils/constants";
import { User } from "lucide-react";
import { UserImportModal } from "./UserImportModal";
import { motion } from "framer-motion";

export const UserList = ({
  users,
  selectedUsers = [],
  currentWinner = null,
  highlightedUserId = null,
  onRemoveSelectedUser = null,
  onImportUsers = null,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (highlightedUserId && containerRef.current) {
      const container = containerRef.current;

      // Tìm element bằng data-user-id
      const item = container.querySelector(
        `[data-user-id="${highlightedUserId}"]`,
      );

      if (item) {
        try {
          item.scrollIntoView({
            behavior: "smooth", // Smooth scroll để mượt mà
            block: "center",
            inline: "nearest",
          });
        } catch (error) {
          // Fallback: Manual scroll
          const containerRect = container.getBoundingClientRect();
          const itemRect = item.getBoundingClientRect();
          const scrollTop = container.scrollTop;
          const itemRelativeTop = itemRect.top - containerRect.top;
          const targetScroll =
            scrollTop +
            itemRelativeTop -
            containerRect.height / 2 +
            itemRect.height / 2;

          container.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        }
      }
    }
  }, [highlightedUserId]);

  const isUserSelected = (userId) => {
    return selectedUsers.some((u) => u.id === userId);
  };

  const isUserWinner = (userId) => {
    return currentWinner && currentWinner.id === userId;
  };

  return (
    <div className="h-full flex flex-col p-7!">
      <div className="mt-14!">
        <h2 className="text-xl font-black mb-2 text-center text-white">
          Danh Sách Người Chơi
        </h2>
        {/* <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>{users.length} người tham gia</span>
        </div> */}
      </div>

      <div
        ref={containerRef}
        className="flex-1 mt-3! p-2! space-y-3 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 310px)" }}
      >
        {users.map((user, index) => {
          const isSelected = isUserSelected(user.id);
          const isWinner = isUserWinner(user.id);
          const isHighlighted = highlightedUserId === user.id;
          const isNotFocused = highlightedUserId && !isHighlighted; // Có user đang được highlight nhưng không phải user này

          return (
            <motion.div
              key={user.id}
              data-user-id={user.id}
              className="relative flex items-center gap-3 px-4 py-3 mb-2! rounded-lg bg-white/95 backdrop-blur-sm"
              style={{
                opacity: isNotFocused ? 0.5 : 1,
                boxShadow:
                  isWinner || isSelected
                    ? "0 4px 12px rgba(0,0,0,0.1)"
                    : "0 2px 6px rgba(0,0,0,0.05)",
              }}
              initial={{ opacity: 1, x: 0 }}
              animate={{
                opacity: isNotFocused ? 0.5 : 1,
                scale: isHighlighted ? 1.02 : 1,
                x: 0,
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Left Border Light Effect - 2 layers */}
              {(isSelected || isWinner) && (
                <>
                  {/* Outer glow */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                    style={{
                      background: isWinner
                        ? `linear-gradient(180deg, ${COLORS.primary.gold} 0%, #F59E0B 50%, ${COLORS.primary.gold} 100%)`
                        : `linear-gradient(180deg, #EF4444 0%, #DC2626 50%, #EF4444 100%)`,
                      boxShadow: isWinner
                        ? `0 0 20px ${COLORS.primary.gold}, 0 0 10px ${COLORS.primary.gold}80`
                        : `0 0 20px #EF4444, 0 0 10px #DC2626`,
                    }}
                  />
                  {/* Inner bright line */}
                  <div
                    className="absolute left-1 top-1 bottom-1 w-0.5 rounded-l-lg"
                    style={{
                      background: isWinner
                        ? "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.9) 100%)"
                        : "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.9) 100%)",
                      boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                    }}
                  />
                </>
              )}

              {/* Highlighted pulse effect */}
              {isHighlighted && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    boxShadow: `0 0 30px ${COLORS.accent.amber}80, inset 0 0 20px ${COLORS.accent.amber}40`,
                    border: `2px solid ${COLORS.accent.amber}60`,
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: isWinner
                    ? `linear-gradient(135deg, ${COLORS.primary.gold}, #EAB308)`
                    : isSelected
                      ? `linear-gradient(135deg, #EF4444, #DC2626)`
                      : isHighlighted
                        ? `linear-gradient(135deg, ${COLORS.accent.amber}, ${COLORS.accent.amber}80)`
                        : `linear-gradient(135deg, #F3F4F6, #E5E7EB)`,
                  boxShadow:
                    isWinner || isSelected
                      ? "0 2px 8px rgba(0,0,0,0.15)"
                      : "none",
                }}
              >
                <User
                  className="w-5 h-5"
                  style={{
                    color:
                      isWinner || isSelected || isHighlighted
                        ? "white"
                        : COLORS.neutral.gray,
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <p
                  className="font-bold text-sm truncate"
                  style={{
                    color: isWinner
                      ? COLORS.primary.gold
                      : isSelected
                        ? "#DC2626"
                        : isHighlighted
                          ? COLORS.accent.amber
                          : COLORS.neutral.dark,
                    fontWeight: isWinner || isSelected ? "900" : "600",
                  }}
                >
                  {user.name}
                </p>
                {isSelected && onRemoveSelectedUser && (
                  <button
                    onClick={() => onRemoveSelectedUser(user.id)}
                    className="ml-2 rounded-full w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 transition-colors shrink-0"
                    title="Bỏ chọn"
                  >
                    ×
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
