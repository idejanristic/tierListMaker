# Tier List Maker – DnD Kit Practice App

This project is a **small practice application** built to explore and learn
drag-and-drop functionality using the [`@dnd-kit`](https://docs.dndkit.com/) library
in a **React + TypeScript** environment.

The app works as a **tier list builder**, where users can drag items between
different tiers (S, A, B, C, D), reorder items within the same tier, and move them
back to the *free* area.

---

## ✨ Features

- Drag & drop between multiple drop zones
- Reordering items within the same tier
- Smooth drag experience using `DragOverlay`
- Centralized state management (drop zones as the source of truth)
- Modular and scalable project structure
- Fully type-safe implementation with TypeScript

---

## 🛠 Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **@dnd-kit**
  - `@dnd-kit/core`
  - `@dnd-kit/sortable`
- **Jotai**
- **Tailwind CSS**

---

## 📁 Project Structure

```txt
src/
├── components/        # UI and DnD-related components
│   ├── DropZone.tsx
│   ├── FreeDropZone.tsx
│   ├── Draggable.tsx
│   └── DraggableContent.tsx
│
├── state/             # Jotai atoms
│   └── dndAtoms.ts
│
├── types/             # Shared TypeScript types
│   └── dnd.ts
│
├── App.tsx
└── main.tsx