---
name: folder-structure
description: Load on every React, TypeScript, or JavaScript change. Place files by user request, then the existing tree, then feature folders.
---

# Folder structure

1. The user named the folders: use those.
2. The repo already has a tree: use that.
3. Neither: use `src/features/<feature>/`.

- `index.ts` is the only public import
- `<Feature>.tsx`
- `use<Feature>.ts`
- `types.ts`

Import another feature only through its `index.ts`. Name each added file for what it does, and keep it in that feature folder.
