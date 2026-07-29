# Gerador de Currículo PDF - Serverless

Este é um projeto simples e eficiente para gerar currículos profissionais em PDF diretamente no navegador, sem necessidade de servidores ou backend. Ideal para hospedagem gratuita no GitHub Pages.

## 🚀 Funcionalidades

- **100% Client-side:** Funciona apenas com HTML, CSS e JS.
- **Geração de PDF:** Utiliza a biblioteca `html2pdf.js` para baixar o currículo formatado.
- **Ajuste automático de formalidade:** substitui algumas palavras informais por sinônimos mais formais no texto de Objetivo e nas descrições de Experiência (veja a lista completa mais abaixo — não é IA, é uma troca de palavras pré-definida).
- **Templates:** Sistema flexível para carregar modelos de currículos (atualmente 3: Clássico, Moderno e Acadêmico).

## 📦 Como rodar o projeto

### Opção 1: Testando no seu computador (Local)
⚠️ **Atenção:** Devido a políticas de segurança dos navegadores (CORS), o site **não funcionará** se você apenas clicar duas vezes no `index.html` (protocolo `file://`).

Você precisa usar um servidor local. Duas formas simples:
1. Se usar VS Code, instale a extensão **Live Server**, clique com o botão direito no `index.html` e escolha "Open with Live Server".
2. Ou, com Python instalado, rode `python3 -m http.server 8080` dentro da pasta do projeto e acesse `http://localhost:8080` no navegador.

### Opção 2: Hospedando no GitHub Pages (Recomendado)

1. Crie um novo repositório no GitHub.
2. Faça o upload dos arquivos mantendo a estrutura de pastas.
3. No repositório, vá em **Settings** > **Pages**.
4. Em "Build and deployment", selecione a "Branch" como `main` (ou `master`) e a pasta `/ (root)`.
5. Clique em **Save**.
6. Aguarde alguns instantes e acesse o link fornecido pelo GitHub.

## 🧑‍💻 Como usar o formulário

A página é um formulário único, dividido em seções. Preencha na ordem e clique em **"Gerar Currículo PDF"** no final — o download começa automaticamente.

1. **Dados Pessoais:** Nome completo, e-mail, telefone/WhatsApp, LinkedIn (opcional — se deixar em branco, simplesmente não aparece no currículo) e Cidade - UF.
2. **Objetivo Profissional:** uma frase ou parágrafo curto sobre o que você busca. Esse texto passa pelo ajuste automático de formalidade antes de ir pro PDF.
3. **Experiência Profissional:** Cargo, Empresa, datas de Início e Fim (use `Atual` no campo Fim se ainda estiver no emprego) e uma descrição das atividades. Clique em **"+ Adicionar Experiência"** para incluir quantos empregos anteriores forem necessários; cada bloco adicionado tem um botão **"Remover"** caso você adicione um a mais por engano.
4. **Formação Acadêmica:** mesma lógica — Curso, Instituição e mês/ano de Conclusão. Use **"+ Adicionar Formação"** para múltiplos cursos/graduações.
5. **Habilidades e Idiomas:** um campo de texto livre (ex: "Inglês Avançado, Excel Intermediário, Liderança").
6. **Escolha o Modelo:** selecione entre os 3 modelos disponíveis antes de gerar. Você pode gerar o PDF mais de uma vez com modelos diferentes sem perder o que já preencheu — a troca de modelo não limpa o formulário.

Todos os campos marcados como obrigatórios no formulário (a maioria) precisam estar preenchidos, ou o navegador vai bloquear o envio e mostrar onde falta completar.

### O que o "ajuste automático de formalidade" faz, de verdade

É uma lista fixa de 5 substituições de palavras, aplicada no texto de Objetivo e nas descrições de Experiência:

| Se você escrever... | Vira... |
|---|---|
| fiz | realizei |
| ajudei | colaborei com |
| vendi | atuei em vendas de |
| cuidei | gerenciei |
| trabalhei com | atuei com foco em |

Além disso, a primeira letra do texto é maiuscula e, se não houver ponto final, ele é adicionado automaticamente. Não é nenhum tipo de IA ou reescrita inteligente — é só isso. Se seu texto não usar nenhuma dessas 5 palavras, ele sai exatamente como você digitou (só com a formatação de maiúscula/pontuação).

## 🎨 Como adicionar novos modelos (Templates)

1. Crie um novo arquivo HTML na pasta `templates/` (ex: `modelo4.html`).
2. Copie a estrutura completa de um modelo existente que funcione (`modelo1.html` ou `modelo3.html` são bons pontos de partida — são mais simples que o `modelo2.html`, que usa duas colunas).
3. Altere o CSS dentro da tag `<style>` desse novo arquivo para mudar o visual.
4. Mantenha **todas** as tags de substituição usadas pelo `js/script.js`: `{{NOME}}`, `{{EMAIL}}`, `{{TELEFONE}}`, `{{LINKEDIN}}`, `{{CIDADE}}`, `{{OBJETIVO}}`, `{{HABILIDADES}}`, `{{EXPERIENCIAS}}` e `{{FORMACAO}}`. Se alguma faltar, aquela seção simplesmente não aparece no PDF — não dá erro visível.
5. Cada tag pode aparecer mais de uma vez no mesmo template (por exemplo, repetir `{{NOME}}` no topo e no rodapé) sem problema — a substituição é global.
6. No arquivo `index.html`, adicione uma nova opção no `<select id="modeloSelect">`:
   ```html
   <option value="templates/modelo4.html">Modelo Criativo</option>
   ```

> **Nota:** o `modelo2.html` (Moderno/TI, layout de duas colunas) foi corrigido — a versão anterior estava com o HTML incompleto e gerava um PDF em branco quando selecionado. Se você tiver uma cópia antiga do projeto, substitua esse arquivo.