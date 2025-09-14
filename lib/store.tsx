import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task } from './types';
import { initialTasks } from './mockData';
import {
  InvertedIndex,
  buildIndex,
  addToIndex,
  removeFromIndex,
  updateInIndex,
} from './searchIndex';


// Global app state: tasks + UI settings (completed color)
export interface State {
  tasks: Task[];
  settings: {completeColor: string}; // choose color for completed rows
  index: InvertedIndex; // search index for task titles
}

// All events that can change state (Reducer handles these)
type Action =
  | { type: 'seed'; payload: Task[] }
  | { type: 'add'; payload: { title: string; description: string}}
  | { type: 'update'; payload: { id: number; title: string; description: string } }
  | { type: 'delete'; payload: { id: number } }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'setCompleteColor'; payload: {color: string} } // new action for changing color

const TaskStateContext = createContext<State | undefined>(undefined);
const TaskDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

// numeric ID generator
let lastId = 0;
function seedLastId(tasks: Task[]){
    for(const t of tasks) if(t.id > lastId) lastId = t.id;
}
function makeId() : number {
    lastId += 1;
  return lastId;
}

// Pure reducer: always return NEW objects; never mutate "state" directly.
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'seed': {
      // Completely replace tasks with provided array
      const next = action.payload;
      seedLastId(next);
      return { ...state, tasks: next, index: buildIndex(next) };
    }
    case 'add': {
      // Create new task with trimmed title/description
      const newTask: Task = {
        id: makeId(),
        title: action.payload.title.trim(),
        description: action.payload.description.trim(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const nextIndex = { ...state.index };
      addToIndex(nextIndex, newTask.id, newTask.title);
      return { ...state, tasks: [newTask, ...state.tasks], index: nextIndex };
    }
    case 'update': {
      // Immutable update of just the matching task
      const prev = state.tasks.find(t => t.id === action.payload.id);
      if(!prev) return state; // not found, no change

      const nextTasks = state.tasks.map(t =>
        t.id === action.payload.id
        ? {
            ...t,
            title: action.payload.title.trim(),
            description: action.payload.description.trim(),
            updatedAt: new Date(),
          }
        : t
      )

      const nextIndex = { ...state.index };
      updateInIndex(nextIndex, prev.id, prev.title, action.payload.title.trim());
      return { ...state, tasks: nextTasks, index: nextIndex };
    }
    case 'delete': {
      // Immutable removal of just the matching task
      const victim = state.tasks.find(t => t.id === action.payload.id);
      if (!victim) return state;
      const nextTasks = state.tasks.filter(t => t.id !== action.payload.id);
      const nextIndex = { ...state.index };
      removeFromIndex(nextIndex, victim.id, victim.title);
      return { ...state, tasks: nextTasks, index: nextIndex };
    }

    case 'toggle': {
      // Immutable toggle of just the matching task's status
      const now = new Date();
      const nextTasks = state.tasks.map(t =>
        t.id === action.payload.id
          ? {
              ...t,
              status: t.status === 'pending' ? 'completed' : 'pending',
              updatedAt: now,
            }
          : t
        );
      return { ...state, tasks: nextTasks };
    }
    case 'setCompleteColor': {
      // Immutable update of just the color
      return {
        ...state,
        settings: {
          ...state.settings,
          completeColor: action.payload.color
        },
      };
    }
    default:
      return state;
  }
}

// Provide state/dispatch to the component tree
export function TaskProvider({ children }: { children: ReactNode }) {
  seedLastId(initialTasks);
  const [state, dispatch] = useReducer(reducer, {
    tasks: initialTasks,
    settings: { completeColor: '#E6F4EA' }, // default color to soft green
    index: buildIndex(initialTasks),
  });
  return (
    <TaskStateContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

// Typed hooks to access store
export function useTasks() {
  const state = useContext(TaskStateContext);
  const dispatch = useContext(TaskDispatchContext);
  if (!state || !dispatch) throw new Error('useTasks must be used within TaskProvider');
  return { state, dispatch };
}

// Selector helper by id
export function selectTaskById(state: State, id: number) {
  return state.tasks.find(t => t.id === id);
}
