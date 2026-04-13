/* És l’endpoint principal.
Rep la pregunta des de Genweb i decideix tot el flow.*/

import { askKnowledge } from "../lib/askKnowledge.js";
import { logUnresolved } from "../lib/logUnresolved.js";
import { isRelated } from "../lib/isRelated.js";
import { generateAnswer } from "../lib/openai.js";
import { getSystemPrompt } from "../lib/prompts.js";

function getLanguageFromMessage(message) {
  const text = (message || "").toLowerCase();

  if (
    text.includes("què") ||
    text.includes("perquè") ||
    text.includes("pràctiques") ||
    text.includes("és")
  ) {
    return "ca";
  }

  if (
    text.includes("qué") ||
    text.includes("porque") ||
    text.includes("practicas")
  ) {
    return "es";
  }

  return "ca";
}

function isBasicDefinition(message) {
  const text = (message || "").toLowerCase();

  return (
    text.startsWith("què és") ||
    text.startsWith("que es") ||
    text.startsWith("què vol dir") ||
    text.startsWith("que significa") ||
    text.startsWith("what is")
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const { chatbot = "", message = "" } = req.body || {};

    if (!chatbot || !message) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields: chatbot and message"
      });
    }

    const userLanguage = getLanguageFromMessage(message);
    const related = isRelated(chatbot, message);

    if (!related) {
      await logUnresolved({
        chatbot,
        question: message,
        user_language: userLanguage,
        context_hint: "out_of_scope",
        status: "out_of_scope"
      });

      return res.status(200).json({
        ok: true,
        reply: "Aquesta consulta no sembla relacionada amb l'àmbit d'aquest chatbot."
      });
    }

    const knowledge = await askKnowledge(chatbot, message);

    if (knowledge.ok && knowledge.found) {
      const reply = await generateAnswer({
        systemPrompt: getSystemPrompt(chatbot),
        message,
        context: knowledge.context || knowledge.answer
      });

      return res.status(200).json({
        ok: true,
        reply
      });
    }

    if (isBasicDefinition(message)) {
      const reply = await generateAnswer({
        systemPrompt: getSystemPrompt(chatbot),
        message,
        context: ""
      });

      return res.status(200).json({
        ok: true,
        reply
      });
    }

    await logUnresolved({
      chatbot,
      question: message,
      user_language: userLanguage,
      context_hint: "not_found_in_context",
      status: "unresolved"
    });

    return res.status(200).json({
      ok: true,
      reply: "No tinc aquesta informació. Et recomano que contactis amb el servei o canal de suport corresponent de l’ESEIAAT."
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Internal server error"
    });
  }
}