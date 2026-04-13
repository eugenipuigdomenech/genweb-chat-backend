/*Funció per enviar preguntes no resoltes al log.*/

export async function logUnresolved({ chatbot, question, user_language, context_hint, status }) {
  try {
    const res = await fetch(process.env.LOG_UNRESOLVED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatbot,
        question,
        user_language,
        context_hint,
        source: "genweb_chat",
        status
      })
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `logUnresolved failed with status ${res.status}`
      };
    }

    const data = await res.json();

    return {
      ok: true,
      data
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
}