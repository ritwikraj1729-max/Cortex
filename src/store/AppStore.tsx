import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { uid } from '../utils/id';
import { todayISO } from '../utils/date';
import {
  SAMPLE_DAILY_QUESTS,
  SAMPLE_WEEKLY_GOALS,
  SAMPLE_MONTHLY_GOALS,
  SAMPLE_NEXT_WEEK_GOALS,
  SAMPLE_FUTURE_TASKS,
  SAMPLE_STREAKS,
  SAMPLE_EVENTS,
  SAMPLE_SUBJECTS,
  SAMPLE_REPORTINGS,
} from '../data/sampleData';
import type {
  DailyQuest,
  Goal,
  FutureTask,
  Streak,
  CalendarEvent,
  Subject,
  Reporting,
  Entry,
  Category,
  QuestRef,
  SectionKey,
} from '../types';

function reorder<T extends { id: string; order: number }>(list: T[], draggedId: string, targetId: string): T[] {
  const arr = [...list].sort((a, b) => a.order - b.order);
  const fromIdx = arr.findIndex((i) => i.id === draggedId);
  const toIdx = arr.findIndex((i) => i.id === targetId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return list;
  const [item] = arr.splice(fromIdx, 1);
  arr.splice(toIdx, 0, item);
  return arr.map((item, i) => ({ ...item, order: i }));
}

interface Toast {
  id: string;
  message: string;
}

interface AppState {
  // nav
  activeSection: SectionKey;
  setActiveSection: (s: SectionKey) => void;
  journeySubjectId: string | null;
  openSubject: (id: string) => void;
  closeSubject: () => void;

  reportingDetailId: string | null;
  openReportingDetail: (id: string) => void;
  closeReportingDetail: () => void;

  // persistence
  hydrated: boolean;
  synced: boolean;
  exportData: () => Record<string, unknown>;
  importData: (data: any) => boolean;
  resetData: () => void;

  // toasts
  toasts: Toast[];
  pushToast: (msg: string) => void;

  // quests
  daily: DailyQuest[];
  addDaily: (name: string, category: Category, refs: QuestRef[]) => void;
  toggleDaily: (id: string) => void;
  deleteDaily: (id: string) => void;
  reorderDaily: (draggedId: string, targetId: string) => void;

  weekly: Goal[];
  addWeekly: (name: string, refs?: QuestRef[]) => void;
  toggleWeekly: (id: string) => void;
  deleteWeekly: (id: string) => void;
  reorderWeekly: (draggedId: string, targetId: string) => void;

  monthly: Goal[];
  addMonthly: (name: string, category?: Category, refs?: QuestRef[]) => void;
  toggleMonthly: (id: string) => void;
  deleteMonthly: (id: string) => void;
  reorderMonthly: (draggedId: string, targetId: string) => void;

  nextWeek: Goal[];
  addNextWeek: (name: string) => void;
  toggleNextWeek: (id: string) => void;
  deleteNextWeek: (id: string) => void;
  reorderNextWeek: (draggedId: string, targetId: string) => void;

  futureTasks: FutureTask[];
  addFutureTask: (date: string, name: string, category: Category, refs: QuestRef[]) => void;
  toggleFutureTask: (id: string) => void;
  deleteFutureTask: (id: string) => void;
  reorderFutureTasks: (date: string, draggedId: string, targetId: string) => void;

  // streaks
  streaks: Streak[];
  addStreak: (name: string, emoji: string, color: string) => void;
  updateStreak: (id: string, data: Partial<Pick<Streak, 'name' | 'emoji' | 'color'>>) => void;
  deleteStreak: (id: string) => void;
  resetStreak: (id: string) => void;
  pinStreak: (id: string) => void;
  toggleStreakDate: (id: string, date: string) => void;

  // calendar
  events: CalendarEvent[];
  addEvent: (ev: CalendarEvent) => void;
  updateEvent: (ev: CalendarEvent) => void;
  deleteEvent: (id: string) => void;

  // journey
  subjects: Subject[];
  addSubject: (s: Omit<Subject, 'id' | 'sections'>) => void;
  deleteSubject: (id: string) => void;
  renameSection: (subjectId: string, sectionId: string, name: string) => void;
  addSection: (subjectId: string) => string;
  deleteSection: (subjectId: string, sectionId: string) => void;
  addChapter: (subjectId: string, sectionId: string) => string;
  renameChapter: (subjectId: string, sectionId: string, chapterId: string, name: string) => void;
  deleteChapter: (subjectId: string, sectionId: string, chapterId: string) => void;
  toggleChapterCollapsed: (subjectId: string, sectionId: string, chapterId: string) => void;
  addLevel: (subjectId: string, sectionId: string, chapterId: string) => void;
  renameLevel: (subjectId: string, sectionId: string, chapterId: string, levelId: string, name: string) => void;
  deleteLevel: (subjectId: string, sectionId: string, chapterId: string, levelId: string) => void;
  toggleLevel: (subjectId: string, sectionId: string, chapterId: string, levelId: string) => void;
  updateSeries: (subjectId: string, sectionId: string, series: string[]) => void;

  // reportings
  reportings: Reporting[];
  addReporting: (r: Omit<Reporting, 'id' | 'entries' | 'pinned'>) => void;
  updateReporting: (id: string, data: Partial<Pick<Reporting, 'name' | 'description' | 'unit' | 'color'>>) => void;
  deleteReporting: (id: string) => void;
  pinReporting: (id: string) => void;
  addEntry: (reportingId: string, entry: Omit<Entry, 'id'>) => void;
  updateEntry: (reportingId: string, entryId: string, data: Omit<Entry, 'id'>) => void;
  deleteEntry: (reportingId: string, entryId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [journeySubjectId, setJourneySubjectId] = useState<string | null>(null);
  const [reportingDetailId, setReportingDetailId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string) => {
    const id = uid('toast');
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2000);
  }, []);

  const openSubject = useCallback((id: string) => setJourneySubjectId(id), []);
  const closeSubject = useCallback(() => setJourneySubjectId(null), []);
  const openReportingDetail = useCallback((id: string) => setReportingDetailId(id), []);
  const closeReportingDetail = useCallback(() => setReportingDetailId(null), []);

  // ---------------- Quests ----------------
  const [daily, setDaily] = useState<DailyQuest[]>(SAMPLE_DAILY_QUESTS);
  const [weekly, setWeekly] = useState<Goal[]>(SAMPLE_WEEKLY_GOALS);
  const [monthly, setMonthly] = useState<Goal[]>(SAMPLE_MONTHLY_GOALS);
  const [nextWeek, setNextWeek] = useState<Goal[]>(SAMPLE_NEXT_WEEK_GOALS);
  const [futureTasks, setFutureTasks] = useState<FutureTask[]>(SAMPLE_FUTURE_TASKS);
  const [streaks, setStreaks] = useState<Streak[]>(SAMPLE_STREAKS);
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);
  const [subjects, setSubjects] = useState<Subject[]>(SAMPLE_SUBJECTS);
  const [reportings, setReportings] = useState<Reporting[]>(SAMPLE_REPORTINGS);

  // ---------- Persistence (server-backed, saved to cortex-data.json) ----------
  const [hydrated, setHydrated] = useState(false);
  const [synced, setSynced] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && Array.isArray(data.subjects)) {
            if (Array.isArray(data.daily)) setDaily(data.daily);
            if (Array.isArray(data.weekly)) setWeekly(data.weekly);
            if (Array.isArray(data.monthly)) setMonthly(data.monthly);
            if (Array.isArray(data.nextWeek)) setNextWeek(data.nextWeek);
            if (Array.isArray(data.futureTasks)) {
              const today = todayISO();
              setFutureTasks(data.futureTasks.filter((t: FutureTask) => t.date >= today));
            }
            if (Array.isArray(data.streaks)) setStreaks(data.streaks);
            if (Array.isArray(data.events)) setEvents(data.events);
            if (Array.isArray(data.subjects)) setSubjects(data.subjects);
            if (Array.isArray(data.reportings)) setReportings(data.reportings);
          }
        }
      } catch {
        setSynced(false);
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    const prune = () => {
      const today = todayISO();
      setFutureTasks((list) => {
        const next = list.filter((t) => t.date >= today);
        return next.length === list.length ? list : next;
      });
    };
    prune();
    const id = window.setInterval(prune, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = {
      version: 1,
      savedAt: new Date().toISOString(),
      daily,
      weekly,
      monthly,
      nextWeek,
      futureTasks,
      streaks,
      events,
      subjects,
      reportings,
    };
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setSynced(res.ok);
      } catch {
        setSynced(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [hydrated, daily, weekly, monthly, nextWeek, futureTasks, streaks, events, subjects, reportings]);

  const exportData = useCallback(
    () => ({
      version: 1,
      exportedAt: new Date().toISOString(),
      daily,
      weekly,
      monthly,
      nextWeek,
      futureTasks,
      streaks,
      events,
      subjects,
      reportings,
    }),
    [daily, weekly, monthly, nextWeek, futureTasks, streaks, events, subjects, reportings]
  );

  const importData = useCallback((data: any): boolean => {
    if (!data || typeof data !== 'object' || !Array.isArray(data.subjects)) return false;
    setDaily(Array.isArray(data.daily) ? data.daily : []);
    setWeekly(Array.isArray(data.weekly) ? data.weekly : []);
    setMonthly(Array.isArray(data.monthly) ? data.monthly : []);
    setNextWeek(Array.isArray(data.nextWeek) ? data.nextWeek : []);
    setFutureTasks(
      Array.isArray(data.futureTasks) ? data.futureTasks.filter((t: FutureTask) => t.date >= todayISO()) : []
    );
    setStreaks(Array.isArray(data.streaks) ? data.streaks : []);
    setEvents(Array.isArray(data.events) ? data.events : []);
    setSubjects(data.subjects);
    setReportings(Array.isArray(data.reportings) ? data.reportings : []);
    return true;
  }, []);

  const resetData = useCallback(() => {
    setDaily(structuredClone(SAMPLE_DAILY_QUESTS));
    setWeekly(structuredClone(SAMPLE_WEEKLY_GOALS));
    setMonthly(structuredClone(SAMPLE_MONTHLY_GOALS));
    setNextWeek(structuredClone(SAMPLE_NEXT_WEEK_GOALS));
    setFutureTasks(structuredClone(SAMPLE_FUTURE_TASKS));
    setStreaks(structuredClone(SAMPLE_STREAKS));
    setEvents(structuredClone(SAMPLE_EVENTS));
    setSubjects(structuredClone(SAMPLE_SUBJECTS));
    setReportings(structuredClone(SAMPLE_REPORTINGS));
  }, []);

  const addDaily = useCallback((name: string, category: Category, refs: QuestRef[]) => {
    setDaily((list) => [
      ...list,
      { id: uid('q'), name, category, refs, completed: false, order: list.length },
    ]);
  }, []);

  const toggleDaily = useCallback((id: string) => {
    setDaily((list) =>
      list.map((q) => {
        if (q.id !== id) return q;
        const completed = !q.completed;
        if (completed) {
          const streakRefs = q.refs.filter((r) => r.type === 'streak');
          if (streakRefs.length) {
            setStreaks((sList) =>
              sList.map((s) => {
                if (!streakRefs.some((r) => r.id === s.id)) return s;
                if (s.dates.includes(todayISO())) return s;
                return { ...s, dates: [...s.dates, todayISO()] };
              })
            );
          }
        }
        return { ...q, completed, completedOn: completed ? todayISO() : undefined };
      })
    );
  }, []);

  const deleteDaily = useCallback((id: string) => setDaily((l) => l.filter((q) => q.id !== id)), []);
  const reorderDaily = useCallback((a: string, b: string) => setDaily((l) => reorder(l, a, b)), []);

  function makeGoalActions(setter: React.Dispatch<React.SetStateAction<Goal[]>>) {
    return {
      add: (name: string, extra?: Partial<Pick<Goal, 'category' | 'refs'>>) =>
        setter((list) => [
          ...list,
          { id: uid('g'), name, completed: false, order: list.length, category: extra?.category, refs: extra?.refs ?? [] },
        ]),
      toggle: (id: string) =>
        setter((list) => list.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))),
      remove: (id: string) => setter((list) => list.filter((g) => g.id !== id)),
      reorderFn: (a: string, b: string) => setter((list) => reorder(list, a, b)),
    };
  }

  const weeklyActions = useMemo(() => makeGoalActions(setWeekly), []);
  const monthlyActions = useMemo(() => makeGoalActions(setMonthly), []);
  const nextWeekActions = useMemo(() => makeGoalActions(setNextWeek), []);

  const addWeekly = useCallback((name: string, refs: QuestRef[] = []) => {
    weeklyActions.add(name, { refs });
  }, [weeklyActions]);

  const addMonthly = useCallback((name: string, category?: Category, refs: QuestRef[] = []) => {
    monthlyActions.add(name, { category, refs });
  }, [monthlyActions]);

  const addFutureTask = useCallback((date: string, name: string, category: Category, refs: QuestRef[]) => {
    if (date < todayISO()) return;
    setFutureTasks((list) => [
      ...list,
      { id: uid('t'), date, name, category, refs, completed: false, order: list.filter((t) => t.date === date).length },
    ]);
  }, []);
  const toggleFutureTask = useCallback((id: string) => {
    setFutureTasks((list) => list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);
  const deleteFutureTask = useCallback((id: string) => setFutureTasks((l) => l.filter((t) => t.id !== id)), []);
  const reorderFutureTasks = useCallback((date: string, a: string, b: string) => {
    setFutureTasks((list) => {
      const dayItems = list.filter((t) => t.date === date);
      const rest = list.filter((t) => t.date !== date);
      return [...rest, ...reorder(dayItems, a, b)];
    });
  }, []);

  // ---------------- Streaks ----------------
  const addStreak = useCallback((name: string, emoji: string, color: string) => {
    setStreaks((list) => [
      ...list,
      { id: uid('streak'), name, emoji, color, dates: [], pinned: false, createdAt: todayISO() },
    ]);
  }, []);
  const updateStreak = useCallback((id: string, data: Partial<Pick<Streak, 'name' | 'emoji' | 'color'>>) => {
    setStreaks((list) => list.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, []);
  const deleteStreak = useCallback((id: string) => setStreaks((l) => l.filter((s) => s.id !== id)), []);
  const resetStreak = useCallback((id: string) => {
    setStreaks((list) => list.map((s) => (s.id === id ? { ...s, dates: [] } : s)));
  }, []);
  const pinStreak = useCallback((id: string) => {
    setStreaks((list) => list.map((s) => ({ ...s, pinned: s.id === id ? !s.pinned : false })));
  }, []);
  const toggleStreakDate = useCallback((id: string, date: string) => {
    setStreaks((list) =>
      list.map((s) => {
        if (s.id !== id) return s;
        const has = s.dates.includes(date);
        return { ...s, dates: has ? s.dates.filter((d) => d !== date) : [...s.dates, date] };
      })
    );
  }, []);

  // ---------------- Calendar ----------------
  const addEvent = useCallback((ev: CalendarEvent) => setEvents((l) => [...l, ev]), []);
  const updateEvent = useCallback((ev: CalendarEvent) => setEvents((l) => l.map((e) => (e.id === ev.id ? ev : e))), []);
  const deleteEvent = useCallback((id: string) => setEvents((l) => l.filter((e) => e.id !== id)), []);

  // ---------------- Journey ----------------
  const addSubject = useCallback((s: Omit<Subject, 'id' | 'sections'>) => {
    const sectionId = uid('sec');
    setSubjects((list) => [
      ...list,
      {
        ...s,
        id: uid('subj'),
        sections: [
          {
            id: sectionId,
            name: s.sectionMode === 'single' ? 'Main' : 'Section 1',
            levelSeries: s.levelMode === 'simple' ? ['Level 1'] : undefined,
            chapters: [],
          },
        ],
      },
    ]);
  }, []);

  const deleteSubject = useCallback((id: string) => setSubjects((l) => l.filter((s) => s.id !== id)), []);

  function updateSubject(id: string, fn: (s: Subject) => Subject) {
    setSubjects((list) => list.map((s) => (s.id === id ? fn(s) : s)));
  }

  const renameSection = useCallback((subjectId: string, sectionId: string, name: string) => {
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) => (sec.id === sectionId ? { ...sec, name } : sec)),
    }));
  }, []);

  const addSection = useCallback((subjectId: string) => {
    const newId = uid('sec');
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: [
        ...s.sections,
        {
          id: newId,
          name: `Section ${s.sections.length + 1}`,
          levelSeries: s.levelMode === 'simple' ? [] : undefined,
          chapters: [],
        },
      ],
    }));
    return newId;
  }, []);

  const deleteSection = useCallback((subjectId: string, sectionId: string) => {
    updateSubject(subjectId, (s) => ({ ...s, sections: s.sections.filter((sec) => sec.id !== sectionId) }));
  }, []);

  const addChapter = useCallback((subjectId: string, sectionId: string) => {
    const newId = uid('chap');
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const levels =
          s.levelMode === 'simple'
            ? (sec.levelSeries || []).map((name) => ({ id: uid('lvl'), name, completed: false }))
            : [];
        return { ...sec, chapters: [...sec.chapters, { id: newId, name: 'New Chapter', levels }] };
      }),
    }));
    return newId;
  }, []);

  const renameChapter = useCallback((subjectId: string, sectionId: string, chapterId: string, name: string) => {
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) =>
        sec.id !== sectionId
          ? sec
          : { ...sec, chapters: sec.chapters.map((c) => (c.id === chapterId ? { ...c, name } : c)) }
      ),
    }));
  }, []);

  const deleteChapter = useCallback((subjectId: string, sectionId: string, chapterId: string) => {
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) =>
        sec.id !== sectionId ? sec : { ...sec, chapters: sec.chapters.filter((c) => c.id !== chapterId) }
      ),
    }));
  }, []);

  const toggleChapterCollapsed = useCallback((subjectId: string, sectionId: string, chapterId: string) => {
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              chapters: sec.chapters.map((c) => (c.id === chapterId ? { ...c, collapsed: !c.collapsed } : c)),
            }
      ),
    }));
  }, []);

  const addLevel = useCallback((subjectId: string, sectionId: string, chapterId: string) => {
    setSubjects((list) =>
      list.map((s) => {
        if (s.id !== subjectId) return s;
        if (s.levelMode === 'simple') {
          return {
            ...s,
            sections: s.sections.map((sec) => {
              if (sec.id !== sectionId) return sec;
              const newName = `Level ${(sec.levelSeries?.length || 0) + 1}`;
              const newSeries = [...(sec.levelSeries || []), newName];
              return {
                ...sec,
                levelSeries: newSeries,
                chapters: sec.chapters.map((c) => ({
                  ...c,
                  levels: [...c.levels, { id: uid('lvl'), name: newName, completed: false }],
                })),
              };
            }),
          };
        }
        return {
          ...s,
          sections: s.sections.map((sec) =>
            sec.id !== sectionId
              ? sec
              : {
                  ...sec,
                  chapters: sec.chapters.map((c) =>
                    c.id !== chapterId
                      ? c
                      : { ...c, levels: [...c.levels, { id: uid('lvl'), name: 'New Level', completed: false }] }
                  ),
                }
          ),
        };
      })
    );
  }, []);

  const renameLevel = useCallback(
    (subjectId: string, sectionId: string, chapterId: string, levelId: string, name: string) => {
      setSubjects((list) =>
        list.map((s) => {
          if (s.id !== subjectId) return s;
          if (s.levelMode === 'simple') {
            return {
              ...s,
              sections: s.sections.map((sec) => {
                if (sec.id !== sectionId) return sec;
                const chapter = sec.chapters.find((c) => c.id === chapterId);
                const idx = chapter?.levels.findIndex((l) => l.id === levelId) ?? -1;
                const newSeries = sec.levelSeries ? [...sec.levelSeries] : [];
                if (idx >= 0 && idx < newSeries.length) newSeries[idx] = name;
                return {
                  ...sec,
                  levelSeries: newSeries,
                  chapters: sec.chapters.map((c) => ({
                    ...c,
                    levels: c.levels.map((l, i) => (i === idx ? { ...l, name } : l)),
                  })),
                };
              }),
            };
          }
          return {
            ...s,
            sections: s.sections.map((sec) =>
              sec.id !== sectionId
                ? sec
                : {
                    ...sec,
                    chapters: sec.chapters.map((c) =>
                      c.id !== chapterId
                        ? c
                        : { ...c, levels: c.levels.map((l) => (l.id === levelId ? { ...l, name } : l)) }
                    ),
                  }
            ),
          };
        })
      );
    },
    []
  );

  const deleteLevel = useCallback((subjectId: string, sectionId: string, chapterId: string, levelId: string) => {
    setSubjects((list) =>
      list.map((s) => {
        if (s.id !== subjectId) return s;
        if (s.levelMode === 'simple') {
          return {
            ...s,
            sections: s.sections.map((sec) => {
              if (sec.id !== sectionId) return sec;
              const chapter = sec.chapters.find((c) => c.id === chapterId);
              const idx = chapter?.levels.findIndex((l) => l.id === levelId) ?? -1;
              const newSeries = (sec.levelSeries || []).filter((_, i) => i !== idx);
              return {
                ...sec,
                levelSeries: newSeries,
                chapters: sec.chapters.map((c) => ({
                  ...c,
                  levels: c.levels.filter((_, i) => i !== idx),
                })),
              };
            }),
          };
        }
        return {
          ...s,
          sections: s.sections.map((sec) =>
            sec.id !== sectionId
              ? sec
              : {
                  ...sec,
                  chapters: sec.chapters.map((c) =>
                    c.id !== chapterId ? c : { ...c, levels: c.levels.filter((l) => l.id !== levelId) }
                  ),
                }
          ),
        };
      })
    );
  }, []);

  const toggleLevel = useCallback((subjectId: string, sectionId: string, chapterId: string, levelId: string) => {
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              chapters: sec.chapters.map((c) =>
                c.id !== chapterId
                  ? c
                  : {
                      ...c,
                      levels: c.levels.map((l) => {
                        if (l.id !== levelId) return l;
                        const completed = !l.completed;
                        return { ...l, completed, completedOn: completed ? todayISO() : undefined };
                      }),
                    }
              ),
            }
      ),
    }));
  }, []);

  const updateSeries = useCallback((subjectId: string, sectionId: string, series: string[]) => {
    updateSubject(subjectId, (s) => ({
      ...s,
      sections: s.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          levelSeries: series,
          chapters: sec.chapters.map((c) => {
            const newLevels = series.map((name, i) => {
              const existing = c.levels[i];
              if (existing) return { ...existing, name };
              return { id: uid('lvl'), name, completed: false };
            });
            return { ...c, levels: newLevels };
          }),
        };
      }),
    }));
  }, []);

  // ---------------- Reportings ----------------
  const addReporting = useCallback((r: Omit<Reporting, 'id' | 'entries' | 'pinned'>) => {
    setReportings((list) => [...list, { ...r, id: uid('rep'), entries: [], pinned: false }]);
  }, []);
  const updateReporting = useCallback(
    (id: string, data: Partial<Pick<Reporting, 'name' | 'description' | 'unit' | 'color'>>) => {
      setReportings((list) => list.map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    []
  );
  const deleteReporting = useCallback((id: string) => setReportings((l) => l.filter((r) => r.id !== id)), []);
  const pinReporting = useCallback((id: string) => {
    setReportings((list) => list.map((r) => ({ ...r, pinned: r.id === id ? !r.pinned : false })));
  }, []);
  const addEntry = useCallback((reportingId: string, entry: Omit<Entry, 'id'>) => {
    setReportings((list) =>
      list.map((r) => (r.id === reportingId ? { ...r, entries: [...r.entries, { ...entry, id: uid('entry') }] } : r))
    );
  }, []);
  const updateEntryFn = useCallback((reportingId: string, entryId: string, data: Omit<Entry, 'id'>) => {
    setReportings((list) =>
      list.map((r) =>
        r.id !== reportingId
          ? r
          : { ...r, entries: r.entries.map((e) => (e.id === entryId ? { ...e, ...data } : e)) }
      )
    );
  }, []);
  const deleteEntry = useCallback((reportingId: string, entryId: string) => {
    setReportings((list) =>
      list.map((r) => (r.id !== reportingId ? r : { ...r, entries: r.entries.filter((e) => e.id !== entryId) }))
    );
  }, []);

  const value: AppState = {
    activeSection,
    setActiveSection,
    journeySubjectId,
    openSubject,
    closeSubject,
    reportingDetailId,
    openReportingDetail,
    closeReportingDetail,
    hydrated,
    synced,
    exportData,
    importData,
    resetData,
    toasts,
    pushToast,

    daily,
    addDaily,
    toggleDaily,
    deleteDaily,
    reorderDaily,

    weekly,
    addWeekly,
    toggleWeekly: weeklyActions.toggle,
    deleteWeekly: weeklyActions.remove,
    reorderWeekly: weeklyActions.reorderFn,

    monthly,
    addMonthly,
    toggleMonthly: monthlyActions.toggle,
    deleteMonthly: monthlyActions.remove,
    reorderMonthly: monthlyActions.reorderFn,

    nextWeek,
    addNextWeek: nextWeekActions.add,
    toggleNextWeek: nextWeekActions.toggle,
    deleteNextWeek: nextWeekActions.remove,
    reorderNextWeek: nextWeekActions.reorderFn,

    futureTasks,
    addFutureTask,
    toggleFutureTask,
    deleteFutureTask,
    reorderFutureTasks,

    streaks,
    addStreak,
    updateStreak,
    deleteStreak,
    resetStreak,
    pinStreak,
    toggleStreakDate,

    events,
    addEvent,
    updateEvent,
    deleteEvent,

    subjects,
    addSubject,
    deleteSubject,
    renameSection,
    addSection,
    deleteSection,
    addChapter,
    renameChapter,
    deleteChapter,
    toggleChapterCollapsed,
    addLevel,
    renameLevel,
    deleteLevel,
    toggleLevel,
    updateSeries,

    reportings,
    addReporting,
    updateReporting,
    deleteReporting,
    pinReporting,
    addEntry,
    updateEntry: updateEntryFn,
    deleteEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
