# Guia de Deploy

## Vercel (Recomendado)

### Deploy Automático via GitHub

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:

- `CLAUDE_API_BASE_URL`: URL base do gateway Claude
- `CLAUDE_API_KEY`: Chave de API (secreta)
- `CLAUDE_MODEL`: ID do modelo Claude
- `CLAUDE_PROXY_TOKEN`: Token de proxy (secreto)

3. Deploy automático em cada push para `main`

### Deploy via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

## Docker

### Build Local

```bash
docker build -t mapa-operacional-amazonas .
```

### Executar Container

```bash
docker run -p 8080:80 mapa-operacional-amazonas
```

Acesse em `http://localhost:8080`

## Variáveis de Ambiente

| Variável              | Descrição                  | Obrigatório                 |
| --------------------- | -------------------------- | --------------------------- |
| `CLAUDE_API_BASE_URL` | URL base do gateway Claude | Sim                         |
| `CLAUDE_API_KEY`      | Chave de API Claude        | Sim                         |
| `CLAUDE_MODEL`        | Modelo Claude a ser usado  | Não (padrão: claude-3-opus) |
| `CLAUDE_PROXY_TOKEN`  | Token de autorização       | Sim                         |

**Segurança:** Nunca commite `.env.local` ou exponha variáveis secretas no frontend.

## Otimizações de Produção

- Bundle dividido em chunks (vendor, lucide, data)
- Minificação automática
- Tree shaking de dependências não utilizadas
- Cache por hash de arquivo

## Monitoramento

Após deploy, monitore:

- Performance via Lighthouse CI
- Erros via console do navegador
- Uso da API Claude via logs do gateway
