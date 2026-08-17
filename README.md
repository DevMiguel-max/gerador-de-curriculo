# Gerador Inteligente de Currículos

Aplicação web para criar currículos profissionais com ajuda de IA
(somente para conteúdo) e templates controlados pelo sistema (para
apresentação), exportando um PDF A4 real.

Status: **Fases 1 a 6 concluídas** (arquitetura, formulário, templates,
preview, IA, adaptação à vaga). Geração de PDF, segurança "de verdade",
privacidade, testes, UX/UI e deploy ainda não foram implementados — são
as Fases 7 a 12 (ver roteiro abaixo).

## Diagnóstico inicial

Não havia repositório prévio — este é um projeto novo, então as
respostas às 10 perguntas do briefing são:

1. **Stack atual**: nenhuma (projeto novo).
2. **Arquitetura atual**: nenhuma.
3. **O que já existe**: nada antes desta Fase 1.
4. **O que pode ser reaproveitado**: nada.
5. **O que precisa ser criado**: tudo — formulário, templates, provider de
   IA, geração de PDF, segurança, testes (Fases 2-12).
6. **Dependências necessárias**: ver `package.json` — lista enxuta,
   justificada abaixo.
7. **Estratégia de PDF**: `@react-pdf/renderer` (ver `lib/pdf/types.ts`).
8. **Estratégia de armazenamento local**: Zustand + `persist` em
   localStorage para os dados de texto; `idb-keyval` (IndexedDB) só para
   a foto, que como data URL pode facilmente estourar a cota do
   localStorage (~5-10MB).
9. **Estrutura de dados**: `ResumeData` com o padrão de 3 estados
   (`provided` / `not_available` / `not_provided`) — ver `types/resume.ts`.
10. **Divisão em fases**: exatamente as 12 fases do briefing original
    (roteiro completo abaixo).

## Princípio arquitetural

Conteúdo (IA) e apresentação (sistema) são completamente separados:

- A IA só enxerga e só devolve `AIEditableContent` (ver
  `types/resume.ts` e `schemas/resume.schema.ts`) — nunca `personalInfo`,
  nunca `settings`, nunca HTML/CSS.
- O JSON da IA é validado por `aiResumeContentSchema` antes de tocar o
  estado da aplicação. Se a validação falhar, o JSON é descartado.
- Templates (`templates/*`) consomem sempre o mesmo `ResumeData` —
  trocar de template nunca altera conteúdo.

## Decisões técnicas e por quê

| Decisão | Motivo |
|---|---|
| `@react-pdf/renderer` para o PDF | Gera PDF vetorial real (texto selecionável, links clicáveis, paginação A4 nativa) sem headless browser — evita os problemas de tamanho de pacote/cold start do Puppeteer em serverless na Vercel. Trade-off: o template de PDF é escrito com os componentes próprios do `@react-pdf/renderer` (não HTML/CSS), então ele e o preview em tela são duas implementações que devem compartilhar os mesmos tokens de design para não divergirem visualmente — ver comentário em `lib/pdf/types.ts`. |
| Zustand + `persist` (localStorage) | Mais simples que Context/reducer manual para o tamanho deste app; `persist` já resolve a recuperação de rascunho (seção 28) sem código extra. |
| `idb-keyval` só para a foto | Evita estourar a cota do localStorage com uma imagem em base64. |
| Zustand ligado direto aos campos (sem `react-hook-form` nas etapas) | Como o rascunho já precisa ficar 100% sincronizado com o localStorage a cada tecla (seção 28), ligar os inputs direto na store é mais simples do que manter dois estados (formulário local + store) sincronizados. `react-hook-form` + `@hookform/resolvers` continuam como dependência, reservados para a Fase 4 (tela de Revisão), onde faz sentido validar o documento inteiro de uma vez antes de liberar a geração do PDF. |
| Nenhum banco de dados, nenhuma autenticação | Conforme seções 71-72: fora do escopo do MVP. |

## Direção visual (skills de design)

Antes de qualquer decisão de UI, revisei três fontes:

- **`frontend-design`** (skill oficial da Anthropic, já disponível
  localmente em `/mnt/skills/public/frontend-design/`) — usada como base.
- **UI/UX Pro Max** (`nextlevelbuilder/ui-ux-pro-max-skill`) — é um
  CLI Node/Python com banco de dados local de estilos/paletas/tipografia,
  instalado via `npm install -g ui-ux-pro-max-cli`. Não consegui
  instalá-lo *de fato* neste ambiente porque o sandbox de execução desta
  conversa não tem acesso de rede (sem `npm install`, sem `npx`, sem
  `git clone`). Consultei a documentação do projeto via busca na web e
  apliquei manualmente sua tabela de prioridades (acessibilidade, alvos
  de toque ≥44px, performance, sistema de tokens por tipo de produto,
  responsividade mobile-first, tipografia/cor semânticas, animação
  150-300ms, formulários com validação inline, navegação previsível).
- **Impeccable** (`pbakaus/impeccable`) — mesma situação: CLI via `npx`,
  não instalável sem rede neste sandbox. Also consultei sua documentação:
  o ponto central é evitar os "tiques" genéricos de design gerado por IA
  (Inter em tudo, gradiente roxo-azul, cards dentro de cards, texto cinza
  sobre fundo colorido, ícone em quadrado arredondado acima de todo
  título) e definir um ponto de vista visual próprio antes de escrever
  código.

Os três convergem no mesmo princípio (evitar o "look" genérico de
IA, ser específico ao produto), então apliquei a síntese diretamente
nos tokens já configurados em `tailwind.config.ts` e `app/layout.tsx`:

- **Conceito**: o produto trata o currículo como um documento real que
  será impresso — não como mais um dashboard SaaS. Um "instrumento de
  precisão editorial", não um assistente de IA genérico.
- **Cor**: paleta fria e neutra (`#F5F6F8` fundo, `#14213A` tinta),
  com um único acento — um dourado de "selo aprovado" (`#B8862E`) — em
  vez do gradiente roxo-azul padrão.
- **Tipografia**: Fraunces (serifada, só em títulos, com moderação) +
  IBM Plex Sans no corpo (deliberadamente não-Inter) + IBM Plex Mono
  para metadados/labels — reforça a sensação de "instrumento técnico
  preciso" adequada a um documento que precisa ser ATS-parseável.
- Esses tokens são a base para as Fases 2-4 (formulário, templates,
  preview) — a própria Fase 1 não implementa telas de verdade, só a
  fundação.

**Se você quiser as ferramentas reais** (banco de dados pesquisável do
UI/UX Pro Max, comandos `/impeccable audit|polish|critique`), elas
precisam rodar num ambiente com acesso à internet — por exemplo, Claude
Code na sua máquina, onde dá para rodar `npm install -g ui-ux-pro-max-cli`
e `npx impeccable install` de verdade dentro deste repositório.

## Fase 2 — o que foi implementado

- `lib/store/resumeStore.ts`: única fonte de verdade (Zustand + `persist`
  em localStorage), com uma ação por operação do formulário — nada de
  mutação direta do estado pelos componentes.
- `components/ui/`: primitivos (TextField, TextArea, Select, Button,
  IconButton, AbsenceCheckbox, ChoiceCard, SectionCard) — todo o resto
  da Fase 2 é composição desses primitivos.
- `components/form/ListFieldSection.tsx`: componente genérico que
  implementa o padrão "checkbox de ausência + lista + botão adicionar"
  uma única vez, reaproveitado por cursos, certificações, habilidades,
  idiomas, projetos, voluntariado e prêmios.
- `components/form/steps/`: as 10 etapas de dados da seção 54 (Template,
  Revisão, IA e PDF ficam para as Fases 3-5 e 7). Voluntariado e prêmios
  (seções 15-16) não tinham etapa própria no fluxo de 14 passos —
  encaixei os dois como seções extras dentro da etapa "Projetos".
- `app/create/page.tsx`: hidrata a store, detecta rascunho salvo e
  oferece "Continuar" / "Começar novo" (seção 28) antes de mostrar o
  wizard.
- Upload de foto: redimensionado/comprimido no navegador
  (`lib/utils/image.ts`) antes de entrar no estado, para não estourar a
  cota do localStorage — validação completa (MIME/dimensões no
  servidor) continua sendo Fase 8.

## Fase 3 — o que foi implementado

- `components/templates/types.ts` + `components/templates/index.ts`:
  o "motor de templates" da seção 48 — um `Record<TemplateId, Componente>`
  só isso. Trocar de template é trocar a chave; o `ResumeData` recebido
  é sempre o mesmo, nenhum template pode alterar conteúdo.
- **Importante**: os 6 templates usam um sistema visual **separado** do
  da própria ferramenta (que usa os tokens `ink`/`accent`/Fraunces do
  `tailwind.config.ts`). Um currículo gerado não deveria parecer "feito
  nesta ferramenta" — cada template tem cor de acento, tipografia e
  layout próprios, adequados ao contexto profissional a que se propõe:
  - **Classic**: preto e branco, serifada, sem ícones — o ATS-friendly
    da seção 47.
  - **Modern**: sidebar azul com foto/contato/habilidades, corpo em
    duas colunas.
  - **Minimal**: coluna única, cinza e preto só, muito espaço em branco.
  - **Executive**: faixa azul-marinho no cabeçalho, acentos em bordô,
    nome em serifada grande.
  - **Tech**: acentos em verde, labels em monoespaçada estilo
    comentário de código (`// experiência`), habilidades como chips.
  - **FirstJob**: acento terracota, objetivo em destaque no topo,
    ordem prioriza formação/cursos/habilidades/projetos antes de
    experiência (seção 46).
- `lib/utils/date.ts`: formatação de datas em pt-BR compartilhada.
- `hasText` adicionado a `lib/utils/fieldState.ts` para campos de texto
  livre (resumo, objetivo) que não usam o padrão de 3 estados.
- Cada template é responsável por sua própria renderização condicional
  (seção 25) usando `hasValue`/`hasItems`/`hasText` — nenhuma seção
  vazia aparece.

## Fase 4 — o que foi implementado

- `app/preview/page.tsx`: renderiza o template selecionado a partir do
  `ResumeData` ao vivo (`components/preview/ResumePreview.tsx`), com
  `TemplateSwitcher` para trocar de template sem alterar conteúdo
  (seção 48) e um link para voltar e editar os dados (retoma o wizard
  na etapa em que a pessoa parou, já que `currentStep` fica persistido).
- A página A4 é renderizada em tamanho real e escalada via
  `components/preview/useScaleToFit.ts` para caber na largura
  disponível, mantendo a altura do contêiner sincronizada — ajuste fino
  de responsividade fica para a Fase 11.
- Botões "Otimizar com IA" e "Baixar PDF" já estão na tela, desabilitados
  com uma dica indicando em qual fase entram (5 e 7) — evita a sensação
  de tela incompleta sem prometer uma função que ainda não existe.
- Último passo do formulário agora leva para `/preview` em vez de ficar
  travado em "última etapa".

## Fase 5 — o que foi implementado

- `lib/ai/openAICompatibleProvider.ts`: implementação real do
  `AIProvider` (a interface da Fase 1 continua sendo o único ponto de
  acoplamento — nada mais no app importa isso diretamente). **Decisão
  assumida**: o `AI_BASE_URL` expõe um endpoint estilo OpenAI Chat
  Completions (`POST {AI_BASE_URL}/chat/completions`) — é o formato
  mais comum entre provedores (inclusive a API NVIDIA Integrate). Se o
  seu provedor for diferente, esta é a única classe que precisa mudar.
- Timeout de 30s via `AbortController`, e tratamento de erro específico
  por causa (`timeout` / `invalid_json` / `rate_limit` / `upstream_error`)
  — `lib/ai/errorResponse.ts` traduz isso em respostas HTTP que nunca
  vazam stack trace, prompt interno ou detalhes do provedor (seção 57).
- `schemas/resume.schema.ts` → `aiResumeContentSchema` valida toda
  resposta da IA antes de qualquer coisa tocar o estado da aplicação;
  se a validação falhar, o conteúdo é descartado e um erro amigável é
  devolvido.
- `app/api/generate-resume` e `app/api/optimize-resume` (antes stubs
  501) agora validam o corpo da requisição com `resumeDataSchema`,
  passam pelo rate limiter (ainda o stub sempre-permite da Fase 1 —
  vira de verdade na Fase 8) e chamam o provider.
- Store: `applyAIContent` aplica o resultado respeitando o padrão de 3
  estados — uma seção que o usuário marcou "não possuo" nunca é
  reaberta automaticamente só porque a IA devolveu um array vazio para
  ela (o que é o comportamento correto e esperado, já que a IA nunca
  deveria inventar itens ali).
- `components/preview/OptimizeWithAI.tsx`: o botão de IA na tela de
  preview funciona de ponta a ponta, com os estados de carregamento
  cíclicos da seção 56 e mensagem de erro sem detalhes internos.

## Fase 6 — o que foi implementado

- Decisão de arquitetura: em vez de criar uma 4ª rota, a adaptação à
  vaga foi embutida na mesma `POST /api/optimize-resume` — quando
  `resume.jobDescription` está preenchido, a rota dispara três chamadas
  à IA em paralelo (`optimizeResume`, `analyzeJob`, `suggestImprovements`)
  e devolve tudo junto. Fica mais simples para o cliente (um botão, uma
  chamada) e evita duplicar a lógica de validação/rate-limit/erro que
  já existe na rota.
- `jobAnalysis.keywords` (palavras-chave da vaga identificadas pela IA)
  aparece como chips no painel de resultado, só para leitura — não
  altera o currículo sozinho.
- `suggestions` (seção 35 — ex.: "Considere adicionar NR10 caso possua
  essa certificação") aparece numa lista separada, deixado claro que
  **não** foi aplicado automaticamente. O conteúdo que de fato é
  reescrito (`result.content`) continua passando pelo mesmo
  `aiResumeContentSchema` e pelo mesmo `applyAIContent` da Fase 5 — a
  regra "nunca inventar uma competência que a vaga pede mas o usuário
  não tem" já estava no prompt de sistema desde a Fase 1 (seção 36) e
  se aplica aqui também.
- Botão de IA no preview agora troca o rótulo para "Adaptar à vaga com
  IA" quando há descrição de vaga colada, e para "Otimizar com IA"
  caso contrário — mesma ação, comunicação mais precisa do que vai
  acontecer.

## Padrão de 3 estados

```ts
{ "linkedin": { "status": "provided", "value": "https://linkedin.com/in/exemplo" } }
{ "linkedin": { "status": "not_available", "value": null } }
{ "linkedin": { "status": "not_provided", "value": null } }
```

Templates nunca checam `.value`/`.items` diretamente — sempre via
`lib/utils/fieldState.ts` (`hasValue`, `hasItems`).

## Estrutura de pastas

```
app/            rotas (App Router) + páginas
components/     UI reutilizável (form, preview, templates de tela, ui base)
lib/ai/         abstração do provedor de IA + prompt de sistema
lib/pdf/        contrato do gerador de PDF
lib/security/   rate limiting
lib/utils/      helpers (padrão de 3 estados)
lib/validation/ re-export dos schemas Zod
schemas/        schemas Zod (espelham types/)
types/          modelo central ResumeData
templates/      templates de PDF (@react-pdf/renderer) — um por estilo
```

## Instalação e execução local

Este projeto foi montado num ambiente sem acesso à internet, então as
dependências ainda não foram instaladas. Localmente:

```bash
npm install
cp .env.example .env.local   # preencha AI_BASE_URL / AI_API_KEY / AI_MODEL quando chegar na Fase 5
npm run dev
```

`npm run typecheck` valida os tipos sem precisar do dev server.

## Roteiro de fases

1. ✅ Arquitetura — tipos, schemas, estrutura, tokens de design
2. ✅ Formulário progressivo (10 etapas de dados, checkboxes de ausência,
   fluxo de primeiro emprego, recuperação de rascunho) — falta ainda a
   etapa de seleção de template (Fase 3) e a de revisão (Fase 4)
3. ✅ Templates visuais (Classic, Modern, Minimal, Executive, Tech, FirstJob)
4. ✅ Preview + edição (troca de template, voltar para editar dados;
   botões de IA/PDF já na tela, desabilitados até as Fases 5 e 7)
5. ✅ Integração de IA (provider real, JSON + Zod, tratamento de erro,
   botão "Otimizar com IA" funcional na tela de preview)
6. ✅ Adaptação à vaga (análise de palavras-chave, sugestões não
   aplicadas automaticamente, tudo embutido na mesma rota/botão de IA)
5. Integração de IA (provider real + Zod + tratamento de erro)
6. Adaptação à vaga (palavras-chave, regras anti-invenção)
7. Geração de PDF (A4, paginação, `@react-pdf/renderer`)
8. Segurança (rate limiting, sanitização, upload de foto)
9. Privacidade (localStorage/IndexedDB, logs mínimos)
10. Testes (unitários, integração, casos extremos da seção 64)
11. UX/UI (responsividade, acessibilidade, refinamento visual)
12. Deploy (Vercel, documentação final)

## Limitações conhecidas (Fase 1)

- Nenhuma dependência foi instalada (sem rede neste sandbox) — rodar
  `npm install` antes de `npm run dev`.
- Não há UI real ainda além de uma página de smoke-test.
- `lib/ai`, `lib/pdf`, `lib/security` são interfaces/contratos —
  implementação entra nas Fases 5, 7 e 8.
