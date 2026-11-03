# Guia de Contribuição

## Padrões de Código

Este projeto utiliza **ESLint** e **Prettier** para garantir consistência. Antes de cada commit:

```bash
# Verificar erros de linting
npm run lint

# Formatar código
npm run format
```

Os hooks Git (Husky + lint-staged) executam essas verificações automaticamente.

## Estrutura do Projeto

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

## Testes

Execute os testes antes de abrir um PR:

```bash
# Executar todos os testes
npm run test:run

# Modo watch durante desenvolvimento
npm test
```

## Commits

Siga o padrão Conventional Commits:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` apenas documentação
- `style:` formatação, sem lógica
- `refactor:` refatoração sem mudança de comportamento
- `test:` adição ou correção de testes
- `chore:` manutenção, dependências

Exemplo: `feat: adicionar filtro por município no painel de efetivo`

## Pull Requests

1. Crie um branch a partir de `main`
2. Implemente suas mudanças
3. Execute `npm run lint && npm run test:run`
4. Abra o PR com descrição clara das mudanças
5. Aguarde revisão

## Configuração do Ambiente

Requisitos:

- Node.js >= 20
- npm >= 10

Instalação:

```bash
npm install
```

Opcional: instale a extensão EditorConfig no seu editor para aplicar as regras de formatação automaticamente.
