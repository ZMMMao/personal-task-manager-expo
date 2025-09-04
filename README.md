# Personal Task Manager (Expo + TypeScript)

A light, fully-typed React Native app built with **Expo** and **Expo Router**, implementing a personal task manager with:
- Task list from hard-coded mock data
- Add / Edit / Delete tasks
- Toggle task status (pending ↔ completed)
- Details screen
- **(Bonus)** Search by title

## Tech Choices
- **Expo** for fast setup and cross-platform dev (Android, iOS, Web).
- **Expo Router** for file-based navigation (`app/` directory).
- **TypeScript** for strict typing (no `any`).
- **React hooks** (`useState`, `useReducer`, `useContext`) for local/global state. No Redux.

## Project Structure
```
expo-ts/
  app/
    _layout.tsx           # Router stack + providers
    index.tsx             # Task list + search + add FAB
    add.tsx               # Create task
    task/[id].tsx         # Details + toggle + delete
    edit/[id].tsx         # Edit task
  components/
    SearchBar.tsx
    TaskItem.tsx
  lib/
    mockData.ts           # Hard-coded initial tasks
    store.tsx             # Context + reducer for tasks
    types.ts              # Task & enums
  assets/                 # Expo assets (placeholder)
  app.json
  babel.config.js
  index.js                # expo-router entry
  package.json
  tsconfig.json
  README.md
```

## Data Model
```ts
type TaskStatus = 'pending' | 'completed';
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
```
- `id`: generated locally
- `status`: toggled in-place via reducer
- `createdAt` / `updatedAt`: ISO strings for traceability

## State Management
A light **Context + Reducer** keeps app state in memory and available across routes:
- `add`, `update`, `delete`, `toggle`, `seed`
- No external stores (per assignment).

## Navigation
**Expo Router** (`Stack`) with typed routes:
- `/` — list
- `/add` — create
- `/task/[id]` — details
- `/edit/[id]` — edit

## Setup & Run
1. Install dependencies (Node 18+ recommended):
   ```bash
   cd expo-ts
   npm install
   ```
2. Start:
   ```bash
   npm run start
   ```
3. Open in Expo Go (device) or in Android/iOS simulators.

> If versions mismatch, run:
> ```bash
> npx expo install expo-router
> ```

## Tests / Manual QA
- Add, edit, delete & toggle across Android and iOS simulators.
- Search filters by title (case-insensitive).
- Ensure navigation transitions work and details update live.

## Git/GitHub Collaboration Tips
- `main` stays stable.
- Create feature branches: `feature/add-task`, `feature/edit-task`, etc.
- Open PRs with descriptive messages. Request a peer review and review a peer's PR.
- Track tasks/bugs in **GitHub Issues**.

## Notes/Improvement
- No backend; all data is in-memory mock data per assignment.
- For persistence, consider `expo-secure-store`/`AsyncStorage`.
