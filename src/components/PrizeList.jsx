import * as LucideIcons from "lucide-react";

import { COLORS } from "../utils/constants";
import { motion } from "framer-motion";

export const PrizeList = ({ prizes, spinHistory }) => {
  const getIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent || LucideIcons.Gift;
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2
          className="text-2xl font-black mb-2 text-center"
          style={{ color: COLORS.primary.red }}
        >
          Giải thưởng
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <LucideIcons.Trophy className="w-4 h-4" />
          <span>{prizes.length} giải thưởng</span>
        </div>
      </div>

      <div className="flex-1 mt-3! p-2! space-y-3 overflow-y-auto custom-scrollbar">
        {prizes.map((prize, index) => {
          const Icon = getIcon(prize.icon);
          return (
            <motion.div
              key={prize.id}
              className="flex items-center gap-3 p-3! mb-2! rounded-xl bg-white border-2"
              style={{
                borderColor:
                  prize.quantity > 0 ? COLORS.neutral.lightGray : "#E5E7EB",
                opacity: prize.quantity > 0 ? 1 : 0.5,
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: prize.quantity > 0 ? 1 : 0.5, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary.red}20, ${COLORS.primary.gold}20)`,
                }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: COLORS.primary.red }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: COLORS.primary.darkRed }}
                >
                  {prize.name}
                </p>
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: COLORS.neutral.gray }}
                >
                  {prize.description}
                </p>
                <p className="text-xs text-gray-500">
                  Còn {prize.quantity} giải
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
