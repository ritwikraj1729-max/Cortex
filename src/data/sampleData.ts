import { uid } from '../utils/id';
import { toISODate, addDays, todayISO } from '../utils/date';
import type {
  DailyQuest,
  Goal,
  FutureTask,
  Streak,
  CalendarEvent,
  Subject,
  Reporting,
} from '../types';

const today = new Date();

function daysAgoISO(n: number): string {
  return toISODate(addDays(today, -n));
}
function daysAheadISO(n: number): string {
  return toISODate(addDays(today, n));
}

// ---------- Streaks ----------
function buildStreakDates(pattern: (n: number) => boolean, span = 180): string[] {
  const dates: string[] = [];
  for (let i = span; i >= 0; i--) {
    if (pattern(i)) dates.push(daysAgoISO(i));
  }
  return dates;
}

export const SAMPLE_STREAKS: Streak[] = [
  {
    id: uid('streak'),
    name: 'Morning Reading',
    emoji: '📖',
    color: '#f59e0b',
    dates: buildStreakDates((n) => n <= 14 || (n % 3 !== 0 && n < 60)),
    pinned: true,
    createdAt: daysAgoISO(180),
  },
  {
    id: uid('streak'),
    name: 'Workout',
    emoji: '💪',
    color: '#ef4444',
    dates: buildStreakDates((n) => n % 2 === 0 && n < 90),
    pinned: false,
    createdAt: daysAgoISO(180),
  },
  {
    id: uid('streak'),
    name: 'Coding Practice',
    emoji: '💻',
    color: '#22d3ee',
    dates: buildStreakDates((n) => n <= 30),
    pinned: false,
    createdAt: daysAgoISO(180),
  },
];

const streakRef = SAMPLE_STREAKS[0];
const streakRef2 = SAMPLE_STREAKS[1];

// ---------- Subjects (Journey) ----------
function makeLevel(name: string, completed = false): any {
  return { id: uid('lvl'), name, completed, completedOn: completed ? todayISO() : undefined };
}

const mathSeries = ['Practice', 'Quiz', 'Mastery'];
function simpleChapter(name: string, completedCount: number) {
  return {
    id: uid('chap'),
    name,
    levels: mathSeries.map((n, i) => makeLevel(n, i < completedCount)),
  };
}

export const SAMPLE_SUBJECTS: Subject[] = [
  {
    id: uid('subj'),
    name: 'Mathematics',
    symbol: '📐',
    sectionMode: 'multi',
    levelMode: 'simple',
    sections: [
      {
        id: uid('sec'),
        name: 'Algebra',
        levelSeries: [...mathSeries],
        chapters: [
          simpleChapter('Linear Equations', 3),
          simpleChapter('Quadratic Equations', 2),
          simpleChapter('Polynomials', 1),
          simpleChapter('Inequalities', 0),
        ],
      },
      {
        id: uid('sec'),
        name: 'Geometry',
        levelSeries: [...mathSeries],
        chapters: [
          simpleChapter('Triangles', 2),
          simpleChapter('Circles', 0),
          simpleChapter('Coordinate Geometry', 0),
        ],
      },
    ],
  },
  {
    id: uid('subj'),
    name: 'Physics',
    symbol: '⚛️',
    sectionMode: 'single',
    levelMode: 'complex',
    sections: [
      {
        id: uid('sec'),
        name: 'Mechanics',
        chapters: [
          {
            id: uid('chap'),
            name: 'Kinematics',
            levels: [
              makeLevel('Motion Basics', true),
              makeLevel('Projectile Motion', true),
              makeLevel('Relative Motion', false),
            ],
          },
          {
            id: uid('chap'),
            name: "Newton's Laws",
            levels: [
              makeLevel('First Law', true),
              makeLevel('Second Law', false),
              makeLevel('Third Law', false),
              makeLevel('Friction', false),
            ],
          },
          {
            id: uid('chap'),
            name: 'Energy & Work',
            levels: [makeLevel('Work-Energy Theorem', false), makeLevel('Conservation of Energy', false)],
          },
        ],
      },
    ],
  },
  {
    id: uid('subj'),
    name: 'Chemistry',
    symbol: '🧪',
    sectionMode: 'single',
    levelMode: 'simple',
    sections: [
      {
        id: uid('sec'),
        name: 'Organic Chemistry',
        levelSeries: ['Learn', 'Practice', 'Test'],
        chapters: [
          { id: uid('chap'), name: 'Hydrocarbons', levels: [makeLevel('Learn', true), makeLevel('Practice', true), makeLevel('Test', true)] },
          { id: uid('chap'), name: 'Alcohols', levels: [makeLevel('Learn', true), makeLevel('Practice', false), makeLevel('Test', false)] },
          { id: uid('chap'), name: 'Amines', levels: [makeLevel('Learn', false), makeLevel('Practice', false), makeLevel('Test', false)] },
        ],
      },
    ],
  },
];

const subjRef = SAMPLE_SUBJECTS[0];

// ---------- Quests ----------
export const SAMPLE_DAILY_QUESTS: DailyQuest[] = [
  {
    id: uid('q'),
    name: 'Read 20 pages',
    category: 'important',
    refs: [{ type: 'streak', id: streakRef.id, name: streakRef.name }],
    completed: true,
    completedOn: todayISO(),
    order: 0,
  },
  {
    id: uid('q'),
    name: 'Finish Algebra practice set',
    category: 'urgent-important',
    refs: [{ type: 'subject', id: subjRef.id, name: subjRef.name }],
    completed: false,
    order: 1,
  },
  {
    id: uid('q'),
    name: 'Workout - leg day',
    category: 'urgent',
    refs: [{ type: 'streak', id: streakRef2.id, name: streakRef2.name }],
    completed: false,
    order: 2,
  },
  {
    id: uid('q'),
    name: 'Review weekly planner',
    category: 'casual',
    refs: [],
    completed: false,
    order: 3,
  },
  {
    id: uid('q'),
    name: 'Email professor about project',
    category: 'urgent',
    refs: [],
    completed: true,
    completedOn: todayISO(),
    order: 4,
  },
];

const monthlyAlgebra = uid('g');
const monthlyRead = uid('g');
const monthlyWorkout = uid('g');

export const SAMPLE_MONTHLY_GOALS: Goal[] = [
  {
    id: monthlyAlgebra,
    name: 'Finish Algebra section',
    completed: false,
    order: 0,
    category: 'important',
    refs: [{ type: 'subject', id: subjRef.id, name: subjRef.name }],
  },
  {
    id: monthlyRead,
    name: 'Read 2 books',
    completed: false,
    order: 1,
    category: 'casual',
    refs: [{ type: 'streak', id: streakRef.id, name: streakRef.name }],
  },
  {
    id: monthlyWorkout,
    name: 'Hit 30-day workout streak',
    completed: false,
    order: 2,
    category: 'urgent',
    refs: [{ type: 'streak', id: streakRef2.id, name: streakRef2.name }],
  },
];

export const SAMPLE_WEEKLY_GOALS: Goal[] = [
  {
    id: uid('g'),
    name: 'Complete 3 chapters in Physics',
    completed: false,
    order: 0,
    refs: [{ type: 'monthly', id: monthlyAlgebra, name: 'Finish Algebra section' }],
  },
  {
    id: uid('g'),
    name: 'Workout 4 times this week',
    completed: false,
    order: 1,
    refs: [{ type: 'monthly', id: monthlyWorkout, name: 'Hit 30-day workout streak' }],
  },
  { id: uid('g'), name: 'Submit chemistry assignment', completed: true, order: 2, refs: [] },
];

export const SAMPLE_NEXT_WEEK_GOALS: Goal[] = [
  { id: uid('g'), name: 'Start Geometry section', completed: false, order: 0 },
  { id: uid('g'), name: 'Mock test - Physics', completed: false, order: 1 },
];

export const SAMPLE_FUTURE_TASKS: FutureTask[] = [
  {
    id: uid('t'),
    date: todayISO(),
    name: 'Read 20 pages',
    category: 'important',
    refs: [{ type: 'streak', id: streakRef.id, name: streakRef.name }],
    completed: true,
    order: 0,
  },
  {
    id: uid('t'),
    date: todayISO(),
    name: 'Finish Algebra practice set',
    category: 'urgent-important',
    refs: [{ type: 'subject', id: subjRef.id, name: subjRef.name }],
    completed: false,
    order: 1,
  },
  {
    id: uid('t'),
    date: todayISO(),
    name: 'Workout - leg day',
    category: 'urgent',
    refs: [{ type: 'streak', id: streakRef2.id, name: streakRef2.name }],
    completed: false,
    order: 2,
  },
  {
    id: uid('t'),
    date: todayISO(),
    name: 'Email professor about project',
    category: 'urgent',
    refs: [],
    completed: true,
    order: 3,
  },
  {
    id: uid('t'),
    date: daysAheadISO(1),
    name: 'Group study session',
    category: 'important',
    refs: [{ type: 'subject', id: subjRef.id, name: subjRef.name }],
    completed: false,
    order: 0,
  },
  {
    id: uid('t'),
    date: daysAheadISO(1),
    name: 'Buy lab notebook',
    category: 'casual',
    refs: [],
    completed: false,
    order: 1,
  },
  {
    id: uid('t'),
    date: daysAheadISO(3),
    name: 'Physics quiz prep',
    category: 'urgent-important',
    refs: [{ type: 'subject', id: SAMPLE_SUBJECTS[1].id, name: SAMPLE_SUBJECTS[1].name }],
    completed: false,
    order: 0,
  },
];

// ---------- Calendar ----------
export const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: uid('ev'),
    mode: 'simple',
    name: 'Midterm Exams',
    color: '#ef4444',
    from: daysAheadISO(4),
    to: daysAheadISO(6),
  },
  {
    id: uid('ev'),
    mode: 'simple',
    name: 'Winter Break',
    color: '#22c55e',
    from: daysAheadISO(20),
    to: daysAheadISO(27),
  },
  {
    id: uid('ev'),
    mode: 'complex',
    name: 'Project Milestones',
    color: '#8b5cf6',
    dates: [
      { date: daysAheadISO(2), label: 'Proposal due' },
      { date: daysAheadISO(10), label: 'Draft review' },
      { date: daysAheadISO(18), label: 'Final submission' },
    ],
  },
];

// ---------- Reportings ----------
function buildEntries(base: number, variance: number, count: number, unit_label: string): any[] {
  const entries = [];
  for (let i = count; i >= 0; i--) {
    const value = Math.max(0, Math.round((base + Math.sin(i / 2) * variance + (Math.random() - 0.5) * variance * 0.6) * 10) / 10);
    entries.push({
      id: uid('entry'),
      value,
      label: `${unit_label} ${count - i + 1}`,
      date: daysAgoISO(i * 4),
    });
  }
  return entries;
}

export const SAMPLE_REPORTINGS: Reporting[] = [
  {
    id: uid('rep'),
    name: 'Study Hours / Week',
    description: 'Total hours spent studying each week',
    unit: 'hours',
    color: '#6366f1',
    pinned: true,
    entries: buildEntries(18, 5, 8, 'Week'),
  },
  {
    id: uid('rep'),
    name: 'Mock Test Scores',
    description: 'Percentage scored in mock tests',
    unit: 'marks',
    color: '#22c55e',
    pinned: false,
    entries: buildEntries(72, 10, 6, 'Test'),
  },
  {
    id: uid('rep'),
    name: 'Sleep Average',
    description: 'Average sleep duration per night',
    unit: 'hours',
    color: '#f59e0b',
    pinned: false,
    entries: buildEntries(6.5, 1, 7, 'Week'),
  },
];
