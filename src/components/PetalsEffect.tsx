'use client';

import React, { useEffect, useState } from 'react';

export default function PetalsEffect() {
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    // Generate 18 floating petals
    const items = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 6,
      size: 14 + Math.random() * 12,
    }));
    setPetals(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute text-pink-300/40 select-none animate-float-slow"
          style={{
            left: `${p.left}%`,
            top: '-30px',
            fontSize: `${p.size}px`,
            animation: `fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          🌸
        </div>
      ))}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-30px) rotate(0deg) translateX(0px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
