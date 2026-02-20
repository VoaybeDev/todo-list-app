// TodoItem.js
import React from 'react';

const TodoItem = ({ task, onDelete, onToggle }) => (
  <div>
    <input 
      type="checkbox" 
      checked={task.completed} 
      onChange={() => onToggle(task.id)} 
    />
    <span>{task.text}</span>
    <button onClick={() => onDelete(task.id)}>Delete</button>
  </div>
);

export default TodoItem;