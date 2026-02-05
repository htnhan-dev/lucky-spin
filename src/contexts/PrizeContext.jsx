import { createContext, useContext, useEffect, useState } from "react";

import { SAMPLE_PRIZES } from "../utils/mockData";

const PrizeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePrizes = () => {
  const context = useContext(PrizeContext);
  if (!context) {
    throw new Error("usePrizes must be used within PrizeProvider");
  }
  return context;
};

export const PrizeProvider = ({ children }) => {
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem("spin-reward-prizes");
    return saved ? JSON.parse(saved) : SAMPLE_PRIZES;
  });

  useEffect(() => {
    localStorage.setItem("spin-reward-prizes", JSON.stringify(prizes));
  }, [prizes]);

  const updatePrize = (prizeId, updates) => {
    setPrizes((prev) =>
      prev.map((prize) =>
        prize.id === prizeId ? { ...prize, ...updates } : prize,
      ),
    );
  };

  const updatePrizeQuantity = (prizeId, quantity) => {
    updatePrize(prizeId, { quantity: Math.max(0, quantity) });
  };

  const updatePrizeWeight = (prizeId, weight) => {
    updatePrize(prizeId, { weight: Math.max(0, weight) });
  };

  const resetPrizes = () => {
    setPrizes(SAMPLE_PRIZES);
  };

  const getWeightedRandomPrize = (availablePrizes) => {
    const validPrizes = availablePrizes.filter((p) => p.quantity > 0);
    if (validPrizes.length === 0) return null;

    const totalWeight = validPrizes.reduce(
      (sum, p) => sum + (p.weight || 1),
      0,
    );
    let random = Math.random() * totalWeight;

    for (const prize of validPrizes) {
      random -= prize.weight || 1;
      if (random <= 0) return prize;
    }

    return validPrizes[0];
  };

  return (
    <PrizeContext.Provider
      value={{
        prizes,
        updatePrize,
        updatePrizeQuantity,
        updatePrizeWeight,
        resetPrizes,
        getWeightedRandomPrize,
      }}
    >
      {children}
    </PrizeContext.Provider>
  );
};
