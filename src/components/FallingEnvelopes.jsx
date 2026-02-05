import { useEffect, useState } from "react";

import { motion } from "framer-motion";

/**
 * Component animation bong bóng bao lì xì rơi
 * Trigger khi có winner
 */
export const FallingEnvelopes = ({ trigger = false }) => {
  const [envelopes, setEnvelopes] = useState([]);

  useEffect(() => {
    if (trigger) {
      // Tạo 15 bao lì xì rơi từ trên xuống
      const timer = setTimeout(() => {
        const newEnvelopes = Array.from({ length: 15 }, (_, i) => ({
          id: i,
          x: Math.random() * window.innerWidth,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          rotation: Math.random() * 360,
          size: 40 + Math.random() * 30,
        }));
        setEnvelopes(newEnvelopes);

        // Clear sau 5s
        setTimeout(() => setEnvelopes([]), 5000);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (envelopes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {envelopes.map((envelope) => (
        <motion.div
          key={envelope.id}
          className="absolute"
          style={{
            left: envelope.x,
            top: -100,
            fontSize: envelope.size,
          }}
          initial={{ y: -100, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [1, 1, 0.5, 0],
            rotate: [0, envelope.rotation, envelope.rotation * 2],
            x: [0, Math.sin(envelope.id) * 50, Math.sin(envelope.id * 2) * 100],
          }}
          transition={{
            duration: envelope.duration,
            delay: envelope.delay,
            ease: "easeIn",
          }}
        >
          🧧
        </motion.div>
      ))}
    </div>
  );
};
