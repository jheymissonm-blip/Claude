const Alexa = require('ask-sdk-core');

const API_KEY = process.env.YOUTUBE_API_KEY; // chave do YouTube Data API v3

async function buscar(q) {
  const url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=1'
    + `&q=${encodeURIComponent(q)}&key=${API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`YouTube API ${r.status}`);
  const item = (await r.json()).items?.[0];
  return item && { id: item.id.videoId, titulo: item.snippet.title, canal: item.snippet.channelTitle };
}

const Launch = {
  canHandle: h => Alexa.getRequestType(h.requestEnvelope) === 'LaunchRequest',
  handle: h => h.responseBuilder.speak('Qual música você quer?').reprompt('Diga, por exemplo: tocar Anitta.').getResponse(),
};

const Tocar = {
  canHandle: h => Alexa.getRequestType(h.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(h.requestEnvelope) === 'TocarMusicaIntent',
  async handle(h) {
    const q = Alexa.getSlotValue(h.requestEnvelope, 'busca');
    if (!q) return h.responseBuilder.speak('Não entendi a música.').reprompt('Qual música?').getResponse();
    const v = await buscar(q);
    if (!v) return h.responseBuilder.speak(`Não achei ${q}.`).getResponse();
    const link = `https://music.youtube.com/watch?v=${v.id}`;
    return h.responseBuilder
      .speak(`Encontrei ${v.titulo}, de ${v.canal}. Mandei o link pro app Alexa no seu celular.`)
      .withSimpleCard(v.titulo, link)
      .getResponse();
  },
};

const Ajuda = {
  canHandle: h => Alexa.getRequestType(h.requestEnvelope) === 'IntentRequest'
    && ['AMAZON.HelpIntent', 'AMAZON.FallbackIntent'].includes(Alexa.getIntentName(h.requestEnvelope)),
  handle: h => h.responseBuilder.speak('Diga tocar e o nome da música ou artista.').reprompt('Qual música?').getResponse(),
};

const Parar = {
  canHandle: h => Alexa.getRequestType(h.requestEnvelope) === 'SessionEndedRequest'
    || (Alexa.getRequestType(h.requestEnvelope) === 'IntentRequest'
      && ['AMAZON.StopIntent', 'AMAZON.CancelIntent'].includes(Alexa.getIntentName(h.requestEnvelope))),
  handle: h => h.responseBuilder.speak('Tchau!').withShouldEndSession(true).getResponse(),
};

const Erro = {
  canHandle: () => true,
  handle: (h, e) => { console.error(e); return h.responseBuilder.speak('Deu um erro. Tente de novo.').getResponse(); },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(Launch, Tocar, Ajuda, Parar)
  .addErrorHandlers(Erro)
  .lambda();
