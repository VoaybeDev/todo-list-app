import React from 'react';
import TodoItem from './TodoItem';

/**
 * Liste des tâches du jour.
 * Affiche un message si la liste est vide.
 */
const TodoList = ({ tasks, onToggle, onDelete, emptyMessage }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="todo-list empty">
        <p className="empty-message">{emptyMessage || 'Aucune tâche.'}</p>
      </div>
    );
  }

  // On affiche d'abord les non terminées (reportées en premier), puis les terminées
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.carriedOver !== b.carriedOver) return a.carriedOver ? -1 : 1;
    return 0;
  });

  return (
    <div className="todo-list">
      {sorted.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TodoList;
