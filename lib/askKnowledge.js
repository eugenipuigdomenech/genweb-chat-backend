/*Funció per consultar el coneixement.
Al principi pot cridar el endpoint de drive-knowledge-bridge per trobar context.*/

export async function askKnowledge(chatbot, message) {
  try {
    const res = await fetch(process.env.ASK_KNOWLEDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatbot,
        query: message
      })
    });

    if (!res.ok) {
      return {
        ok: false,
        found: false,
        error: `askKnowledge failed with status ${res.status}`
      };
    }

    const data = await res.json();

    return {
      ok: true,
      found: Boolean(data?.answer || data?.context),
      answer: data?.answer || "",
      context: data?.context || ""
    };
  } catch (error) {
    return {
      ok: false,
      found: false,
      error: error.message
    };
  }
}