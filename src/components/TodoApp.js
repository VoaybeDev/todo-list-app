import React, { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList';

const STORAGE_KEY = 'todo-list-db-v1';

/**
 * Retourne la date du jour au format YYYY-MM-DD
 */
const getToday = () => new Date().toISOString().slice(0, 10);

/**
 * Formate une date YYYY-MM-DD en français lisible
 */
const formatDateFr = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Charge les tâches depuis localStorage (notre "base de données")
 */
const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Erreur lecture BD locale:', e);
    return [];
  }
};

/**
 * Sauvegarde les tâches dans localStorage
 */
const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Erreur écriture BD locale:', e);
  }
};

/**
 * Composant principal — Gestionnaire de tâches journalier
 * - Persistance locale (BD)
 * - Report automatique des tâches non terminées des jours précédents
 */
const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [today] = useState(getToday());
  const [loaded, setLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /**
   * Au démarrage : charger la BD + reporter les tâches non faites
   * des jours précédents vers aujourd'hui (règle importante)
   */
  useEffect(() => {
    const allTasks = loadTasks();
    const todayStr = getToday();

    // Reporter les tâches non terminées des jours passés
    const updated = allTasks.map((task) => {
      if (!task.completed && task.date < todayStr) {
        return {
          ...task,
          originalDate: task.originalDate || task.date, // on garde la date d'origine
          date: todayStr, // on les ramène à aujourd'hui
          carriedOver: true,
        };
      }
      return task;
    });

    // Sauvegarder si des reports ont eu lieu
    const hasCarry = updated.some(
      (t, i) => t.date !== allTasks[i]?.date || t.carriedOver
    );
    if (hasCarry) {
      saveTasks(updated);
    }

    setTasks(updated);
    setLoaded(true);
  }, []);

  /**
   * Sauvegarder à chaque modification des tâches
   */
  useEffect(() => {
    if (loaded) {
      saveTasks(tasks);
    }
  }, [tasks, loaded]);

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;

    const task = {
      id: Date.now() + Math.random(),
      text,
      completed: false,
      date: today,
      createdAt: new Date().toISOString(),
      carriedOver: false,
    };

    setTasks((prev) => [...prev, task]);
    setNewTask('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const nowCompleted = !task.completed;
        return {
          ...task,
          completed: nowCompleted,
          completedAt: nowCompleted ? new Date().toISOString() : null,
          // Une fois terminée, on retire le flag reporté
          carriedOver: nowCompleted ? false : task.carriedOver,
        };
      })
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // Tâches du jour (inclut les reportées)
  const todayTasks = tasks.filter((t) => t.date === today);
  const pendingToday = todayTasks.filter((t) => !t.completed);
  const doneToday = todayTasks.filter((t) => t.completed);
  const carriedCount = pendingToday.filter((t) => t.carriedOver).length;

  // Historique des jours passés (tâches déjà terminées ou d'autres jours)
  const historyTasks = tasks
    .filter((t) => t.date !== today || (t.completed && t.originalDate))
    .sort((a, b) => b.date.localeCompare(a.date) || (b.completedAt || '').localeCompare(a.completedAt || ''));

  // Grouper l'historique par date
  const historyByDate = historyTasks.reduce((acc, task) => {
    const key = task.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  if (!loaded) {
    return (
      <div className="todo-app">
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Chargement de la base de données…</p>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <h1>Gestionnaire de Tâches</h1>

      <div className="date-header">
        <span className="date-label">{formatDateFr(today)}</span>
        {carriedCount > 0 && (
          <span className="carry-badge" title="Tâches reportées des jours précédents">
            {carriedCount} reportée{carriedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="input-row">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ajouter une tâche du jour…"
          autoFocus
        />
        <button type="button" onClick={addTask} className="btn-add">
          Ajouter
        </button>
      </div>

      {/* Statistiques du jour */}
      <div className="stats-row">
        <span>
          {doneToday.length} / {todayTasks.length} terminée
          {todayTasks.length !== 1 ? 's' : ''}
        </span>
        {pendingToday.length > 0 && (
          <span className="pending-count">
            {pendingToday.length} restante{pendingToday.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Liste du jour */}
      <TodoList
        tasks={todayTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        emptyMessage="Aucune tâche pour aujourd'hui. Ajoute-en une !"
      />

      {/* Historique */}
      <div className="history-section">
        <button
          type="button"
          className="btn-history"
          onClick={() => setShowHistory((v) => !v)}
        >
          {showHistory ? 'Masquer l’historique' : 'Voir l’historique des jours précédents'}
        </button>

        {showHistory && (
          <div className="history-list">
            {Object.keys(historyByDate).length === 0 ? (
              <p className="empty-history">Aucun historique pour le moment.</p>
            ) : (
              Object.entries(historyByDate).map(([date, dayTasks]) => (
                <div key={date} className="history-day">
                  <h3>{formatDateFr(date)}</h3>
                  <ul>
                    {dayTasks.map((task) => (
                      <li
                        key={task.id}
                        className={task.completed ? 'hist-done' : 'hist-pending'}
                      >
                        <span className="hist-check">
                          {task.completed ? '✓' : '○'}
                        </span>
                        <span className="hist-text">{task.text}</span>
                        {task.originalDate && task.originalDate !== task.date && (
                          <span className="hist-origin">
                            (créée le {task.originalDate})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <p className="todo-count">
        Données enregistrées localement • Les tâches non terminées sont
        automatiquement reportées au jour suivant
      </p>
    </div>
  );
};

export default TodoApp;
