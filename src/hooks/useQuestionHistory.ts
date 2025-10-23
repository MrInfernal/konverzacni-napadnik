import { useState, useEffect } from 'react';
import { Category } from '@/data';
import { generateCategoryHashes } from '@/utils/hashHelper';

const STORAGE_KEY = 'konverzacni-napadnik-history';

interface QuestionHistory {
  seenQuestions: Record<string, number>; // key: "categoryId-questionIndex", value: timestamp
  questionHashes: Record<string, string>; // key: categoryId, value: hash
  stats: {
    totalSeen: number;
    lastReset: number;
    sessionCount: number;
  };
}

interface HistoryStats {
  totalQuestions: number;
  seenQuestions: number;
  remainingQuestions: number;
  percentComplete: number;
  newQuestionsDetected: number;
}

export function useQuestionHistory(categories: Category[]) {
  const [history, setHistory] = useState<QuestionHistory>(() => loadHistory());
  const [newQuestionsCount, setNewQuestionsCount] = useState(0);

  // Load history from localStorage
  function loadHistory(): QuestionHistory {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }

    // Default empty history
    return {
      seenQuestions: {},
      questionHashes: {},
      stats: {
        totalSeen: 0,
        lastReset: Date.now(),
        sessionCount: 0,
      },
    };
  }

  // Save history to localStorage
  function saveHistory(newHistory: QuestionHistory) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  // Detect new questions by comparing hashes
  useEffect(() => {
    const currentHashes = generateCategoryHashes(categories);
    let newQuestionsFound = 0;

    categories.forEach(category => {
      const oldHash = history.questionHashes[category.id];
      const newHash = currentHashes[category.id];

      // If hash changed, some questions were added/modified
      if (oldHash && oldHash !== newHash) {
        // Count how many questions are in this category
        const categoryQuestionCount = category.questions.length;
        const seenInCategory = Object.keys(history.seenQuestions).filter(
          key => key.startsWith(`${category.id}-`)
        ).length;

        // Estimate new questions (this is approximate)
        if (categoryQuestionCount > seenInCategory) {
          newQuestionsFound += categoryQuestionCount - seenInCategory;
        }
      }
    });

    if (newQuestionsFound > 0) {
      setNewQuestionsCount(newQuestionsFound);
    }

    // Update hashes
    const updatedHistory = {
      ...history,
      questionHashes: currentHashes,
    };
    saveHistory(updatedHistory);
  }, [categories]);

  // Check if a question has been seen
  function isQuestionSeen(categoryId: string, questionIndex: number): boolean {
    const key = `${categoryId}-${questionIndex}`;
    return key in history.seenQuestions;
  }

  // Mark a question as seen
  function markQuestionAsSeen(categoryId: string, questionIndex: number) {
    const key = `${categoryId}-${questionIndex}`;

    if (!isQuestionSeen(categoryId, questionIndex)) {
      const updatedHistory = {
        ...history,
        seenQuestions: {
          ...history.seenQuestions,
          [key]: Date.now(),
        },
        stats: {
          ...history.stats,
          totalSeen: history.stats.totalSeen + 1,
        },
      };
      saveHistory(updatedHistory);
    }
  }

  // Get questions that haven't been seen yet
  function getUnseenQuestions(selectedCategories: Category[]) {
    const unseenQuestions: Array<{
      question: string;
      category: Category;
      questionIndex: number;
    }> = [];

    selectedCategories.forEach(category => {
      category.questions.forEach((question, index) => {
        if (!isQuestionSeen(category.id, index)) {
          unseenQuestions.push({
            question,
            category,
            questionIndex: index,
          });
        }
      });
    });

    return unseenQuestions;
  }

  // Reset history (clear all seen questions)
  function resetHistory() {
    const currentHashes = generateCategoryHashes(categories);
    const freshHistory: QuestionHistory = {
      seenQuestions: {},
      questionHashes: currentHashes,
      stats: {
        totalSeen: 0,
        lastReset: Date.now(),
        sessionCount: history.stats.sessionCount + 1,
      },
    };
    saveHistory(freshHistory);
    setNewQuestionsCount(0);
  }

  // Get statistics
  function getStats(): HistoryStats {
    const totalQuestions = categories.reduce(
      (sum, cat) => sum + cat.questions.length,
      0
    );
    const seenQuestions = Object.keys(history.seenQuestions).length;
    const remainingQuestions = totalQuestions - seenQuestions;
    const percentComplete = Math.round((seenQuestions / totalQuestions) * 100);

    return {
      totalQuestions,
      seenQuestions,
      remainingQuestions,
      percentComplete,
      newQuestionsDetected: newQuestionsCount,
    };
  }

  // Export history as JSON
  function exportHistory(): string {
    return JSON.stringify(history, null, 2);
  }

  // Import history from JSON
  function importHistory(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      // Validate structure
      if (
        imported.seenQuestions &&
        imported.questionHashes &&
        imported.stats
      ) {
        saveHistory(imported);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }

  // Clear new questions notification
  function dismissNewQuestionsNotification() {
    setNewQuestionsCount(0);
  }

  return {
    isQuestionSeen,
    markQuestionAsSeen,
    getUnseenQuestions,
    resetHistory,
    getStats,
    exportHistory,
    importHistory,
    newQuestionsCount,
    dismissNewQuestionsNotification,
  };
}
