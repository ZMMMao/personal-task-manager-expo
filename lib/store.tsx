import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task } from './types';
import { initialTasks } from './mockData';

export interface State {
  tasks: Task[];
  settings: {completeColor: string}; // chosen tint for completed rows
}

type Action =
  | { type: 'add'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'update'; payload: { id: string; title: string; description: string } }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'toggle'; payload: { id: string } }
  | { type: 'setCompleteColor'; payload: {color: string} } // new action for changing color
  | { type: 'seed'; payload: Task[] };

const TaskStateContext = createContext<State | undefined>(undefined);
const TaskDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'seed': {
      return { ...state, tasks: action.payload };
    }
    case 'add': {
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
      return { ...state, tasks: state.tasks.filter(t => t.id != action.payload.id) };
    }
    case 'toggle': {
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

export function useTasks() {
  const state = useContext(TaskStateContext);
  const dispatch = useContext(TaskDispatchContext);
  if (!state || !dispatch) throw new Error('useTasks must be used within TaskProvider');
  return { state, dispatch };
}

export function selectTaskById(state: State, id: string) {
  return state.tasks.find(t => t.id === id);
}
