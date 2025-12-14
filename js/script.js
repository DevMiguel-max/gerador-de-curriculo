// Otimizador de texto simples (Requisito: Otimização automática)
function otimizarTexto(texto) {
    if (!texto) return "";
    // Capitaliza a primeira letra
    let otimizado = texto.charAt(0).toUpperCase() + texto.slice(1);
    
    // Substituições simples para linguagem mais formal
    const substituicoes = {
        "fiz": "realizei",
        "ajudei": "colaborei com",
        "vendi": "atuei em vendas de",
        "cuidei": "gerenciei",
        "trabalhei com": "atuei com foco em"
    };

    // Aplica substituições (case insensitive básico)
    for (const [simples, formal] of Object.entries(substituicoes)) {
        const regex = new RegExp(`\\b${simples}\\b`, 'gi');
        otimizado = otimizado.replace(regex, formal);
    }

    // Garante ponto final se não houver pontuação
    if (!/[.!?]$/.test(otimizado)) {
        otimizado += ".";
    }

    return otimizado;
}

// Funções para adicionar campos dinâmicos
function adicionarExperiencia() {
    const container = document.getElementById('experiencias-container');
    const div = document.createElement('div');
    div.className = 'experiencia-item';
    div.innerHTML = `
        <hr style="margin: 15px 0; border: 0; border-top: 1px dashed #ccc;">
        <input type="text" class="cargo" placeholder="Cargo" required>
        <input type="text" class="empresa" placeholder="Empresa" required>
        <div class="dates" style="display:flex; gap:10px;">
            <input type="text" class="inicio" placeholder="Início (MM/AAAA)" required>
            <input type="text" class="fim" placeholder="Fim (MM/AAAA)" required>
        </div>
        <textarea class="descricao" placeholder="Principais atividades..." rows="3"></textarea>
        <button type="button" class="btn-secondary" onclick="this.parentElement.remove()" style="padding: 5px 10px; font-size: 0.8rem; background:#ffcccc;">Remover</button>
    `;
    container.appendChild(div);
}

function adicionarFormacao() {
    const container = document.getElementById('formacao-container');
    const div = document.createElement('div');
    div.className = 'formacao-item';
    div.innerHTML = `
        <hr style="margin: 15px 0; border: 0; border-top: 1px dashed #ccc;">
        <input type="text" class="curso" placeholder="Nome do Curso" required>
        <input type="text" class="instituicao" placeholder="Instituição" required>
        <input type="text" class="conclusao" placeholder="Conclusão (MM/AAAA)" required>
        <button type="button" class="btn-secondary" onclick="this.parentElement.remove()" style="padding: 5px 10px; font-size: 0.8rem; background:#ffcccc;">Remover</button>
    `;
    container.appendChild(div);
}

// Lógica principal de geração
document.getElementById('cvForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Gerando PDF...";
    btn.disabled = true;

    // 1. Coletar dados
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        linkedin: document.getElementById('linkedin').value,
        cidade: document.getElementById('cidade').value,
        objetivo: otimizarTexto(document.getElementById('objetivo').value),
        habilidades: document.getElementById('habilidades').value,
        experiencias: [],
        formacao: []
    };

    // Coletar experiências
    document.querySelectorAll('.experiencia-item').forEach(item => {
        dados.experiencias.push({
            cargo: item.querySelector('.cargo').value,
            empresa: item.querySelector('.empresa').value,
            inicio: item.querySelector('.inicio').value,
            fim: item.querySelector('.fim').value,
            descricao: otimizarTexto(item.querySelector('.descricao').value)
        });
    });

    // Coletar formação
    document.querySelectorAll('.formacao-item').forEach(item => {
        dados.formacao.push({
            curso: item.querySelector('.curso').value,
            instituicao: item.querySelector('.instituicao').value,
            conclusao: item.querySelector('.conclusao').value
        });
    });

    // 2. Carregar o template HTML
    const templatePath = document.getElementById('modeloSelect').value;
    
    try {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error("Erro ao carregar modelo");
        let htmlTemplate = await response.text();

        // 3. Injetar dados no HTML (Sistema de replace simples)
        htmlTemplate = htmlTemplate
            .replace('{{NOME}}', dados.nome)
            .replace('{{EMAIL}}', dados.email)
            .replace('{{TELEFONE}}', dados.telefone)
            .replace('{{LINKEDIN}}', dados.linkedin ? ` | ${dados.linkedin}` : '')
            .replace('{{CIDADE}}', dados.cidade)
            .replace('{{OBJETIVO}}', dados.objetivo)
            .replace('{{HABILIDADES}}', dados.habilidades);

        // Gerar HTML de Experiências
        let expHtml = '';
        dados.experiencias.forEach(exp => {
            expHtml += `
                <div class="job-item">
                    <div class="job-header">
                        <span class="job-role">${exp.cargo}</span>
                        <span class="job-date">${exp.inicio} - ${exp.fim}</span>
                    </div>
                    <div class="job-company">${exp.empresa}</div>
                    <div class="job-desc">${exp.descricao}</div>
                </div>
            `;
        });
        htmlTemplate = htmlTemplate.replace('{{EXPERIENCIAS}}', expHtml);

        // Gerar HTML de Formação
        let eduHtml = '';
        dados.formacao.forEach(edu => {
            eduHtml += `
                <div class="edu-item">
                    <div class="edu-course">${edu.curso}</div>
                    <div class="edu-school">${edu.instituicao} - Conclusão em: ${edu.conclusao}</div>
                </div>
            `;
        });
        htmlTemplate = htmlTemplate.replace('{{FORMACAO}}', eduHtml);

        // 4. Renderizar PDF
        const renderArea = document.getElementById('render-area');
        renderArea.innerHTML = htmlTemplate;

        const opt = {
            margin: [0, 0, 0, 0], // Margem controlada pelo CSS do template
            filename: `Curriculo_${dados.nome.split(' ')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Pequeno delay para garantir que estilos carregaram
        setTimeout(() => {
            html2pdf().set(opt).from(renderArea).save().then(() => {
                renderArea.innerHTML = ''; // Limpa
                btn.innerText = originalText;
                btn.disabled = false;
            });
        }, 1500);

    } catch (error) {
        console.error(error);
        alert("Erro ao gerar currículo. Se estiver testando localmente, use um Live Server.");
        btn.innerText = originalText;
        btn.disabled = false;
    }

});
