import React, { useState } from 'react';
//import TodoItem from './TodoItem';
import TodoList from './TodoList';

/**
 * Composant principal de l'application Todo.
 * Permet d'ajouter, de supprimer et de marquer les tâches comme terminées.
 */
const TodoApp = () => {
  // État local pour stocker les tâches et le texte de la nouvelle tâche
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  /**
   * Ajoute une nouvelle tâche à la liste des tâches.
   */
  const addTask = () => {
    if (newTask.trim()) {
      const newTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
      setTasks(newTasks);
      setNewTask('');
    }
  };

  /**
   * Modifie l'état de complétion d'une tâche (marque comme terminée ou non).
   * @param {number} id - Identifiant de la tâche
   */
  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  /**
   * Supprime une tâche de la liste.
   * @param {number} id - Identifiant de la tâche
   */
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <h1>Gestionnaire de Tâches</h1>
      <input 
        type="text" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Ajouter une tâche"
      />
      <button onClick={addTask}>Ajouter</button>

      <TodoList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
};

export default TodoApp;