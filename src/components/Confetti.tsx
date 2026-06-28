import React, { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number; // initial horizontal position %
  color: string;
  size: number; // width/height in px
  delay: number; // animation delay in seconds
  duration: number; // animation duration in seconds
  shape: "circle" | "rect" | "triangle";
  rotation: number;
}

const COLORS = [
  "#f43f5e", // rose-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#eab308", // yellow-500
  "#ec4899", // pink-500
  "#8b5cf6", // purple-500
  "#f97316", // orange-500
  "#06b6d4"  // cyan-500
];

const SHAPES: ("circle" | "rect" | "triangle")[] = ["circle", "rect", "triangle"];

export const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const newPieces: ConfettiPiece[] = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // 0% to 100% of screen width
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 12 + 8, // 8px to 20px
      delay: Math.random() * 2.5, // staggered starts
      duration: Math.random() * 3.5 + 2.5, // 2.5s to 6s fall time
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      rotation: Math.random() * 360
    }));

    setPieces(newPieces);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => {
        let shapeClass = "";
        if (p.shape === "circle") {
          shapeClass = "rounded-full";
        } else if (p.shape === "triangle") {
          shapeClass = "clip-path-triangle";
        }

        return (
          <div
            key={p.id}
            className={`absolute top-0 opacity-90 animate-fall ${shapeClass}`}
            style={{
              left: `${p.x}%`,
              backgroundColor: p.shape === "triangle" ? "transparent" : p.color,
              borderBottomColor: p.shape === "triangle" ? p.color : undefined,
              width: `${p.size}px`,
              height: p.shape === "triangle" ? "0" : `${p.size}px`,
              borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
              borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
              borderBottom: p.shape === "triangle" ? `${p.size}px solid` : undefined,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`
            }}
          />
        );
      })}

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0);
            opacity: 1;
          }
          50% {
            translateX: 20px;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(-20px);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .clip-path-triangle {
          width: 0;
          height: 0;
        }
      `}</style>
    </div>
  );
};
