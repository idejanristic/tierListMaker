export type Draggable = {
    id: string;
    src: string;
};

export type DropZone = {
    id: string;
    draggables: string[];
    color: string;
};