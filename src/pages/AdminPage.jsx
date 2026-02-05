import { ArrowLeft, RotateCcw, Save, Settings } from "lucide-react";

import { COLORS } from "../utils/constants";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePrizes } from "../contexts/PrizeContext";
import { useState } from "react";

export const AdminPage = () => {
  const { prizes, updatePrizeQuantity, updatePrizeWeight, resetPrizes } =
    usePrizes();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn reset về cài đặt mặc định?")) {
      resetPrizes();
    }
  };

  const totalWeight = prizes.reduce((sum, p) => sum + (p.weight || 1), 0);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(135deg, ${COLORS.neutral.dark} 0%, ${COLORS.neutral.gray} 100%)`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-3 rounded-xl hover:bg-white/10 transition-colors"
                style={{ color: COLORS.primary.gold }}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1
                  className="text-4xl font-bold"
                  style={{ color: COLORS.primary.gold }}
                >
                  <Settings className="inline w-8 h-8 mr-3" />
                  Admin Control Panel
                </h1>
                <p className="text-gray-400 mt-1">
                  Quản lý số lượng và tỷ lệ giải thưởng
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors"
                style={{ color: COLORS.neutral.white }}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
                style={{
                  background: saved
                    ? COLORS.accent.green
                    : `linear-gradient(135deg, ${COLORS.primary.red} 0%, ${COLORS.primary.darkRed} 100%)`,
                  color: COLORS.neutral.white,
                  border: `2px solid ${COLORS.primary.gold}`,
                }}
              >
                <Save className="w-5 h-5" />
                {saved ? "Đã Lưu!" : "Lưu"}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prizes.map((prize, index) => {
            const percentage = (
              ((prize.weight || 1) / totalWeight) *
              100
            ).toFixed(1);

            return (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl p-6"
                style={{
                  background: `${COLORS.neutral.gray}CC`,
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${prize.color}40`,
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${prize.color}40 0%, ${prize.color}20 100%)`,
                      border: `2px solid ${prize.color}`,
                    }}
                  >
                    <span className="text-3xl">{prize.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: prize.color }}
                    >
                      {prize.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {prize.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-300">
                        Số lượng
                      </label>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: prize.color }}
                      >
                        {prize.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updatePrizeQuantity(prize.id, prize.quantity - 1)
                        }
                        className="w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={prize.quantity}
                        onChange={(e) =>
                          updatePrizeQuantity(
                            prize.id,
                            parseInt(e.target.value),
                          )
                        }
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${prize.color} 0%, ${prize.color} ${prize.quantity}%, ${COLORS.neutral.gray} ${prize.quantity}%, ${COLORS.neutral.gray} 100%)`,
                        }}
                      />
                      <button
                        onClick={() =>
                          updatePrizeQuantity(prize.id, prize.quantity + 1)
                        }
                        className="w-10 h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-300">
                        Tỷ lệ ra ({percentage}%)
                      </label>
                      <span
                        className="text-lg font-bold"
                        style={{ color: COLORS.primary.gold }}
                      >
                        ×{prize.weight || 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updatePrizeWeight(prize.id, (prize.weight || 1) - 0.5)
                        }
                        className="w-10 h-10 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={prize.weight || 1}
                        onChange={(e) =>
                          updatePrizeWeight(
                            prize.id,
                            parseFloat(e.target.value),
                          )
                        }
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${COLORS.primary.gold} 0%, ${COLORS.primary.gold} ${((prize.weight || 1) / 10) * 100}%, ${COLORS.neutral.gray} ${((prize.weight || 1) / 10) * 100}%, ${COLORS.neutral.gray} 100%)`,
                        }}
                      />
                      <button
                        onClick={() =>
                          updatePrizeWeight(prize.id, (prize.weight || 1) + 0.5)
                        }
                        className="w-10 h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div
                      className="mt-2 h-3 rounded-full overflow-hidden"
                      style={{ background: COLORS.neutral.darkest }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${prize.color} 0%, ${prize.color}80 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
