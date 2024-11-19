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

export type Player = {
    user_name: string;
    user_code: string;
    score: boolean[];
    completed_at: Date | null;
};

export type TemplateUploadType = {
    postTemplate: File | null | string;
    storyTemplate: File | null | string;
    showModal: boolean;
};
