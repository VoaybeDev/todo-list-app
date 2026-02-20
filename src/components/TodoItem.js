import React from 'react';

/**
 * Composant représentant une tâche individuelle.
 * Affiche une tâche avec une case à cocher et un bouton de suppression.
 */
const TodoItem = ({ task, onDelete, onToggle }) => (
  <div className="todo-item">
    <input 
      type="checkbox" 
      checked={task.completed} 
      onChange={() => onToggle(task.id)} 
    />
    <span className={task.completed ? 'completed' : ''}>{task.text}</span>
    <button onClick={() => onDelete(task.id)}>Supprimer</button>
  </div>
);

export default TodoItem;