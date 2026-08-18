import { useMemo } from 'react';
import {
  isSameDay,
  getMonthGrid,
  formatTime,
  toDateInputVal,
} from '../../utils/dateUtils';

const MAX_SHOW = 3;

export default function MonthView({
  date,
  todos,
  onOpenDetail,
  onOpenPopupWithDateTime,
}) {
  const cells = useMemo(() => getMonthGrid(date), [date]);
  const now = new Date();

  return (
    <div id="view-month" className="view-panel active">
      <div className="month-dow-row">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="month-dow">
            {d}
          </div>
        ))}
      </div>
      <div className="month-grid">
        {cells.map((cell, i) => {
          const dayTasks = todos.filter(
            (t) =>
              t.date &&
              isSameDay(new Date(t.date + 'T00:00:00'), cell.date)
          );
          const isToday = isSameDay(cell.date, now);

          return (
            <div
              key={i}
              className={`month-cell${cell.isOther ? ' mc-other' : ''}${isToday ? ' mc-today' : ''}`}
              onClick={(e) => {
                if (
                  e.target === e.currentTarget ||
                  e.target.classList.contains('mc-date-num')
                ) {
                  onOpenPopupWithDateTime(
                    toDateInputVal(cell.date),
                    '',
                    ''
                  );
                }
              }}
            >
              <div className="mc-date-num">{cell.date.getDate()}</div>
              {dayTasks.slice(0, MAX_SHOW).map((t) => {
                const timeLabel =
                  t.startTime ? formatTime(t.startTime) + ' ' : '';
                return (
                  <div
                    key={t.id}
                    className={`month-chip p-${t.priority || 'normal'} ${t.completed ? 'completed-chip' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(t.id);
                    }}
                  >
                    {timeLabel}
                    {t.text}
                  </div>
                );
              })}
              {dayTasks.length > MAX_SHOW && (
                <div className="month-more">
                  +{dayTasks.length - MAX_SHOW} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
