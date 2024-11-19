export type CreateEventTypes = {
    name?: string;
    showModal?: boolean;
};

export type EventType = {
    id: string;
    name: string;
    participant_count: number;
    created_at: string;
};
