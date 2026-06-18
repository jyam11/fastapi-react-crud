import React from 'react';
import './TaskItem.css';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <div className="task-item__left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          className="task-item__checkbox"
        />
        <div>
          <p className={`task-item__title${task.completed ? ' task-item__title--completed' : ''}`}>
            {task.title}
          </p>
          {task.description && <p className="task-item__desc">{task.description}</p>}
          <p className="task-item__date">Created: {new Date(task.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="task-item__actions">
        <button onClick={() => onEdit(task)} className="task-item__edit-btn">Edit</button>
        <button onClick={() => onDelete(task.id)} className="task-item__delete-btn">Delete</button>
      </div>
    </div>
  );
}
