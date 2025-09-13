import { Task } from './types';
// Sample initial tasks for seeding or testing

const now = Date.now();

export const initialTasks: Task[] = [
  {
    id: 'now - 3',
    title: 'Test color picker and searchbar',
    description: 'Implement color picker for completed tasks and search bar for filtering tasks.',
    status: 'pending',
    createdAt: new Date(now -3),
    updatedAt: new Date(now - 3),
  },
  {
    id: 'now - 2',
    title: 'Test edit screen',
    description: 'Allow users to edit title and description.',
    status: 'completed',
    createdAt: new Date(now - 2),
    updatedAt: new Date(now - 2),
  },
  {
    id: 'now - 1',
    title: 'Test on mobile',
    description: 'Ensure UI works on both iOS and Android devices.',
    status: 'pending',
    createdAt: new Date(now - 1),
    updatedAt: new Date(now - 1),
  }
];
