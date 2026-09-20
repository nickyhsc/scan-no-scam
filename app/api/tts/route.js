export async function POST(req) {
  const { text } = await req.json();

  if (!text || !text.trim()) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }

  const voiceId = "hpp4J3VqNfWAUOO0d1Us"; // "Rachel" — swap for your chosen voice ID

  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error("ElevenLabs error:", errText);
      return Response.json({ error: "TTS generation failed." }, { status: 502 });
    }

    const audioBuffer = await elevenRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not reach ElevenLabs." }, { status: 500 });
  }
}
