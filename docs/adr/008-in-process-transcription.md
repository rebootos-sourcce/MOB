# ADR-008: Transcription Runs In-Process, Not in a Worker Thread

**Status:** Decided, with an open follow-up question (undocumented until this session)
**Referenced by:** `recorder/src/main/transcription.js`

## Context

The build-plan spec's original phase table describes transcription running in a dedicated worker thread, separate from the main process. The shipped implementation calls `@xenova/transformers`'s pipeline directly inside `transcription.js`, which runs in the Electron main process.

## Decision

Transcription runs in-process. This was the simpler path to a working pipeline: no `worker_threads` message-passing boundary to design for a multi-megabyte model and its progress callbacks, no need to marshal the WASM/ONNX runtime across a thread boundary, and no separate lifecycle to manage.

## Consequences

**The main process blocks on inference.** Whisper transcription of a multi-minute recording ties up the same process that handles every IPC call, every window's responsiveness signaling, and the recording state machine. In practice recording and transcription are not expected to happen simultaneously, which limits how often this bites — but it does mean the control window, bubble, and any in-flight IPC call are all waiting behind the same event loop during a transcription run.

**No cancellation.** This session added progress-callback-based progress reporting (`chunk_callback`) and fixed a double-load race (the pipeline promise is now cached, not just the resolved value), but there is still no way to abort a transcription once started short of quitting the app. `@xenova/transformers`'s `pipeline()` call has no exposed abort hook for a single in-flight inference — building real cancellation would mean either finding or contributing an abort path in that library, or moving the work to a `worker_threads` worker that can be `.terminate()`-ed outright.

## Open follow-up question

Should transcription move to a `worker_threads` worker? This would fix both the main-process-blocking and no-cancellation problems at once, at the cost of the IPC/message-passing complexity this ADR's original decision was explicitly trying to avoid. Not resolved as of this session — flagged here so it is evaluated deliberately rather than revisited as a surprise the next time transcription responsiveness becomes a user-facing complaint.
