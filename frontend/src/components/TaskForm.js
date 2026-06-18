import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>{editingTask ? 'Edit Task' : 'New Task'}</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        style={{ ...styles.input, height: 80, resize: 'vertical' }}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div style={styles.buttons}>
        <button type="submit" style={styles.btn}>
          {editingTask ? 'Update' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} style={{ ...styles.btn, background: '#6c757d' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: { background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: 24 },
  heading: { marginBottom: 16, fontSize: 18, color: '#333' },
  input: { display: 'block', width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: 15 },
  buttons: { display: 'flex', gap: 8 },
  btn: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, cursor: 'pointer' },
};
