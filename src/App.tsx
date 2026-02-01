import { useState } from 'react'
import './App.css'
import { DndContext, DragOverlay, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useAtom, useAtomValue } from 'jotai'
import type { Draggable, DropZone as DZ } from './types/dnd'
import { activeDraggableAtom, defaultDraggablesAtom } from './state/dndAtoms'
import { DraggableContent } from './components/DraggableContent'
import { DropZone } from './components/DropZone'
import { FreeDropZone } from './components/FreeDropZone'


export default function App() {
  const defaultDraggables = useAtomValue(defaultDraggablesAtom);

  const defaultDropZones: DZ[] = [
    { id: "S", draggables: [], color: "rgb(255, 127, 127)" },
    { id: "A", draggables: [], color: "rgb(255, 192, 127)" },
    { id: "B", draggables: [], color: "rgb(255, 255, 127)" },
    { id: "C", draggables: [], color: "rgb(127, 255, 127)" },
    { id: "D", draggables: [], color: "rgb(127, 192, 255)" },
    {
      id: "free",
      draggables: defaultDraggables.map((draggable) => draggable.id),
      color: "rgb(200, 200, 200)",
    },
  ];

  const dropZoneIds = defaultDropZones.map(dz => dz.id);

  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);
  const [dropZones, setDropZones] = useState<DZ[]>(defaultDropZones);

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

    const currentDropZone = dropZones.find(dz => dz.draggables.some(draggable => draggable === activeDraggableId));

    if (!currentDropZone) return;

    const currentDropZoneId = currentDropZone.id;

    setDropZones((prev) => {
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

  const freeDropZone = dropZones.find(dz => dz.id === "free");

  if (!freeDropZone) return null;

  return (
    <>
      <div className='w-full h-screen flex flex-col  justify-start items-center'>
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          <div className="w-full mb-8">
            {dropZones.filter(dz => dz.id !== "free").map((dropZone) => (
              <DropZone key={dropZone.id} dropZone={dropZone} />
            ))}
          </div>
          <FreeDropZone dropZone={freeDropZone} />
          <DragOverlay>
            {activeDraggable && <DraggableContent draggable={activeDraggable} isDragging={true} />}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  )
}
