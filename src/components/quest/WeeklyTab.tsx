import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppStore';
import { useDragReorder } from './dnd';
import { GoalRow, Divider, EmptyState } from './Rows';
import { Button } from '../ui/Button';
import { IconPlus } from '../ui/Icons';
import { QuestFormModal } from './QuestFormModal';

export function WeeklyTab() {
  const { weekly, addWeekly, toggleWeekly, deleteWeekly, reorderWeekly, pushToast } = useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);

  const goalDnd = useDragReorder(reorderWeekly);

  const activeGoals = useMemo(() => [...weekly].filter((g) => !g.completed).sort((a, b) => a.order - b.order), [weekly]);
  const completedGoals = useMemo(() => [...weekly].filter((g) => g.completed).sort((a, b) => a.order - b.order), [weekly]);

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-50">Weekly Goals</h2>
          <Button variant="primary" size="sm" onClick={() => setShowAddGoal(true)}>
            <IconPlus width={14} height={14} />
          </Button>
        </div>
        <div className="space-y-2">
          {activeGoals.length === 0 && completedGoals.length === 0 && <EmptyState>No weekly goals yet.</EmptyState>}
          {activeGoals.map((g) => {
            const { isOver, ...row } = goalDnd.rowProps(g.id);
            return (
              <GoalRow key={g.id} goal={g} onToggle={() => toggleWeekly(g.id)} onDelete={() => deleteWeekly(g.id)} grip={goalDnd.gripProps(g.id)} row={row} isOver={isOver} />
            );
          })}
          {completedGoals.length > 0 && (
            <>
              <Divider count={completedGoals.length} />
              {completedGoals.map((g) => {
                const { isOver, ...row } = goalDnd.rowProps(g.id);
                return (
                  <GoalRow
                    key={g.id}
                    goal={g}
                    onToggle={() => toggleWeekly(g.id)}
                    onDelete={() => deleteWeekly(g.id)}
                    grip={goalDnd.gripProps(g.id)}
                    row={row}
                    isOver={isOver}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      {showAddGoal && (
        <QuestFormModal
          title="Add Weekly Goal"
          includeCategory={false}
          refMode="monthly"
          onClose={() => setShowAddGoal(false)}
          onSubmit={(name, _category, refs) => {
            addWeekly(name, refs);
            pushToast('Goal added');
          }}
        />
      )}
    </div>
  );
}
