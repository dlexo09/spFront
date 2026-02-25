import OpenAI from 'openai';

let _client;

export function getOpenAI() {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY must be set');
    _client = new OpenAI({ apiKey });
  }
  return _client;
}
