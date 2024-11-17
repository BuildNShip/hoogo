export type EventType = {
  id: string;
  mmp_event_id: string | null;
  name: string;
  matrix: string[][];
  participant_count: number;
  created_at: string;
};

export type Player = {
  user_name: string;
  user_code: string;
  score: boolean[];
  completed_at: Date | null;
};
