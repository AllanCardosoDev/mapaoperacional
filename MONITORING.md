# Monitoramento e Observabilidade

## Métricas de Performance (Lighthouse)

Objetivos para produção:

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: N/A (aplicação interna)
- **PWA**: ≥ 80 (quando PWA implementado)

### Executando Auditoria Local

```bash
npx lighthouse http://localhost:3000 --view
```

## Health Checks

### Endpoint de Status

Implementar `/api/health` no backend futuro:

```json
{
  "status": "ok",
  "timestamp": "2026-11-03T12:00:00Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

## Logging

### Frontend

- Erros capturados via `console.error` enviados para serviço externo
- Eventos de usuário registrados para analytics
- Performance marks para medir tempo de renderização

### Exemplo de Log Estruturado

```javascript
console.log(
  JSON.stringify({
    level: 'error',
    message: 'Falha ao carregar geometria municipal',
    municipality: 'Manaus',
    timestamp: new Date().toISOString(),
  })
);
```

## Alertas Configurados

- **CI/CD Falhando**: Notificação via GitHub Actions
- **Dependências Vulneráveis**: Dependabot alerts
- **Performance Degradada**: Lighthouse CI thresholds
- **Erro em Produção**: Sentry ou similar (planejado)

## Dashboard Recomendado

Ferramentas para implementação futura:

- **Sentry**: Error tracking
- **Datadog/New Relic**: APM completo
- **Google Analytics**: Métricas de uso
- **UptimeRobot**: Monitoramento de disponibilidade

## Runbook de Incidentes

### Aplicação Não Carrega

1. Verificar status do deploy na Vercel
2. Checar console do navegador por erros
3. Validar variáveis de ambiente configuradas
4. Reverter último commit se necessário

### API Claude Indisponível

1. Verificar status do gateway (`CLAUDE_API_BASE_URL`)
2. Validar token de proxy (`CLAUDE_PROXY_TOKEN`)
3. Testar endpoint manualmente com curl
4. Fallback: desabilitar funcionalidade IA temporariamente

### Performance Lenta

1. Abrir DevTools > Performance
2. Identificar componentes com re-renderização excessiva
3. Verificar tamanho do bundle (`npm run build`)
4. Otimizar chunks grandes com lazy loading
