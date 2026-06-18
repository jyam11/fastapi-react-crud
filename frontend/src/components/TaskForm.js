import React, { useState, useEffect } from 'react';
import './TaskForm.css';

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
    <form onSubmit={handleSubmit} className="task-form">
      <h2 className="task-form__heading">{editingTask ? 'Edit Task' : 'New Task'}</h2>
      <input
        className="task-form__input"
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="task-form__input task-form__textarea"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="task-form__buttons">
        <button type="submit" className="task-form__btn">
          {editingTask ? 'Update' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} className="task-form__btn task-form__btn--cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
