import React, { useState, useEffect, useRef } from "react";
import { 
  VOCABULARY_DATA, 
  REWARD_CARDS, 
  getWordsForLevel, 
  VocabularyItem, 
  RewardCard 
} from "./data/vocabulary";
import { DinosaurDoodle } from "./components/DinosaurDoodle";
import { DinosaurCard } from "./components/DinosaurCard";
import { Confetti } from "./components/Confetti";
import { VocabularyEditorScreen } from "./components/VocabularyEditorScreen";
import { 
  Volume2, 
  HelpCircle, 
  Trophy, 
  ArrowRight, 
  CheckCircle, 
  RefreshCw, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Award,
  ChevronRight,
  Home,
  Trash2,
  Play,
  Check,
  Eye,
  EyeOff,
  Star,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";

// Synthesize satisfying arcade-like game audio effects locally using Web Audio API
const playSound = (type: "correct" | "incorrect" | "victory" | "click") => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "correct") {
      // Rising major-third double-chime (C5 -> E5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain1.gain.linearRampToValueAtTime(0, now + 0.2);
      osc1.start(now);
      osc1.stop(now + 0.22);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0, now + 0.35);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.37);
    } else if (type === "incorrect") {
      // Disappointing slide down
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === "victory") {
      // Happy fanfare
      const playFanfareNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
        gain.gain.linearRampToValueAtTime(0, start + duration);
        osc.start(start);
        osc.stop(start + duration + 0.05);
      };
      playFanfareNote(261.63, now, 0.15); // C4
      playFanfareNote(329.63, now + 0.12, 0.15); // E4
      playFanfareNote(392.00, now + 0.24, 0.15); // G4
      playFanfareNote(523.25, now + 0.36, 0.5); // C5
    }
  } catch (e) {
    console.warn("Audio Context is blocked or not supported on this browser:", e);
  }
};

// Standard Text-To-Speech Pronunciation engine for English learning
const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any currently speaking voice
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.82; // slightly slower for children's digestion
    window.speechSynthesis.speak(utterance);
  }
};

// Fun kid-friendly congratulations words for correct answers
const CONGRATULATIONS = [
  "太棒了！你是个拼写小达人！🦖🌟",
  "真厉害！恐龙宝宝为你疯狂鼓掌！👏👏",
  "完全正确！你的英语底子真扎实！💯🏆",
  "聪明绝顶！继续保持哦！🚀✨",
  "哇，一次就写对，太优秀了！🎉🌻",
  "答对啦！小恐龙高兴地在地上打滚！💃🦖",
  "你真棒！胜利就在眼前，加油！⭐⚡",
  "超级正确！你是最闪亮的那颗单词之星！✨🌈",
  "不可思议！你是恐龙王国的拼写英雄！👑"
];

// Encouraging words for typos
const RETRY_ENCOURAGEMENTS = [
  "加油！再仔细想想，你一定可以的！💪🐾",
  "差一点点就对啦，小恐龙相信你可以写出来！✨🦖",
  "别灰心，小恐龙陪你一起努力，再试一次吧！❤️🦕",
  "检查一下字母，是不是有小调皮字母写反啦？🔍",
  "没关系，多试一次就离胜利更近一步！加油再想想！🌿",
  "敲一敲聪明的小脑袋，词汇能量已经加载99%啦！🧠💡"
];

// Helper to adjust typed casing dynamically matching target word
const adjustCasing = (input: string, correctWord: string): string => {
  if (!correctWord) return input.toLowerCase();
  let result = "";
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const targetChar = correctWord[i];
    if (targetChar) {
      const isTargetUpper = targetChar !== targetChar.toLowerCase() && targetChar === targetChar.toUpperCase();
      if (isTargetUpper) {
        result += char.toUpperCase();
      } else {
        result += char.toLowerCase();
      }
    } else {
      result += char.toLowerCase();
    }
  }
  return result;
};

export interface MistakeRecord {
  id: number;
  word: VocabularyItem;
  wrongCount: number;
  lastTestedTime: number;
  level: number;
}

interface MistakeCardProps {
  record: MistakeRecord;
  onRemove: (id: number) => void;
  onCorrectMastered: (id: number) => void;
  speakWord: (word: string) => void;
  playSound: (type: "correct" | "incorrect" | "click") => void;
}

const MistakeCard: React.FC<MistakeCardProps> = ({
  record,
  onRemove,
  onCorrectMastered,
  speakWord,
  playSound,
}) => {
  const [isSpelling, setIsSpelling] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [showSpelling, setShowSpelling] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [shakeInput, setShakeInput] = useState<boolean>(false);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const checkInPlace = () => {
    if (!userInput.trim()) return;

    const normalize = (str: string) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()!]/g, "")
        .replace(/\s+/g, " ");
    };

    const normInput = normalize(userInput);
    const answersToTry = [record.word.english, ...(record.word.alternatives || [])];
    const isRight = answersToTry.some(ans => {
      const normAns = normalize(ans);
      return normAns === normInput || normAns.replace(/\s+/g, "") === normInput.replace(/\s+/g, "");
    });

    if (isRight) {
      playSound("correct");
      setIsCorrect(true);
      setIsSpelling(false);
      setShowSpelling(true);
      setTimeout(() => {
        onCorrectMastered(record.id);
      }, 1200);
    } else {
      playSound("incorrect");
      setShakeInput(true);
      setWrongCount(prev => prev + 1);
      setTimeout(() => setShakeInput(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkInPlace();
    }
  };

  return (
    <div 
      className={`relative rounded-2xl border-4 p-4 flex flex-col justify-between h-64 transition-all duration-300 shadow-sm ${
        isCorrect 
          ? "border-[#81C784] bg-gradient-to-br from-white to-[#E8F5E9] shadow-md scale-95" 
          : isSpelling 
            ? "border-[#FFB74D] bg-white shadow-md ring-2 ring-[#FFE0B2]" 
            : "border-[#A5D6A7] bg-white hover:shadow-md hover:-translate-y-1"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-extrabold bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-0.5 rounded-full border border-[#81C784]">
          第 {record.level} 关
        </span>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 flex items-center gap-1">
          ⚠️ 拼错 {record.wrongCount + wrongCount} 次
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center my-2 text-center">
        {isCorrect ? (
          <div className="space-y-1.5 animate-scale-up">
            <div className="text-xl text-emerald-600 font-bold flex items-center justify-center gap-1">
              🎉 成功消灭!
            </div>
            <p className="text-lg font-extrabold text-[#2E7D32] tracking-widest font-mono">
              {record.word.english}
            </p>
            <p className="text-xs text-slate-500">{record.word.chinese}</p>
          </div>
        ) : isSpelling ? (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500">
              请拼写: <span className="text-sm font-black text-[#2E7D32]">{record.word.chinese}</span>
            </p>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="输入单词..."
                value={userInput}
                onChange={(e) => setUserInput(adjustCasing(e.target.value, record.word.english))}
                onKeyDown={handleKeyDown}
                className={`w-full text-center font-mono font-bold tracking-wider text-[#2E7D32] border-2 rounded-xl py-1.5 px-3 focus:outline-none text-base transition-all ${
                  shakeInput 
                    ? "border-red-500 animate-shake bg-red-50 text-red-700" 
                    : "border-slate-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#C8E6C9]"
                }`}
              />
            </div>
            {wrongCount > 0 && (
              <p className="text-[10px] font-bold text-red-500">拼写不正确，再想一想哦！🔍</p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">
              {record.word.chinese}
            </h4>
            
            {showSpelling ? (
              <p className="text-lg font-black text-[#2E7D32] font-mono tracking-widest">
                {record.word.english}
              </p>
            ) : (
              <p className="text-lg font-bold text-slate-300 font-mono tracking-widest">
                {"• ".repeat(record.word.english.length)}
              </p>
            )}

            {record.word.example && (
              <p className="text-[11px] text-slate-400 italic max-w-full truncate px-1" title={record.word.example}>
                {record.word.example.replace(new RegExp(record.word.english, "i"), "_______")}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-2 flex items-center justify-between gap-1.5">
        {isCorrect ? (
          <button
            onClick={() => { playSound("click"); onRemove(record.id); }}
            className="w-full py-1.5 bg-[#4CAF50] text-white font-extrabold text-xs rounded-xl hover:bg-[#66BB6A] transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" /> 移出本题
          </button>
        ) : isSpelling ? (
          <div className="flex w-full gap-1.5">
            <button
              onClick={() => { playSound("click"); setIsSpelling(false); }}
              className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-lg transition-all"
            >
              取消
            </button>
            <button
              onClick={checkInPlace}
              disabled={!userInput.trim()}
              className={`flex-1 py-1 font-extrabold text-xs rounded-lg transition-all ${
                userInput.trim() 
                  ? "bg-[#4CAF50] text-white hover:bg-[#66BB6A]" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              提交
            </button>
          </div>
        ) : (
          <div className="flex w-full justify-between items-center gap-1">
            <div className="flex gap-1">
              <button
                onClick={() => { playSound("click"); speakWord(record.word.english); }}
                className="p-1.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] rounded-lg transition-all border border-[#81C784]"
                title="听发音"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { playSound("click"); setShowSpelling(!showSpelling); }}
                className="p-1.5 bg-[#FFF9C4] hover:bg-[#FFF59D] text-[#F57F17] rounded-lg transition-all border border-[#FBC02D]"
                title={showSpelling ? "隐藏答案" : "偷偷看一眼"}
              >
                {showSpelling ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex gap-1 items-center">
              <button
                onClick={() => { playSound("click"); onRemove(record.id); }}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="从错题本中移除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { playSound("click"); setIsSpelling(true); setUserInput(""); }}
                className="px-2.5 py-1.5 bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1"
              >
                ✍️ 拼写
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  // Game Navigation States
  // 'start': Welcome & Level Select map
  // 'playing': Active spelling gameplay
  // 'correct_modal': Big Pop-up Celebration modal for correct answer
  // 'level_completed': Finished a level, show confetti and reward card reveal
  // 'album': Interactive badges/cards album book
  // 'vocabulary_editor': Administrator settings panel to edit/correct words
  const [gameState, setGameState] = useState<"start" | "playing" | "correct_modal" | "level_completed" | "album" | "mistakes" | "vocabulary_editor">("start");

  // Custom Vocabulary State (to correct/add spelling alternatives)
  const [vocabData, setVocabData] = useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem("dino_custom_vocabulary");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading custom vocabulary", e);
      }
    }
    return VOCABULARY_DATA;
  });

  const saveCustomVocabulary = (newVocab: VocabularyItem[]) => {
    setVocabData(newVocab);
    localStorage.setItem("dino_custom_vocabulary", JSON.stringify(newVocab));
  };

  // Game Progress States
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentWords, setCurrentWords] = useState<VocabularyItem[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  
  // Scoring & Performance States
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]); // Levels 1 to 10
  const [streak, setStreak] = useState<number>(0);
  const [wrongTriesCount, setWrongTriesCount] = useState<number>(0);
  const [dinoState, setDinoState] = useState<"idle" | "thinking" | "correct" | "incorrect">("idle");
  const [shakeInput, setShakeInput] = useState<boolean>(false);

  // Mistakes Module States
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [showMistakesVictory, setShowMistakesVictory] = useState<boolean>(false);

  // Hints States
  const [hintLevel, setHintLevel] = useState<number>(0); // 0: none, 1: blanked sentence, 2: first + last letters, 3: reveal half

  // Celebration Modals / Confetti States
  const [activeConfetti, setActiveConfetti] = useState<boolean>(false);
  const [randomSuccessMsg, setRandomSuccessMsg] = useState<string>("");
  const [randomRetryMsg, setRandomRetryMsg] = useState<string>("");
  const [isNewCardClaimed, setIsNewCardClaimed] = useState<boolean>(false);
  const [selectedAlbumCard, setSelectedAlbumCard] = useState<RewardCard | null>(null);
  const [isFailedAnswer, setIsFailedAnswer] = useState<boolean>(false);

  // References
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync and retrieve data from browser localStorage to persist game achievements offline
  useEffect(() => {
    const savedLevels = localStorage.getItem("dino_unlocked_levels");
    if (savedLevels) {
      try {
        setUnlockedLevels(JSON.parse(savedLevels));
      } catch (e) {
        console.error("Error reading unlocked levels", e);
      }
    }
    const savedMistakes = localStorage.getItem("dino_mistakes");
    if (savedMistakes) {
      try {
        setMistakes(JSON.parse(savedMistakes));
      } catch (e) {
        console.error("Error reading saved mistakes", e);
      }
    }
  }, []);

  const saveUnlockedLevels = (levels: number[]) => {
    setUnlockedLevels(levels);
    localStorage.setItem("dino_unlocked_levels", JSON.stringify(levels));
  };

  const saveMistakes = (newMistakes: MistakeRecord[]) => {
    setMistakes(newMistakes);
    localStorage.setItem("dino_mistakes", JSON.stringify(newMistakes));
  };

  // Helper to trigger confetti safely
  const triggerConfettiDuration = (ms: number) => {
    setActiveConfetti(true);
    setTimeout(() => {
      setActiveConfetti(false);
    }, ms);
  };

  // Select a level to play
  const startLevel = (lvlNum: number) => {
    playSound("click");
    // Dynamically slice the up-to-date custom vocabData
    const getLocalWordsForLevel = (level: number) => {
      const startIndex = level <= 5 ? (level - 1) * 15 : 75 + (level - 6) * 16;
      const count = level <= 5 ? 15 : 16;
      return vocabData.slice(startIndex, startIndex + count);
    };
    const words = getLocalWordsForLevel(lvlNum);
    setCurrentLevel(lvlNum);
    setCurrentWords(words);
    setCurrentWordIndex(0);
    setUserInput("");
    setWrongTriesCount(0);
    setHintLevel(0);
    setStreak(0);
    setDinoState("idle");
    setIsFailedAnswer(false);
    setGameState("playing");
    
    // Auto-pronounce the first word when level loads to establish auditory stimulus
    setTimeout(() => {
      speakWord(words[0].english);
    }, 600);
  };

  // Start the 错题大挑战 (Mistakes Challenge Mode)
  const startMistakesChallenge = () => {
    playSound("click");
    if (mistakes.length === 0) return;
    
    // Dynamically retrieve the corrected spellings for mistake entries
    const words = mistakes.map(m => vocabData.find(v => v.id === m.id) || m.word);
    setCurrentLevel(-1); // -1 signifies mistakes mode
    setCurrentWords(words);
    setCurrentWordIndex(0);
    setUserInput("");
    setWrongTriesCount(0);
    setHintLevel(0);
    setStreak(0);
    setDinoState("idle");
    setIsFailedAnswer(false);
    setGameState("playing");

    setTimeout(() => {
      speakWord(words[0].english);
    }, 600);
  };

  // Trigger speech synth
  const handleListen = () => {
    playSound("click");
    if (currentWords[currentWordIndex]) {
      speakWord(currentWords[currentWordIndex].english);
    }
  };

  // Get current word
  const activeWord = currentWords[currentWordIndex];

  // Incremental Hint Logic
  const handleGetHint = () => {
    playSound("click");
    setDinoState("thinking");
    setHintLevel((prev) => Math.min(prev + 1, 3));
    setTimeout(() => {
      if (dinoState !== "correct" && dinoState !== "incorrect") {
        setDinoState("idle");
      }
    }, 1500);
  };

  // Core Word Spelling check logic
  const checkSpelling = () => {
    if (!userInput.trim()) return;

    const normalize = (str: string) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "") // remove apostrophes for simple comparison
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()!]/g, "") // remove punctuation
        .replace(/\s+/g, " "); // normalize multiple spaces to one space
    };

    const normInput = normalize(userInput);
    const answersToTry = [activeWord.english, ...(activeWord.alternatives || [])];
    const isCorrectAnswer = answersToTry.some(ans => {
      const normAns = normalize(ans);
      return normAns === normInput || normAns.replace(/\s+/g, "") === normInput.replace(/\s+/g, "");
    });

    if (isCorrectAnswer) {
      // 🏆 CORRECT ACTION!
      setIsFailedAnswer(false);
      playSound("correct");
      setDinoState("correct");
      setStreak((prev) => prev + 1);
      
      // Auto-speak English word on correct match to anchor pronunciation
      speakWord(activeWord.english);

      // Choose a random cheerful message
      const msg = CONGRATULATIONS[Math.floor(Math.random() * CONGRATULATIONS.length)];
      setRandomSuccessMsg(msg);
      
      // Open the Great Pop-up Celebration! ("大大弹窗鼓励")
      setGameState("correct_modal");
    } else {
      // ❌ INCORRECT ACTION
      playSound("incorrect");
      setDinoState("incorrect");
      const nextWrongCount = wrongTriesCount + 1;
      setWrongTriesCount(nextWrongCount);
      setStreak(0);
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);

      // Record the mistake
      const existing = mistakes.find(m => m.id === activeWord.id);
      let updatedMistakes: MistakeRecord[];
      if (existing) {
        updatedMistakes = mistakes.map(m => 
          m.id === activeWord.id 
            ? { ...m, wrongCount: m.wrongCount + 1, lastTestedTime: Date.now() }
            : m
        );
      } else {
        updatedMistakes = [
          ...mistakes,
          {
            id: activeWord.id,
            word: activeWord,
            wrongCount: 1,
            lastTestedTime: Date.now(),
            level: currentLevel === -1 ? 1 : currentLevel
          }
        ];
      }
      saveMistakes(updatedMistakes);

      // Choose a random retry encouragement
      const retryMsg = RETRY_ENCOURAGEMENTS[Math.floor(Math.random() * RETRY_ENCOURAGEMENTS.length)];
      setRandomRetryMsg(retryMsg);

      // Let dinosaur return to idle/concerned after a few seconds
      setTimeout(() => {
        setDinoState("idle");
      }, 3000);

      // 3-strike bypass check
      if (nextWrongCount >= 3) {
        setIsFailedAnswer(true);
        setRandomSuccessMsg("别灰心！正确答案已经为你准备好啦，让我们一起记住它！🦖💡");
        // Automatically speak word
        speakWord(activeWord.english);
        // Put correct spelling into input
        setUserInput(activeWord.english);
        setTimeout(() => {
          setGameState("correct_modal");
        }, 1200);
      }
    }
  };

  // Move to next word in the current level
  const handleNextWord = () => {
    playSound("click");
    setDinoState("idle");
    setHintLevel(0);
    setUserInput("");
    setWrongTriesCount(0);

    // If in mistakes challenge, and they didn't fail (meaning they successfully spelled it)
    if (currentLevel === -1 && !isFailedAnswer) {
      const updated = mistakes.filter(m => m.id !== activeWord.id);
      saveMistakes(updated);
    }

    setIsFailedAnswer(false);

    const isLastWordOfLevel = currentWordIndex >= currentWords.length - 1;

    if (isLastWordOfLevel) {
      if (currentLevel === -1) {
        // 🎉 MISTAKES CHALLENGE FULLY COMPLETED!
        playSound("victory");
        triggerConfettiDuration(6000);
        setShowMistakesVictory(true);
        setGameState("mistakes");
        return;
      }

      // 🎉 LEVEL COMPLETED!
      playSound("victory");
      
      // Unlock next level in progress list
      const nextLvl = currentLevel + 1;
      if (nextLvl <= 10 && !unlockedLevels.includes(nextLvl)) {
        saveUnlockedLevels([...unlockedLevels, nextLvl]);
      }

      setIsNewCardClaimed(false);
      triggerConfettiDuration(6000);
      setGameState("level_completed");
    } else {
      // Proceed to next word in queue
      setCurrentWordIndex((prev) => prev + 1);
      setGameState("playing");
      
      // Auto-pronounce next word
      setTimeout(() => {
        if (currentWords[currentWordIndex + 1]) {
          speakWord(currentWords[currentWordIndex + 1].english);
        }
      }, 400);
    }
  };

  // Keyboard support: hit Enter to check or advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (gameState === "playing") {
        checkSpelling();
      } else if (gameState === "correct_modal") {
        handleNextWord();
      }
    }
  };

  // Force reset child progress for testing / replay value
  const handleResetProgress = () => {
    if (window.confirm("确定要重置所有的关卡和卡牌吗？")) {
      saveUnlockedLevels([1]);
      setGameState("start");
      playSound("incorrect");
    }
  };

  // Calculate percentage of footprints filled
  const getProgressPercentage = () => {
    if (currentWords.length === 0) return 0;
    return (currentWordIndex / currentWords.length) * 100;
  };

  // Format blank letter box helper
  const renderLetterGuide = () => {
    if (!activeWord) return null;
    const standardWord = activeWord.english;

    // Splitting word by words to support phrases like "play basketball"
    const wordParts = standardWord.split(" ");
    
    return (
      <div className="flex flex-wrap justify-center items-center gap-4 mt-3">
        {wordParts.map((part, pIdx) => {
          const chars = part.split("");
          return (
            <React.Fragment key={pIdx}>
              {pIdx > 0 && (
                <div 
                  className="w-10 h-11 md:w-14 md:h-16 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 flex flex-col items-center justify-center text-xs font-black text-orange-600 shadow-sm animate-pulse" 
                  title="这里是一个空格 (Space)"
                >
                  <span>␣</span>
                  <span className="text-[10px] scale-90">空格</span>
                </div>
              )}
              <div className="flex gap-1.5 md:gap-2">
                {chars.map((char, cIdx) => {
                  // Determine what to display
                  const isPunctuation = /[.,'’\-!?]/.test(char);
                  let displayChar = "";

                  // If hintLevel >= 2, reveal first & last letters
                  const isFirst = cIdx === 0 && pIdx === 0;
                  const isLast = pIdx === wordParts.length - 1 && cIdx === chars.length - 1;

                  if (isPunctuation) {
                    displayChar = char;
                  } else if (hintLevel >= 2 && (isFirst || isLast)) {
                    displayChar = char;
                  } else if (hintLevel >= 3 && (cIdx % 2 === 0)) {
                    // reveal every other char
                    displayChar = char;
                  }

                  return (
                    <div 
                      key={cIdx} 
                      className={`w-10 h-11 md:w-14 md:h-16 rounded-xl flex flex-col items-center justify-center font-bold text-lg md:text-2xl transition-all shadow-sm ${
                        isPunctuation 
                          ? "border-transparent bg-transparent text-slate-500" 
                          : "border-2 border-slate-300 bg-slate-50 text-emerald-700"
                      }`}
                    >
                      <span>{displayChar}</span>
                      {!isPunctuation && (
                        <div className="w-6 h-0.5 md:w-8 bg-slate-400 mt-0.5 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Find associated Reward Card for current level
  const activeLevelCard = REWARD_CARDS.find(c => c.level === currentLevel) || REWARD_CARDS[0];

  return (
    <div className="min-h-screen flex flex-col font-sans select-none pb-12 relative overflow-hidden bg-[#F1F8E9]">
      
      {/* Background Decorative Circles from Natural Tones Theme */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#DCEDC8] rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-[#C5E1A5] rounded-full opacity-30 pointer-events-none"></div>
      
      {/* Visual Background Decors - clouds and trees */}
      <div className="absolute top-10 left-6 text-4xl opacity-15 pointer-events-none animate-pulse">☁️</div>
      <div className="absolute top-24 right-12 text-5xl opacity-15 pointer-events-none animate-pulse delay-700">☁️</div>
      <div className="absolute bottom-16 left-8 text-4xl opacity-10 pointer-events-none">🌴</div>
      <div className="absolute bottom-10 right-8 text-5xl opacity-10 pointer-events-none">🌳</div>

      {/* Confetti Spreader */}
      <Confetti active={activeConfetti} />

      {/* GORGEOUS TOP NAVIGATION HEADER BAR */}
      <header className="bg-white/90 backdrop-blur-md border-b-4 border-[#81C784] py-3.5 px-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => { playSound("click"); setGameState("start"); }}
            className="flex items-center gap-2 cursor-pointer transform active:scale-95 transition-all"
          >
            <span className="text-3xl">🦕</span>
            <h1 className="text-xl md:text-2xl font-black text-[#2E7D32] tracking-tight flex items-center">
              恐龙英语拼写大闯关
              <span className="ml-1.5 text-xs bg-[#4CAF50] text-white px-2 py-0.5 rounded-full font-bold shadow-sm">三年级版</span>
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              id="nav-mistakes-btn"
              onClick={() => { playSound("click"); setGameState("mistakes"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-sm border-2 border-[#E65100] transition-all relative ${
                gameState === "mistakes" 
                  ? "bg-[#E65100] text-white shadow-[2px_2px_0px_#BF360C]" 
                  : "bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#E65100] shadow-[2px_2px_0px_#FFB74D]"
              }`}
            >
              📖 错题本
              {mistakes.length > 0 && (
                <span className="absolute -top-2.5 -right-1.5 bg-[#D84315] text-white rounded-full px-1.5 py-0.5 text-[9px] font-black border-2 border-white shadow-sm animate-pulse">
                  {mistakes.length}
                </span>
              )}
            </button>
            <button
              id="nav-album-btn"
              onClick={() => { playSound("click"); setGameState("album"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-sm border-2 border-[#81C784] transition-all ${
                gameState === "album" 
                  ? "bg-[#4CAF50] text-white shadow-[2px_2px_0px_#2E7D32]" 
                  : "bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] shadow-[2px_2px_0px_#81C784]"
              }`}
            >
              🏆 卡牌包
            </button>
            <button
              id="nav-vocab-editor-btn"
              onClick={() => { playSound("click"); setGameState("vocabulary_editor"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-sm border-2 border-[#0097A7] transition-all ${
                gameState === "vocabulary_editor" 
                  ? "bg-[#0097A7] text-white shadow-[2px_2px_0px_#006064]" 
                  : "bg-[#E0F7FA] hover:bg-[#B2EBF2] text-[#006064] shadow-[2px_2px_0px_#0097A7]"
              }`}
            >
              🔧 答案库
            </button>
            {gameState !== "start" && (
              <button
                id="nav-home-btn"
                onClick={() => { playSound("click"); setGameState("start"); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9C4] hover:bg-[#FFF59D] text-[#F57F17] font-extrabold text-sm border-2 border-[#FBC02D] rounded-xl shadow-[2px_2px_0px_#FBC02D] transition-all"
              >
                <Home className="w-4 h-4" />
                地图
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 mt-6">
        
        {/* ======================= STATE 1: START SCREEN (LEVEL SELECT MAP) ======================= */}
        {gameState === "start" && (
          <div className="space-y-8 animate-fade-in">
            {/* Mascot Banner Card */}
            <div className="bg-gradient-to-r from-[#81C784] via-[#4CAF50] to-[#2E7D32] rounded-3xl p-6 md:p-10 border-4 border-[#388E3C] shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-9xl opacity-15 transform rotate-12">🦖</div>
              <div className="absolute left-4 top-4 text-4xl opacity-10 animate-bounce">✨</div>
              
              <div className="max-w-2xl relative z-10 space-y-4">
                <div className="inline-block bg-[#2E7D32]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-[#81C784]">
                  🦕 Dinosaur Spelling Safari
                </div>
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white">
                  和小恐龙一起拼单词，<br />
                  召唤远古神兽卡牌！
                </h2>
                <p className="text-[#E8F5E9] text-sm md:text-base font-semibold max-w-xl">
                  专门针对三年级核心句型与 155 个常考词汇设计。10大关卡极速挑战，完美默写单词可获得精美的恐龙徽章卡牌，快来集齐你的卡牌包吧！
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    id="start-level-1-btn"
                    onClick={() => startLevel(1)}
                    className="bg-[#FFF9C4] hover:bg-[#FFF59D] text-[#F57F17] font-extrabold px-6 py-3 rounded-2xl border-2 border-[#FBC02D] text-sm shadow-[4px_4px_0px_#FBC02D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-1.5"
                  >
                    🚀 开启第一关
                  </button>
                  <button
                    id="view-album-landing-btn"
                    onClick={() => setGameState("album")}
                    className="bg-white hover:bg-[#E8F5E9] text-[#2E7D32] font-extrabold px-6 py-3 rounded-2xl border-2 border-[#81C784] text-sm shadow-[4px_4px_0px_#81C784] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-1.5"
                  >
                    🏆 浏览卡牌收集 ({unlockedLevels.length - 1}/10)
                  </button>
                  {mistakes.length > 0 && (
                    <button
                      id="view-mistakes-landing-btn"
                      onClick={() => setGameState("mistakes")}
                      className="bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#E65100] font-extrabold px-6 py-3 rounded-2xl border-2 border-[#FFB74D] text-sm shadow-[4px_4px_0px_#FFB74D] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-1.5"
                    >
                      📖 错题复习 ({mistakes.length})
                    </button>
                  )}
                  <button
                    id="view-vocab-editor-landing-btn"
                    onClick={() => { playSound("click"); setGameState("vocabulary_editor"); }}
                    className="bg-[#E0F7FA] hover:bg-[#B2EBF2] text-[#006064] font-extrabold px-6 py-3 rounded-2xl border-2 border-[#4DD0E1] text-sm shadow-[4px_4px_0px_#4DD0E1] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-1.5"
                  >
                    🔧 答案库修正
                  </button>
                </div>
              </div>
            </div>

            {/* Level selection maps block */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#2E7D32] flex items-center gap-2">
                🐾 关卡地图 (Spelling Map)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => {
                  const lvlNum = i + 1;
                  const isUnlocked = unlockedLevels.includes(lvlNum);
                  const isCompleted = unlockedLevels.includes(lvlNum + 1) || (lvlNum === 10 && unlockedLevels.length === 10 && unlockedLevels.includes(10) && isNewCardClaimed);
                  
                  // Get card metadata for previews
                  const cardMeta = REWARD_CARDS.find(c => c.level === lvlNum);

                  return (
                    <div
                      key={lvlNum}
                      onClick={() => isUnlocked && startLevel(lvlNum)}
                      className={`relative rounded-2xl border-4 p-4 flex flex-col justify-between h-40 transition-all ${
                        isUnlocked 
                          ? "border-[#81C784] bg-white hover:shadow-lg cursor-pointer hover:-translate-y-1 shadow-[4px_4px_0px_#DCEDC8]" 
                          : "border-slate-300 bg-slate-100 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {/* Ribbon banner */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          isCompleted ? "bg-[#E8F5E9] text-[#2E7D32]" : isUnlocked ? "bg-[#FFF9C4] text-[#F57F17]" : "bg-slate-200 text-slate-500"
                        }`}>
                          {isCompleted ? "✨ 已完美通关" : isUnlocked ? "🎯 待挑战" : "🔒 未解锁"}
                        </span>
                        <span className="text-xl">
                          {lvlNum === 1 && "🦖"}
                          {lvlNum === 2 && "🦕"}
                          {lvlNum === 3 && "🦒"}
                          {lvlNum === 4 && "🦅"}
                          {lvlNum === 5 && "🛡️"}
                          {lvlNum === 6 && "⚡"}
                          {lvlNum === 7 && "🔨"}
                          {lvlNum === 8 && "🦈"}
                          {lvlNum === 9 && "🎵"}
                          {lvlNum === 10 && "👑"}
                        </span>
                      </div>

                      {/* Title block */}
                      <div className="mt-2 text-left">
                        <h4 className="text-lg font-black text-[#2E7D32]">第 {lvlNum} 关</h4>
                        <p className="text-xs text-[#558B2F] font-bold truncate">
                          {cardMeta ? cardMeta.cardName : `恐龙卡牌 L${lvlNum}`}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {lvlNum <= 5 ? "包含 15 个词汇" : "包含 16 个词汇"}
                        </p>
                      </div>

                      {/* Footer block */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {lvlNum * 15 - (lvlNum > 5 ? lvlNum - 5 : 0) - 14} - {lvlNum <= 5 ? lvlNum * 15 : 75 + (lvlNum - 5) * 16} 词
                        </span>
                        {isUnlocked ? (
                          <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
                        ) : (
                          "🔒"
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info Panels & Control */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-[#81C784] shadow-sm gap-4 text-center sm:text-left">
              <div>
                <p className="text-sm font-bold text-[#2E7D32]">
                  🦖 <span className="font-extrabold text-[#33691E]">小贴士</span>: 游戏支持全键盘操作。输入答案后按下 <strong className="text-[#388E3C]">Enter 回车键</strong> 可以快速验证答案并进入下一题哦！
                </p>
              </div>
              <button
                id="reset-progress-btn"
                onClick={handleResetProgress}
                className="text-xs font-extrabold text-[#D84315] hover:text-[#BF360C] flex items-center gap-1 shrink-0 bg-white border-2 border-[#FFCCBC] px-3 py-1.5 rounded-xl hover:bg-[#FFEBEE] transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重置关卡进度
              </button>
            </div>
          </div>
        )}


        {/* ======================= STATE 2: ACTIVE PLAYING ENGINE ======================= */}
        {gameState === "playing" && activeWord && (
          <div className="space-y-6 animate-fade-in" onKeyDown={handleKeyDown}>
            {/* Level status progress line */}
            <div className="bg-white rounded-2xl border-4 border-[#81C784] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[#2E7D32]">
                <span className="text-2xl">🏆</span>
                <span className="font-extrabold text-sm md:text-base">第 {currentLevel} 关</span>
                <span className="text-[#81C784]">|</span>
                <span className="font-bold text-sm text-[#558B2F]">词汇进度: {currentWordIndex + 1} / {currentWords.length}</span>
              </div>

              {/* Little footprints visual progress line */}
              <div className="flex-1 max-w-md w-full px-2">
                <div className="flex items-center justify-between text-xs text-[#558B2F] mb-1.5 font-bold">
                  <span>开始 🐾</span>
                  <span className="text-[#F57F17] bg-[#FFF9C4] px-2 py-0.5 rounded-full border border-[#FBC02D]">🔥 连对：{streak}</span>
                  <span>终点 🏁</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full relative overflow-hidden border border-[#A5D6A7] shadow-inner flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-[#81C784] to-[#4CAF50] transition-all duration-300 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                  {/* Little dinosaur cursor riding the progress */}
                  <div 
                    className="absolute -ml-2 text-sm transition-all duration-300 pointer-events-none"
                    style={{ left: `${getProgressPercentage()}%` }}
                  >
                    🦖
                  </div>
                </div>
              </div>

              <button
                id="back-to-map-btn"
                onClick={() => { playSound("click"); setGameState("start"); }}
                className="px-3 py-1 bg-[#E8F5E9] hover:bg-[#C8E6C9] border-2 border-[#81C784] text-xs font-bold rounded-lg text-[#2E7D32] transition-all"
              >
                返回地图
              </button>
            </div>

            {/* Core Spelling Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Mascot Dinosaur */}
              <div className="lg:col-span-4 bg-white rounded-3xl border-4 border-[#81C784] p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-[#4CAF50]"></div>
                <div className="absolute bottom-2 text-[#81C784] font-extrabold text-xs">
                  {activeLevelCard.dinoName} 正在陪你学习
                </div>

                <DinosaurDoodle state={dinoState} size={180} />

                {/* Dinosaur Dialogue Bubble */}
                <div className="mt-4 bg-[#E8F5E9] border-2 border-[#81C784] text-[#2E7D32] p-3.5 rounded-2xl relative max-w-xs text-center font-bold text-sm leading-relaxed">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#E8F5E9] border-t-2 border-l-2 border-[#81C784] rotate-45"></div>
                  "小朋友，请听音并默写出这个单词哦！"
                </div>
              </div>

              {/* Right Column: Spelling Canvas */}
              <div className="lg:col-span-8 bg-white rounded-3xl border-4 border-[#81C784] p-6 md:p-8 shadow-md flex flex-col justify-between space-y-6 relative">
                <div className="absolute top-0 inset-x-0 h-2 bg-[#FBC02D]"></div>

                {/* Word Prompt area */}
                <div className="text-center space-y-2">
                  <span className="text-xs font-extrabold uppercase bg-[#FFF9C4] text-[#F57F17] px-3 py-1 rounded-full border border-[#FBC02D]">
                    第 {activeWord.id} 题 · 中文释义
                  </span>
                  
                  <p className="text-[#689F38] text-lg font-medium">请写出对应的英文单词：</p>
                  <h3 className="text-5xl md:text-6xl font-black text-[#33691E] tracking-tight py-2 leading-snug">
                    {activeWord.chinese}
                  </h3>

                  {/* Show partial example sentence as dynamic hint when requested */}
                  {hintLevel >= 1 ? (
                    <div className="bg-[#F1F8E9] border-2 border-[#C5E1A5] rounded-xl p-3 text-[#2E7D32] max-w-lg mx-auto text-sm leading-relaxed text-left">
                      <p className="font-bold text-[#689F38] uppercase tracking-widest text-[10px] mb-1">💡 例句填空 (Example Hint)</p>
                      <p className="font-semibold text-[#33691E]">
                        {activeWord.example?.replace(new RegExp(activeWord.english, "i"), "_______")}
                      </p>
                      <p className="text-[#558B2F] text-xs mt-1">({activeWord.exampleChinese})</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#689F38] font-bold">
                      💡 遇到困难？点击“💡 提示”查看例句或首尾字母！
                    </p>
                  )}
                </div>

                {/* EXTRA-LARGE SPELLING AREA */}
                <div className="space-y-4">
                  
                  {/* Visual Letter Boxes representing the word length */}
                  {renderLetterGuide()}

                  {/* The Actual typing Input box */}
                  <div className="relative">
                    {/* Footprint Indicator inside input box */}
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none opacity-40">
                      🐾
                    </span>
                    
                    <input
                      ref={inputRef}
                      type="text"
                      autoFocus
                      placeholder="在这里输入英文单词..."
                      value={userInput}
                      onChange={(e) => setUserInput(adjustCasing(e.target.value, activeWord.english))}
                      onKeyDown={handleKeyDown}
                      className={`w-full bg-white rounded-3xl border-b-8 text-center font-mono font-black text-3xl md:text-5xl tracking-widest text-[#2E7D32] placeholder-[#C8E6C9] p-6 focus:outline-none transition-all shadow-xl ${
                        shakeInput 
                          ? "border-red-500 animate-shake bg-red-50 text-red-700" 
                          : "border-[#A5D6A7] focus:border-[#4CAF50] focus:ring-4 focus:ring-[#C8E6C9]"
                      }`}
                    />
                  </div>

                  {/* Interactive hint display details */}
                  {hintLevel >= 2 && (
                    <p className="text-sm font-bold text-[#D84315] text-center bg-[#FFF176]/30 py-1.5 rounded-lg border border-[#FFCCBC]">
                      🗝️ 提示拼写首尾字母：首字母是 <strong className="text-base">'{activeWord.english.charAt(0)}'</strong>，尾字母是 <strong className="text-base">'{activeWord.english.charAt(activeWord.english.length - 1)}'</strong>
                    </p>
                  )}
                </div>

                {/* GENTLE INLINE ERROR TYPO BANNER (直到写对) */}
                {wrongTriesCount > 0 && dinoState !== "correct" && (
                  <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border-2 border-[#FFCCBC] relative animate-pulse text-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t-2 border-l-2 border-[#FFCCBC] rotate-45"></div>
                    <p className="text-[#D84315] font-black text-lg md:text-xl italic">
                      "拼写有误，{randomRetryMsg}"
                    </p>
                  </div>
                )}

                {/* GAME CONTROL ACTIONS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    id="listen-word-btn"
                    onClick={handleListen}
                    className="py-3 px-4 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] font-extrabold border-2 border-[#81C784] rounded-2xl text-sm shadow-[2px_2px_0px_#2E7D32] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-5 h-5 text-[#2E7D32] animate-pulse" />
                    📢 听单词发音
                  </button>

                  <button
                    id="hint-spelling-btn"
                    onClick={handleGetHint}
                    className="py-3 px-4 bg-[#FFE0B2] hover:bg-[#FFCC80] text-[#E65100] font-extrabold border-2 border-[#FFB74D] rounded-2xl text-sm shadow-[2px_2px_0px_#E65100] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                  >
                    <HelpCircle className="w-5 h-5 text-[#E65100]" />
                    💡 查看提示 ({hintLevel}/3)
                  </button>

                  <button
                    id="submit-spelling-btn"
                    onClick={checkSpelling}
                    disabled={!userInput.trim()}
                    className={`py-3 px-4 font-black border-2 rounded-2xl text-sm flex items-center justify-center gap-1.5 transition-all ${
                      userInput.trim() 
                        ? "bg-[#4CAF50] hover:bg-[#66BB6A] text-white border-[#2E7D32] shadow-[2px_2px_0px_#2E7D32] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer" 
                        : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                    }`}
                  >
                    🚀 确认拼写 (Enter)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ======================= STATE 3: BIG CELEBRATION MODAL (大大弹窗鼓励) ======================= */}
        {gameState === "correct_modal" && activeWord && (
          <div className="fixed inset-0 bg-[#33691E]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-6 md:p-8 max-w-lg w-full shadow-2xl border-8 border-[#FFF176] text-center space-y-6 relative overflow-hidden animate-scale-up">
              
              {/* Fun Confetti Sparkles inside the modal */}
              <div className="absolute top-2 left-4 text-2xl animate-bounce">✨</div>
              <div className="absolute top-4 right-6 text-3xl animate-bounce delay-300">🎉</div>
              <div className="absolute bottom-6 left-12 text-2xl opacity-40">🦖</div>

              <div className="flex justify-center">
                {isFailedAnswer ? (
                  <div className="w-20 h-20 rounded-full bg-[#FFE0B2] border-4 border-[#FFB74D] flex items-center justify-center animate-bounce">
                    <HelpCircle className="w-12 h-12 text-[#E65100]" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#E8F5E9] border-4 border-[#4CAF50] flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-12 h-12 text-[#4CAF50]" />
                  </div>
                )}
              </div>

              {/* Changing encouragement message */}
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-[#FBC02D] leading-tight">
                  {randomSuccessMsg}
                </h2>
                <p className="text-sm font-bold text-[#558B2F] uppercase tracking-widest italic">
                  {isFailedAnswer ? "学习模式 Study Mode" : "拼写正确 Perfect Match!"}
                </p>
              </div>

              {/* Correct English word details card */}
              <div className="bg-[#F1F8E9] border-4 border-[#A5D6A7] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-[#2E7D32] tracking-widest">
                    {activeWord.english}
                  </span>
                  <button
                    id="speak-correct-word-btn"
                    onClick={() => speakWord(activeWord.english)}
                    className="p-1.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] rounded-full transition-all border border-[#81C784]"
                    title="再听一次发音"
                  >
                    <Volume2 className="w-5 h-5 text-[#2E7D32]" />
                  </button>
                </div>
                
                <p className="text-base font-bold text-[#33691E] border-t border-[#A5D6A7] pt-2">
                  中文释义：{activeWord.chinese}
                </p>

                {activeWord.example && (
                  <div className="bg-white border-2 border-[#C5E1A5] rounded-xl p-3 text-left">
                    <p className="text-[10px] font-black text-[#689F38] uppercase tracking-wider mb-1">📖 例句拓展 (Learn Sentence)</p>
                    <p className="text-[#33691E] font-bold text-sm leading-relaxed">
                      {activeWord.example}
                    </p>
                    <p className="text-[#558B2F] text-xs mt-0.5">
                      {activeWord.exampleChinese}
                    </p>
                  </div>
                )}
              </div>

              {/* Dialog control button */}
              <button
                id="modal-next-word-btn"
                onClick={handleNextWord}
                autoFocus
                className="w-full py-4 bg-[#4CAF50] text-white text-xl font-black rounded-full border-b-8 border-[#2E7D32] hover:bg-[#66BB6A] active:border-b-2 active:mt-1 transition-all flex items-center justify-center gap-1.5"
              >
                <span>进入下一题 (Enter)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}


        {/* ======================= STATE 4: LEVEL COMPLETED CEREMONY (弹窗撒花 & Card Reward) ======================= */}
        {gameState === "level_completed" && (
          <div className="fixed inset-0 bg-[#33691E]/40 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-[40px] p-6 md:p-10 max-w-lg w-full shadow-2xl border-8 border-[#FFF176] text-center transform scale-100 relative my-auto animate-scale-up">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-7xl md:text-8xl select-none">🎉</div>
              
              <h2 className="text-[#FBC02D] text-2xl md:text-4xl font-black mb-2 mt-4">太棒了！第 {currentLevel} 关完美通关！</h2>
              <p className="text-[#558B2F] text-sm md:text-base font-bold mb-6 italic">
                "你是个真正的英语小达人，奖励一张卡牌！"
              </p>

              {/* Reward Card Display */}
              <div className="w-full max-w-xs mx-auto mb-6">
                <DinosaurCard 
                  card={activeLevelCard}
                  showCollectButton={false}
                />
              </div>

              <button 
                onClick={() => {
                  playSound("click");
                  setIsNewCardClaimed(true);
                  setGameState("start");
                  triggerConfettiDuration(1000); // short burst
                }}
                className="w-full py-4 bg-[#4CAF50] text-white text-xl md:text-2xl font-black rounded-full border-b-8 border-[#2E7D32] hover:bg-[#66BB6A] active:border-b-2 active:mt-1 transition-all"
              >
                收下卡牌，返回地图
              </button>
              
              {/* Static Confetti inside overlay */}
              <div className="absolute top-10 left-4 text-3xl transform -rotate-12 select-none pointer-events-none">✨</div>
              <div className="absolute bottom-10 right-4 text-3xl transform rotate-45 select-none pointer-events-none">🌿</div>
              <div className="absolute top-1/2 right-2 text-2xl select-none pointer-events-none">⭐</div>
              <div className="absolute top-1/3 left-2 text-2xl select-none pointer-events-none">⭐</div>
            </div>
          </div>
        )}


        {/* ======================= STATE 5: ALBUM (Interactive Badges Gallery) ======================= */}
        {gameState === "album" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-4 border-[#81C784] pb-4 gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-3xl font-black text-[#2E7D32] tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  🏆 恐龙卡牌收集册
                </h2>
                <p className="text-sm text-[#558B2F] font-bold">
                  通过完成不同的拼写关卡，激活远古大陆上的恐龙图鉴卡。当前收集度: <strong className="text-[#F57F17] text-base">{unlockedLevels.length - 1} / 10</strong>
                </p>
              </div>

              <button
                id="album-back-to-map-btn"
                onClick={() => { playSound("click"); setGameState("start"); }}
                className="bg-[#FFF9C4] hover:bg-[#FFF59D] text-[#F57F17] font-extrabold px-5 py-2.5 rounded-2xl border-2 border-[#FBC02D] text-sm shadow-[2px_2px_0px_#FBC02D] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                ⬅️ 返回关卡地图
              </button>
            </div>

            {/* Grid of All Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {REWARD_CARDS.map((card) => {
                const isLocked = !unlockedLevels.includes(card.level + 1) && !(card.level === 10 && unlockedLevels.includes(10) && isNewCardClaimed);
                
                return (
                  <div
                    key={card.level}
                    onClick={() => !isLocked && setSelectedAlbumCard(card)}
                    className={`relative rounded-2xl border-4 p-4 text-center cursor-pointer flex flex-col justify-between h-56 transition-all ${
                      isLocked 
                        ? "bg-slate-100/70 border-slate-300 opacity-60 hover:border-slate-400" 
                        : "border-2 border-[#81C784] bg-white hover:shadow-lg hover:-translate-y-1.5 shadow-[4px_4px_0px_#DCEDC8] bg-gradient-to-b from-white to-green-50"
                    }`}
                  >
                    <div>
                      <div className={`h-8 rounded-lg bg-gradient-to-r ${isLocked ? "from-slate-300 to-slate-400" : card.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        Level {card.level}
                      </div>

                      {/* Mascot Icon */}
                      <div className="text-5xl my-4 transform group-hover:scale-110 transition-transform">
                        {isLocked ? "🔒" : (
                          card.level === 1 ? "🦖" :
                          card.level === 2 ? "🦕" :
                          card.level === 3 ? "🦒" :
                          card.level === 4 ? "🦅" :
                          card.level === 5 ? "🛡️" :
                          card.level === 6 ? "⚡" :
                          card.level === 7 ? "🔨" :
                          card.level === 8 ? "🦈" :
                          card.level === 9 ? "🎵" : "👑"
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#2E7D32] truncate">
                        {isLocked ? "神秘恐龙" : card.dinoName}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        {isLocked ? `通关第 ${card.level} 关解锁` : card.cardName}
                      </p>
                    </div>

                    {!isLocked && (
                      <span className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] font-black px-1.5 py-0.5 rounded-md mt-2 block mx-auto w-max border border-[#81C784]">
                        🔍 点击看属性
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detail modal overlay for selected card */}
            {selectedAlbumCard && (
              <div className="fixed inset-0 bg-[#33691E]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-sm animate-scale-up">
                  <DinosaurCard
                    card={selectedAlbumCard}
                    onClose={() => setSelectedAlbumCard(null)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= STATE 6: MISTAKES (Mistake Notebook Review) ======================= */}
        {gameState === "mistakes" && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-4 border-[#FFB74D] pb-4 gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-3xl font-black text-[#E65100] tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  📖 单词错题本
                </h2>
                <p className="text-sm text-[#E65100]/80 font-bold">
                  闯关中拼错的单词会自动记在这里，让我们和小恐龙一起消灭它们吧！🦕🐾
                </p>
              </div>

              <div className="flex gap-2">
                {mistakes.length > 0 && (
                  <button
                    onClick={startMistakesChallenge}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold px-5 py-2.5 rounded-2xl border-2 border-orange-600 text-sm shadow-[2px_2px_0px_#BF360C] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    ⚔️ 错题消灭大挑战
                  </button>
                )}
                <button
                  onClick={() => { playSound("click"); setGameState("start"); }}
                  className="bg-[#FFF9C4] hover:bg-[#FFF59D] text-[#F57F17] font-extrabold px-5 py-2.5 rounded-2xl border-2 border-[#FBC02D] text-sm shadow-[2px_2px_0px_#FBC02D] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  ⬅️ 返回关卡地图
                </button>
              </div>
            </div>

            {/* Empty State */}
            {mistakes.length === 0 ? (
              <div className="bg-white border-4 border-[#81C784] rounded-3xl p-10 text-center max-w-md mx-auto space-y-4 shadow-sm my-12 animate-scale-up">
                <div className="text-7xl">🦖💤</div>
                <h3 className="text-2xl font-black text-[#2E7D32]">错题本空空如也！</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">
                  小恐龙高兴地在绿油油的草地上打滚！你在闯关中拼写得非常完美，暂时没有需要复习的错题哦，继续保持吧！🌿✨
                </p>
                <button
                  onClick={() => { playSound("click"); setGameState("start"); }}
                  className="w-full bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-extrabold py-3 rounded-2xl shadow-md border-b-4 border-[#2E7D32] transition-all"
                >
                  开启单词大闯关
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats & Actions */}
                <div className="bg-orange-50 border-2 border-[#FFB74D] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm font-bold text-orange-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <span>
                      你目前有 <strong className="text-orange-600 text-lg">{mistakes.length}</strong> 个单词写错过。点击卡片上的 <strong className="text-[#2E7D32]">✍️ 拼写</strong> 只要写对 1 次就能把它们消灭哦！
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("确定要清空全部错题记录吗？这一步不能撤销哦。")) {
                        playSound("click");
                        saveMistakes([]);
                      }
                    }}
                    className="text-xs text-orange-600 hover:text-red-500 border border-orange-200 hover:bg-orange-100/50 px-2.5 py-1.5 rounded-xl transition-all w-max self-end md:self-auto"
                  >
                    🗑️ 全部清空
                  </button>
                </div>

                {/* Grid layout of mistake cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mistakes.map((record) => {
                    const freshWord = vocabData.find(v => v.id === record.id) || record.word;
                    const resolvedRecord = { ...record, word: freshWord };
                    return (
                      <MistakeCard
                        key={record.id}
                        record={resolvedRecord}
                        onRemove={(id) => {
                          const updated = mistakes.filter((m) => m.id !== id);
                          saveMistakes(updated);
                        }}
                        onCorrectMastered={(id) => {
                          const updated = mistakes.filter((m) => m.id !== id);
                          saveMistakes(updated);
                        }}
                        speakWord={speakWord}
                        playSound={playSound}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mistakes Victory Celebration Overlay */}
            {showMistakesVictory && (
              <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white border-8 border-[#81C784] rounded-3xl p-6 md:p-8 max-w-sm text-center shadow-2xl relative overflow-hidden animate-scale-up space-y-4">
                  <div className="absolute -top-10 -right-10 text-7xl opacity-15">🦖</div>
                  <div className="text-6xl animate-bounce">👑✨</div>
                  <h3 className="text-2xl font-black text-emerald-800">错题消灭大胜利！</h3>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    太牛啦！你刚刚在挑战模式中，把刚才拼错的单词全部都拼正确了！小恐龙兴奋地为你戴上了胜利之冠！👑🎉
                  </p>
                  <button
                    onClick={() => { playSound("click"); setShowMistakesVictory(false); }}
                    className="w-full py-3 bg-[#4CAF50] hover:bg-[#66BB6A] text-white font-extrabold rounded-2xl shadow-md border-b-4 border-[#2E7D32] transition-all"
                  >
                    太棒了，继续复习！
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= STATE 6: VOCABULARY DATABASE EDITOR ======================= */}
        {gameState === "vocabulary_editor" && (
          <VocabularyEditorScreen
            vocabData={vocabData}
            onSave={(updatedVocab) => saveCustomVocabulary(updatedVocab)}
            onBack={() => setGameState("start")}
            playSound={playSound}
            defaultVocab={VOCABULARY_DATA}
          />
        )}

      </main>

      {/* Styled Animations for custom keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes scale-up {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>

    </div>
  );
}
