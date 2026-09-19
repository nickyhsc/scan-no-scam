# SafeCheck — AI Scam Safety Assistant (MVP)

Paste-text MVP: paste a suspicious message → Nemotron analyzes it →
see WHY / WHAT / NOW WHAT. Falls back to Claude if Nemotron fails.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env example and fill in your real keys:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local`:
   - `NVIDIA_API_KEY` — get this from https://build.nvidia.com (pick a Nemotron model → "Get API Key")
   - `ANTHROPIC_API_KEY` — get this from https://console.anthropic.com (only used as a fallback)

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000, paste a test message, click "Analyze Message".

## How it works

- `app/page.js` — the paste box + results UI
- `app/api/analyze/route.js` — receives the pasted text, calls Nemotron
  (`nvidia/nemotron-3-nano-30b-a3b`), and falls back to Claude
  (`claude-sonnet-4-6`) only if Nemotron's call fails
- `lib/prompt.js` — the single shared system prompt + JSON schema both
  providers are told to follow, so the frontend gets the same shape either way

## If Nemotron returns a 404

Some accounts don't have hosted access enabled for `nvidia/nemotron-3-nano-30b-a3b`
yet. If you see that error, open `app/api/analyze/route.js` and swap the
`model` value to:
```
nvidia/nemotron-3-nano-omni-30b-a3b-reasoning
```
Same request/response shape, just a different model string.

## Next steps (in priority order)

1. Test the pipeline above against a handful of real/fake sample messages
   (scam + legit + ambiguous) and tune `lib/prompt.js` until the output
   is reliably good.
2. Add evidence highlighting: take `signals[].evidence` and highlight that
   exact substring inside the pasted message on screen.
3. Wire up the real "Listen to explanation" button in `app/page.js` to
   call the ElevenLabs text-to-speech API with `result.summary`.
4. Only after all of the above works reliably: add screenshot upload,
   ideally using `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` directly
   on the image (skips a separate OCR step).

## Notes

- `.env.local` is already gitignored — never commit real API keys.
- No database, no auth — intentionally out of scope for the MVP.
