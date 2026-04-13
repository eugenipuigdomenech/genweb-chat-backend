/* Comprova si la pregunta està relacionada amb l’àmbit del chatbot. */

export function isRelated(chatbot, message) {
  const text = (message || "").toLowerCase();

  const keywords = {
    tfe: [
      "tfe",
      "treball de fi",
      "tribunal",
      "director",
      "cotutor",
      "defensa",
      "memòria",
      "crèdits"
    ],
    practiques: [
      "pràctiques",
      "empresa",
      "conveni",
      "curriculars",
      "extracurriculars",
      "oferta"
    ],
    mobilitat: [
      "mobilitat",
      "erasmus",
      "sicue",
      "intercanvi",
      "destinació",
      "universitat"
    ]
  };

  const list = keywords[chatbot] || [];
  return list.some((word) => text.includes(word));
}