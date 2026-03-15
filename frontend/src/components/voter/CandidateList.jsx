const CandidateList = ({ candidates, selectedId, onSelect, hasVoted, disabled }) => {
  return (
    <div className="candidate-list">
      {candidates.map((c, index) => {
        const isSelected = selectedId === index;
        return (
          <div
            key={c._id || index}
            className={`candidate-item ${isSelected ? 'candidate-item--selected' : ''} ${disabled ? 'candidate-item--disabled' : ''}`}
            onClick={() => !disabled && onSelect(index)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => e.key === 'Enter' && !disabled && onSelect(index)}
          >
            <div className="candidate-item__radio">
              {isSelected ? '●' : '○'}
            </div>
            <div className="candidate-item__info">
              <span className="candidate-item__name">{c.name}</span>
              {c.description && <span className="candidate-item__desc">{c.description}</span>}
            </div>
            {hasVoted && isSelected && (
              <span className="badge badge--green">Your Vote</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CandidateList;