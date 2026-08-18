export function pad(n) {
  return String(n).padStart(2, '0');
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getWeekRange(date) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

export function timeToHour(timeStr) {
  if (!timeStr) return -1;
  return parseInt(timeStr.split(':')[0], 10);
}

export function formatHour(h) {
  return `${pad(h)}:00`;
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  return `${pad(h)}:${pad(m)}`;
}

export function toDateInputVal(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

export function compareDates(a, b, dir) {
  const da = a.date ? new Date(a.date).getTime() : Infinity;
  const db = b.date ? new Date(b.date).getTime() : Infinity;
  return (da - db) * dir;
}

export function getWeekDays(date) {
  const { start } = getWeekRange(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function getMonthGrid(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    let cellDate;
    let isOther = false;
    if (i < firstDay) {
      cellDate = new Date(year, month - 1, daysInPrev - firstDay + i + 1);
      isOther = true;
    } else if (i >= firstDay + daysInMonth) {
      cellDate = new Date(year, month + 1, i - firstDay - daysInMonth + 1);
      isOther = true;
    } else {
      cellDate = new Date(year, month, i - firstDay + 1);
    }
    cells.push({ date: cellDate, isOther });
  }
  return cells;
}

export function getTopbarTitle(currentView, currentDate) {
  if (currentView === 'day') {
    const isToday = isSameDay(currentDate, new Date());
    return isToday
      ? 'Today — ' +
          currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })
      : currentDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  } else if (currentView === 'week') {
    const { start, end } = getWeekRange(currentDate);
    return (
      start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' – ' +
      end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  } else if (currentView === 'month') {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }
  return 'All Tasks';
}
