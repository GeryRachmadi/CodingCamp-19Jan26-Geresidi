import { formatTime } from '../../utils/dateUtils';

export default function TaskChip({ todo, onToggleComplete, onOpenDetail }) {
  const isEvent = todo.type === 'event';

  const handleClick = (e) => {
    // Don't open detail if clicking the checkbox
    if (!e.target.closest('.chip-check')) {
      onOpenDetail(todo.id);
    }
  };

  const handleCheck = (e) => {
    e.stopPropagation();
    onToggleComplete(todo.id);
  };

  return (
    <div
      className={`task-chip p-${todo.priority || 'normal'} ${todo.completed ? 'completed-chip' : ''}`}
      style={{ display: 'flex' }}
      onClick={handleClick}
    >
      {isEvent ? (
        <i
          className="fas fa-calendar-check chip-type-icon"
          style={{
            fontSize: '10px',
            flexShrink: 0,
            opacity: 0.75,
            marginRight: '1px',
          }}
        ></i>
      ) : (
        <div className="chip-check" onClick={handleCheck}>
          <i className="fas fa-check"></i>
        </div>
      )}

      {!isEvent && todo.deadlineTime && (
        <span className="chip-time">{formatTime(todo.deadlineTime)}</span>
      )}

      <span className="chip-label">{todo.text}</span>
    </div>
  );
}
