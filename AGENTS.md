# Agent Guidelines

## Project Overview

`@grom.js/effect-tg` is a library for building Telegram bots on top of [Effect](https://effect.website), targeting the Telegram Bot API. See `README.md` for user-facing docs and usage examples.

- `src/*.ts` — public API. Each file is exported as a namespace from `src/index.ts`.
- `src/internal/` — implementation details backing the public modules (not exported directly).
- `src/internal/botApi.gen.ts` — generated Bot API method/type definitions. Never hand-edit; regenerate with `pnpm gen:bot-api` (see `scripts/gen-bot-api.ts`).
- `test/` — Vitest suites (`*.test.ts`) and type-level tests (`*.test-d.ts`).

### Commands

- `pnpm test` — run tests
- `pnpm typecheck` — project-wide type check
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm build` — emit `dist/`
- `pnpm gen:bot-api` — regenerate `src/internal/botApi.gen.ts` from the Bot API spec
- `pnpm knip` — check for unused files/exports/dependencies

## Verifying Changes

Run the following checks to verify your changes:

```sh
pnpm run typecheck
pnpm run lint
pnpm run knip
pnpm run test
```

## Telegram Terminology

### Topic vs. Thread

Use **"topic"** in favor of "thread" when referring to message containers in forums, private chats, or channel direct messages.

**Why:** (1) The Bot API consistently uses "topic" in type names (`ForumTopic`, `DirectMessagesTopic`), method names (`createForumTopic`, `editForumTopic`), and Telegram's own docs. (2) Conceptually, a **topic** is a named container for a conversation (forum-style: Discourse, Reddit), while a **thread** typically denotes reply chains in messengers (Slack, Discord). Telegram's forum feature is topic-based—named containers with icons—so "topic" fits the design. The parameter `message_thread_id` is a legacy name; map it to `topicId` at API boundaries.

## Package Manager & Runtime

- Use **pnpm** in favor of other package managers (npm, yarn, deno, bun).
- Run installed executables and scripts with `pnpm exec`.
- Use **Node.js** for running JS and TS in favor of other runtimes (deno, bun). Node supports TypeScript via its built-in loader.
