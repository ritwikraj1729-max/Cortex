import { useRef, useState } from 'react';

export function useDragReorder(onReorder: (draggedId: string, targetId: string) => void) {
  const [armedId, setArmedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const draggingId = useRef<string | null>(null);

  function gripProps(id: string) {
    return {
      onMouseDown: () => setArmedId(id),
      onMouseUp: () => setArmedId(null),
    };
  }

  function rowProps(id: string) {
    return {
      draggable: armedId === id,
      onDragStart: (e: React.DragEvent) => {
        if (armedId !== id) {
          e.preventDefault();
          return;
        }
        draggingId.current = id;
        e.dataTransfer.effectAllowed = 'move';
      },
      onDragOver: (e: React.DragEvent) => {
        if (!draggingId.current || draggingId.current === id) return;
        e.preventDefault();
        setOverId(id);
      },
      onDragLeave: () => setOverId((cur) => (cur === id ? null : cur)),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (draggingId.current && draggingId.current !== id) {
          onReorder(draggingId.current, id);
        }
        draggingId.current = null;
        setArmedId(null);
        setOverId(null);
      },
      onDragEnd: () => {
        draggingId.current = null;
        setArmedId(null);
        setOverId(null);
      },
      isOver: overId === id,
    };
  }

  return { gripProps, rowProps };
}
