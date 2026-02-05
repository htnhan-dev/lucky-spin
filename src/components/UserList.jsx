import { useEffect, useRef } from "react";

import { COLORS } from "../utils/constants";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { UserImportModal } from "./UserImportModal";

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
    <div className="h-full flex flex-col p-3! bg-white rounded-xl  border border-solid border-gray-200">
      <div className="mb-4">
        <h2
          className="text-2xl font-black mb-2 text-center"
          style={{ color: COLORS.primary.gold }}
        >
          Danh Sách Người Chơi
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
          <User className="w-4 h-4" />
          <span>{users.length} người tham gia</span>
        </div>

        {/* Import Users Button */}
        {onImportUsers && (
          <div className="flex justify-center">
            <UserImportModal onImportUsers={onImportUsers} />
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 custom-scrollbar overflow-x-hidden"
        style={{ maxHeight: "calc(100vh - 200px)" }}
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
              className="relative p-1!"
              initial={{ opacity: 1, x: 0 }}
              animate={{
                opacity: isNotFocused ? 0.3 : 1, // Làm mờ các user không focus
                x: 0,
              }}
              transition={{ duration: 0.2 }} // Smooth fade in/out
            >
              <motion.div
                className="px-3! py-2! rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: isWinner
                    ? `linear-gradient(135deg, ${COLORS.primary.gold}40, ${COLORS.primary.gold}20)`
                    : isSelected
                      ? `linear-gradient(135deg, ${COLORS.primary.red}30, ${COLORS.primary.red}15)`
                      : isHighlighted
                        ? `linear-gradient(135deg, ${COLORS.accent.amber}40, ${COLORS.accent.amber}20)` // Màu đậm hơn khi highlight
                        : "white",
                  border: `2px solid ${isWinner ? COLORS.primary.gold : isSelected ? COLORS.primary.red : isHighlighted ? COLORS.accent.amber : "#E5E7EB"}`,
                  color:
                    isWinner || isSelected || isHighlighted
                      ? COLORS.neutral.dark
                      : "#6B7280",
                  boxShadow: isHighlighted
                    ? `0 0 30px ${COLORS.accent.amber}80, 0 0 15px ${COLORS.accent.amber}60` // Shadow mạnh hơn (2 layers)
                    : isWinner || isSelected
                      ? `0 4px 12px rgba(0,0,0,0.1)`
                      : "none",
                }}
                animate={{
                  scale: isHighlighted ? 1.08 : 1, // Scale lớn hơn (1.03 → 1.08)
                }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">{user.name}</div>
                  {isSelected && onRemoveSelectedUser && (
                    <button
                      onClick={() => onRemoveSelectedUser(user.id)}
                      className="ml-2 rounded-full w-6 h-6 flex items-center justify-center bg-white text-gray-700 border"
                      title="Bỏ chọn"
                    >
                      ×
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
