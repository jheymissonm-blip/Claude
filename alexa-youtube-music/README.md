# Alexa + YouTube Music (pt-BR)

Skill custom: você fala a música, ela busca no YouTube (Data API v3) e manda o link do YouTube Music pro app Alexa.

## Por que não toca direto no Echo?
O YouTube Music **não tem API pública de streaming**. Extrair o áudio do YouTube viola os Termos do Google
e a Amazon reprova skills assim. Por isso a skill entrega o link (card) em vez de tocar.
Alternativa oficial para ouvir no Echo: parear o celular por **Bluetooth** ("Alexa, parear") e tocar pelo app do YouTube Music.

## Deploy
1. Google Cloud Console → ative *YouTube Data API v3* → crie uma API key.
2. AWS Lambda (Node 20, us-east-1): suba `lambda/` (`npm install` antes de zipar), variável `YOUTUBE_API_KEY`, gatilho *Alexa Skills Kit*.
3. developer.amazon.com/alexa → Create Skill → Custom, pt-BR → cole `skill-package/interactionModels/custom/pt-BR.json` no JSON Editor → Endpoint = ARN da Lambda → Build.
4. Teste: aba *Test* → "abrir minha música do youtube" → "tocar Anitta".
