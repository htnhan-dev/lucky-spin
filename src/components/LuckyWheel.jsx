import { ANIMATION_CONFIG, COLORS } from "../utils/constants";
import { Award, Gift, Medal, Sparkles, Trophy } from "lucide-react";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Map icon names to components
const ICON_MAP = {
  Trophy: Trophy,
  Award: Award,
  Medal: Medal,
  Gift: Gift,
  Sparkles: Sparkles,
};

export const LuckyWheel = ({
  prizes = [], // Danh sách 5 giải thưởng
  maxPrizeTier = null, // Giải trần từ vòng quay
  isSpinning = false,
  spinDuration = null, // Duration từ useSpinGame (để sync timing)
}) => {
  const radius = 160;
  const centerSize = 20;
  const displayPrizes = prizes.slice(0, 5); // Lấy 5 giải: Đặc biệt, Nhất, Nhì, Ba, Tư

  // Tìm index của giải trần
  const maxPrizeIndex = maxPrizeTier
    ? displayPrizes.findIndex((p) => p.tier === maxPrizeTier)
    : -1;

  const segmentAngle = 360 / displayPrizes.length; // 72° cho mỗi giải
  // Tam giác mốc ở bên phải (0°), thêm offset +10° để không dừng giữa 2 giải
  const angleOffset = 10;

  // useMemo để KHÓA rotation - chỉ tính 1 lần khi maxPrizeTier thay đổi
  const finalRotation = useMemo(() => {
    const maxPrizeIndex = maxPrizeTier
      ? displayPrizes.findIndex((p) => p.tier === maxPrizeTier)
      : -1;

    if (maxPrizeIndex < 0) return 0;

    const segmentCenterAngle = maxPrizeIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = segmentCenterAngle - angleOffset;
    return 360 * ANIMATION_CONFIG.spin.rotations - targetAngle;
  }, [maxPrizeTier, displayPrizes, segmentAngle, angleOffset]);

  // Sử dụng spinDuration từ prop (đã tính trong useSpinGame), fallback nếu không có
  const actualDuration =
    spinDuration ||
    (typeof ANIMATION_CONFIG.spin.duration === "function"
      ? ANIMATION_CONFIG.spin.duration()
      : ANIMATION_CONFIG.spin.duration);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        key={`wheel-${maxPrizeTier || "initial"}`} // Force reset khi chơi vòng mới
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
          transformStyle: "preserve-3d",
        }}
        initial={{ rotate: 0 }}
        animate={
          isSpinning ? { rotate: finalRotation } : { rotate: finalRotation }
        }
        transition={
          isSpinning
            ? {
                duration: actualDuration,
                ease: ANIMATION_CONFIG.spin.easing,
              }
            : { duration: 0 } // Khi dừng: không animation (giữ nguyên vị trí)
        }
      >
        <svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="drop-shadow-2xl"
        >
          {displayPrizes.map((prize, index) => {
            // Tam giác mốc ở bên phải (0°), segment index 0 bắt đầu từ 0°
            const startAngle = index * segmentAngle * (Math.PI / 180);
            const endAngle = (index + 1) * segmentAngle * (Math.PI / 180);
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

            const isMaxPrize =
              maxPrizeTier && prize.tier === maxPrizeTier && !isSpinning;

            // 5 màu đỏ phân biệt cho 5 giải
            const segmentColors = [
              "#DC2626", // Đỏ tươi - Đặc biệt
              "#B91C1C", // Đỏ đậm - Nhất
              "#991B1B", // Đỏ sẫm - Nhì
              "#EF4444", // Đỏ nhạt - Ba
              "#F87171", // Đỏ rất nhạt - Tư
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
                    filter: isMaxPrize
                      ? `drop-shadow(0 0 20px ${COLORS.primary.gold}) drop-shadow(0 0 30px ${COLORS.effect.glow})`
                      : "none",
                    opacity: isMaxPrize
                      ? 1
                      : !isSpinning && maxPrizeTier
                        ? 0.6
                        : 1,
                  }}
                />
                {/* Dòng 1: Tên giải (displayName) */}
                <text
                  x={radius}
                  y={radius - 45}
                  fill={COLORS.neutral.white}
                  fontSize="12"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${index * segmentAngle + segmentAngle / 2 + 90}, ${radius}, ${radius}) translate(0, ${-radius * 0.55})`}
                  className="pointer-events-none select-none"
                  style={{
                    filter: isMaxPrize
                      ? `drop-shadow(0 0 4px ${COLORS.primary.gold})`
                      : "none",
                  }}
                >
                  {prize.displayName || prize.name}
                </text>
                {/* Dòng 2: Giá trị (displayValue) */}
                <text
                  x={radius}
                  y={radius - 40}
                  fill={COLORS.neutral.white}
                  fontSize="15"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${index * segmentAngle + segmentAngle / 2 + 90}, ${radius}, ${radius}) translate(0, ${-radius * 0.38})`}
                  className="pointer-events-none select-none"
                  style={{
                    filter: isMaxPrize
                      ? `drop-shadow(0 0 4px ${COLORS.primary.gold})`
                      : "none",
                  }}
                >
                  {prize.displayValue || prize.description}
                </text>
                {/* Emoji bao lì xì nhỏ ở dưới */}
                <text
                  x={radius}
                  y={radius - 25}
                  fontSize="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${index * segmentAngle + segmentAngle / 2 + 90}, ${radius}, ${radius}) translate(0, ${-radius * 0.22})`}
                  className="pointer-events-none select-none"
                >
                  {prize.emoji || "🧧"}
                </text>
                {/* Highlight overlay cho giải được chọn */}
                {isMaxPrize && (
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke={COLORS.primary.gold}
                    strokeWidth="4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
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
      {/* Tam giác chỉ định - Ở BÊN PHẢI, CHỈ SANG TRÁI (vào vòng quay) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 z-10"
        style={{
          right: "-40px",
          filter: `drop-shadow(0 2px 8px ${COLORS.effect.shadow})`,
        }}
      >
        <div
          className="w-0 h-0"
          style={{
            borderTop: "20px solid transparent",
            borderBottom: "20px solid transparent",
            borderRight: `30px solid ${COLORS.primary.gold}`,
          }}
        />
      </div>
      {/* REMOVED heavy spinning animations for performance */}
    </div>
  );
};
