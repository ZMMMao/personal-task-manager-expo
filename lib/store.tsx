import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Task } from './types';
import { initialTasks } from './mockData';

type Action =
  | { type: 'add'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'update'; payload: { id: string; title: string; description: string } }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'toggle'; payload: { id: string } }
  | { type: 'seed'; payload: Task[] };

interface State {
  tasks: Task[];
}

const TaskStateContext = createContext<State | undefined>(undefined);
const TaskDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'seed': {
      return { tasks: action.payload };
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
      return { tasks: [newTask, ...state.tasks] };
    }
    case 'update': {
      return {
        tasks: state.tasks.map(t => 
          t.id === action.payload.id
            ? { ...t, title: action.payload.title.trim(), description: action.payload.description.trim(), updatedAt: new Date().toISOString() }
            : t
        )
      };
    }
    case 'delete': {
      return { tasks: state.tasks.filter(t => t.id != action.payload.id) };
    }
    case 'toggle': {
      return {
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending', updatedAt: new Date().toISOString() }
            : t
        )
      };
    }
    default:
      return state;
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { tasks: initialTasks });
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
