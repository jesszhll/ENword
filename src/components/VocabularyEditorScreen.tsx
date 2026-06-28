import React, { useState } from "react";
import { VocabularyItem } from "../data/vocabulary";
import { Search, Save, X, RotateCcw, ArrowLeft, Edit3, HelpCircle, Check, Info } from "lucide-react";

interface VocabularyEditorScreenProps {
  vocabData: VocabularyItem[];
  onSave: (updatedVocab: VocabularyItem[]) => void;
  onBack: () => void;
  playSound: (type: "correct" | "incorrect" | "click") => void;
  defaultVocab: VocabularyItem[];
}

export const VocabularyEditorScreen: React.FC<VocabularyEditorScreenProps> = ({
  vocabData,
  onSave,
  onBack,
  playSound,
  defaultVocab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number>(0); // 0 = all levels
  const [editingId, setEditingId] = useState<number | null>(null);

  // Temporary inline edit states
  const [editEnglish, setEditEnglish] = useState("");
  const [editChinese, setEditChinese] = useState("");
  const [editAlternatives, setEditAlternatives] = useState("");
  const [editExample, setEditExample] = useState("");
  const [editExampleChinese, setEditExampleChinese] = useState("");

  const handleStartEdit = (item: VocabularyItem) => {
    playSound("click");
    setEditingId(item.id);
    setEditEnglish(item.english);
    setEditChinese(item.chinese);
    setEditAlternatives(item.alternatives ? item.alternatives.join(", ") : "");
    setEditExample(item.example || "");
    setEditExampleChinese(item.exampleChinese || "");
  };

  const handleCancelEdit = () => {
    playSound("click");
    setEditingId(null);
  };

  const handleSaveEdit = (id: number) => {
    if (!editEnglish.trim()) {
      playSound("incorrect");
      alert("英文拼写不能为空哦！");
      return;
    }
    if (!editChinese.trim()) {
      playSound("incorrect");
      alert("中文意思不能为空哦！");
      return;
    }

    playSound("correct");
    const updated = vocabData.map((item) => {
      if (item.id === id) {
        // Parse alternatives from comma-separated list
        const alts = editAlternatives
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0);

        return {
          ...item,
          english: editEnglish.trim(),
          chinese: editChinese.trim(),
          alternatives: alts.length > 0 ? alts : undefined,
          example: editExample.trim() || undefined,
          exampleChinese: editExampleChinese.trim() || undefined,
        };
      }
      return item;
    });

    onSave(updated);
    setEditingId(null);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("确定要恢复默认单词库吗？所有自定义修改都将被覆盖且无法撤销！")) {
      playSound("correct");
      onSave(defaultVocab);
      setEditingId(null);
    }
  };

  // Helper to determine which level a word index belongs to
  const getWordLevel = (id: number) => {
    // 1-indexed id, words are sequenced Level 1 (1-15), Level 2 (16-30), Level 3 (31-45), Level 4 (46-60), Level 5 (61-75)
    // Level 6 (76-91), Level 7 (92-107), Level 8 (108-123), Level 9 (124-139), Level 10 (140-155)
    if (id <= 15) return 1;
    if (id <= 30) return 2;
    if (id <= 45) return 3;
    if (id <= 60) return 4;
    if (id <= 75) return 5;
    if (id <= 91) return 6;
    if (id <= 107) return 7;
    if (id <= 123) return 8;
    if (id <= 139) return 9;
    return 10;
  };

  // Filter words based on search query and level tab
  const filteredWords = vocabData.filter((item) => {
    const levelOfWord = getWordLevel(item.id);
    const matchesLevel = selectedLevel === 0 || levelOfWord === selectedLevel;

    const normQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      normQuery === "" ||
      item.english.toLowerCase().includes(normQuery) ||
      item.chinese.toLowerCase().includes(normQuery) ||
      (item.alternatives && item.alternatives.some((alt) => alt.toLowerCase().includes(normQuery)));

    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#006064] flex items-center gap-2">
            🔧 答案库修正与词汇设置
          </h2>
          <p className="text-xs md:text-sm text-cyan-800 font-bold mt-1">
            双击或点击卡片上的【编辑】按钮，可以修改任意单词的拼写、意思或例句，完美契合孩子学校的教材！
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs md:text-sm border-2 border-rose-300 rounded-xl shadow-[2px_2px_0px_#FDA4AF] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            title="将整个词库恢复至默认的155个词汇"
          >
            <RotateCcw className="w-4 h-4" />
            恢复默认词库
          </button>
          <button
            onClick={() => {
              playSound("click");
              onBack();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs md:text-sm border-2 border-slate-300 rounded-xl shadow-[2px_2px_0px_#CBD5E1] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            返回地图
          </button>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="bg-[#E0F7FA]/70 border-2 border-[#4DD0E1] rounded-2xl p-4 flex gap-3 text-cyan-900 text-xs md:text-sm leading-relaxed">
        <Info className="w-5 h-5 shrink-0 text-[#00838F]" />
        <div>
          <span className="font-extrabold">教材版本各不相同？没关系！</span>
          <p className="font-semibold mt-1">
            你可以给同一个单词添加多个可接受的拼写。用英文逗号隔开即可。例如把书包（schoolbag）的备选答案加上
            <strong className="text-[#00838F]">“school bag”</strong>
            ，这样孩子敲出这两种中的任何一个，游戏都会判定回答正确哦！
          </p>
        </div>
      </div>

      {/* Search and Filters bar */}
      <div className="bg-white border-2 border-cyan-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-600" />
          <input
            type="text"
            placeholder="搜索英文单词、中文释义或备用拼写..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-cyan-50/50 border-2 border-cyan-100 focus:border-[#4DD0E1] rounded-xl font-bold text-sm text-cyan-900 placeholder-cyan-500/70 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-800 font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Level Tabs list */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => {
              playSound("click");
              setSelectedLevel(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border ${
              selectedLevel === 0
                ? "bg-[#0097A7] text-white border-[#00838F] shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            全部关卡
          </button>
          {Array.from({ length: 10 }).map((_, idx) => {
            const lvl = idx + 1;
            return (
              <button
                key={lvl}
                onClick={() => {
                  playSound("click");
                  setSelectedLevel(lvl);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all border ${
                  selectedLevel === lvl
                    ? "bg-[#0097A7] text-white border-[#00838F] shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                第 {lvl} 关
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of editable word cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.length === 0 ? (
          <div className="col-span-full bg-white border-2 border-dashed border-cyan-200 rounded-3xl p-12 text-center text-cyan-600 font-bold">
            <HelpCircle className="w-12 h-12 mx-auto text-cyan-300 mb-3 animate-pulse" />
            没有找到符合搜索条件的单词，请重新输入或切换关卡选项。
          </div>
        ) : (
          filteredWords.map((item) => {
            const isEditing = editingId === item.id;
            const levelOfWord = getWordLevel(item.id);

            if (isEditing) {
              return (
                <div
                  key={item.id}
                  className="bg-cyan-50/50 border-3 border-[#0097A7] rounded-3xl p-5 shadow-md space-y-4 animate-scale-up"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-[#0097A7] text-white px-2 py-0.5 rounded-full font-black">
                      正在修改：单词 #{item.id} (第 {levelOfWord} 关)
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        取消
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-cyan-900 block">标准英文拼写</label>
                      <input
                        type="text"
                        value={editEnglish}
                        onChange={(e) => setEditEnglish(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border-2 border-cyan-200 focus:border-[#4DD0E1] rounded-xl text-sm font-extrabold focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-cyan-900 block">中文释义</label>
                      <input
                        type="text"
                        value={editChinese}
                        onChange={(e) => setEditChinese(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border-2 border-cyan-200 focus:border-[#4DD0E1] rounded-xl text-sm font-extrabold focus:outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-full space-y-1">
                      <label className="text-xs font-extrabold text-cyan-900 block">
                        其他备选答案 (多项请用英文逗号隔开)
                      </label>
                      <input
                        type="text"
                        placeholder="例如: school bag, backpack"
                        value={editAlternatives}
                        onChange={(e) => setEditAlternatives(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border-2 border-cyan-200 focus:border-[#4DD0E1] rounded-xl text-xs font-bold focus:outline-none placeholder-slate-400 transition-all"
                      />
                    </div>
                    <div className="col-span-full space-y-1">
                      <label className="text-xs font-extrabold text-cyan-900 block">例句 (选填)</label>
                      <input
                        type="text"
                        value={editExample}
                        onChange={(e) => setEditExample(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border-2 border-cyan-200 focus:border-[#4DD0E1] rounded-xl text-xs font-semibold focus:outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-full space-y-1">
                      <label className="text-xs font-extrabold text-cyan-900 block">例句翻译 (选填)</label>
                      <input
                        type="text"
                        value={editExampleChinese}
                        onChange={(e) => setEditExampleChinese(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border-2 border-cyan-200 focus:border-[#4DD0E1] rounded-xl text-xs font-semibold focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                onDoubleClick={() => handleStartEdit(item)}
                className="bg-white border-2 border-cyan-100 hover:border-[#4DD0E1] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full border border-cyan-200">
                      ID #{item.id} | 第 {levelOfWord} 关
                    </span>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="opacity-80 group-hover:opacity-100 flex items-center gap-1 text-cyan-700 hover:text-[#00838F] text-xs font-extrabold transition-all bg-cyan-50 group-hover:bg-cyan-100 px-2.5 py-1 rounded-xl border border-cyan-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      编辑
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-black text-[#006064] tracking-tight">{item.english}</span>
                    <span className="text-slate-400 font-bold text-xs">/</span>
                    <span className="text-sm font-extrabold text-slate-600">{item.chinese}</span>
                  </div>

                  {item.alternatives && item.alternatives.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[11px]">
                      <span className="text-cyan-600 font-extrabold">备选匹配:</span>
                      {item.alternatives.map((alt, aIdx) => (
                        <span
                          key={aIdx}
                          className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-semibold border border-slate-200"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.example && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <div className="text-[11px] font-extrabold text-slate-700 italic">“{item.example}”</div>
                      {item.exampleChinese && (
                        <div className="text-[10px] font-bold text-slate-500 mt-0.5">({item.exampleChinese})</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-300 font-black text-right mt-3 select-none pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity">
                  💡 双击卡片直接进行修改
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
