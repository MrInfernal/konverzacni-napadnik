interface HistoryControlsProps {
  stats: {
    totalQuestions: number;
    seenQuestions: number;
    remainingQuestions: number;
    percentComplete: number;
    newQuestionsDetected: number;
  };
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
  onDismissNewQuestions?: () => void;
  compact?: boolean;
}

export default function HistoryControls({
  stats,
  onReset,
  onExport,
  onImport,
  onDismissNewQuestions,
  compact = false,
}: HistoryControlsProps) {
  const handleReset = () => {
    if (
      window.confirm(
        `Opravdu chcete resetovat historii? Ztratíte záznam o ${stats.seenQuestions} viděných otázkách.`
      )
    ) {
      onReset();
    }
  };

  const handleExport = () => {
    onExport();
    alert('Historie byla exportována do schránky!');
  };

  const handleImport = () => {
    const json = prompt('Vložte JSON historii:');
    if (json) {
      onImport();
    }
  };

  if (compact) {
    return (
      <div className="history-controls-compact">
        <div className="stats-compact">
          <span className="stat-number">{stats.seenQuestions}</span>
          <span className="stat-label">/{stats.totalQuestions} otázek</span>
        </div>
        <div className="progress-bar-mini">
          <div
            className="progress-fill-mini"
            style={{ width: `${stats.percentComplete}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="history-controls">
      {stats.newQuestionsDetected > 0 && (
        <div className="new-questions-notification">
          <span className="notification-icon">✨</span>
          <span className="notification-text">
            {stats.newQuestionsDetected} nových otázek!
          </span>
          {onDismissNewQuestions && (
            <button
              onClick={onDismissNewQuestions}
              className="notification-dismiss"
              aria-label="Zavřít"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-value">{stats.seenQuestions}</span>
          <span className="stat-label">viděno</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-item">
          <span className="stat-value">{stats.totalQuestions}</span>
          <span className="stat-label">celkem</span>
        </div>
        <div className="stat-item stat-remaining">
          <span className="stat-value">{stats.remainingQuestions}</span>
          <span className="stat-label">zbývá</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.percentComplete}%` }}
          >
            <span className="progress-text">{stats.percentComplete}%</span>
          </div>
        </div>
      </div>

      <div className="control-buttons">
        <button onClick={handleReset} className="control-button reset-button">
          <span className="button-icon">🔄</span>
          <span className="button-text">Resetovat historii</span>
        </button>

        <div className="control-buttons-secondary">
          <button
            onClick={handleExport}
            className="control-button-small export-button"
            title="Exportovat historii"
          >
            📥
          </button>
          <button
            onClick={handleImport}
            className="control-button-small import-button"
            title="Importovat historii"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
}
