# 🚒 Sistema de Comando e Controle - Mapa Operacional do Amazonas (CBMAM)

[![CI/CD](https://github.com/Allan2fish/mapa-operacional-amazonas/actions/workflows/ci.yml/badge.svg)](https://github.com/Allan2fish/mapa-operacional-amazonas/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Allan2fish/mapa-operacional-amazonas/actions/workflows/codeql.yml/badge.svg)](https://github.com/Allan2fish/mapa-operacional-amazonas/actions/workflows/codeql.yml)
[![Version](https://img.shields.io/github/v/tag/Allan2fish/mapa-operacional-amazonas?label=version&color=blue)](https://github.com/Allan2fish/mapa-operacional-amazonas/releases)
[![License](https://img.shields.io/github/license/Allan2fish/mapa-operacional-amazonas?color=green)](LICENSE)
[![React](https://img.shields.io/badge/react-19.0.0-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-6.4.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/Allan2fish/mapa-operacional-amazonas/actions)
[![Coverage](https://img.shields.io/badge/coverage-configured-yellow)](vitest.config.js)
[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)](Dockerfile)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Aplicação web moderna desenvolvida em **React + Vite** para planejamento e acompanhamento tático das operações do **Corpo de Bombeiros Militar do Amazonas (CBMAM)** e do **Comando de Bombeiros do Interior (CBI)**.

Reproduz fielmente o quadro operacional físico da sala de situação, permitindo alocar e redistribuir viaturas, aeronaves e efetivo militar sobre os 62 municípios do Amazonas.

---

## 🌟 Principais Recursos

- **Geometria Oficial dos 62 Municípios**: Malha territorial com limites e nomes oficiais do IBGE com acentuação e coordenadas precisas.
- **Visual Tático Fiel ao Quadro Real**:
  - Fundo tecnológico de Sala de Situação / CICC com malha de circuitos.
  - Bloco 3D inferior isométrico simulando o relevo do quadro físico.
  - Cores temáticas harmoniosas por município.
  - Linhas indicadoras (_callouts_) para municípios densos da calha do Rio Amazonas e Região Metropolitana.
- **Camada "Arco do Fogo"**: Seta tática destacando as operações no sul do estado (Boca do Acre, Lábrea, Humaitá, Manicoré, Apuí).
- **Ativos Operacionais Táticos (Drag & Drop e Clique)**:
  - 🛩️ **Air Tractor (AT-802F)**: Avião amarelo de combate a incêndio florestal.
  - 🚁 **Helicóptero Harpia**: Aeronave militar de asas rotativas para busca, resgate e aeromédico.
  - ✈️ **KC-390 Millennium**: Avião cargueiro militar pesado para apoio logístico.
  - 🚒 **Viatura ABT**: Auto Bomba Tanque pesado para combate a incêndio.
  - 🛻 **Viatura 4x4 Florestal**: Pick-up rápida para resposta a queimadas.
  - 🚑 **Unidade de Resgate (UR)**: Ambulância de socorro pré-hospitalar.
  - 🚤 **Lancha Fluvial (VRF)**: Embarcação de resposta rápida nos rios amazônicos.
  - 👨‍🚒 **Efetivo Militar**: Badges de bombeiro com contador numérico dinâmico (4, 7, 9, 14, etc.).
  - 🛡️ **Brasões Oficiais**: CBI CBMAM e 2ª CIBM.
- **Cenário Real em 1 Clique**: Botão **"Cenário Real (Foto)"** que carrega imediatamente a disposição tática exata vista nas fotos de referência.
- **Exportação em Alta Definição (PNG)**: Gera imagens em alta resolução prontas para impressão ou inclusão em relatórios e briefings.
- **Salvar / Carregar Missão**: Persistência automática no navegador (`localStorage`) e download/upload de arquivos `.json`.
- **Zoom & Pan Suave**: Navegação livre com a roda do mouse, arrasto do mapa e botões de controle.

---

## 🚀 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O sistema abrirá em `http://localhost:3000`.

---

## 🛠️ Desenvolvimento

### Comandos Úteis

```bash
# Verificar erros de linting
npm run lint

# Corrigir erros automaticamente
npm run lint:fix

# Formatar código (Prettier)
npm run format

# Verificar formatação sem alterar arquivos
npm run format:check

# Verificação de tipos TypeScript
npm run type-check
```

### Padrões de Código

O projeto utiliza **ESLint** e **Prettier** para garantir consistência:

- Hooks Git executam lint-staged automaticamente antes de cada commit
- EditorConfig disponível para configurar seu editor (.editorconfig)
- TypeScript para verificação estática de tipos (mesmo em arquivos .js)

### Testes

```bash
# Executar testes em modo watch
npm test

# Executar testes uma vez (CI)
npm run test:run

# Gerar relatório de cobertura
npm run test:coverage
```

### Docker

```bash
# Build da imagem
docker build -t mapa-operacional-amazonas .

# Executar container
docker run -p 8080:80 mapa-operacional-amazonas
```

---

## 🏗️ Arquitetura

```
src/
├── components/     # Componentes React reutilizáveis
├── data/           # Dados estáticos e configurações
├── services/       # Lógica de negócio e integrações
├── test/           # Testes unitários e de integração
├── utils/          # Funções utilitárias
├── App.jsx         # Componente raiz da aplicação
├── main.jsx        # Ponto de entrada
└── index.css       # Estilos globais
```

Para detalhes da API, consulte [API.md](API.md).

---

## 🔄 CI/CD

O projeto possui pipeline automatizado com GitHub Actions:

- **Lint & Test**: Verificação de qualidade de código em cada push/PR
- **Build**: Geração de artefatos otimizados
- **Security Audit**: Verificação de vulnerabilidades em dependências
- **CodeQL**: Análise estática de segurança
- **Deploy Preview**: Deploy automático para PRs
- **Deploy Production**: Deploy automático para main

Atualizações de dependências são gerenciadas pelo Dependabot.

---

## 🌐 Como Publicar na Vercel e Compartilhar o Link

### Opção 1: Direto pelo Terminal (Mais Rápido - 1 Minuto)

1. No terminal desta pasta, execute:
   ```bash
   npx vercel
   ```
2. Faça login com sua conta (GitHub, Google ou e-mail) se for a primeira vez.
3. Confirme as opções padrão apertando `Enter`:
   - _Set up and deploy?_ **Y**
   - _Which scope?_ (seu usuário)
   - _Link to existing project?_ **N**
   - _Project name?_ `mapa-operacional-amazonas`
   - _In which directory?_ `./`
4. Em instantes, a Vercel gerará o link oficial para você enviar para qualquer pessoa:
   ```
   https://mapa-operacional-amazonas.vercel.app
   ```

### Opção 2: Pelo GitHub

1. Suba este projeto para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Selecione o repositório e clique em **Deploy**.
4. O link gerado funcionará em qualquer computador, tablet ou smartphone com atualização automática!

## Configuração da API do Claude

A aplicação disponibiliza o endpoint server-side `POST /api/claude`, que encaminha mensagens no protocolo Anthropic Messages. A chave do gateway fica apenas no servidor; não use variáveis com prefixo `VITE_` para segredos.

Configure estas variáveis no ambiente local e na Vercel:

| Variável              | Valor                                                                       |
| --------------------- | --------------------------------------------------------------------------- |
| `CLAUDE_API_BASE_URL` | URL base do gateway, por exemplo `https://iron-cody-api.fly.dev/v1`         |
| `CLAUDE_API_KEY`      | Chave do gateway, configurada somente como variável secreta                 |
| `CLAUDE_MODEL`        | ID de um modelo Claude aceito pelo gateway                                  |
| `CLAUDE_PROXY_TOKEN`  | Segredo aleatório separado, exigido para autorizar chamadas a este endpoint |

Para desenvolvimento local no Windows, copie `.env.example` para `.env.local`, preencha os valores (não compartilhe nem versione `.env.local`) e execute `npx vercel dev`. Gere um valor aleatório para `CLAUDE_PROXY_TOKEN`, por exemplo com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Na Vercel, adicione as mesmas variáveis em **Project Settings → Environment Variables** e faça um novo deploy.

O endpoint aceita um JSON com `messages` (mensagens de texto `user`/`assistant`), além de `system` e `max_tokens` opcionais. A chamada também precisa do header `Authorization: Bearer <CLAUDE_PROXY_TOKEN>`. Esse token é para chamadas server-to-server; não o inclua no código do navegador. Como a aplicação ainda não possui autenticação de usuários, mantenha o endpoint restrito a um backend confiável.

**Segurança:** a chave compartilhada na conversa deve ser revogada/rotacionada antes de configurar `CLAUDE_API_KEY`. Nunca coloque a chave ou o token de proxy em código-fonte, commits ou no bundle do frontend.

---

## 📋 Documentação Adicional

- [API Documentation](API.md) - Documentação da integração com Claude API
- [Contributing Guide](CONTRIBUTING.md) - Como contribuir com o projeto
- [Security Policy](SECURITY.md) - Política de segurança e reporte de vulnerabilidades
- [Changelog](CHANGELOG.md) - Histórico de versões e mudanças

---

## 📊 Status do Projeto

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Last Commit](https://img.shields.io/github/last-commit/Allan2fish/mapa-operacional-amazonas)
![Issues](https://img.shields.io/github/issues/Allan2fish/mapa-operacional-amazonas)
![PRs](https://img.shields.io/github/issues-pr-closed/Allan2fish/mapa-operacional-amazonas)

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ para o Corpo de Bombeiros Militar do Amazonas
