# Agent Guidelines

## Telegram Terminology

### Topic vs. Thread

Use **"topic"** in favor of "thread" when referring to message containers in forums, private chats, or channel direct messages.

**Why:** (1) The Bot API consistently uses "topic" in type names (`ForumTopic`, `DirectMessagesTopic`), method names (`createForumTopic`, `editForumTopic`), and Telegram's own docs. (2) Conceptually, a **topic** is a named container for a conversation (forum-style: Discourse, Reddit), while a **thread** typically denotes reply chains in messengers (Slack, Discord). Telegram's forum feature is topic-based—named containers with icons—so "topic" fits the design. The parameter `message_thread_id` is a legacy name; map it to `topicId` at API boundaries.

## Package Manager & Runtime

- Use **pnpm** in favor of other package managers (npm, yarn, deno, bun).
- Run installed executables and scripts with `pnpm exec`.
- Use **Node.js** for running JS and TS in favor of other runtimes (deno, bun). Node supports TypeScript via its built-in loader.
