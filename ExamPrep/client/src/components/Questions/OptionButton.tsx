import type { Option } from '../../types';
import './QuestionCard.css';

interface Props {
  option: Option;
  isSelected: boolean;
  isCorrect?: boolean;
  isSubmitted: boolean;
  onClick: () => void;
}

export default function OptionButton({ option, isSelected, isCorrect, isSubmitted, onClick }: Props) {
  let className = 'option-button';
  if (isSelected) className += ' selected';
  if (isSubmitted && isCorrect === true) className += ' correct';
  if (isSubmitted && isSelected && isCorrect === false) className += ' incorrect';

  return (
    <button className={className} onClick={onClick} disabled={isSubmitted}>
      <span className="option-letter">{String.fromCharCode(64 + option.orderIndex)}</span>
      <span className="option-text">{option.optionText}</span>
    </button>
  );
}
