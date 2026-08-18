import { formatTime } from '../../utils/dateUtils';
import { PRIORITY_LABELS } from '../../constants/priorities';

export default function TaskDetailModal({
  todo,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!todo) return null;

  const isEvent = todo.type === 'event';
  const dateStr = todo.date
    ? new Date(todo.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date';
  const isOverdue =
    !todo.completed &&
    todo.date &&
    new Date(todo.date + 'T00:00:00') <
      new Date(new Date().setHours(0, 0, 0, 0));

  let timeStr = '';
  if (isEvent && todo.startTime)
    timeStr =
      formatTime(todo.startTime) +
      (todo.endTime ? ' – ' + formatTime(todo.endTime) : '');
  else if (!isEvent && todo.deadlineTime)
    timeStr = formatTime(todo.deadlineTime);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      onDelete(todo.id);
    }
  };

  return (
    <div className="popup active" onClick={handleBackdropClick}>
      <div className="popup-content detail-content">
        <div className="popup-header">
          <h3>{isEvent ? 'Event Details' : 'Task Details'}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div>
          <div className="detail-title">{todo.text}</div>
          <div style={{ marginTop: '4px', marginBottom: '10px' }}>
            <span className={`type-badge type-${isEvent ? 'event' : 'task'}`}>
              {isEvent ? '⬤ Event' : '☐ Task'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div>
              <i
                className="far fa-calendar"
                style={{ width: '16px', marginRight: '7px', opacity: 0.6 }}
              ></i>
              {dateStr}
              {isOverdue && (
                <span
                  style={{
                    color: 'var(--p-urgent)',
                    fontSize: '11px',
                  }}
                >
                  {' '}
                  · Overdue
                </span>
              )}
            </div>
            {timeStr && (
              <div>
                <i
                  className="far fa-clock"
                  style={{ width: '16px', marginRight: '7px', opacity: 0.6 }}
                ></i>
                {timeStr}
              </div>
            )}
            {todo.location && (
              <div>
                <i
                  className="fas fa-location-dot"
                  style={{ width: '16px', marginRight: '7px', opacity: 0.6 }}
                ></i>
                {todo.location}
              </div>
            )}
            <div>
              <i
                className="fas fa-flag"
                style={{ width: '16px', marginRight: '7px', opacity: 0.6 }}
              ></i>
              <span
                className={`priority-badge p-${todo.priority || 'normal'}`}
              >
                {PRIORITY_LABELS[todo.priority] || 'Normal'}
              </span>
            </div>
            <div>
              <i
                className="fas fa-circle-half-stroke"
                style={{ width: '16px', marginRight: '7px', opacity: 0.6 }}
              ></i>
              {todo.completed ? 'Completed ✓' : 'Ongoing'}
            </div>
            {todo.desc && (
              <div
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  background: 'var(--surface2)',
                  borderRadius: '8px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  fontSize: '13px',
                }}
              >
                {todo.desc}
              </div>
            )}
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-save" onClick={() => onEdit(todo)}>
            <i className="fas fa-pen"></i> Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
