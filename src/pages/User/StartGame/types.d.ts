export type EventType = {
    id: string;
    mmp_event_id: string | null;
    name: string;
    matrix: string[][];
    participant_count: number;
    created_at: string;
}