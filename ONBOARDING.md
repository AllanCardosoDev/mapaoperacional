# Guia de Onboarding para Novos Desenvolvedores

## Bem-vindo ao Projeto! 🚒

Este guia vai ajudar você a configurar o ambiente e entender o projeto rapidamente.

## Configuração Rápida (5 minutos)

### 1. Pré-requisitos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Git** instalado
- Editor de código recomendado: **VS Code**

Verifique as versões:

```bash
node --version
npm --version
git --version
```

### 2. Clone o Repositório

```bash
git clone https://github.com/Allan2fish/mapa-operacional-amazonas.git
cd mapa-operacional-amazonas
```

### 3. Instale Dependências

```bash
npm install
```

### 4. Configure Variáveis de Ambiente

```bash
# Copie o exemplo
cp .env.example .env.local

# Edite com suas credenciais
# CLAUDE_API_BASE_URL=https://iron-cody-api.fly.dev/v1
# CLAUDE_API_KEY=sua-chave-aqui
# CLAUDE_MODEL=claude-3-opus-20240229
# CLAUDE_PROXY_TOKEN=token-gerado
```

### 5. Execute em Modo Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:3000`

## Extensões VS Code Recomendadas

Instale estas extensões para melhor produtividade:

- **ESLint**: Validação de código em tempo real
- **Prettier**: Formatação automática
- **EditorConfig**: Respeita configurações do projeto
- **JavaScript and TypeScript Nightly**: IntelliSense melhorado
- **GitLens**: Visualização de histórico de commits
- **Thunder Client**: Teste de APIs integrado

## Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── data/           # Dados estáticos (municípios, ativos táticos)
├── services/       # Lógica de negócio (banco de efetivo)
├── test/           # Testes automatizados
├── App.jsx         # Componente principal
└── main.jsx        # Ponto de entrada
```

## Comandos Essenciais

| Comando            | Descrição                          |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Inicia servidor de desenvolvimento |
| `npm run build`    | Gera build de produção             |
| `npm run lint`     | Verifica erros de linting          |
| `npm run format`   | Formata código automaticamente     |
| `npm test`         | Executa testes em modo watch       |
| `npm run test:run` | Executa todos os testes uma vez    |

## Fluxo de Trabalho Git

1. Crie um branch da feature:

   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Faça commits frequentes com mensagens claras:

   ```bash
   git add .
   git commit -m "feat: adicionar filtro por município"
   ```

3. Push e abra um Pull Request:
   ```bash
   git push origin feature/nome-da-feature
   ```

## Padrões de Código

- Use **funções arrow** para componentes
- Nomeie componentes em **PascalCase**
- Nomeie arquivos em **PascalCase.jsx**
- Siga o padrão **Conventional Commits** para mensagens de commit
- Execute `npm run lint && npm run test:run` antes de cada PR

## Recursos de Aprendizado

- [Documentação React](https://react.dev/)
- [Documentação Vite](https://vitejs.dev/)
- [Guia de Contribuição](CONTRIBUTING.md)
- [Arquitetura do Sistema](ARCHITECTURE.md)
- [API Documentation](API.md)

## Dúvidas Comuns

### Como adicionar um novo componente?

1. Crie o arquivo em `src/components/NomeComponente.jsx`
2. Exporte como função arrow
3. Importe no componente pai
4. Adicione testes em `src/test/components/`

### Como testar uma mudança?

```bash
# Modo watch durante desenvolvimento
npm test

# Ou execute todos os testes
npm run test:run
```

### O build falhou, o que fazer?

1. Verifique se há erros de linting: `npm run lint`
2. Execute os testes: `npm run test:run`
3. Limpe o cache: `rm -rf node_modules dist && npm install`

## Próximos Passos

1. Leia o [ROADMAP.md](ROADMAP.md) para entender o futuro do projeto
2. Explore as issues abertas para encontrar tarefas
3. Particiipe das revisões de código para aprender padrões do projeto

---

**Precisa de ajuda?** Abra uma issue ou entre em contato com os mantenedores.
