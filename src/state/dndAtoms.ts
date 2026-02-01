import { atom } from 'jotai';
import type { Draggable } from '@/types/dnd';

export const activeDraggableAtom = atom<Draggable | undefined>(undefined);

export const defaultDraggablesAtom = atom<Draggable[]>([
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
]);
