import { useEffect, useRef, useMemo } from 'react';
import { isSameDay, formatHour, pad, toDateInputVal } from '../../utils/dateUtils';
import TaskChip from '../common/TaskChip';
import EventBlock from '../common/EventBlock';

const ROW_H = 60;

export default function DayView({
  date,
  todos,
  onOpenDetail,
  onToggleComplete,
  onOpenPopupWithDateTime,
}) {
  const timelineRef = useRef(null);

  const dayTasks = useMemo(
    () =>
      todos.filter(
        (t) => t.date && isSameDay(new Date(t.date + 'T00:00:00'), date)
      ),
    [todos, date]
  );

  const timedTasks = useMemo(
    () =>
      dayTasks.filter((t) =>
        t.type === 'event' ? t.startTime : t.deadlineTime
      ),
    [dayTasks]
  );

  const untimedTasks = useMemo(
    () =>
      dayTasks.filter((t) =>
        t.type === 'event' ? !t.startTime : !t.deadlineTime
      ),
    [dayTasks]
  );

  // Scroll to current hour if today
  useEffect(() => {
    if (isSameDay(date, new Date()) && timelineRef.current) {
      const h = new Date().getHours();
      setTimeout(() => {
        timelineRef.current?.scrollTo({
          top: Math.max(0, h * ROW_H - 80),
          behavior: 'smooth',
        });
      }, 80);
    }
  }, [date]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div id="view-day" className="view-panel active">
      <div className="day-view-header">
        <i className="fas fa-tasks" style={{ marginRight: '6px' }}></i>
        {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} on this day
      </div>
      <div className="day-timeline" ref={timelineRef}>
        {/* All-day / untimed section */}
        {untimedTasks.length > 0 && (
          <div className="no-time-section">
            <div className="no-time-label">All day / No time set</div>
            {untimedTasks.map((t) => (
              <TaskChip
                key={t.id}
                todo={t}
                onToggleComplete={onToggleComplete}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        )}

        {/* 24-hour timeline */}
        <div className="timeline-inner" style={{ height: `${24 * ROW_H}px` }}>
          {hours.map((h) => (
            <div
              key={h}
              className="timeline-row"
              style={{ top: `${h * ROW_H}px` }}
            >
              <div
                className="time-label"
                style={{
                  width: '56px',
                  minWidth: '56px',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  padding: '7px 8px 0 0',
                  textAlign: 'right',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                {formatHour(h)}
              </div>
              <div
                className="timeline-slot"
                style={{ flex: 1, height: '100%' }}
                onClick={() =>
                  onOpenPopupWithDateTime(
                    toDateInputVal(date),
                    `${pad(h)}:00`,
                    ''
                  )
                }
              ></div>
            </div>
          ))}

          {/* Timed event/task blocks */}
          {timedTasks.map((t) => {
            const isEvent = t.type === 'event';
            const timeRef = isEvent ? t.startTime : t.deadlineTime;
            const [sh, sm] = timeRef.split(':').map(Number);
            const startFrac = sh + sm / 60;

            let durationH = 0.5;
            if (isEvent && t.endTime) {
              const [eh, em] = t.endTime.split(':').map(Number);
              durationH = Math.max(0.25, eh + em / 60 - startFrac);
            }

            return (
              <EventBlock
                key={t.id}
                todo={t}
                top={startFrac * ROW_H}
                height={durationH * ROW_H}
                onOpenDetail={onOpenDetail}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
