export type EventType = {
    id: string;
    mmp_id: string | null;
    name: string;
    matrix: string[][];
    participant_count: number;
    created_at: string;
}