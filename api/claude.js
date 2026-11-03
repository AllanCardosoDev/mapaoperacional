import { timingSafeEqual } from 'node:crypto';

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 20000;
const MAX_SYSTEM_LENGTH = 10000;
const MAX_TOTAL_LENGTH = 100000;
const MAX_TOKENS = 8192;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '128kb',
    },
  },
};

function isAuthorized(request, expectedToken) {
  const authorization = request.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) return false;

  const provided = Buffer.from(authorization.slice(7));
  const expected = Buffer.from(expectedToken);
  return (
    provided.length === expected.length && timingSafeEqual(provided, expected)
  );
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método não permitido.' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  const proxyToken = process.env.CLAUDE_PROXY_TOKEN;
  const model = process.env.CLAUDE_MODEL;
  const configuredBaseUrl = process.env.CLAUDE_API_BASE_URL;

  if (!apiKey || !proxyToken || !model || !configuredBaseUrl) {
    return response
      .status(500)
      .json({ error: 'Configuração do Claude incompleta no servidor.' });
  }

  if (!isAuthorized(request, proxyToken)) {
    return response.status(401).json({ error: 'Não autorizado.' });
  }

  let baseUrl;
  try {
    baseUrl = new URL(configuredBaseUrl);
  } catch {
    return response
      .status(500)
      .json({ error: 'CLAUDE_API_BASE_URL não é uma URL válida.' });
  }

  if (baseUrl.protocol !== 'https:' || baseUrl.search || baseUrl.hash) {
    return response
      .status(500)
      .json({
        error:
          'CLAUDE_API_BASE_URL deve ser HTTPS e não pode conter query ou fragmento.',
      });
  }

  const body = request.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return response
      .status(400)
      .json({ error: 'O corpo deve ser um objeto JSON.' });
  }

  if (
    !Array.isArray(body.messages) ||
    body.messages.length === 0 ||
    body.messages.length > MAX_MESSAGES
  ) {
    return response
      .status(400)
      .json({
        error: `messages deve conter de 1 a ${MAX_MESSAGES} mensagens.`,
      });
  }

  if (
    body.system !== undefined &&
    (typeof body.system !== 'string' || body.system.length > MAX_SYSTEM_LENGTH)
  ) {
    return response
      .status(400)
      .json({
        error: `system deve ser texto com até ${MAX_SYSTEM_LENGTH} caracteres.`,
      });
  }

  const messages = [];
  let totalLength = typeof body.system === 'string' ? body.system.length : 0;

  for (const message of body.messages) {
    if (
      !message ||
      typeof message !== 'object' ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string' ||
      message.content.length === 0 ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return response.status(400).json({
        error: `Cada mensagem deve ter role user/assistant e conteúdo de texto de até ${MAX_MESSAGE_LENGTH} caracteres.`,
      });
    }

    totalLength += message.content.length;
    messages.push({ role: message.role, content: message.content });
  }

  if (totalLength > MAX_TOTAL_LENGTH) {
    return response
      .status(400)
      .json({
        error: `O conteúdo total não pode exceder ${MAX_TOTAL_LENGTH} caracteres.`,
      });
  }

  const maxTokens = body.max_tokens === undefined ? 2048 : body.max_tokens;
  if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > MAX_TOKENS) {
    return response
      .status(400)
      .json({
        error: `max_tokens deve ser um inteiro entre 1 e ${MAX_TOKENS}.`,
      });
  }

  const upstreamUrl = `${configuredBaseUrl.replace(/\/+$/, '')}/messages`;
  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages,
        ...(body.system === undefined ? {} : { system: body.system }),
      }),
    });
  } catch {
    return response
      .status(502)
      .json({ error: 'Não foi possível conectar ao gateway do Claude.' });
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    return response
      .status(502)
      .json({
        error:
          'O gateway do Claude retornou uma resposta que não é JSON válido.',
      });
  }

  return response.status(upstream.status).json(result);
}
