import { SYSTEM_PROMPT, buildUserPrompt, parseModelJson } from "@/lib/prompt";

// -------------------------------------------------------------------------
// Provider 1: NVIDIA Nemotron (primary)
// -------------------------------------------------------------------------
async function callNemotron(messageText) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is not set");

  // Primary model id. If your account 404s on this one, swap in
  // "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning" instead - same API shape.
  const model = "nvidia/nemotron-3.5-lightning-30b-a3b";

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(messageText) },
      ],
      temperature: 0.2,
      max_tokens: 3072,
      chat_template_kwargs: { thinking: false },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Nemotron request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("Nemotron returned no content");

  return parseModelJson(rawText);
}

// -------------------------------------------------------------------------
// Provider 2: Claude (fallback, only used if Nemotron fails)
// -------------------------------------------------------------------------
async function callClaudeFallback(messageText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(messageText) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Claude fallback failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const rawText = data.content?.find((b) => b.type === "text")?.text;
  if (!rawText) throw new Error("Claude returned no text content");

  return parseModelJson(rawText);
}

// -------------------------------------------------------------------------
// Route handler
// -------------------------------------------------------------------------
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messageText = (body?.message || "").trim();
  if (!messageText) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }
  if (messageText.length > 4000) {
    return Response.json(
      { error: "message is too long (max 4000 characters)" },
      { status: 400 }
    );
  }

  // Try Nemotron first. Only fall back to Claude if it genuinely fails
  // (network error, non-2xx response, or unparseable JSON) - not just
  // because Claude might be "better" for a given message.
  try {
    const result = await callNemotron(messageText);
    return Response.json({ result, provider: "nemotron" });
  } catch (nemotronError) {
    console.error("Nemotron call failed, falling back to Claude:", nemotronError);
    try {
      const result = await callClaudeFallback(messageText);
      return Response.json({ result, provider: "claude-fallback" });
    } catch (claudeError) {
      console.error("Claude fallback also failed:", claudeError);
      return Response.json(
        {
          error:
            "Both the primary and fallback analysis providers failed. Please try again.",
        },
        { status: 502 }
      );
    }
  }
}
