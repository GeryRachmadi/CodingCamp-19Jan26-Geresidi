import { PRIORITY_LABELS, PRIORITIES } from '../../constants/priorities';

const VIEWS = [
  { key: 'day', icon: 'fa-calendar-day', label: 'Day' },
  { key: 'week', icon: 'fa-calendar-week', label: 'Week' },
  { key: 'month', icon: 'fa-calendar-alt', label: 'Month' },
  { key: 'list', icon: 'fa-list-ul', label: 'List' },
];

const FILTERS = [
  { key: 'all', icon: 'fa-inbox', label: 'All Tasks' },
  { key: 'active', icon: 'fa-circle-half-stroke', label: 'Ongoing' },
  { key: 'completed', icon: 'fa-check-circle', label: 'Completed' },
];

export default function Sidebar({
  currentView,
  onSelectView,
  currentFilter,
  onSelectFilter,
  onNewTask,
  isOpen,
  onClose,
}) {
  const handleViewClick = (view) => {
    onSelectView(view);
    onClose();
  };

  const handleFilterClick = (filter) => {
    onSelectFilter(filter);
    onClose();
  };

  const handleNewTask = () => {
    onNewTask();
    onClose();
  };

  return (
      <aside className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img
              src="/image/priorme-logo.png"
              alt=""
              className="brand-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                const fb = document.getElementById('brandIconFb');
                if (fb) fb.style.display = 'flex';
              }}
            />
            <span
              className="brand-icon-fb"
              id="brandIconFb"
              style={{ display: 'none' }}
            >
              <i className="fas fa-layer-group"></i>
            </span>
            <span className="brand-name">Priorme</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <button className="sidebar-add-btn" onClick={handleNewTask}>
          <i className="fas fa-plus"></i> <span>New Task</span>
        </button>

        <div className="sidebar-divider"></div>

        {/* Views */}
        <nav className="sidebar-nav">
          <p className="nav-label">Views</p>
          {VIEWS.map((v) => (
            <button
              key={v.key}
              className={`nav-btn${currentView === v.key ? ' active' : ''}`}
              data-view={v.key}
              onClick={() => handleViewClick(v.key)}
            >
              <i className={`fas ${v.icon}`}></i>
              <span>{v.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-divider"></div>

        {/* Filters */}
        <nav className="sidebar-nav">
          <p className="nav-label">Filter</p>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`nav-btn filter-btn${currentFilter === f.key ? ' active' : ''}`}
              data-filter={f.key}
              onClick={() => handleFilterClick(f.key)}
            >
              <i className={`fas ${f.icon}`}></i>
              <span>{f.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-divider"></div>

        {/* Priority Legend */}
        <div className="priority-legend">
          <p className="nav-label">Priority</p>
          {PRIORITIES.map((p) => (
            <div key={p} className="legend-item">
              <span className={`dot p-${p}`}></span>
              <span>{PRIORITY_LABELS[p]}</span>
            </div>
          ))}
        </div>
      </aside>
  );
}
