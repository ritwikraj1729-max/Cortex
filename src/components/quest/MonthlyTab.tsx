import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppStore';
import { useDragReorder } from './dnd';
import { GoalRow, Divider, EmptyState } from './Rows';
import { Button } from '../ui/Button';
import { IconPlus } from '../ui/Icons';
import { QuestFormModal } from './QuestFormModal';

export function MonthlyTab() {
  const { monthly, addMonthly, toggleMonthly, deleteMonthly, reorderMonthly, pushToast } = useApp();
  const [showAddMonthly, setShowAddMonthly] = useState(false);

  const monthlyDnd = useDragReorder(reorderMonthly);

  const activeMonthly = useMemo(() => [...monthly].filter((g) => !g.completed).sort((a, b) => a.order - b.order), [monthly]);
  const completedMonthly = useMemo(() => [...monthly].filter((g) => g.completed).sort((a, b) => a.order - b.order), [monthly]);

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-50">Monthly Goals</h2>
          <Button variant="primary" size="sm" onClick={() => setShowAddMonthly(true)}>
            <IconPlus width={14} height={14} />
          </Button>
        </div>
        <div className="space-y-2">
          {activeMonthly.length === 0 && completedMonthly.length === 0 && <EmptyState>No monthly goals yet.</EmptyState>}
          {activeMonthly.map((g) => {
            const { isOver, ...row } = monthlyDnd.rowProps(g.id);
            return (
              <GoalRow
                key={g.id}
                goal={g}
                onToggle={() => toggleMonthly(g.id)}
                onDelete={() => deleteMonthly(g.id)}
                grip={monthlyDnd.gripProps(g.id)}
                row={row}
                isOver={isOver}
              />
            );
          })}
          {completedMonthly.length > 0 && (
            <>
              <Divider count={completedMonthly.length} />
              {completedMonthly.map((g) => {
                const { isOver, ...row } = monthlyDnd.rowProps(g.id);
                return (
                  <GoalRow
                    key={g.id}
                    goal={g}
                    onToggle={() => toggleMonthly(g.id)}
                    onDelete={() => deleteMonthly(g.id)}
                    grip={monthlyDnd.gripProps(g.id)}
                    row={row}
                    isOver={isOver}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      {showAddMonthly && (
        <QuestFormModal
          title="Add Monthly Goal"
          includeCategory
          refMode="subject-streak"
          onClose={() => setShowAddMonthly(false)}
          onSubmit={(name, category, refs) => {
            addMonthly(name, category, refs);
            pushToast('Goal added');
          }}
        />
      )}
    </div>
  );
}
