export type Importance = 1 | 2 | 3;

export type EventType = {
  id?: number;
  title: string;
  description: string;
  importance: Importance;
  dateTime?: string;
};
