import type { Chapter, Section, Subject } from '../types';

export function chapterProgress(chapter: Chapter) {
  const total = chapter.levels.length;
  const done = chapter.levels.filter((l) => l.completed).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function sectionProgress(section: Section) {
  let done = 0;
  let total = 0;
  for (const c of section.chapters) {
    done += c.levels.filter((l) => l.completed).length;
    total += c.levels.length;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function subjectProgress(subject: Subject) {
  let done = 0;
  let total = 0;
  for (const s of subject.sections) {
    const p = sectionProgress(s);
    done += p.done;
    total += p.total;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function overallJourneyProgress(subjects: Subject[]) {
  let done = 0;
  let total = 0;
  for (const s of subjects) {
    const p = subjectProgress(s);
    done += p.done;
    total += p.total;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
