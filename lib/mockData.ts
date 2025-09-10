import { Task } from './types';
// Sample initial tasks for seeding or testing
export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Finish README',
    description: 'Write setup steps and usage instructions.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Implement edit screen',
    description: 'Allow users to edit title and description.',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Polish task item UI',
    description: 'Add better spacing and touch targets.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
