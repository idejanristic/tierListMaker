import { useState } from 'react'
import './App.css'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'

type Draggable = {
  id: string
  src: string
  dz?: string
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
]

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);

  return (
    <>
      <div className='w-screen h-screen flex flex-col gap-16 justify-center items-center'>
        <DndContext>
          <DropZone />
          <div className='flex gap-2'>
            {draggables.map((draggable, index) => (
              <Draggable key={draggable.id} draggable={draggable} />

            ))}
          </div>
        </DndContext>
      </div>
    </>
  )
}

function DropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'drop-zone' });

  const style = {
    backgroundColor: isOver ? '#444' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className='border border-white bg-[#333] h-30 w-full flex justify-center items-center mb-4'>
      <p className='text-gray-400'>Drop Here</p>
    </div>
  );
}

function Draggable({ draggable }: { draggable: Draggable }) {
  const { id, src } = draggable;
  const { setNodeRef, listeners, attributes, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  }

  return (
    <button ref={setNodeRef} className='cursor-pointer' style={style} {...listeners} {...attributes}  >
      <img src={`/src/assets/${src}`} alt="draggable" className='max-h-30 aspect-[0.833] object-cover' />
    </button>
  );

}
