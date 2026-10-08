// Core domain types for Cortex

export type Category = 'urgent-important' | 'urgent' | 'important' | 'casual';

export type RefType = 'streak' | 'subject' | 'weekly' | 'monthly';

export interface QuestRef {
  type: RefType;
  id: string;
  name: string;
}

export interface DailyQuest {
  id: string;
  name: string;
  category: Category;
  refs: QuestRef[];
  completed: boolean;
  completedOn?: string;
  order: number;
}

export interface Goal {
  id: string;
  name: string;
  completed: boolean;
  order: number;
  category?: Category;
  refs?: QuestRef[];
}

export interface FutureTask {
  id: string;
  date: string; // yyyy-mm-dd
  name: string;
  category: Category;
  refs: QuestRef[];
  completed: boolean;
  order: number;
}

export interface Streak {
  id: string;
  name: string;
  emoji: string;
  color: string; // tailwind-ish hex
  dates: string[]; // yyyy-mm-dd
  pinned: boolean;
  createdAt: string;
}

export interface SimpleEvent {
  id: string;
  mode: 'simple';
  name: string;
  color: string;
  from: string;
  to: string;
}

export interface ComplexEvent {
  id: string;
  mode: 'complex';
  name: string;
  color: string;
  dates: { date: string; label: string }[];
}

export type CalendarEvent = SimpleEvent | ComplexEvent;

export interface Level {
  id: string;
  name: string;
  completed: boolean;
  completedOn?: string;
}

export interface Chapter {
  id: string;
  name: string;
  levels: Level[];
  collapsed?: boolean;
}

export interface Section {
  id: string;
  name: string;
  chapters: Chapter[];
  levelSeries?: string[]; // simple subjects only
}

export interface Subject {
  id: string;
  name: string;
  symbol: string;
  sectionMode: 'single' | 'multi';
  levelMode: 'simple' | 'complex';
  sections: Section[];
}

export interface Entry {
  id: string;
  value: number;
  label: string;
  date: string;
}

export interface Reporting {
  id: string;
  name: string;
  description: string;
  unit: string;
  color: string;
  pinned: boolean;
  entries: Entry[];
}

export type SectionKey = 'dashboard' | 'quest' | 'streaks' | 'calendar' | 'journey' | 'reportings' | 'data';
