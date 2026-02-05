import { LuckyWheel } from "./LuckyWheel";
import { motion } from "framer-motion";

export const LuckySpinArena = ({
  prizes,
  selectedUsers,
  currentWinner,
  isSpinning,
}) => {
  return (
    <div className="relative w-full flex items-center justify-center">
      <motion.div
        className="relative"
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
    </div>
  );
};
