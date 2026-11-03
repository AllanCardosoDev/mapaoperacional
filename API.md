# API Documentation

## Claude API Integration

O sistema integra com o Claude API para assistência inteligente em operações táticas.

### Endpoint

```
POST /api/claude
```

### Headers

| Header        | Valor                         | Obrigatório |
| ------------- | ----------------------------- | ----------- |
| Authorization | Bearer `<CLAUDE_PROXY_TOKEN>` | Sim         |
| Content-Type  | application/json              | Sim         |

### Request Body

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Qual é o status atual das operações?"
    }
  ],
  "system": "Você é um assistente tático do CBMAM.",
  "max_tokens": 1024,
  "model": "claude-3-opus-20240229"
}
```

### Response

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Resposta do assistente..."
    }
  ]
}
```

### Códigos de Erro

| Código | Descrição                                |
| ------ | ---------------------------------------- |
| 400    | Requisição inválida                      |
| 401    | Token de autorização inválido ou ausente |
| 429    | Limite de requisições excedido           |
| 500    | Erro interno do servidor                 |

### Exemplo de Uso

```javascript
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.CLAUDE_PROXY_TOKEN}`,
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Liste operações ativas' }],
  }),
});

const data = await response.json();
console.log(data.content[0].text);
```

### Limitações

- Máximo de 100 requisições por minuto
- Tamanho máximo de payload: 10MB
- Timeout: 60 segundos

### Segurança

- Nunca exponha `CLAUDE_PROXY_TOKEN` no frontend
- Use HTTPS em todas as comunicações
- Rotacione tokens periodicamente
- Monitore uso anômalo
