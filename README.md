# Personal Task Manager (Expo + TypeScript)

A light, fully-typed React Native app built with **Expo** and **TypeScript**. It demonstrates clean component structure, a Context + Reducer store, and Expo Router navigation.

## Features
- Task list from hard-coded mock data
- Add / Edit / Delete tasks
- Toggle task status (pending ↔ completed)
- Details screen
- Search by title
- **Completed status color picker** (tints completed rows)

## Tech Choices
- **Expo** for fast setup and cross-platform dev (Android, iOS, Web).
- **Expo Router** for file-based navigation (`app/` directory).
- **TypeScript** for strict typing (no `any`).
- **React hooks** (`useState`, `useReducer`, `useContext`) for local/global state. No Redux.

## Project Structure
```
expo-ts/
  app/
    _layout.tsx        # App shell: stack + providers
    index.tsx          # Task list, search, color picker, + FAB floating button
    add.tsx            # Create task
    task/[id].tsx      # Details: toggle/edit/delete
    edit/[id].tsx      # Edit task
  components/
    TaskItem.tsx       # Task row UI + callbacks
    SearchBar.tsx      # Controlled input
  lib/
    types.ts           # Task & enums
    store.tsx          # Context + reducer (CRUD/toggle/setCompleetedColor)
    mockData.ts        # Seed data
  assets/              # icon.png, adaptive-icon.png, splash.png, favicon.png
  index.js             # expo-router entry
  app.json             # Expo config (icons, splash, scheme)
  tsconfig.json        # strict TS
  babel.config.js      # babel-preset-expo
  package.json         # scripts + versions
  README.md            # setup & troubleshooting

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
- setCompleteColor (for the completed-row tint)

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

## Notes/Future Improvement:
- No backend; all data is in-memory mock data per assignment.
- For persistence, consider `expo-secure-store`/`AsyncStorage`.
