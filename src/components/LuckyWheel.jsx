import { ANIMATION_CONFIG, COLORS } from "../utils/constants";
import { Award, Gift, Medal, Sparkles, Trophy } from "lucide-react";

import { motion } from "framer-motion";

// Map icon names to components
const ICON_MAP = {
  Trophy: Trophy,
  Award: Award,
  Medal: Medal,
  Gift: Gift,
};

export const LuckyWheel = ({
  prizes = [], // Danh sách 4 giải thưởng
  selectedUsers = [],
  currentWinner = null,
  isSpinning = false,
}) => {
  const radius = 160;
  const centerSize = 25;
  const displayPrizes = prizes.slice(0, 4); // Chỉ lấy 4 giải

  // Tìm giải thưởng của winner
  const winnerPrizeIndex = currentWinner
    ? displayPrizes.findIndex((p) => p.id === currentWinner.prizeId)
    : -1;

  const targetAngle = winnerPrizeIndex >= 0 ? winnerPrizeIndex * 90 : 0;
  const totalRotation = isSpinning
    ? 360 * ANIMATION_CONFIG.spin.rotations + (360 - targetAngle)
    : 0;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotate: totalRotation }}
        transition={{
          duration: isSpinning ? ANIMATION_CONFIG.spin.duration : 0,
          ease: ANIMATION_CONFIG.spin.easing,
        }}
      >
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="drop-shadow-2xl"
        >
          {displayPrizes.map((prize, index) => {
            const startAngle = (index * 90 - 90) * (Math.PI / 180);
            const endAngle = ((index + 1) * 90 - 90) * (Math.PI / 180);
            const x1 = radius + radius * Math.cos(startAngle);
            const y1 = radius + radius * Math.sin(startAngle);
            const x2 = radius + radius * Math.cos(endAngle);
            const y2 = radius + radius * Math.sin(endAngle);
            const pathData = [
              `M ${radius} ${radius}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 0 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            const isWinner =
              currentWinner &&
              prize.id === currentWinner.prizeId &&
              !isSpinning;

            // 4 màu đỏ phân biệt cho đẹp
            const segmentColors = [
              "#DC2626", // Đỏ tươi (Red 600)
              "#B91C1C", // Đỏ đậm (Red 700)
              "#991B1B", // Đỏ sẫm (Red 800)
              "#EF4444", // Đỏ nhạt (Red 500)
            ];

            const IconComponent = ICON_MAP[prize.icon] || Gift;

            return (
              <g key={prize.id}>
                <path
                  d={pathData}
                  fill={segmentColors[index]}
                  stroke={COLORS.primary.gold}
                  strokeWidth="2"
                  style={{
                    filter: isWinner
                      ? `drop-shadow(0 0 15px ${COLORS.effect.glow})`
                      : "none",
                  }}
                />
                {/* Prize name text */}
                <text
                  x={radius}
                  y={radius - 40}
                  fill={COLORS.neutral.white}
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${index * 90 + 45}, ${radius}, ${radius}) translate(0, ${-radius * 0.5})`}
                  className="pointer-events-none select-none"
                >
                  {prize.name}
                </text>
                {/* Prize description */}
                <text
                  x={radius}
                  y={radius - 30}
                  fill={COLORS.neutral.white}
                  fontSize="10"
                  fontWeight="normal"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${index * 90 + 45}, ${radius}, ${radius}) translate(0, ${-radius * 0.3})`}
                  className="pointer-events-none select-none"
                  opacity="0.9"
                >
                  {prize.description}
                </text>
              </g>
            );
          })}
          <circle
            cx={radius}
            cy={radius}
            r={centerSize}
            fill={COLORS.neutral.dark}
            stroke={COLORS.primary.gold}
            strokeWidth="3"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={isSpinning ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity },
            }}
          >
            <Sparkles className="w-10 h-10 text-yellow-400" />
          </motion.div>
        </div>
      </motion.div>
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
        style={{ filter: `drop-shadow(0 2px 8px ${COLORS.effect.shadow})` }}
      >
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: `30px solid ${COLORS.primary.gold}`,
          }}
        />
      </div>
      {/* REMOVED heavy spinning animations for performance */}
    </div>
  );
};
