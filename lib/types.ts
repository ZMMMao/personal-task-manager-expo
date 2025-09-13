export type TaskStatus = 'pending' | 'completed';
// Task interface representing a to-do item
export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}
