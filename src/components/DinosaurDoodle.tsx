import React from "react";

interface DinosaurDoodleProps {
  state: "idle" | "thinking" | "correct" | "incorrect";
  size?: number;
}

export const DinosaurDoodle: React.FC<DinosaurDoodleProps> = ({ state, size = 160 }) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center transition-all duration-300"
      style={{ width: size, height: size }}
    >
      {/* Interactive Thinking Bubbles / Stars / Tears */}
      {state === "thinking" && (
        <div className="absolute -top-6 -right-2 flex space-x-1 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-60"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-80"></div>
          <div className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-bold shadow-sm">
            Thinking...
          </div>
        </div>
      )}

      {state === "correct" && (
        <div className="absolute -top-8 flex space-x-2 animate-bounce">
          <span className="text-xl">⭐</span>
          <span className="text-lg text-yellow-500 animate-ping">✨</span>
          <span className="text-xl">👑</span>
        </div>
      )}

      {state === "incorrect" && (
        <div className="absolute -top-8 flex flex-col items-center animate-pulse">
          <div className="bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium px-2 py-1 rounded-lg shadow-sm">
            💡 加油,再想想!
          </div>
          <div className="w-2 h-2 bg-amber-100 border-r border-b border-amber-300 rotate-45 -mt-1"></div>
        </div>
      )}

      {/* Main Dinosaur SVG */}
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full transition-transform duration-300 ${
          state === "correct" ? "animate-bounce scale-110" : ""
        } ${state === "incorrect" ? "animate-wiggle" : ""}`}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="dinoSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" /> {/* green-400 */}
            <stop offset="100%" stopColor="#15803d" /> {/* green-700 */}
          </linearGradient>
          <linearGradient id="dinoBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" /> {/* yellow-200 */}
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="dinoSpikes" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" /> {/* rose-400 */}
            <stop offset="100%" stopColor="#be123c" /> {/* rose-700 */}
          </linearGradient>
        </defs>

        {/* Tail (Back side) */}
        <path
          d="M 50 130 Q 10 150 15 110 Q 20 80 40 100 Z"
          fill="url(#dinoSkin)"
          className="origin-right transition-transform"
          style={{
            animation: state === "correct" 
              ? "dinoTailWag 0.4s infinite alternate" 
              : "dinoTailWag 2s infinite alternate ease-in-out"
          }}
        />

        {/* Spikes on Tail & Back */}
        <g fill="url(#dinoSpikes)">
          {/* Spike 1 on tail */}
          <polygon points="12,100 25,95 20,112" />
          {/* Spike 2 on back */}
          <polygon points="45,65 60,50 65,70" />
          {/* Spike 3 on head */}
          <polygon points="85,32 105,15 110,40" />
          {/* Spike 4 on head */}
          <polygon points="120,32 140,15 142,40" />
        </g>

        {/* Left Foot */}
        <ellipse cx="75" cy="170" rx="16" ry="10" fill="#166534" />
        <ellipse cx="75" cy="168" rx="14" ry="8" fill="url(#dinoSkin)" />
        <ellipse cx="65" cy="166" rx="3" ry="4" fill="#fef08a" />
        <ellipse cx="75" cy="166" rx="3" ry="4" fill="#fef08a" />
        <ellipse cx="85" cy="166" rx="3" ry="4" fill="#fef08a" />

        {/* Right Foot */}
        <ellipse cx="125" cy="170" rx="16" ry="10" fill="#166534" />
        <ellipse cx="125" cy="168" rx="14" ry="8" fill="url(#dinoSkin)" />
        <ellipse cx="115" cy="166" rx="3" ry="4" fill="#fef08a" />
        <ellipse cx="125" cy="166" rx="3" ry="4" fill="#fef08a" />
        <ellipse cx="135" cy="166" rx="3" ry="4" fill="#fef08a" />

        {/* Body & Head Combined */}
        {/* Soft plump body shape */}
        <path
          d="M 60 140 C 50 100 70 50 100 45 C 140 40 160 70 155 110 C 150 145 130 165 100 165 C 70 165 65 155 60 140 Z"
          fill="url(#dinoSkin)"
        />

        {/* Yellow Belly Patch */}
        <path
          d="M 85 110 C 80 85 110 80 120 100 C 130 115 125 150 110 155 C 95 160 90 140 85 110 Z"
          fill="url(#dinoBelly)"
          opacity="0.95"
        />

        {/* Left Eye */}
        {state === "correct" ? (
          // Happy Eyes (Curve up)
          <path d="M 90 75 Q 100 65 110 75" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
        ) : state === "incorrect" ? (
          // Puzzled/Concerned eyes (Diagonal)
          <g>
            <line x1="90" y1="70" x2="106" y2="80" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            <line x1="90" y1="80" x2="106" y2="70" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
          </g>
        ) : (
          // Normal Twinkling Eye
          <g>
            <circle cx="98" cy="75" r="9" fill="#1e293b" />
            <circle cx="96" cy="72" r="3" fill="#ffffff" /> {/* Twinkle */}
          </g>
        )}

        {/* Right Eye */}
        {state === "correct" ? (
          // Happy Eyes (Curve up)
          <path d="M 130 75 Q 140 65 150 75" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
        ) : state === "incorrect" ? (
          // Puzzled/Concerned eyes (Diagonal)
          <g>
            <line x1="134" y1="70" x2="150" y2="80" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            <line x1="134" y1="80" x2="150" y2="70" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
          </g>
        ) : (
          // Normal Twinkling Eye
          <g>
            <circle cx="142" cy="75" r="9" fill="#1e293b" />
            <circle cx="140" cy="72" r="3" fill="#ffffff" /> {/* Twinkle */}
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="86" cy="84" rx="6" ry="4" fill="#fb7185" opacity="0.6" />
        <ellipse cx="152" cy="84" rx="6" ry="4" fill="#fb7185" opacity="0.6" />

        {/* Mouth */}
        {state === "correct" ? (
          // Huge Open Happy Mouth
          <path
            d="M 110 92 Q 120 115 130 92"
            fill="#be123c"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : state === "incorrect" ? (
          // Flat/Wavy mouth
          <path
            d="M 112 96 Q 118 90 122 96 T 130 96"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : state === "thinking" ? (
          // Cute whistling mouth
          <circle cx="120" cy="95" r="4" fill="none" stroke="#1e293b" strokeWidth="4" />
        ) : (
          // Happy Smile
          <path
            d="M 112 92 Q 120 102 128 92"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* Cute Tiny Dinosaur Hands */}
        {/* Left hand */}
        <path
          d="M 72 115 Q 55 110 60 120"
          stroke="url(#dinoSkin)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          className="origin-right"
          style={{
            animation: state === "correct"
              ? "dinoHandWave 0.2s infinite alternate"
              : state === "thinking"
              ? "dinoHandThink 1s infinite alternate"
              : "none"
          }}
        />

        {/* Right hand */}
        <path
          d="M 148 115 Q 165 110 160 120"
          stroke="url(#dinoSkin)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          className="origin-left"
          style={{
            animation: state === "correct"
              ? "dinoHandWave 0.2s infinite alternate"
              : "none"
          }}
        />
      </svg>

      {/* Styled Animations Injected Dynamically */}
      <style>{`
        @keyframes dinoTailWag {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes dinoHandWave {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-5px) rotate(-15deg); }
        }
        @keyframes dinoHandThink {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-3px) rotate(15deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
