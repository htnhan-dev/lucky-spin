import { COLORS } from "../utils/constants";
import { motion } from "framer-motion";

/**
 * Component hiển thị danh sách 4 người đã được chọn
 * Dạng numbered pills vertical
 */
export const SelectedUsersList = ({ selectedUsers = [] }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-xl font-bold mb-2 text-center"
        style={{ color: COLORS.primary.gold }}
      >
        SELECTED USERS
      </h3>

      {[0, 1, 2, 3].map((index) => {
        const user = selectedUsers[index];
        const isEmpty = !user;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <motion.div
              className="px-6 py-3 rounded-full font-bold text-white text-center"
              style={{
                background: isEmpty
                  ? COLORS.neutral.gray
                  : `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.darkRed} 100%)`,
                border: `2px solid ${isEmpty ? COLORS.neutral.lightGray : COLORS.primary.gold}`,
                boxShadow: isEmpty
                  ? "none"
                  : `0 0 20px ${COLORS.primary.gold}60`,
              }}
              whileHover={!isEmpty ? { scale: 1.05 } : {}}
            >
              {isEmpty ? (
                <span className="text-gray-500">
                  {index + 1}. Click envelope...
                </span>
              ) : (
                <span>
                  {index + 1}. {user.name}
                </span>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
