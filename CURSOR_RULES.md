# Cursor Rules

## Context
This project is a fantasy football locker room built with React + Vite + Phaser 3.
It uses Apollo Client (GraphQL backend via `VITE_GRAPHQL_URL`) and Clerk for auth.

## Style
- Prefer functional React components with hooks.
- Use Tailwind for styling.
- Keep Phaser code in `src/game/` and React UI in `src/components/`.
- GraphQL ops live in `src/graphql/operations/`.

## When asked to generate code:
- Always generate TypeScript if the file extension is `.ts` or `.tsx`.
- Include JSDoc-style comments.
- Keep scene code modular (scenes, systems, sprites).
- Use Zustand for transient game state.

## Example command
“Create a Phaser LockerRoomScene that spawns player avatars from roster query data.”
