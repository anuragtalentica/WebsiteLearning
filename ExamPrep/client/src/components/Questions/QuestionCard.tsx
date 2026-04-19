import { useState } from 'react';
import type { Question, AnswerResult } from '../../types';
import OptionButton from './OptionButton';
import './QuestionCard.css';

interface Props {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (questionId: number, optionId: number) => Promise<AnswerResult>;
  onNext: () => void;
}

export default function QuestionCard({ question, questionNumber, totalQuestions, onSubmit, onNext }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOptionId) return;
    setLoading(true);
    try {
      const answerResult = await onSubmit(question.id, selectedOptionId);
      setResult(answerResult);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setResult(null);
    onNext();
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  const getDifficultyClass = (level: number) => {
    switch (level) {
      case 1: return 'difficulty-easy';
      case 2: return 'difficulty-medium';
      case 3: return 'difficulty-hard';
      default: return '';
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {questionNumber} of {totalQuestions}</span>
        <span className={`difficulty-badge ${getDifficultyClass(question.difficultyLevel)}`}>
          {getDifficultyLabel(question.difficultyLevel)}
        </span>
      </div>
      <p className="question-text">{question.questionText}</p>
      <div className="options-list">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            isCorrect={result ? option.id === result.correctOptionId : undefined}
            isSubmitted={result !== null}
            onClick={() => !result && setSelectedOptionId(option.id)}
          />
        ))}
      </div>

      {result && (
        <div className={`result-box ${result.isCorrect ? 'result-correct' : 'result-incorrect'}`}>
          <strong>{result.isCorrect ? 'Correct!' : 'Incorrect'}</strong>
          {result.explanation && <p className="explanation">{result.explanation}</p>}
        </div>
      )}

      <div className="question-actions">
        {!result ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!selectedOptionId || loading}
          >
            {loading ? 'Submitting...' : 'Submit Answer'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            {questionNumber < totalQuestions ? 'Next Question' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
}
