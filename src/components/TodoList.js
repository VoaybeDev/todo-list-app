import React from 'react';
import TodoItem from './TodoItem';

/**
 * Composant qui affiche la liste des tâches.
 * Utilise le composant TodoItem pour chaque tâche.
 */
const TodoList = ({ tasks, onToggle, onDelete }) => (
  <div className="todo-list">
    {tasks.map((task) => (
      <TodoItem 
        key={task.id} 
        task={task} 
        onDelete={onDelete} 
        onToggle={onToggle} 
      />
    ))}
  </div>
);

export default TodoList;