# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-03

### Adicionado

- Sistema completo de mapa operacional com 62 municípios do Amazonas
- Interface tática fiel ao quadro físico da sala de situação CBMAM
- Drag & Drop para ativos operacionais (viaturas, aeronaves, efetivo)
- Exportação de cenários em PNG de alta resolução
- Salvar/carregar missões via localStorage e arquivos JSON
- Integração com Claude API para assistência inteligente
- Pipeline CI/CD completo com GitHub Actions
- Testes automatizados com Vitest e Testing Library
- Configuração de linting e formatação com ESLint + Prettier
- Husky + lint-staged para verificação pré-commit
- Documentação completa de API e contribuição
- Templates de issues para bugs, features e documentação
- CodeQL para análise estática de segurança
- Dependabot para atualização automática de dependências

### Segurança

- Endpoint server-side protegido com token de proxy
- Variáveis de ambiente para credenciais sensíveis
- Política de segurança documentada (SECURITY.md)
- Revisão de código obrigatória via PRs

### Performance

- Build otimizado com Vite
- Carregamento sob demanda de geometrias municipais
- Renderização eficiente com React 19

## Versões Anteriores

Consulte o histórico de commits no GitHub para detalhes de versões de desenvolvimento.
