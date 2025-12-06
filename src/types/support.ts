export type SupportTicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SupportTicketStatus = 'Open' | 'In Progress' | 'Pending Requester' | 'Resolved' | 'Closed';

export interface SupportTicket {
    id: string;
    title: string;
    ticketNumber: string;
    description: string;
    priority: SupportTicketPriority;
    status: SupportTicketStatus;
    raisedByName: string;
    raisedAt: string; // ISO date string
    // Assuming other fields might exist based on context
    raisedById: string;
    assignedToId?: string;
    commentsCount?: number;
}