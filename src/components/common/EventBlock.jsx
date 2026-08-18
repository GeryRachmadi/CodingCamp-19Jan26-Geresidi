import { formatTime } from '../../utils/dateUtils';

export default function EventBlock({
  todo,
  top,
  height,
  onOpenDetail,
  style: extraStyle,
}) {
  const isEvent = todo.type === 'event';

  const handleClick = (e) => {
    e.stopPropagation();
    onOpenDetail(todo.id);
  };

  const baseStyle = {
    top: `${top}px`,
    height: `${height}px`,
    ...extraStyle,
  };

  return (
    <div
      className={`event-block-abs p-${todo.priority || 'normal'} ${todo.completed ? 'completed-chip' : ''}`}
      style={baseStyle}
      onClick={handleClick}
    >
      <div className="ebl-time">
        <i
          className={`fas ${isEvent ? 'fa-calendar-check' : 'fa-check-square'}`}
          style={{ fontSize: '9px', marginRight: isEvent ? '3px' : '4px' }}
        ></i>
        {isEvent
          ? `${formatTime(todo.startTime)}${todo.endTime ? ' – ' + formatTime(todo.endTime) : ''}`
          : formatTime(todo.deadlineTime)}
      </div>
      <div className="ebl-title">{todo.text}</div>
    </div>
  );
}
