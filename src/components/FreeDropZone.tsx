import type { DropZone } from "../types/dnd";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Draggable from "./Draggable";
import { defaultDraggablesAtom } from "../state/dndAtoms";
import { useAtomValue } from "jotai";

export function FreeDropZone({ dropZone }: { dropZone: DropZone }) {
    const { id, draggables } = dropZone;
    const { setNodeRef, isOver } = useDroppable({ id });

    const defaultDraggables = useAtomValue(defaultDraggablesAtom);

    const style = {
        backgroundColor: isOver ? '#444' : undefined,
    };

    if (draggables && draggables.length > 0) {
        return (
            <div ref={setNodeRef} style={style} className='border border-white bg-[#333] w-full flex mb-1'>
                <div className='flex gap-1 flex-1 justify-center items-center'>
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
        <div ref={setNodeRef} style={style} className='border border-white bg-[#333] h-30 w-full flex mb-1'>
            <div className='flex flex-1 justify-center items-center'>
                <p className='text-gray-400'>Drop Here</p>
            </div>
        </div>
    );
}