import { useMemo } from 'react';
import { formatTime } from '../../utils/dateUtils';
import {
  PRIORITY_ORDER,
  PRIORITY_LABELS,
} from '../../constants/priorities';

const DIR_ICONS = {
  date: { asc: 'fa-arrow-up-short-wide', desc: 'fa-arrow-down-short-wide' },
  name: { asc: 'fa-arrow-down-a-z', desc: 'fa-arrow-up-z-a' },
  priority: {
    asc: 'fa-arrow-up-wide-short',
    desc: 'fa-arrow-down-wide-short',
  },
};

export default function ListView({
  todos,
  sortKey,
  sortDir,
  onSetSortKey,
  onOpenDetail,
  onOpenEditPopup,
  onToggleComplete,
  onDeleteTodo,
}) {
  const sorted = useMemo(() => {
    const copy = [...todos];
    const dir = sortDir[sortKey] === 'asc' ? 1 : -1;
    copy.sort((a, b) => {
      if (sortKey === 'date') {
        const da = a.date ? new Date(a.date).getTime() : Infinity;
        const db = b.date ? new Date(b.date).getTime() : Infinity;
        return (da - db) * dir;
      }
      if (sortKey === 'name') return a.text.localeCompare(b.text) * dir;
      if (sortKey === 'priority')
        return (
          ((PRIORITY_ORDER[b.priority] || 0) -
            (PRIORITY_ORDER[a.priority] || 0)) *
          dir
        );
      return 0;
    });
    return copy;
  }, [todos, sortKey, sortDir]);

  const isEmpty = sorted.length === 0;

  return (
    <div id="view-list" className="view-panel active">
      {/* Sort toolbar */}
      <div className="list-toolbar">
        <div className="sort-group">
          <span className="sort-group-label">Sort by:</span>
          <div className="sort-btn-group">
            {['date', 'name', 'priority'].map((key) => {
              const labels = { date: 'Deadline', name: 'Name', priority: 'Priority' };
              const currentDir = sortDir[key] || 'asc';
              return (
                <button
                  key={key}
                  className={`sort-seg${sortKey === key ? ' active' : ''}`}
                  data-sort-key={key}
                  onClick={() => onSetSortKey(key)}
                >
                  <i
                    className={`fas ${DIR_ICONS[key][currentDir]} sort-dir-icon`}
                  ></i>{' '}
                  {labels[key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className={`list-empty${isEmpty ? ' show' : ''}`}>
        <i className="fas fa-clipboard-list"></i>
        <p>No tasks here. Add one!</p>
      </div>

      {/* Task list */}
      <ul className="task-list">
        {sorted.map((t) => {
          const isEvent = t.type === 'event';
          const dateStr = t.date
            ? new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—';

          let timeStr = '';
          if (isEvent && t.startTime)
            timeStr =
              formatTime(t.startTime) +
              (t.endTime ? ' – ' + formatTime(t.endTime) : '');
          else if (!isEvent && t.deadlineTime)
            timeStr = formatTime(t.deadlineTime);

          const isOverdue =
            !t.completed &&
            t.date &&
            new Date(t.date + 'T00:00:00') <
              new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <li
              key={t.id}
              className={`task-item p-${t.priority || 'normal'} ${t.completed ? 'completed' : ''}`}
              onClick={() => onOpenDetail(t.id)}
            >
              <div
                className={`task-checkbox ${isEvent ? 'event-checkbox' : ''} ${t.completed ? 'checked' : ''}`}
                onClick={(e) => {
                  if (!isEvent) {
                    e.stopPropagation();
                    onToggleComplete(t.id);
                  }
                }}
              >
                {isEvent ? (
                  <i
                    className="fas fa-calendar-check"
                    style={{ fontSize: '10px' }}
                  ></i>
                ) : t.completed ? (
                  <i className="fas fa-check"></i>
                ) : null}
              </div>
              <div className="task-body">
                <div className="task-name">
                  {t.text}
                  <span
                    className={`type-badge type-${isEvent ? 'event' : 'task'}`}
                    style={{ marginLeft: '6px', verticalAlign: 'middle' }}
                  >
                    {isEvent ? 'Event' : 'Task'}
                  </span>
                </div>
                <div className="task-meta">
                  <span className={isOverdue ? 'overdue' : ''}>
                    <i className="far fa-calendar"></i> {dateStr}
                    {timeStr && (
                      <>
                        <i
                          className="far fa-clock"
                          style={{ marginLeft: '6px' }}
                        ></i>{' '}
                        {timeStr}
                      </>
                    )}
                    {isOverdue && ' · Overdue'}
                  </span>
                  {t.location && (
                    <span>
                      <i
                        className="fas fa-location-dot"
                        style={{ marginRight: '3px', opacity: 0.6 }}
                      ></i>
                      {t.location}
                    </span>
                  )}
                  <span
                    className={`priority-badge p-${t.priority || 'normal'}`}
                  >
                    {PRIORITY_LABELS[t.priority] || 'Normal'}
                  </span>
                </div>
                {t.desc && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '340px',
                    }}
                  >
                    {t.desc}
                  </div>
                )}
              </div>
              <div className="task-actions">
                <button
                  className="act-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditPopup(t.id);
                  }}
                  title="Edit"
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className="act-btn del"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTodo(t.id);
                  }}
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
