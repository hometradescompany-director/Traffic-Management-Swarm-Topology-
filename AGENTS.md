# Project agent instructions

Read README.md and docs/CONNECTORS.md before crossing boundaries. Get a bounded product sold to fund development; evaluate pricing, licensing and customer value alongside technical scope.

Use the repo-local federation-contract-author skill for boundaries and provenance-guardian for observations and derived conclusions. Read applicable SKILL.md files. Unchanged skills-foundry snapshots are recorded in .agents/skills.lock.json.

The local entrypoint is ingestTrafficObservations in src/connectors/observation-import.mjs. integrations/connectors.json records implemented bindings and outstanding integrations, not live credentials or connectivity.

Run npm test with Node >=22. Keep road-event identity separate from graph-edge identity; preserve distinct source timestamps. Keep unknown performance typed, never zero. No live controller authority is granted. Preserve v1 semantics; changes in meaning need a new version and migration. No customer data or credentials in public commits. Fixtures are synthetic.

