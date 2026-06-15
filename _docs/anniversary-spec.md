# Especificação — Homenagem de 2 Anos de Namoro 💛

> Documento de planejamento interno. Fica em `_docs/`, que **não** é publicado pelo
> Jekyll (pastas iniciadas com `_` são ignoradas no build). Serve de base para a
> construção da página depois.

---

## 1. Visão geral

Uma página web interativa, dentro do site pessoal já existente
(`arturmagalhaes.com`), feita como presente de **2 anos de namoro**. A namorada
acessa um link, e vai **abrindo "cartas" (envelopes)** que revelam, uma a uma, as
memórias de momentos marcantes do casal. Cada carta só desbloqueia depois que a
anterior é aberta — criando uma pequena jornada cronológica que termina em uma
**mensagem-surpresa final**.

**Tom:** íntimo, romântico, lúdico. **Idioma:** português (PT-BR), exclusivamente.

### Decisões já tomadas
- **Metáfora de interação:** cartas/envelopes que abrem (efeito *flip*/desdobrar).
- **Desbloqueio:** sequencial — abrir uma carta acende/libera a próxima.
- **Idioma:** somente português.
- **Final:** sim — após as 4 cartas, desbloqueia uma 5ª seção secreta com uma
  declaração + animação especial (corações/confete) + contador de tempo juntos.

---

## 2. Onde fica (rota, arquivo, stack)

- **Rota / URL:** `arturmagalhaes.com/nos` *(sugestão — alternativas: `/dois-anos`,
  `/nosso-amor`, `/aniversario`; ver §13, Decisões pendentes)*.
- **Arquivo:** novo diretório na raiz do repositório, ex. `nos/index.html`.
  O Jekyll/GitHub Pages serve `nos/index.html` automaticamente em `/nos/`.
- **Padrão escolhido:** **HTML standalone full-screen** (como `life/` e `game/`),
  **sem** o cabeçalho/menu do site. Motivo: é uma experiência imersiva e privada;
  o menu do blog quebraria a imersão. (O `carnival/` usa o layout do site com
  `permalink`; **não** seguiremos esse modelo aqui.)
- **Stack:** HTML + CSS + JavaScript *vanilla*, tudo inline em um único
  `index.html`. Sem build, sem dependências externas obrigatórias. (Opcional: uma
  fonte do Google Fonts e uma micro-lib de confete via CDN — ver §8.)
- **Privacidade:** página **não-listada** — não entra no menu (`header_pages` do
  `_config.yml`) nem é linkada em lugar nenhum público. Só quem tem o link acessa.
  *(Observação honesta: "não-listada" ≠ "secreta". O conteúdo é público para quem
  souber a URL e fica no histórico do Git. Não colocar nada que não possa, em
  último caso, ser visto por terceiros.)*

---

## 3. Conceito da experiência

```
   [ Tela de abertura ]
            │  (clique em "Abrir")
            ▼
   ┌─────────────────────────────────────────────┐
   │  Trilha de 4 envelopes/cartas (cronológica)  │
   │                                               │
   │   ✉ 1  Como a gente se conheceu   [ABERTA]    │
   │   ✉ 2  Nosso primeiro encontro    [LIBERADA]  │ ← clicável agora
   │   ✉ 3  Nossa primeira viagem      [TRANCADA]  │
   │   ✉ 4  Nosso primeiro show        [TRANCADA]  │
   └─────────────────────────────────────────────┘
            │  (após abrir as 4)
            ▼
   ┌─────────────────────────────────────────────┐
   │   💛 Carta final secreta se revela           │
   │   declaração + confete + contador de dias    │
   └─────────────────────────────────────────────┘
```

- Cada **carta** tem dois lados: a **frente** (envelope fechado, com um título
  curto e ícone) e o **conteúdo** (foto + texto da memória), revelado com uma
  animação de virar/abrir.
- Cartas ainda **trancadas** aparecem com cadeado e visual apagado (cinza/baixa
  opacidade), e **não** são clicáveis.
- Ao abrir uma carta, a próxima ganha destaque (brilho/pulsação suave) sinalizando
  "clique aqui agora".

---

## 4. Fluxo do usuário (passo a passo)

1. **Abertura.** Tela inicial com um título carinhoso (ex. *"Pra você, com amor"* /
   *"2 anos da gente"*), talvez os nomes/iniciais e uma data, e um botão grande
   **"Abrir nossa história"**. Fundo suave com corações/partículas discretas.
2. **Trilha de cartas.** Aparecem as 4 cartas. Só a **1ª** está liberada; as demais,
   trancadas.
3. **Abrir carta.** Ela clica na carta liberada → animação de abertura → revela
   **foto + texto** daquela memória. A próxima carta destranca com destaque.
4. **Repetir** até a 4ª carta.
5. **Final secreto.** Quando a 4ª é aberta, surge (com transição especial) a **5ª
   seção**: mensagem de declaração + animação de corações/confete + **contador**
   ("Estamos juntos há X dias / Y meses").
6. **Reabrir.** Cartas já abertas continuam clicáveis para reler. Botão opcional
   **"Recomeçar"** para zerar o progresso (limpa o `localStorage`).

---

## 5. As 5 seções de conteúdo

Cada momento = uma carta. Conteúdo a ser preenchido pelo Artur (ver checklist §11).

| # | Carta | Ícone sugerido | Conteúdo |
|---|-------|----------------|----------|
| 1 | **Como a gente se conheceu** | ✨/👀 | 1 foto + texto curto (como/onde/quando se conheceram, primeira impressão) |
| 2 | **Nosso primeiro encontro** | ☕/🍽️ | 1 foto + texto (o lugar, o clima, um detalhe engraçado/marcante) |
| 3 | **Nossa primeira viagem** | ✈️/🧳 | 1 foto + texto (destino, o que rolou, melhor memória da viagem) |
| 4 | **Nosso primeiro show** | 🎵/🎤 | 1 foto + texto (qual artista/show, a música do casal, como foi) |
| 5 | **Mensagem final (secreta)** | 💛 | Declaração do Artur + contador de dias juntos + animação especial |

> **Sugestão de campos por carta** (estrutura de dados no JS):
> `{ id, titulo, data (ex. "Março de 2024"), foto, texto, icone }`.
> Manter os textos curtos (2–5 frases) para caber bem no mobile.

### Contador final
- Data de início do namoro: **`DD/MM/AAAA`** *(a definir — ver §13)*.
- Calcular dinamicamente em JS: dias totais (e, se quiser, "X anos e Y dias").
- Atualiza sozinho sempre que a página é aberta.

---

## 6. Mecânica de interação (estados das cartas)

Cada carta tem **3 estados visuais**, controlados por classes CSS:

| Estado | Visual | Interação |
|--------|--------|-----------|
| `locked` (trancada) | cinza, opacidade ~0.5, cadeado 🔒, sem sombra | não clicável (`pointer-events: none`) |
| `unlocked` (liberada) | colorida, brilho/pulsação suave, cursor pointer | clicável → abre |
| `opened` (aberta) | mostra foto + texto; marca de "lida" (✓ ou coração preenchido) | clicável de novo para reabrir/reler |

**Regra de progressão:** a carta `n+1` passa de `locked` → `unlocked` no momento em
que a carta `n` é aberta pela primeira vez. Quando a carta 4 abre, dispara a
revelação da seção final.

**Animação de abertura (envelope/flip):** sugestões (escolher 1 na construção):
- *Flip 3D*: `transform: rotateY(180deg)` com `transform-style: preserve-3d` (frente
  vira e mostra o verso com o conteúdo).
- *Envelope*: a "aba" do envelope abre (rotação no topo) e o cartão "sobe" pra fora.
- Em ambos: transição suave (~500–700ms), com `ease`, e um leve "pop"/escala.
- Respeitar `prefers-reduced-motion`: se ativo, trocar animações por *fade* simples.

---

## 7. Persistência de progresso (localStorage)

Para que ela possa **fechar e voltar** sem perder o desbloqueio:

- Salvar em `localStorage` (chave ex. `nos_progress`) o **índice da carta máxima
  aberta** (ou um array de ids abertos).
- Ao carregar a página, reidratar os estados a partir desse valor.
- Botão **"Recomeçar"** limpa a chave e volta tudo ao início.
- *Trade-off:* `localStorage` é por dispositivo/navegador. Se ela abrir no celular e
  depois no notebook, o progresso não migra. Para um presente, isso é aceitável
  (ela provavelmente fará tudo de uma vez, no celular). **Não** vamos montar backend.

---

## 8. Visual e estética

- **Paleta sugerida:** tons quentes e românticos — creme/off-white de fundo,
  dourado/âmbar (combina com o "👾 may the force" amarelo do site), rosa suave e um
  vinho/bordô para acentos. Definir 4–5 cores em CSS variables.
- **Tipografia:** uma *serif* elegante para títulos (ex. **Lora**, já usada no
  `carnival/`) + sans-serif do sistema para o corpo. Carregar via Google Fonts
  (`preconnect` + `link`), igual ao `carnival/`.
- **Fundo:** gradiente suave + partículas/corações flutuando discretamente (CSS ou
  canvas leve). Nada que canse a leitura.
- **Animações:**
  - Entrada das cartas: *fade + slide up* escalonado.
  - Destaque da carta liberada: *glow*/pulsação (`@keyframes`).
  - Final: explosão de **confete + corações**. Opções: CSS puro, ou a lib
    [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti) via CDN
    (~1 arquivo, sem build). Recomendado `canvas-confetti` pela qualidade.
- **Microcópia carinhosa** nos botões e títulos (ex. "Abrir nossa história",
  "Próxima lembrança 💛", "Recomeçar do início").

---

## 9. Responsividade e desempenho

- **Mobile-first.** É quase certo que ela vai abrir no **celular**. Layout das
  cartas em coluna única no mobile; pode virar grade 2×2 no desktop.
- Botões e áreas de clique grandes (≥44px).
- **Imagens:** otimizar antes de subir (largura ~1200px, comprimir, `.jpg`/`.webp`).
  Guardar em `files/images/nos/` (seguindo o padrão atual de `files/images/`).
  Usar `loading="lazy"` e definir `aspect-ratio` pra evitar "pulos" de layout.
- Testar em telas pequenas e checar contraste do texto sobre o fundo.

---

## 10. Acessibilidade

- `prefers-reduced-motion`: desligar animações pesadas (ver §6).
- `alt` descritivo em todas as fotos.
- Cartas clicáveis acessíveis por teclado (usar `<button>` ou `tabindex` + `role`).
- Contraste de texto adequado (WCAG AA).

---

## 11. Checklist de conteúdo a fornecer (Artur)

Para construir, vou precisar destes itens. Pode me mandar aos poucos.

- [ ] **Nome/apelido dela** (e como ela é chamada com carinho).
- [ ] **Data de início do namoro** (`DD/MM/AAAA`) — para o contador.
- [ ] **Carta 1 — Como se conheceram:** 1 foto + texto curto (+ mês/ano).
- [ ] **Carta 2 — Primeiro encontro:** 1 foto + texto (+ mês/ano).
- [ ] **Carta 3 — Primeira viagem:** 1 foto + texto (+ destino e mês/ano).
- [ ] **Carta 4 — Primeiro show:** 1 foto + texto (+ artista e mês/ano).
- [ ] **Mensagem final:** o texto da declaração que você quer que apareça no fim.
- [ ] (Opcional) **Música do casal** — dá pra embutir um player/spotify ou só citar.
- [ ] (Opcional) **Rota preferida** da URL (ver §13).

> As fotos podem ser commitadas no repo (`files/images/nos/`). Lembre que o repo é
> público — então só use fotos que você não se importa que fiquem acessíveis por URL.

---

## 12. Considerações técnicas de implementação

- Arquivo único `nos/index.html` com `<style>` e `<script>` inline (padrão do repo).
- Dados das cartas em um array JS no topo do script — fácil de editar.
- Sem front matter Jekyll (como `life/` e `game/`) para virar página standalone,
  **ou** com front matter mínimo se quisermos `permalink` limpo. Recomendo
  **standalone sem front matter** para evitar o layout do site.
- Confete via `canvas-confetti` (CDN) — opcional, mas recomendado.
- Fonte via Google Fonts (Lora).
- Sem coleta de dados, sem analytics nessa página.

---

## 13. Decisões pendentes (preciso da sua escolha)

1. **Nome da rota:** `/nos`, `/dois-anos`, `/nosso-amor`, `/aniversario`, ou outro?
   *(default sugerido: `/nos`)*
2. **Data de início do namoro** (para o contador).
3. **Nome/apelido dela** a exibir na abertura.
4. **Quer música** (player Spotify embutido / áudio) ou não?
5. **Animação de abertura:** *flip 3D* de cartão ou *abrir envelope*?
   *(default sugerido: envelope, mais temático com "cartas")*

---

## 14. Roadmap de construção (fases)

1. **Fase 0 — Conteúdo.** Artur preenche o checklist (§11) e as decisões (§13).
2. **Fase 1 — Esqueleto.** Criar `nos/index.html` com a estrutura, paleta, fontes e
   a tela de abertura. Dados *placeholder*.
3. **Fase 2 — Cartas + lógica de desbloqueio.** Estados locked/unlocked/opened,
   animação de abertura, progressão sequencial, `localStorage`.
4. **Fase 3 — Final.** Seção secreta, contador de dias, confete/corações.
5. **Fase 4 — Conteúdo real.** Inserir fotos e textos definitivos; otimizar imagens.
6. **Fase 5 — Polimento.** Responsivo, acessibilidade, `prefers-reduced-motion`,
   testes no celular. Commit + push na branch e revisão final.

---

*Próximo passo:* responder às **Decisões pendentes (§13)** e ir preenchendo o
**checklist de conteúdo (§11)**. Com isso, partimos para a Fase 1 da construção.
