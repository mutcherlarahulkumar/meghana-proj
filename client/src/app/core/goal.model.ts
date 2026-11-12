export type GoalStatus = 'pending' | 'in_progress' | 'completed';
export interface Goal { id: number; title: string; description: string; category: string; startDate: string; endDate: string; status: GoalStatus; }
export type GoalInput = Omit<Goal, 'id'>;
export const statusLabel = (status: GoalStatus) => ({ pending: 'Pending', in_progress: 'In progress', completed: 'Completed' })[status];
