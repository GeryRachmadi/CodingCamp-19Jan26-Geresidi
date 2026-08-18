import { useState, useCallback, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';
import { toDateInputVal } from './utils/dateUtils';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DayView from './components/views/DayView';
import WeekView from './components/views/WeekView';
import MonthView from './components/views/MonthView';
import ListView from './components/views/ListView';
import TaskFormModal from './components/modals/TaskFormModal';
import TaskDetailModal from './components/modals/TaskDetailModal';
import './index.css';

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } =
    useTodos();
  const { isLight, toggleTheme } = useTheme();

  // App-level state
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [currentFilter, setCurrentFilter] = useState('all');
  const [sortKey, setSortKeyState] = useState('date');
  const [sortDir, setSortDir] = useState({
    date: 'asc',
    name: 'asc',
    priority: 'desc',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formDefaults, setFormDefaults] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Filtered todos
  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (currentFilter === 'active') return !t.completed;
      if (currentFilter === 'completed') return t.completed;
      return true;
    });
  }, [todos, currentFilter]);

  // Navigation
  const navigatePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (currentView === 'day') d.setDate(d.getDate() - 1);
      if (currentView === 'week') d.setDate(d.getDate() - 7);
      if (currentView === 'month') d.setMonth(d.getMonth() - 1);
      return d;
    });
  }, [currentView]);

  const navigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (currentView === 'day') d.setDate(d.getDate() + 1);
      if (currentView === 'week') d.setDate(d.getDate() + 7);
      if (currentView === 'month') d.setMonth(d.getMonth() + 1);
      return d;
    });
  }, [currentView]);

  const goToday = useCallback(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCurrentDate(d);
  }, []);

  // Sort
  const handleSetSortKey = useCallback(
    (key) => {
      if (sortKey === key) {
        setSortDir((prev) => ({
          ...prev,
          [key]: prev[key] === 'asc' ? 'desc' : 'asc',
        }));
      } else {
        setSortKeyState(key);
      }
    },
    [sortKey]
  );

  // Open add form (from sidebar or calendar click)
  const handleNewTask = useCallback(() => {
    setEditingTask(null);
    setFormDefaults({
      date: toDateInputVal(new Date()),
      type: 'task',
      startTime: '',
      endTime: '',
    });
    setIsFormModalOpen(true);
  }, []);

  // Open add form with pre-filled date/time (from clicking calendar slots)
  const handleOpenPopupWithDateTime = useCallback(
    (dateVal, startTime, endTime, type = 'task') => {
      setEditingTask(null);
      setFormDefaults({
        date: dateVal || toDateInputVal(new Date()),
        type,
        startTime: startTime || '',
        endTime: endTime || '',
      });
      setIsFormModalOpen(true);
    },
    []
  );

  // Open edit form
  const handleOpenEditPopup = useCallback(
    (id) => {
      const t = todos.find((x) => x.id === id);
      if (t) {
        setEditingTask(t);
        setFormDefaults(null);
        setIsFormModalOpen(true);
      }
    },
    [todos]
  );

  // Detail popup
  const selectedTask = useMemo(
    () => todos.find((t) => t.id === selectedTaskId) || null,
    [todos, selectedTaskId]
  );

  const handleOpenDetail = useCallback((id) => {
    setSelectedTaskId(id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedTaskId(null);
  }, []);

  const handleEditFromDetail = useCallback(
    (task) => {
      setSelectedTaskId(null);
      handleOpenEditPopup(task.id);
    },
    [handleOpenEditPopup]
  );

  const handleDeleteFromDetail = useCallback(
    (id) => {
      deleteTodo(id);
      setSelectedTaskId(null);
    },
    [deleteTodo]
  );

  // Form save handlers
  const handleAddSave = useCallback(
    (todoData) => {
      addTodo(todoData);
    },
    [addTodo]
  );

  const handleEditSave = useCallback(
    (id, todoData) => {
      updateTodo(id, todoData);
    },
    [updateTodo]
  );

  const handleFormSave = editingTask ? handleEditSave : handleAddSave;

  // Render the active view
  const renderView = () => {
    const commonProps = {
      todos: filteredTodos,
      onOpenDetail: handleOpenDetail,
      onToggleComplete: toggleComplete,
      onOpenPopupWithDateTime: handleOpenPopupWithDateTime,
    };

    switch (currentView) {
      case 'day':
        return <DayView date={currentDate} {...commonProps} />;
      case 'week':
        return <WeekView date={currentDate} {...commonProps} />;
      case 'month':
        return <MonthView date={currentDate} {...commonProps} />;
      case 'list':
        return (
          <ListView
            {...commonProps}
            sortKey={sortKey}
            sortDir={sortDir}
            onSetSortKey={handleSetSortKey}
            onOpenEditPopup={handleOpenEditPopup}
            onDeleteTodo={deleteTodo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sidebar overlay (mobile) — sits outside app-shell like the original */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-shell">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          currentFilter={currentFilter}
          onSelectFilter={setCurrentFilter}
          onNewTask={handleNewTask}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          <Topbar
            currentView={currentView}
            currentDate={currentDate}
            onNavigatePrev={navigatePrev}
            onNavigateNext={navigateNext}
            onGoToday={goToday}
            onSelectView={setCurrentView}
            onToggleTheme={toggleTheme}
            isLight={isLight}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          {renderView()}
        </main>
      </div>

      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleFormSave}
        editingTask={editingTask}
        defaultValues={formDefaults}
      />

      <TaskDetailModal
        todo={selectedTask}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />
    </>
  );
}
