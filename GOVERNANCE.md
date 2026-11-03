# Governança do Projeto

## Papéis e Responsabilidades

### Maintainer (Mantenedor)

- **Responsável**: @Allan2fish
- **Atribuições**:
- Aprovar e mergear PRs
- Gerenciar roadmap e prioridades
- Configurar CI/CD e infraestrutura
- Responder issues e revisar código
- Publicar releases

### Contributor (Contribuidor)

- Desenvolver features e corrigir bugs
- Escrever e manter testes
- Documentar mudanças
- Participar de code reviews

### Reviewer (Revisor)

- Revisar PRs atribuídos
- Validar qualidade de código e testes
- Sugerir melhorias de arquitetura

## Processo de Decisão

### Mudanças Menores

- **Quem**: Qualquer contributor
- **Como**: PR com descrição clara
- **Aprovação**: 1 maintainer

### Mudanças Significativas

- **Quem**: Maintainers + Contributors seniores
- **Como**: RFC (Request for Comments) via issue
- **Aprovação**: Consenso entre maintainers
- **Prazo para feedback**: 5 dias úteis

### Mudanças Críticas (Breaking Changes)

- **Quem**: Todos os stakeholders
- **Como**: Design document + discussão em issue
- **Aprovação**: Unanimidade dos maintainers
- **Prazo para feedback**: 10 dias úteis

## Política de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(escopo opcional): <descrição curta>

[corpo opcional]

[rodapé opcional]
```

Tipos:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação (sem mudança lógica)
- `refactor`: Refatoração (sem nova feature ou bug fix)
- `test`: Adição ou correção de testes
- `chore`: Manutenção, dependências, CI/CD

Exemplos:

```
feat(municipios): adicionar filtro por região macro
fix(api): corrigir timeout em requisições Claude
docs(readme): atualizar seção de deploy
```

## Política de Branches

- **main**: Código em produção, sempre estável
- **develop**: Branch de integração de features
- **feature/nome**: Novas funcionalidades
- **hotfix/nome**: Correções urgentes em produção
- **release/vX.Y.Z**: Preparação de release

Nomenclatura:

- Usar kebab-case
- Prefixar com tipo: `feature/`, `hotfix/`, `release/`
- Nome descritivo: `feature/adicionar-filtro-municipios`

## Code Review

### Checklist do Revisor

- [ ] Código segue padrões do projeto
- [ ] Testes cobrem novas funcionalidades
- [ ] Documentação atualizada
- [ ] Sem vulnerabilidades de segurança
- [ ] Performance aceitável
- [ ] Nomes claros e expressivos
- [ ] Sem duplicação desnecessária

### Tempo de Resposta

- **PRs prioritários**: 24 horas
- **PRs normais**: 48 horas
- **PRs de dependabot**: 72 horas

## Gestão de Issues

### Triagem

- Label apropriada aplicada em até 48h
- Prioridade definida (P0-P3)
- Assignee definido se aplicável

### Prioridades

- **P0 - Crítica**: Resolver em 24h (ex: app não carrega)
- **P1 - Alta**: Resolver em 1 semana (ex: feature principal quebrada)
- **P2 - Média**: Resolver em 2 semanas (ex: feature secundária com problema)
- **P3 - Baixa**: Resolver quando possível (ex: melhorias cosméticas)

### Fechamento de Issues

- Issue resolvida deve ter teste correspondente
- Documentação atualizada se necessário
- Changelog atualizado se for bug fix ou feature

## Segurança

### Acesso

- **Maintainers**: Acesso total ao repositório
- **Contributors**: Acesso via fork e PR
- **Colaboradores externos**: Requer aprovação de maintainer

### Segredos

- Nunca commitar credenciais, tokens ou chaves API
- Usar variáveis de ambiente para dados sensíveis
- Rotacionar segredos a cada 90 dias
- Usar GitHub Secrets para CI/CD

### Auditoria

- Revisar logs de acesso mensalmente
- Auditar dependências trimestralmente
- Verificar configurações de permissão semestralmente

## Comunicação

### Canais Oficiais

- **Issues**: Bugs e feature requests
- **Pull Requests**: Discussão de código
- **Discussions** (futuro): Perguntas gerais
- **E-mail**: Assuntos sensíveis (seguranca@cbmam.am.gov.br)

### Reuniões

- **Sprint Planning**: Quinzenal (planejado)
- **Review**: Ao final de cada sprint
- **Retrospectiva**: Mensal

## Métricas de Sucesso

### Qualidade de Código

- Coverage mínimo: 70%
- Zero vulnerabilidades críticas
- Build passando em todos os PRs
- Linting limpo

### Produtividade

- Tempo médio de review: < 48h
- Tempo médio de merge: < 1 semana
- Issues abertas > 30 dias: < 10%

### Satisfação

- Contribuidores ativos crescendo
- PRs merged/rejected ratio > 80%
- Issues resolvidas no prazo > 90%
