import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'priorme_todos';

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos);

  // Auto-persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((todo) => {
    setTodos((prev) => [
      ...prev,
      { ...todo, id: crypto.randomUUID(), completed: false },
    ]);
  }, []);

  const updateTodo = useCallback((id, updatedFields) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  return { todos, addTodo, updateTodo, deleteTodo, toggleComplete };
}
