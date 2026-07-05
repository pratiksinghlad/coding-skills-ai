#!/usr/bin/env node
// bin/agent-skills.js
// Entrypoint for the `agent-skills` CLI.
// Must stay thin: parse args, delegate to src/index.js.
// chmod +x is set by the npm publish pipeline (files are executable).

import '../src/index.js';
