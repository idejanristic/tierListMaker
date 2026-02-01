import type { Draggable } from "../types/dnd";
import { useSortable } from "@dnd-kit/sortable";
import { DraggableContent } from "./DraggableContent";

export default function Draggable({ draggable }: { draggable?: Draggable }) {
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

