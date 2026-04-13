/* Connexió amb OpenAI per generar la resposta final. */

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateAnswer({ systemPrompt, message, context }) {
  const messages = [
    { role: "system", content: systemPrompt }
  ];

  if (context) {
    messages.push({
      role: "system",
      content: `Context recuperat:\n${context}`
    });
  }

  messages.push({
    role: "user",
    content: message
  });

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.2
  });

  return completion.choices[0]?.message?.content || "No s'ha pogut generar una resposta.";
}