# Student Task Manager

**Live site:** https://todo.pradipmaity.in/

A simple, dependency-free task manager for students to keep track of their study tasks. Built with plain HTML, CSS, and JavaScript — no build step or frameworks required.

## Features

- Add new tasks with a single form
- Mark tasks as completed or pending with a checkbox
- Delete tasks you no longer need
- Filter the list by **All**, **Pending**, or **Completed**
- Live stats showing total, completed, and pending counts
- Tasks persist in the browser via `localStorage`
- Responsive, accessible layout with an empty-state message

## Project structure

```
.
├── index.html   # Page markup: header, stats, form, filters, task list
├── style.css    # Styling for the app
├── script.js    # Task logic, filtering, stats, and storage
└── README.md
```

## Running locally

No dependencies or build tooling — just open the page:

```bash
# from the project root
python3 -m http.server 8000
```

Then visit http://localhost:8000/ in your browser (or simply open `index.html` directly).

## How it works

- Tasks are stored in a single array of objects: `{ id, title, completed }`
- On page load, tasks are read from `localStorage` (key `studentTasks`) and rendered
- Every mutation (add, toggle, delete) re-saves the array and re-renders the list, stats, and empty state
- The active filter (`all` / `pending` / `completed`) controls which tasks are shown
