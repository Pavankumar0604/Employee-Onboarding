export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
export type EscalationLevel = 'None' | 'Level 1' | 'Level 2';

export interface DisplayUser {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface DisplayTask {
    id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string; // ISO date string
    assignedTo: DisplayUser;
    status: TaskStatus;
    escalationLevel: EscalationLevel;
    createdAt: string; // ISO date string
}

// Re-export Task from mindmesh.d.ts for consistency in other files that rely on it
// This is a temporary measure until all files are updated to use the canonical MindmeshTask type
// For now, we define Task as an alias to DisplayTask for backward compatibility in files like mockData.ts
export type Task = DisplayTask;

export interface UpdateTaskData {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
    assignedToId?: string;
    status?: TaskStatus;
    escalationLevel?: EscalationLevel;
}

export interface TaskInsert {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    assignedToId: string;
    status: TaskStatus;
    escalationLevel: EscalationLevel;
}

export interface UploadedFile {
    preview: string;
    name: string;
    type: string;
    size: number;
    file: File;
}