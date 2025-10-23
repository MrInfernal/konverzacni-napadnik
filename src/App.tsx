import { useState, useEffect } from 'react';
import { categories, Category } from '@/data';
import { useQuestionHistory } from '@/hooks/useQuestionHistory';
import HistoryControls from '@/components/HistoryControls';

type Mode = 'menu' | 'random-mix' | 'multi-select' | 'single-category';
type QuestionWithCategory = { question: string; category: Category; questionIndex: number };

export default function App() {
  const [mode, setMode] = useState<Mode>('menu');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithCategory | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [showAllSeenModal, setShowAllSeenModal] = useState(false);

  // Question history management
  const history = useQuestionHistory(categories);

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    setUsedQuestions(new Set());
    setCurrentQuestion(null);

    if (selectedMode === 'random-mix') {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev => {
      const exists = prev.find(c => c.id === category.id);
      if (exists) {
        return prev.filter(c => c.id !== category.id);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSingleCategorySelect = (category: Category) => {
    setSelectedCategories([category]);
  };

  const getNextQuestion = () => {
    if (selectedCategories.length === 0) return;

    // Get unseen questions from persistent history
    const unseenQuestions = history.getUnseenQuestions(selectedCategories);

    // If all questions seen, show modal
    if (unseenQuestions.length === 0) {
      setShowAllSeenModal(true);
      return;
    }

    // Filter out questions used in current session
    const availableQuestions = unseenQuestions.filter(q => {
      const key = `${q.category.id}-${q.questionIndex}`;
      return !usedQuestions.has(key);
    });

    // If no questions available in current session, reset session
    const questionsToUse = availableQuestions.length > 0 ? availableQuestions : unseenQuestions;

    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
    }

    // Pick random question
    const randomIndex = Math.floor(Math.random() * questionsToUse.length);
    const nextQuestion = questionsToUse[randomIndex];
    const questionKey = `${nextQuestion.category.id}-${nextQuestion.questionIndex}`;

    // Mark as used in session and persistent history
    setUsedQuestions(prev => new Set([...prev, questionKey]));
    history.markQuestionAsSeen(nextQuestion.category.id, nextQuestion.questionIndex);
    setCurrentQuestion(nextQuestion);
  };

  // Auto-start random mix mode and single category mode
  useEffect(() => {
    if ((mode === 'random-mix' || mode === 'single-category') && !currentQuestion && selectedCategories.length > 0) {
      getNextQuestion();
    }
  }, [mode, selectedCategories.length]);

  const handleBack = () => {
    if (mode === 'multi-select' && selectedCategories.length > 0 && currentQuestion) {
      setCurrentQuestion(null);
      setUsedQuestions(new Set());
    } else {
      setMode('menu');
      setSelectedCategories([]);
      setCurrentQuestion(null);
      setUsedQuestions(new Set());
    }
  };

  // Main menu - mode selection
  if (mode === 'menu') {
    const stats = history.getStats();

    const handleExport = () => {
      const json = history.exportHistory();
      navigator.clipboard.writeText(json);
    };

    const handleImport = () => {
      const json = prompt('Vložte JSON historii:');
      if (json) {
        const success = history.importHistory(json);
        if (success) {
          alert('Historie byla úspěšně importována!');
        } else {
          alert('Chyba při importu historie. Zkontrolujte formát.');
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Konverzační Nápadník
            </h1>
            <p className="text-xl text-slate-300">
              Vyberte režim zobrazování otázek
            </p>
          </div>

          {/* History Controls */}
          <div className="mb-8">
            <HistoryControls
              stats={stats}
              onReset={history.resetHistory}
              onExport={handleExport}
              onImport={handleImport}
              onDismissNewQuestions={history.dismissNewQuestionsNotification}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleModeSelect('random-mix')}
              className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white"
            >
              <div className="text-5xl mb-4">🎲</div>
              <h2 className="text-2xl font-bold mb-3">Náhodný Mix</h2>
              <p className="text-sm opacity-90">
                Otázky ze všech kategorií náhodně
              </p>
            </button>

            <button
              onClick={() => handleModeSelect('multi-select')}
              className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white"
            >
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-bold mb-3">Vlastní Výběr</h2>
              <p className="text-sm opacity-90">
                Vyberte si kategorie dle libosti
              </p>
            </button>

            <button
              onClick={() => handleModeSelect('single-category')}
              className="bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white"
            >
              <div className="text-5xl mb-4">📂</div>
              <h2 className="text-2xl font-bold mb-3">Jedna Kategorie</h2>
              <p className="text-sm opacity-90">
                Otázky pouze z jedné kategorie
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multi-select mode - category selection
  if (mode === 'multi-select' && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-8 text-white hover:text-slate-300 transition-colors flex items-center gap-2"
          >
            ← Zpět na režimy
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Vyberte kategorie
            </h1>
            <p className="text-lg text-slate-300">
              Vybráno: {selectedCategories.length} kategorií
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => {
              const isSelected = selectedCategories.find(c => c.id === category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category)}
                  className={`${isSelected ? category.color : 'bg-white/10'} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white relative`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      ✓
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  <p className="text-sm opacity-90">{category.description}</p>
                  <p className="mt-4 text-xs opacity-75">
                    {category.questions.length} otázek
                  </p>
                </button>
              );
            })}
          </div>

          {selectedCategories.length > 0 && (
            <div className="text-center">
              <button
                onClick={getNextQuestion}
                className="bg-white text-purple-900 py-4 px-12 rounded-full font-bold text-xl hover:bg-slate-100 transition-colors shadow-lg"
              >
                Začít s {selectedCategories.length} kategoriemi →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Single category mode - category selection
  if (mode === 'single-category' && selectedCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-8 text-white hover:text-slate-300 transition-colors flex items-center gap-2"
          >
            ← Zpět na režimy
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Vyberte jednu kategorii
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSingleCategorySelect(category)}
                className={`${category.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white`}
              >
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-sm opacity-90">{category.description}</p>
                <p className="mt-4 text-xs opacity-75">
                  {category.questions.length} otázek
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-2xl">Načítání...</div>
      </div>
    );
  }

  const totalQuestions = selectedCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const progress = Math.round((usedQuestions.size / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <button
          onClick={handleBack}
          className="mb-8 text-white hover:text-slate-300 transition-colors flex items-center gap-2"
        >
          ← Zpět
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <div className={`inline-block ${currentQuestion.category.color} px-4 py-2 rounded-full text-white font-semibold mb-4`}>
              {currentQuestion.category.name}
            </div>
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/70 text-sm">
              {usedQuestions.size} z {totalQuestions} otázek
            </p>
          </div>

          <div className="my-12">
            <p className="text-white text-3xl md:text-4xl font-medium leading-relaxed text-center">
              {currentQuestion.question}
            </p>
          </div>

          <button
            onClick={getNextQuestion}
            className="w-full bg-white text-purple-900 py-4 px-8 rounded-full font-bold text-xl hover:bg-slate-100 transition-colors shadow-lg"
          >
            Další otázka →
          </button>
        </div>

        {/* All questions seen modal */}
        {showAllSeenModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-purple-900 mb-4">
                  Gratuluji!
                </h2>
                <p className="text-lg text-slate-700 mb-6">
                  Viděl/a jste všechny otázky z vybraných kategorií!
                  <br />
                  Chcete začít znovu?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      history.resetHistory();
                      setShowAllSeenModal(false);
                      setUsedQuestions(new Set());
                      getNextQuestion();
                    }}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-full font-bold hover:bg-purple-700 transition-colors"
                  >
                    ✅ Resetovat a pokračovat
                  </button>
                  <button
                    onClick={() => {
                      setShowAllSeenModal(false);
                      handleBack();
                    }}
                    className="flex-1 bg-slate-200 text-slate-700 py-3 px-6 rounded-full font-bold hover:bg-slate-300 transition-colors"
                  >
                    ❌ Zpět na menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
