#!/usr/bin/env node
// bin/agent-skills.js
// Thin entrypoint for the `agent-skills` CLI.
// Delegates immediately to cli/index.js which wires up commander.
// chmod +x is set by the npm publish pipeline (files are executable).

import '../cli/index.js';
