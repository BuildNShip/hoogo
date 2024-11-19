export type EventType = {
    id: string;
    mmp_event_id: string | null;
    name: string;
    matrix: string[][];
    participant_count: number;
    created_at: string;
    post_template: string;
    story_template: string;
};
