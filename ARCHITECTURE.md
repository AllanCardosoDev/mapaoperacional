# Arquitetura do Sistema

## Visão Geral

O Mapa Operacional do Amazonas é uma aplicação React single-page application (SPA) desenvolvida com Vite para gerenciamento tático de operações do CBMAM.

## Stack Tecnológica

### Frontend

- **React 19**: Biblioteca UI component-based
- **Vite 6**: Build tool e dev server
- **Lucide React**: Iconografia consistente
- **CSS Modules**: Estilização modular

### Qualidade de Código

- **TypeScript**: Verificação estática de tipos (modo checkJs para .js)
- **ESLint**: Linting com regras React e React Hooks
- **Prettier**: Formatação consistente de código
- **Husky + lint-staged**: Hooks Git pré-commit

### Testes

- **Vitest**: Framework de testes moderno
- **Testing Library**: Testes centrados no usuário
- **jsdom**: Ambiente DOM simulado
- **Coverage v8**: Métricas de cobertura de código

### CI/CD

- **GitHub Actions**: Pipeline automatizado
- **CodeQL**: Análise estática de segurança
- **Dependabot**: Atualização automática de dependências
- **Vercel**: Deploy contínuo

## Estrutura de Diretórios

```
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── AeronavesModal.jsx
│   │   ├── EfetivoCrudModal.jsx
│   │   ├── EfetivoGestaoPanel.jsx
│   │   ├── EfetivoModal.jsx
│   │   ├── Header.jsx
│   │   ├── MunicipalityDrawer.jsx
│   │   ├── OperationalMap.jsx
│   │   ├── RelatorioOficialModal.jsx
│   │   ├── TacticalSidebar.jsx
│   │   ├── TokenEditModal.jsx
│   │   └── TokenSvg.jsx
│   ├── data/            # Dados estáticos e configurações
│   │   ├── operacaoAmazonasData.js
│   │   └── tacticalAssets.js
│   ├── services/        # Lógica de negócio
│   │   └── efetivoDatabase.js
│   ├── test/            # Suíte de testes
│   │   ├── setup.js
│   │   ├── App.test.jsx
│   │   └── components/
│   ├── utils/           # Funções utilitárias (planejado)
│   ├── App.jsx          # Componente raiz
│   ├── main.jsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── api/                 # Endpoints server-side
│   └── claude.js
├── .github/             # Configuração GitHub
│   ├── workflows/       # Pipelines CI/CD
│   ├── ISSUE_TEMPLATE/  # Templates de issues
│   ├── CODEOWNERS       # Responsáveis por código
│   └── PULL_REQUEST_TEMPLATE.md
├── public/              # Assets estáticos
└── docs/                # Documentação adicional (planejado)
```

## Padrões de Design

### Componentes

- **Atomic Design**: Componentes organizados por complexidade
- **Props drilling mínimo**: Context API quando necessário
- **Custom Hooks**: Lógica reutilizável extraída de componentes

### Estado

- **localStorage**: Persistência de missões no cliente
- **Estado local**: useState para estado de UI
- **Sem biblioteca global**: Estado gerenciado via props e context

### Estilização

- **CSS Modules**: Escopo local de estilos
- **Variáveis CSS**: Tokens de design centralizados
- **Responsividade**: Mobile-first approach

## Integrações Externas

### Claude API

- Endpoint: `POST /api/claude`
- Autenticação: Bearer token via CLAUDE_PROXY_TOKEN
- Uso: Assistência inteligente em operações táticas
- Segurança: Server-side only, sem exposição no frontend

### Deploy

- **Plataforma**: Vercel
- **Build**: Otimizado com Vite
- **Cache**: Automático por hash de arquivo

## Performance

### Otimizações

- **Code splitting**: Automático via Vite
- **Lazy loading**: Componentes carregados sob demanda
- **Tree shaking**: Remoção de código não utilizado
- **Minificação**: Produção otimizada

### Métricas Alvo

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle size**: < 250KB gzipped

## Segurança

### Práticas Implementadas

- Variáveis de ambiente para segredos
- HTTPS forçado em produção
- CSP headers configurados
- Dependências monitoradas por Dependabot
- CodeQL para análise estática

### Vulnerabilidades Conhecidas

- Nenhuma vulnerabilidade crítica conhecida
- Auditoria regular via `npm audit`
- Reporte responsável via SECURITY.md

## Roadmap Técnico

### Curto Prazo (v1.1)

- [ ] Migração completa para TypeScript
- [ ] Testes E2E com Playwright
- [ ] Modo offline com Service Workers
- [ ] Exportação para PDF

### Médio Prazo (v2.0)

- [ ] Backend Node.js para persistência
- [ ] Autenticação de usuários
- [ ] WebSocket para atualizações em tempo real
- [ ] PWA completo

### Longo Prazo (v3.0)

- [ ] Multiplayer colaborativo
- [ ] IA preditiva para alocação de recursos
- [ ] Integração com sistemas externos (APIs governamentais)
- [ ] Dashboard analytics avançado
