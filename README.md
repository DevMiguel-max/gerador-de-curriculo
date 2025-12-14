# Gerador de Currículo PDF - Serverless

Este é um projeto simples e eficiente para gerar currículos profissionais em PDF diretamente no navegador, sem necessidade de servidores ou backend. Ideal para hospedagem gratuita no GitHub Pages.

## 🚀 Funcionalidades

- **100% Client-side:** Funciona apenas com HTML, CSS e JS.
- **Geração de PDF:** Utiliza a biblioteca `html2pdf.js` para baixar o currículo formatado.
- **Otimização de Texto:** Pequena lógica para melhorar a formalidade das frases.
- **Templates:** Sistema flexível para carregar modelos de currículos.

## 📦 Como usar este projeto

### Opção 1: Testando no seu computador (Local)
⚠️ **Atenção:** Devido a políticas de segurança dos navegadores (CORS), o site **não funcionará** se você apenas clicar duas vezes no `index.html` (protocolo `file://`).

Você precisa usar um servidor local.
1. Se usar VS Code, instale a extensão **Live Server**.
2. Clique com o botão direito no `index.html` e escolha "Open with Live Server".

### Opção 2: Hospedando no GitHub Pages (Recomendado)

1. Crie um novo repositório no GitHub.
2. Faça o upload dos arquivos mantendo a estrutura de pastas.
3. No repositório, vá em **Settings** > **Pages**.
4. Em "Build and deployment", selecione a "Branch" como `main` (ou `master`) e a pasta `/ (root)`.
5. Clique em **Save**.
6. Aguarde alguns instantes e acesse o link fornecido pelo GitHub.

## 🎨 Como adicionar novos modelos (Templates)

1. Crie um novo arquivo HTML na pasta `templates/` (ex: `modelo2.html`).
2. Copie a estrutura do `modelo1.html`.
3. Altere o CSS dentro da tag `<style>` desse novo arquivo para mudar o visual.
4. Mantenha as tags de substituição (`{{NOME}}`, `{{EXPERIENCIAS}}`, etc.).
5. No arquivo `index.html`, adicione uma nova opção no `<select id="modeloSelect">`:
   ```html
   <option value="templates/modelo2.html">Modelo Criativo</option>