import { useState } from 'react'
import './App.css'
import { DndContext, DragOverlay, useDraggable, useDroppable, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { atom, useAtom, useAtomValue } from 'jotai'

type Draggable = {
  id: string
  src: string
  dz?: string
}

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "GolemCard.png", dz: 'drop-zone' },
  { id: crypto.randomUUID(), src: "MegaKnight.png", dz: 'drop-zone' },
  { id: crypto.randomUUID(), src: "BabyDragonCard.png", dz: 'drop-zone' },
  { id: crypto.randomUUID(), src: "BarbariansCard.png", dz: 'drop-zone' },
  { id: crypto.randomUUID(), src: "BomberCard.png", dz: 'drop-zone' },
  { id: crypto.randomUUID(), src: "DarkPrinceCard.png", dz: 'drop-zone' },
  { id: crypto.randomUUID(), src: "ElixirGolemCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "MinerCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "PEKKACard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "RagingPrinceCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "SkeletonsCard.png", dz: undefined },
];

const activeDraggableAtom = atom<Draggable>();

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);
  const [activeDraggable, setActiveDraggable] = useAtom(activeDraggableAtom);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;
    const draggable = draggables.find(item => item.id === activeId) || undefined;

    setActiveDraggable(draggable);
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !activeDraggable) return;

    const overId = over.id as string;
    const activeId = active.id as string;

    setDraggables((prev) => {
      // If we're hovering the empty space in a drop zone
      if (overId === 'drop-zone') {
        const newDraggable = { ...activeDraggable, dz: 'drop-zone' };

        return [...prev.filter(item => item.id !== activeId), newDraggable];
      }

      // If we're hovering the space inside a SortableContext
      const overDraggable = prev.find(item => item.id === overId);
      const overDropZone = !!overDraggable?.dz;

      const oldIndex = prev.findIndex(item => item.id === activeId);
      const newIndex = prev.findIndex(item => item.id === overId);

      if (oldIndex === newIndex) return prev;

      const shiftedItems = arrayMove(prev, oldIndex, newIndex);

      shiftedItems[newIndex] = { ...shiftedItems[newIndex], dz: overDropZone ? 'drop-zone' : undefined };

      return shiftedItems;
    });
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDraggable(undefined);
  }

  const freeDraggables = draggables.filter(draggable => !draggable.dz);

  return (
    <>
      <div className='w-screen h-screen flex flex-col gap-16 justify-center items-center'>
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          <DropZone draggables={draggables} />
          <SortableContext items={freeDraggables.map(item => item.id)}>
            <div className='flex gap-2'>
              {freeDraggables.map((draggable) => (
                <Draggable key={draggable.id} draggable={draggable} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeDraggable && <DraggableContent draggable={activeDraggable} isDragging={true} />}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  )
}

function DropZone({ draggables }: { draggables?: Draggable[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'drop-zone' });

  const style = {
    backgroundColor: isOver ? '#444' : undefined,
  };

  const items = draggables?.filter(draggable => draggable.dz);

  if (items && items.length > 0) {
    return (
      <div ref={setNodeRef} style={style} className='border border-white bg-[#333] w-full flex flex-col justify-center items-start mb-4'>
        <div className='flex gap-2'>
          <SortableContext items={items?.map(item => item.id)}>
            {items?.map((draggable) => (
              <Draggable key={draggable.id} draggable={draggable} />
            ))}
          </SortableContext>
        </div>
      </div >
    );
  }

  return (
    <div ref={setNodeRef} style={style} className='border border-white bg-[#333] h-30 w-full flex justify-center items-center mb-4'>
      <p className='text-gray-400'>Drop Here</p>
    </div>
  );
}

function Draggable({ draggable }: { draggable?: Draggable }) {
  if (!draggable) return null;

  const { id } = draggable;
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  }

  return (
    <button ref={setNodeRef} className='cursor-pointer' style={style} {...listeners} {...attributes}  >
      <DraggableContent draggable={draggable} />
    </button>
  );
}

function DraggableContent({ draggable, isDragging }: { draggable?: Draggable, isDragging?: boolean }) {
  if (!draggable) return null;

  const { id, src } = draggable;
  const activeDraggableId = useAtomValue(activeDraggableAtom)?.id;

  const style: { opacity?: number } = {
    opacity: isDragging || activeDraggableId !== id ? 0.6 : 0
  };

  return (
    <img
      src={`/src/assets/${src}`}
      style={style}
      alt="draggable"
      className='max-h-30 aspect-[0.833] object-cover' />
  );
}