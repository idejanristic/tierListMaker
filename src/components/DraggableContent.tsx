import { activeDraggableAtom } from "../state/dndAtoms";
import type { Draggable } from "../types/dnd";
import { useAtomValue } from "jotai";

export function DraggableContent({ draggable, isDragging }: { draggable?: Draggable, isDragging?: boolean }) {
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