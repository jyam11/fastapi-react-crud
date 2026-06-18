import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import { getTasks, createTask, updateTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      setError('');
    } catch {
      setError('Failed to connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (data) => {
    try {
      await createTask(data);
      fetchTasks();
    } catch {
      setError('Failed to create task.');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
      fetchTasks();
    } catch {
      setError('Failed to update task.');
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      fetchTasks();
    } catch {
      setError('Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch {
      setError('Failed to delete task.');
    }
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Task Manager</h1>
          <p style={styles.subtitle}>{completedCount}/{tasks.length} tasks completed</p>
        </header>

        {error && <div style={styles.error}>{error}</div>}

        <TaskForm
          onSubmit={editingTask ? handleUpdate : handleCreate}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        <div style={styles.filters}>
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.empty}>No tasks found.</p>
        ) : (
          filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))
        )}

        <footer style={styles.footer}>
          Swagger docs: <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">http://localhost:8000/docs</a>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', padding: '40px 16px', background: '#f0f2f5' },
  container: { maxWidth: 680, margin: '0 auto' },
  header: { marginBottom: 28, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 700, color: '#1a1a2e' },
  subtitle: { color: '#888', marginTop: 4 },
  error: { background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 6, marginBottom: 20 },
  filters: { display: 'flex', gap: 8, marginBottom: 16 },
  filterBtn: { padding: '6px 16px', border: '1px solid #ddd', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 14 },
  filterActive: { background: '#4f46e5', color: '#fff', borderColor: '#4f46e5' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
  footer: { marginTop: 40, textAlign: 'center', fontSize: 13, color: '#aaa' },
};
