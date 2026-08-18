import { useEffect, useRef, useMemo, useState } from 'react';
import {
  isSameDay,
  getWeekDays,
  formatHour,
  formatTime,
  pad,
  toDateInputVal,
} from '../../utils/dateUtils';
import TaskChip from '../common/TaskChip';
import EventBlock from '../common/EventBlock';

const ROW_H = 60;
const TOTAL_H = 24 * ROW_H;

export default function WeekView({
  date,
  todos,
  onOpenDetail,
  onToggleComplete,
  onOpenPopupWithDateTime,
}) {
  const scrollRef = useRef(null);
  const weekDays = useMemo(() => getWeekDays(date), [date]);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const now = new Date();

  // Track hovered slots
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Scroll to current hour if current week
  useEffect(() => {
    if (weekDays.some((d) => isSameDay(d, now)) && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: Math.max(0, now.getHours() * ROW_H - 80),
          behavior: 'smooth',
        });
      }, 80);
    }
  }, [date]);

  return (
    <div id="view-week" className="view-panel active">
      <div className="week-wrapper">
        <div className="week-scroll" ref={scrollRef}>
          {/* Header Row */}
          <div
            className="week-header-row"
            style={{
              gridTemplateColumns: `var(--time-col) repeat(7, 1fr)`,
            }}
          >
            <div className="week-header-spacer"></div>
            {weekDays.map((d) => {
              const isToday = isSameDay(d, now);
              return (
                <div
                  key={d.toISOString()}
                  className={`week-day-head${isToday ? ' wdh-today' : ''}`}
                >
                  <div className="wdh-dow">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="wdh-num">{d.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div
            className="week-grid"
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            {/* All-day strip */}
            <div
              style={{
                display: 'flex',
                borderBottom: '2px solid var(--border)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 'var(--time-col)',
                  minWidth: 'var(--time-col)',
                  fontSize: '9px',
                  color: 'var(--text-muted)',
                  padding: '5px 6px 0 0',
                  textAlign: 'right',
                  borderRight: '1px solid var(--border)',
                  flexShrink: 0,
                }}
              >
                all day
              </div>
              {weekDays.map((d) => {
                const isToday = isSameDay(d, now);
                const allDayTasks = todos.filter(
                  (t) =>
                    t.date &&
                    !(t.type === 'event' ? t.startTime : t.deadlineTime) &&
                    isSameDay(new Date(t.date + 'T00:00:00'), d)
                );
                return (
                  <div
                    key={d.toISOString()}
                    className={isToday ? 'wdc-today' : ''}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      borderRight: '1px solid var(--border)',
                      padding: '3px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      minHeight: '32px',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        onOpenPopupWithDateTime(
                          toDateInputVal(d),
                          '',
                          '',
                          'task'
                        );
                      }
                    }}
                  >
                    {allDayTasks.map((t) => (
                      <TaskChip
                        key={t.id}
                        todo={t}
                        onToggleComplete={onToggleComplete}
                        onOpenDetail={onOpenDetail}
                      />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Timed grid */}
            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
              {/* Time labels column */}
              <div
                style={{
                  width: 'var(--time-col)',
                  minWidth: 'var(--time-col)',
                  flexShrink: 0,
                  position: 'relative',
                  height: `${TOTAL_H}px`,
                  borderRight: '1px solid var(--border)',
                }}
              >
                {hours.map((h) => (
                  <div key={h}>
                    <div
                      style={{
                        position: 'absolute',
                        top: `${h * ROW_H}px`,
                        right: '6px',
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        lineHeight: 1,
                        paddingTop: '4px',
                      }}
                    >
                      {h === 0 ? '' : formatHour(h)}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: `${h * ROW_H}px`,
                        left: 0,
                        right: 0,
                        borderTop: '1px solid var(--border)',
                        width: '100%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((d, dayIdx) => {
                const isToday = isSameDay(d, now);
                const timedTasks = todos.filter(
                  (t) =>
                    t.date &&
                    (t.type === 'event' ? t.startTime : t.deadlineTime) &&
                    isSameDay(new Date(t.date + 'T00:00:00'), d)
                );

                return (
                  <div
                    key={d.toISOString()}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      position: 'relative',
                      height: `${TOTAL_H}px`,
                      borderRight: '1px solid var(--border)',
                      background: isToday
                        ? 'rgba(79,110,247,0.03)'
                        : undefined,
                    }}
                  >
                    {/* Hour slots (click targets + grid lines) */}
                    {hours.map((h) => (
                      <div
                        key={h}
                        style={{
                          position: 'absolute',
                          top: `${h * ROW_H}px`,
                          left: 0,
                          right: 0,
                          height: `${ROW_H}px`,
                          borderTop: '1px solid var(--border)',
                          cursor: 'pointer',
                          boxSizing: 'border-box',
                          background:
                            hoveredSlot === `${dayIdx}-${h}`
                              ? 'rgba(79,110,247,0.04)'
                              : undefined,
                        }}
                        onClick={() =>
                          onOpenPopupWithDateTime(
                            toDateInputVal(d),
                            `${pad(h)}:00`,
                            `${pad(h + 1)}:00`,
                            'event'
                          )
                        }
                        onMouseEnter={() =>
                          setHoveredSlot(`${dayIdx}-${h}`)
                        }
                        onMouseLeave={() => setHoveredSlot(null)}
                      ></div>
                    ))}

                    {/* Timed event blocks */}
                    {timedTasks.map((t) => {
                      const isEvent = t.type === 'event';
                      const timeRef = isEvent
                        ? t.startTime
                        : t.deadlineTime;
                      const [sh, sm] = timeRef.split(':').map(Number);
                      const startFrac = sh + sm / 60;
                      let durationH = 0.5;
                      if (isEvent && t.endTime) {
                        const [eh, em] = t.endTime.split(':').map(Number);
                        durationH = Math.max(
                          0.25,
                          eh + em / 60 - startFrac
                        );
                      }

                      return (
                        <EventBlock
                          key={t.id}
                          todo={t}
                          top={startFrac * ROW_H}
                          height={durationH * ROW_H}
                          onOpenDetail={onOpenDetail}
                          style={{ left: '2px', right: '2px' }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
