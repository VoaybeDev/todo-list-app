import React, { useState } from 'react';
import TodoItem from './TodoItem';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    const newTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
    setTasks(newTasks);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <input 
        type="text" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Add a task" 
      />
      <button onClick={addTask}>Add Task</button>
      
      {tasks.map(task => (
        <TodoItem 
          key={task.id} 
          task={task} 
          onDelete={deleteTask} 
          onToggle={toggleTask} 
        />
      ))}
    </div>
  );
};

export default TodoApp;