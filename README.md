# 🚒 Sistema de Comando e Controle - Mapa Operacional do Amazonas (CBMAM)

Aplicação web moderna desenvolvida em **React + Vite** para planejamento e acompanhamento tático das operações do **Corpo de Bombeiros Militar do Amazonas (CBMAM)** e do **Comando de Bombeiros do Interior (CBI)**.

Reproduz fielmente o quadro operacional físico da sala de situação, permitindo alocar e redistribuir viaturas, aeronaves e efetivo militar sobre os 62 municípios do Amazonas.

---

## 🌟 Principais Recursos

- **Geometria Oficial dos 62 Municípios**: Malha territorial com limites e nomes oficiais do IBGE com acentuação e coordenadas precisas.
- **Visual Tático Fiel ao Quadro Real**:
  - Fundo tecnológico de Sala de Situação / CICC com malha de circuitos.
  - Bloco 3D inferior isométrico simulando o relevo do quadro físico.
  - Cores temáticas harmoniosas por município.
  - Linhas indicadoras (*callouts*) para municípios densos da calha do Rio Amazonas e Região Metropolitana.
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

## 🌐 Como Publicar na Vercel e Compartilhar o Link

### Opção 1: Direto pelo Terminal (Mais Rápido - 1 Minuto)

1. No terminal desta pasta, execute:
   ```bash
   npx vercel
   ```
2. Faça login com sua conta (GitHub, Google ou e-mail) se for a primeira vez.
3. Confirme as opções padrão apertando `Enter`:
   - *Set up and deploy?* **Y**
   - *Which scope?* (seu usuário)
   - *Link to existing project?* **N**
   - *Project name?* `mapa-operacional-amazonas`
   - *In which directory?* `./`
4. Em instantes, a Vercel gerará o link oficial para você enviar para qualquer pessoa:
   ```
   https://mapa-operacional-amazonas.vercel.app
   ```

### Opção 2: Pelo GitHub

1. Suba este projeto para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Selecione o repositório e clique em **Deploy**.
4. O link gerado funcionará em qualquer computador, tablet ou smartphone com atualização automática!
