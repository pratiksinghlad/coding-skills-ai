---
name: folder-structure
description: Load on every Python change. Place files by user request, then the existing tree, then feature folders.
---

# Folder structure

1. The user named the folders: use those.
2. The repo already has a tree: use that.
3. Neither: use `src/features/<feature>/`.

- `__init__.py` is the only public import
- `models.py`
- `service.py`
- `io.py` only when the feature does I/O

Import another feature only through its `__init__.py`. Name each added file for what it does, and keep it in that feature folder.
