import { useEffect, useRef } from "react";

import { COLORS } from "../utils/constants";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export const UserList = ({
  users,
  selectedUsers = [],
  currentWinner = null,
  highlightedUserId = null,
}) => {
  const containerRef = useRef(null);
  const highlightedItemRef = useRef(null);

  useEffect(() => {
    if (
      highlightedUserId &&
      highlightedItemRef.current &&
      containerRef.current
    ) {
      highlightedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedUserId]);

  const isUserSelected = (userId) => {
    return selectedUsers.some((u) => u.id === userId);
  };

  const isUserWinner = (userId) => {
    return currentWinner && currentWinner.id === userId;
  };

  return (
    <div className="h-full flex flex-col !p-3 bg-white rounded-xl  border border-solid border-gray-200">
      <div className="mb-6">
        <h2
          className="text-2xl font-black mb-2 text-center"
          style={{ color: COLORS.primary.gold }}
        >
          Danh Sách Người Chơi
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>{users.length} người tham gia</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {users.map((user, index) => {
          const isSelected = isUserSelected(user.id);
          const isWinner = isUserWinner(user.id);
          const isHighlighted = highlightedUserId === user.id;

          return (
            <motion.div
              key={user.id}
              ref={isHighlighted ? highlightedItemRef : null}
              className="relative !p-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.div
                className="!px-3 !py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: isWinner
                    ? `linear-gradient(135deg, ${COLORS.primary.gold}40, ${COLORS.primary.gold}20)`
                    : isSelected
                      ? `linear-gradient(135deg, ${COLORS.primary.red}30, ${COLORS.primary.red}15)`
                      : isHighlighted
                        ? `linear-gradient(135deg, ${COLORS.accent.amber}25, ${COLORS.accent.amber}10)`
                        : "white",
                  border: `2px solid ${isWinner ? COLORS.primary.gold : isSelected ? COLORS.primary.red : isHighlighted ? COLORS.accent.amber : "#E5E7EB"}`,
                  color:
                    isWinner || isSelected || isHighlighted
                      ? COLORS.neutral.dark
                      : "#6B7280",
                  boxShadow: isHighlighted
                    ? `0 0 20px ${COLORS.accent.amber}50`
                    : isWinner || isSelected
                      ? `0 4px 12px rgba(0,0,0,0.1)`
                      : "none",
                }}
                animate={{
                  scale: isHighlighted ? 1.03 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                {user.name}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
