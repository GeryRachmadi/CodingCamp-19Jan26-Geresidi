import { useState, useEffect, useRef } from 'react';
import { PRIORITIES, PRIORITY_LABELS } from '../../constants/priorities';

export default function TaskFormModal({
  isOpen,
  onClose,
  onSave,
  editingTask,
  defaultValues,
}) {
  const nameRef = useRef(null);

  // Form state
  const [itemType, setItemType] = useState('task');
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('normal');

  // Validation errors
  const [nameError, setNameError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const isEditing = !!editingTask;
  const isEvent = itemType === 'event';

  // Populate form on open
  useEffect(() => {
    if (!isOpen) return;

    if (editingTask) {
      setItemType(editingTask.type || 'task');
      setName(editingTask.text || '');
      setDueDate(editingTask.date || '');
      setDeadlineTime(editingTask.deadlineTime || '');
      setStartTime(editingTask.startTime || '');
      setEndTime(editingTask.endTime || '');
      setLocation(editingTask.location || '');
      setDesc(editingTask.desc || '');
      setPriority(editingTask.priority || 'normal');
    } else {
      setItemType(defaultValues?.type || 'task');
      setName('');
      setDueDate(defaultValues?.date || '');
      setDeadlineTime('');
      setStartTime(defaultValues?.startTime || '');
      setEndTime(defaultValues?.endTime || '');
      setLocation('');
      setDesc('');
      setPriority('normal');
    }

    setNameError(false);
    setStartTimeError(false);
    setEndTimeError(false);

    setTimeout(() => nameRef.current?.focus(), 80);
  }, [isOpen, editingTask, defaultValues]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (isEvent) {
      if (!startTime) {
        setStartTimeError(true);
        valid = false;
      } else {
        setStartTimeError(false);
      }
      if (!endTime) {
        setEndTimeError(true);
        valid = false;
      } else {
        setEndTimeError(false);
      }
    } else {
      setStartTimeError(false);
      setEndTimeError(false);
    }

    if (!valid) return;

    const todoData = {
      text: name.trim(),
      date: dueDate,
      type: itemType,
      startTime: isEvent ? startTime : '',
      endTime: isEvent ? endTime : '',
      deadlineTime: isEvent ? '' : deadlineTime,
      priority,
      desc: desc.trim(),
      location: isEvent ? location.trim() : '',
    };

    if (isEditing) {
      onSave(editingTask.id, todoData);
    } else {
      onSave(todoData);
    }

    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const title = isEditing
    ? isEvent
      ? 'Edit Event'
      : 'Edit Task'
    : isEvent
      ? 'New Event'
      : 'New Task';

  return (
    <div
      className="popup active"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className="popup-content">
        <div className="popup-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Type Toggle (hidden when editing) */}
        {!isEditing && (
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn${!isEvent ? ' active' : ''}`}
              onClick={() => setItemType('task')}
            >
              <i className="fas fa-check-square"></i> Task
            </button>
            <button
              type="button"
              className={`type-btn${isEvent ? ' active event-active' : ''}`}
              onClick={() => setItemType('event')}
            >
              <i className="fas fa-calendar-dot"></i> Event
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="taskName">
              {isEvent ? 'Event Name' : 'Task Name'}
            </label>
            <input
              ref={nameRef}
              type="text"
              id="taskName"
              className="form-control"
              placeholder={
                isEvent ? 'What is this event?' : 'What needs to be done?'
              }
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="error-msg" style={{ display: 'block' }}>
                Name cannot be empty.
              </p>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="taskDueDate">
              {isEvent ? 'Date' : 'Deadline Date'}
            </label>
            <input
              type="date"
              id="taskDueDate"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Task: deadline time */}
          {!isEvent && (
            <div className="form-group">
              <label htmlFor="taskDeadlineTime">
                Deadline Time <span className="optional-tag">optional</span>
              </label>
              <input
                type="time"
                id="taskDeadlineTime"
                className="form-control"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
            </div>
          )}

          {/* Event: start + end time */}
          {isEvent && (
            <div className="form-row two-col">
              <div className="form-group">
                <label htmlFor="taskStartTime">Start Time</label>
                <input
                  type="time"
                  id="taskStartTime"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                {startTimeError && (
                  <p className="error-msg" style={{ display: 'block' }}>
                    Start time required.
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="taskEndTime">End Time</label>
                <input
                  type="time"
                  id="taskEndTime"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                {endTimeError && (
                  <p className="error-msg" style={{ display: 'block' }}>
                    End time required.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Location (event only) */}
          {isEvent && (
            <div className="form-group">
              <label htmlFor="taskLocation">
                Location <span className="optional-tag">optional</span>
              </label>
              <input
                type="text"
                id="taskLocation"
                className="form-control"
                placeholder="Where is this happening?"
                autoComplete="off"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label htmlFor="taskDesc">
              Description <span className="optional-tag">optional</span>
            </label>
            <textarea
              id="taskDesc"
              className="form-control form-textarea"
              placeholder="Add notes or details..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label>Priority</label>
            <div className="priority-picker">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`prio-opt p-${p}${priority === p ? ' active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row two-col">
            <button type="submit" className="btn btn-save">
              Save
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
