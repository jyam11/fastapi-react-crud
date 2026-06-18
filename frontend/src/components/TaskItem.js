import React from 'react';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div style={{ ...styles.card, opacity: task.completed ? 0.7 : 1 }}>
      <div style={styles.left}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          style={styles.checkbox}
        />
        <div>
          <p style={{ ...styles.title, textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </p>
          {task.description && <p style={styles.desc}>{task.description}</p>}
          <p style={styles.date}>Created: {new Date(task.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div style={styles.actions}>
        <button onClick={() => onEdit(task)} style={styles.editBtn}>Edit</button>
        <button onClick={() => onDelete(task.id)} style={styles.deleteBtn}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '16px 20px', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  left: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  checkbox: { marginTop: 4, width: 18, height: 18, cursor: 'pointer' },
  title: { fontSize: 16, fontWeight: 600, color: '#222', marginBottom: 2 },
  desc: { fontSize: 14, color: '#666', marginBottom: 4 },
  date: { fontSize: 12, color: '#aaa' },
  actions: { display: 'flex', gap: 8, flexShrink: 0 },
  editBtn: { padding: '6px 14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  deleteBtn: { padding: '6px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
};
