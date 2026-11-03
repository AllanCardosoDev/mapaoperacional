# Processo de Release

## Versionamento Semântico

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Mudanças incompatíveis
- **MINOR** (1.0.0 → 1.1.0): Novas funcionalidades compatíveis
- **PATCH** (1.0.0 → 1.0.1): Correções de bugs

## Criando um Release

### Via Git Tag

```bash
# Atualizar CHANGELOG.md com novas mudanças
git add CHANGELOG.md
git commit -m "chore: update changelog for v1.1.0"

# Criar tag
git tag v1.1.0

# Push com tag
git push origin main --tags
```

O workflow de CI/CD automaticamente criará um GitHub Release com os artifacts do build.

### Checklist de Release

- [ ] Todos os testes passam (`npm run test:run`)
- [ ] Linting limpo (`npm run lint`)
- [ ] Build funciona (`npm run build`)
- [ ] CHANGELOG.md atualizado
- [ ] Versão no package.json atualizada
- [ ] Documentação revisada
- [ ] Nenhuma vulnerabilidade crítica (`npm audit`)

## Branches

- **main**: Código em produção, estável
- **develop**: Branch de desenvolvimento
- **feature/***: Novas funcionalidades
- **hotfix/***: Correções urgentes

## Distribuição

Após o release:

1. GitHub Release criado automaticamente
2. Deploy na Vercel (se configurado)
3. Docker image publicada (se configurado)
4. Notificação aos stakeholders
