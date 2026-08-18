import { useMemo } from 'react';
import { getTopbarTitle } from '../../utils/dateUtils';

const VIEWS = [
  { key: 'day', icon: 'fa-calendar-day', label: 'Day' },
  { key: 'week', icon: 'fa-calendar-week', label: 'Week' },
  { key: 'month', icon: 'fa-calendar-alt', label: 'Month' },
  { key: 'list', icon: 'fa-list-ul', label: 'List' },
];

export default function Topbar({
  currentView,
  currentDate,
  onNavigatePrev,
  onNavigateNext,
  onGoToday,
  onSelectView,
  onToggleTheme,
  isLight,
  onOpenSidebar,
}) {
  const title = useMemo(
    () => getTopbarTitle(currentView, currentDate),
    [currentView, currentDate]
  );

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          className="hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <button className="nav-arrow" onClick={onNavigatePrev}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="nav-arrow" onClick={onNavigateNext}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <button className="today-btn" onClick={onGoToday}>
          Today
        </button>
        <h2 className="topbar-title">{title}</h2>
      </div>
      <div className="topbar-right">
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title="Toggle light/dark mode"
        >
          <i className={`fas ${isLight ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
        {VIEWS.map((v) => (
          <button
            key={v.key}
            className={`view-toggle-btn${currentView === v.key ? ' active' : ''}`}
            data-v={v.key}
            onClick={() => onSelectView(v.key)}
          >
            <i className={`fas ${v.icon}`}></i>
            <span>{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
