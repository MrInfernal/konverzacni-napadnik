import { useState, useEffect } from 'react';
import { categories, Category } from '@/data';

type Mode = 'menu' | 'random-mix' | 'multi-select' | 'single-category';
type QuestionWithCategory = { question: string; category: Category; questionIndex: number };

export default function App() {
  const [mode, setMode] = useState<Mode>('menu');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithCategory | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(() => {
    // Load progress from localStorage on init
    const saved = localStorage.getItem('usedQuestions');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('usedQuestions', JSON.stringify(Array.from(usedQuestions)));
  }, [usedQuestions]);

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
  };

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    setCurrentQuestion(null);
    // Keep usedQuestions - progress is now persistent across sessions

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

  // Get answered questions count for a specific category
  const getAnsweredQuestionsCount = (categoryId: string): number => {
    return Array.from(usedQuestions).filter(key => key.startsWith(`${categoryId}-`)).length;
  };

  const getNextQuestion = () => {
    if (selectedCategories.length === 0) return;

    const allQuestions: QuestionWithCategory[] = [];
    selectedCategories.forEach(cat => {
      cat.questions.forEach((q, idx) => {
        allQuestions.push({ question: q, category: cat, questionIndex: idx });
      });
    });

    const totalQuestions = allQuestions.length;
    if (usedQuestions.size >= totalQuestions) {
      setUsedQuestions(new Set());
    }

    let nextQuestion: QuestionWithCategory;
    let questionKey: string;

    do {
      const randomIndex = Math.floor(Math.random() * totalQuestions);
      nextQuestion = allQuestions[randomIndex];
      questionKey = `${nextQuestion.category.id}-${nextQuestion.questionIndex}`;
    } while (usedQuestions.has(questionKey) && usedQuestions.size < totalQuestions);

    setUsedQuestions(prev => new Set([...prev, questionKey]));
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
      // Going back from questions to category selection - keep progress
      setCurrentQuestion(null);
    } else {
      // Going back to main menu - keep progress (now persisted in localStorage)
      setMode('menu');
      setSelectedCategories([]);
      setCurrentQuestion(null);
      // Don't reset usedQuestions - progress is now persistent
    }
  };

  // Disclaimer Modal
  const DisclaimerModal = () => {
    if (!showDisclaimer) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Experimentální Aplikace
            </h2>
          </div>
          <div className="text-slate-700 space-y-4 mb-8">
            <p className="text-lg">
              Tato aplikace je ve fázi <strong>experimentálního vývoje</strong>.
            </p>
            <ul className="list-disc list-inside space-y-2 text-left">
              <li>Některé otázky mohou být formulovány nepřesně nebo obsahovat chyby</li>
              <li>Aplikace slouží primárně pro testování a zpětnou vazbu</li>
              <li>Očekáváme vaše náměty na vylepšení</li>
            </ul>
            <p className="text-sm text-slate-500 mt-4">
              Děkujeme za pochopení a těšíme se na vaše podněty! 🙏
            </p>
          </div>
          <button
            onClick={handleDisclaimerClose}
            style={{
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
              width: '100%',
              color: 'white',
              padding: '1.5rem 2.5rem',
              borderRadius: '1rem',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(168, 85, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
          >
            ✓ Rozumím, pokračovat do aplikace →
          </button>
        </div>
      </div>
    );
  };

  // Main menu - mode selection
  if (mode === 'menu') {
    return (
      <>
        <DisclaimerModal />
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

          <div className="text-center mt-12 text-slate-400 text-sm">
            <p>Verze 1.1.0 (Vite) • Experimentální</p>
          </div>
        </div>
      </div>
      </>
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
              const answeredCount = getAnsweredQuestionsCount(category.id);
              const totalCount = category.questions.length;

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
                  <div className="mt-4 space-y-2">
                    <p className="text-xs opacity-75">
                      {category.questions.length} otázek
                    </p>
                    {answeredCount > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs">
                          Zodpovězeno: {answeredCount} / {totalCount}
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div
                            className="bg-white rounded-full h-1.5 transition-all duration-300"
                            style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
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
            {categories.map((category) => {
              const answeredCount = getAnsweredQuestionsCount(category.id);
              const totalCount = category.questions.length;

              return (
                <button
                  key={category.id}
                  onClick={() => handleSingleCategorySelect(category)}
                  className={`${category.color} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-white`}
                >
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  <p className="text-sm opacity-90">{category.description}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs opacity-75">
                      {category.questions.length} otázek
                    </p>
                    {answeredCount > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs">
                          Zodpovězeno: {answeredCount} / {totalCount}
                        </p>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div
                            className="bg-white rounded-full h-1.5 transition-all duration-300"
                            style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
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
      </div>
    </div>
  );
}
