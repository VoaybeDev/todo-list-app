# Gestionnaire de Tâches Journalier

Application React de gestion de tâches avec **persistance locale** (base de données navigateur) et **report automatique** des tâches non terminées.

## Fonctionnalités

- Ajouter des tâches du jour
- Marquer comme terminées / non terminées
- Supprimer des tâches
- **Base de données locale** (localStorage) : tout est enregistré et survit au rechargement / fermeture du navigateur
- **Report automatique** : les tâches non terminées des jours précédents sont automatiquement ramenées au jour actuel (jamais perdues)
- Badge « Reportée » sur les tâches reportées
- Historique des jours précédents
- Interface moderne (thème sombre glassmorphism)

## Installation

```bash
git clone https://github.com/VoaybeDev/todo-list-app.git
cd todo-list-app
npm install
npm start
```

L'application s'ouvre sur [http://localhost:3000](http://localhost:3000).

## Comment ça marche (la BD)

Les tâches sont stockées dans `localStorage` sous la clé `todo-list-db-v1`.

Chaque tâche contient :
- `id` — identifiant unique
- `text` — le contenu
- `completed` — true / false
- `date` — jour d'affectation (YYYY-MM-DD)
- `originalDate` — date d'origine si la tâche a été reportée
- `carriedOver` — true si elle vient d'un jour précédent
- `createdAt` / `completedAt` — timestamps

Au démarrage de l'app, toutes les tâches non terminées dont la date est antérieure à aujourd'hui sont automatiquement reportées sur la date du jour. Elles ne sont **jamais ignorées**.

## Structure

```
src/
  components/
    TodoApp.js      ← logique principale + BD + report
    TodoList.js
    TodoItem.js
  index.css         ← styles complets
  index.js
```
