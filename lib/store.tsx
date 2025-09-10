import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task } from './types';
import { initialTasks } from './mockData';

// Global app state: tasks + UI settings (completed color)
export interface State {
  tasks: Task[];
  settings: {completeColor: string}; // choose color for completed rows
}

// All events that can change state (Reducer handles these)
type Action =
  | { type: 'add'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'update'; payload: { id: string; title: string; description: string } }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'toggle'; payload: { id: string } }
  | { type: 'setCompleteColor'; payload: {color: string} } // new action for changing color
  | { type: 'seed'; payload: Task[] };

const TaskStateContext = createContext<State | undefined>(undefined);
const TaskDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

// Simple id generator for demo purposes
function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Pure reducer: always return NEW objects; never mutate "state" directly.
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'seed': {
      // Completely replace tasks with provided array
      return { ...state, tasks: action.payload };
    }
    case 'add': {
      // Create new task with trimmed title/description
      const now = new Date().toISOString();
      const newTask: Task = {
        id: makeId(),
        title: action.payload.title.trim(),
        description: action.payload.description.trim(),
        status: 'pending',
        createdAt: now,
        updatedAt: now
      };
      return { ...state, tasks: [newTask, ...state.tasks] };
    }
    case 'update': {
      // Immutable update of just the matching task
      return {
        ...state,
        tasks: state.tasks.map(t => 
          t.id === action.payload.id
            ? { ...t, title: action.payload.title.trim(), description: action.payload.description.trim(), updatedAt: new Date().toISOString() }
            : t
        )
      };
    }
    case 'delete': {
      // Immutable removal of the matching task
      return { ...state, tasks: state.tasks.filter(t => t.id != action.payload.id) };
    }
    case 'toggle': {
      // Immutable toggle of just the matching task's status
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending', updatedAt: new Date().toISOString() }
            : t
        )
      };
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
  const [state, dispatch] = useReducer(reducer, {
    tasks: initialTasks,
    settings: { completeColor: '#E6F4EA' }, // default color to soft green
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
export function selectTaskById(state: State, id: string) {
  return state.tasks.find(t => t.id === id);
}
