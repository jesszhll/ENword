import React from "react";
import { RewardCard } from "../data/vocabulary";

interface DinosaurCardProps {
  card: RewardCard;
  isLocked?: boolean;
  onClose?: () => void;
  showCollectButton?: boolean;
  onCollect?: () => void;
}

export const DinosaurCard: React.FC<DinosaurCardProps> = ({
  card,
  isLocked = false,
  onClose,
  showCollectButton = false,
  onCollect
}) => {
  return (
    <div className="relative group perspective-1000 w-full max-w-sm mx-auto">
      {/* Glow effect behind active cards */}
      {!isLocked && (
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${card.color} opacity-40 blur-xl group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>
      )}

      {/* Card Body */}
      <div 
        className={`relative flex flex-col rounded-2xl border-4 border-slate-700 bg-white shadow-2xl transition-all duration-500 overflow-hidden ${
          isLocked ? "grayscale opacity-50 cursor-not-allowed" : "hover:-translate-y-2 hover:rotate-1"
        }`}
      >
        {/* Elemental Top Header Ribbon */}
        <div className={`h-12 bg-gradient-to-r ${card.color} flex items-center justify-between px-4 text-white font-bold tracking-wider shadow-md`}>
          <span className="flex items-center gap-1.5 text-sm sm:text-base">
            🦖 {card.cardName}
          </span>
          <span className="text-xs bg-slate-900/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {card.type}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-14 right-4 w-10 h-10 rounded-full bg-slate-800 text-yellow-300 font-extrabold flex items-center justify-center border-2 border-yellow-300 text-sm shadow-md z-10">
          L{card.level}
        </div>

        {/* Dinosaur Illustration Showcase Container */}
        <div className="relative h-44 bg-slate-100 flex items-center justify-center p-4 border-b-2 border-slate-200 overflow-hidden">
          {/* Decorative background grids */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30"></div>
          
          {/* Circular spotlight */}
          <div className={`absolute w-32 h-32 rounded-full bg-gradient-to-b ${card.color} opacity-20 blur-md`}></div>
          
          {/* Dino Icon Wrapper */}
          <div className="relative z-10 text-7xl transform transition-transform duration-500 group-hover:scale-110">
            {/* Pick appropriate icon based on level */}
            {card.level === 1 && "🦖"}
            {card.level === 2 && "🦕"}
            {card.level === 3 && "🦒"}
            {card.level === 4 && "🦅"}
            {card.level === 5 && "🛡️"}
            {card.level === 6 && "⚡"}
            {card.level === 7 && "🔨"}
            {card.level === 8 && "🦈"}
            {card.level === 9 && "🎵"}
            {card.level === 10 && "👑"}
          </div>

          {/* Shimmer overlay effect */}
          {!isLocked && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          )}
        </div>

        {/* Card Metadata & Story */}
        <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
          <div>
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {card.dinoName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mb-2">
                🏆 勋章称号：{card.badgeName}
              </p>
            </div>

            {/* Lore Description */}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/50 mb-4 font-medium text-center">
              {card.description}
            </p>
          </div>

          {/* Skills Stats Meter */}
          <div className="space-y-2 mb-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">
              ⭐ 属性面板 (Stats)
            </h4>
            {card.skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{skill.label}</span>
                  <span>{isLocked ? "???" : `${skill.value} pt`}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/30">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out`}
                    style={{ width: isLocked ? "0%" : `${skill.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Locked Overlay text if applicable */}
          {isLocked && (
            <div className="mt-2 text-center text-xs font-bold text-slate-400 bg-slate-200/50 py-1.5 rounded-lg border border-slate-300 border-dashed">
              🔒 通关第 {card.level} 关解锁此卡牌
            </div>
          )}

          {/* Interactive buttons */}
          {!isLocked && (showCollectButton || onClose) && (
            <div className="mt-4 flex gap-2">
              {showCollectButton && onCollect && (
                <button
                  id="collect-card-btn"
                  onClick={onCollect}
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${card.color} hover:shadow-lg transform active:scale-95 transition-all shadow-md`}
                >
                  🎉 收入卡牌包
                </button>
              )}
              {onClose && (
                <button
                  id="close-card-btn"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl border border-slate-300 transition-all active:scale-95"
                >
                  关闭
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
