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

type DropZone = {
  id: string,
  draggables: string[]
}

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "GolemCard.png" },
  { id: crypto.randomUUID(), src: "MegaKnight.png" },
  { id: crypto.randomUUID(), src: "BabyDragonCard.png" },
  { id: crypto.randomUUID(), src: "BarbariansCard.png" },
  { id: crypto.randomUUID(), src: "BomberCard.png" },
  { id: crypto.randomUUID(), src: "DarkPrinceCard.png" },
  { id: crypto.randomUUID(), src: "ElixirGolemCard.png" },
  { id: crypto.randomUUID(), src: "MinerCard.png" },
  { id: crypto.randomUUID(), src: "PEKKACard.png" },
  { id: crypto.randomUUID(), src: "RagingPrinceCard.png" },
  { id: crypto.randomUUID(), src: "SkeletonsCard.png" },
];

const defaultDropZones: DropZone[] = [
  { id: "S", draggables: [] },
  { id: "A", draggables: [] },
  { id: "B", draggables: [] },
  { id: "C", draggables: [] },
  { id: "D", draggables: [] },
  {
    id: "free",
    draggables: defaultDraggables.map((draggable) => draggable.id),
  },
];

const dropZoneIds = defaultDropZones.map(dz => dz.id);

const activeDraggableAtom = atom<Draggable>();

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);
  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones);

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
    const activeDraggableId = active.id as string;

    setDropZones((prev) => {

      const currentDropZone = dropZones.find(dz => dz.draggables.some(draggable => draggable === activeDraggableId));

      if (!currentDropZone) return prev;

      const currentDropZoneId = currentDropZone.id;

      // Case #1 If we're hovering the empty space in a drop zone
      if (dropZoneIds.includes(overId)) {
        const dropZone = dropZones.find(dz => dz.id === overId);

        if (!dropZone) return prev;

        const newDraggables = [
          ...dropZone.draggables.filter(item => item !== activeDraggableId),
          activeDraggableId
        ];

        return prev.map((dz) => {
          // If not the old or new, just return as is
          if (dz.id !== overId && dz.id !== currentDropZoneId) return dz;

          // Remove from old one if we went across drop zones
          if (dz.id === currentDropZoneId && currentDropZoneId !== overId) {
            return {
              ...dz,
              draggables: dz.draggables.filter(
                (draggable) => draggable !== activeDraggableId,
              ),
            };
          }

          // Add to new one
          return { ...dz, draggables: newDraggables };
        });
      }

      // Case #2 If we're re-arranging within the same drop zone  
      else if (currentDropZone.draggables.some(item => item === overId)) {
        const oldIndex = currentDropZone.draggables.findIndex(item => item === activeDraggableId);
        const newIndex = currentDropZone.draggables.findIndex(item => item === overId);

        if (oldIndex === newIndex) return prev;

        const newDraggables = arrayMove(currentDropZone.draggables, oldIndex, newIndex);

        return prev.map((dz) => {
          if (dz.id === currentDropZoneId) {
            return { ...dz, draggables: newDraggables };
          }
          return dz;
        });
      }

      // Case #3 If we're re-areranging between drop zones
      else if (
        !currentDropZone.draggables.some((draggable) => draggable === overId)
      ) {
        const newDropZone = dropZones.find((dz) =>
          dz.draggables.some((draggable) => draggable === overId),
        );

        if (!newDropZone) return prev;

        const overIndex = newDropZone.draggables.findIndex(
          (draggable) => draggable === overId,
        );

        const newDraggables = newDropZone.draggables.toSpliced(
          overIndex,
          0,
          activeDraggableId,
        );

        return prev.map((dz) => {
          // If not the new OR old dropZone, just return it as is
          if (dz.id !== currentDropZoneId && dz.id !== newDropZone.id) return dz
          // Remove from the old one
          else if (dz.id === currentDropZoneId)
            return {
              ...dz,
              draggables: dz.draggables.filter(
                (draggable) => draggable !== activeDraggableId,
              ),
            }

          // Add to new
          return { ...dz, draggables: newDraggables }
        })
      }

      return prev;
    });
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDraggable(undefined);
  }

  const freeDraggables = draggables.filter(draggable => !draggable.dz);

  return (
    <>
      <div className='w-full h-screen flex flex-col gap-6 justify-start items-center'>
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          {dropZones.map((dropZone) => (
            <DropZone key={dropZone.id} dropZone={dropZone} />
          ))}
          <DragOverlay>
            {activeDraggable && <DraggableContent draggable={activeDraggable} isDragging={true} />}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  )
}

function DropZone({ dropZone }: { dropZone: DropZone }) {
  const { id, draggables } = dropZone;
  const { setNodeRef, isOver } = useDroppable({ id });

  const style = {
    backgroundColor: isOver ? '#444' : undefined,
  };

  if (draggables && draggables.length > 0) {
    return (
      <div ref={setNodeRef} style={style} className='border border-white bg-[#333] w-full flex flex-col justify-center items-start mb-4'>
        <div className='flex gap-2'>
          <SortableContext items={draggables}>
            {draggables.map((draggableId) => {
              const draggable = defaultDraggables.find(item => item.id === draggableId);

              if (!draggable) return null;

              return (
                <Draggable key={draggable.id} draggable={draggable} />
              );
            })}
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