import React from 'react';

/**
 * Une tâche individuelle.
 * Affiche un badge si la tâche a été reportée d'un jour précédent.
 */
const TodoItem = ({ task, onDelete, onToggle }) => (
  <div className={`todo-item ${task.completed ? 'is-completed' : ''} ${task.carriedOver ? 'is-carried' : ''}`}>
    <input
      type="checkbox"
      checked={!!task.completed}
      onChange={() => onToggle(task.id)}
      aria-label={task.completed ? 'Marquer non terminée' : 'Marquer terminée'}
    />

    <div className="todo-content">
      <span className={task.completed ? 'completed' : ''}>{task.text}</span>
      {task.carriedOver && !task.completed && (
        <span className="carry-tag" title={`Reportée depuis le ${task.originalDate}`}>
          Reportée
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => onDelete(task.id)}
      aria-label="Supprimer la tâche"
    >
      Supprimer
    </button>
  </div>
);

export default TodoItem;
