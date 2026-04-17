// ======================== CONFIGURAÇÕES ========================
let cpfRaw = "";
const displayInput = document.getElementById('display');
const msgParagraph = document.getElementById('msg');
const API_URL = 'https://api-academia-five.vercel.app'; 

const buttonsNumber = document.querySelectorAll('.n');
const btnClear = document.getElementById('btnLimpar');
const btnOk = document.getElementById('btnOk');

// ======================== MÁSCARA DE CPF ========================
function formatCPF(valueNumbers) {
    let v = valueNumbers.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    
    if (v.length <= 3) return v;
    if (v.length <= 6) return v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length <= 9) return v.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
}

function updateDisplay() {
    if (cpfRaw.length === 0) {
        displayInput.value = "";
        return;
    }
    displayInput.value = formatCPF(cpfRaw);
}

function resetMessageStyle() {
    msgParagraph.className = "";
}

// ======================== ADICIONAR NÚMERO ========================
function addNumber(num) {
    if (window.navigator?.vibrate) {
        window.navigator.vibrate(10);
    }
    
    if (cpfRaw.length < 11) {
        cpfRaw += num.toString();
        updateDisplay();
        resetMessageStyle();
        msgParagraph.innerText = "INSIRA SEU CPF";
    } else {
        msgParagraph.innerText = "⚠️ CPF COMPLETO";
        msgParagraph.className = "erro";
        setTimeout(() => {
            if (cpfRaw.length === 11) {
                msgParagraph.innerText = "INSIRA SEU CPF";
                resetMessageStyle();
            }
        }, 1200);
    }
}

// ======================== LIMPAR ========================
function limparTudo() {
    if (window.navigator?.vibrate) window.navigator.vibrate(8);
    cpfRaw = "";
    updateDisplay();
    resetMessageStyle();
    msgParagraph.innerText = "INSIRA SEU CPF";
    msgParagraph.classList.remove("sucesso", "erro");
}

// ======================== VALIDAÇÃO NA API ========================
async function validarCPF() {
    const cpfNumerico = cpfRaw.replace(/\D/g, "");
    
    if (cpfNumerico.length !== 11) {
        msgParagraph.innerText = "❌ CPF INCOMPLETO";
        msgParagraph.className = "erro";
        if (window.navigator?.vibrate) window.navigator.vibrate([50, 30, 50]);
        return;
    }
    
    msgParagraph.innerText = "⏳ VERIFICANDO...";
    msgParagraph.className = "";
    
    try {
        const response = await fetch(`${API_URL}/catraca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf: cpfNumerico })
        });

        const data = await response.json();
        console.log("RESPOSTA COMPLETA DA API:", data);
        console.log("STATUS DA RESPOSTA:", response.status);

        // VERIFICA SE É CPF NÃO CADASTRADO
        // Caso 1: Status 404
        if (response.status === 404) {
            msgParagraph.innerText = "❌ CPF NÃO CADASTRADO";
            msgParagraph.className = "erro";
            
            if (window.navigator?.vibrate) window.navigator.vibrate([80, 40, 80]);
            
            setTimeout(() => {
                limparTudo();
            }, 2500);
            return;
        }
        
        // Caso 2: Verifica mensagem de erro da API
        if (data.error) {
            const erroLower = data.error.toLowerCase();
            
            if (erroLower.includes("não encontrado") || 
                erroLower.includes("not found") ||
                erroLower.includes("inexistente") ||
                erroLower.includes("não cadastrado")) {
                
                msgParagraph.innerText = "❌ CPF NÃO CADASTRADO";
                msgParagraph.className = "erro";
                
                if (window.navigator?.vibrate) window.navigator.vibrate([80, 40, 80]);
                
                setTimeout(() => {
                    limparTudo();
                }, 2500);
                return;
            } else {
                // Outro tipo de erro
                msgParagraph.innerText = data.error;
                msgParagraph.className = "erro";
                
                if (window.navigator?.vibrate) window.navigator.vibrate([80, 40, 80]);
                
                setTimeout(() => {
                    limparTudo();
                }, 2500);
                return;
            }
        }

        const status = (data.status || "").toString().toUpperCase();

        // Caso 3: CPF ATIVO
        if (response.ok && status === "ATIVO") {
            msgParagraph.innerText = "✅ ACESSO LIBERADO";
            msgParagraph.className = "sucesso";

            if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100]);

            setTimeout(() => {
                limparTudo();
                msgParagraph.innerText = "✅ BEM-VINDO(A)";
                msgParagraph.className = "sucesso";

                setTimeout(() => {
                    msgParagraph.innerText = "INSIRA SEU CPF";
                    msgParagraph.className = "";
                }, 2000);
            }, 2800);
        } 
        // Caso 4: CPF INATIVO
        else if (status === "INATIVO") {
            msgParagraph.innerText = "⛔ CPF INATIVO - PROCURE A ADMINISTRAÇÃO";
            msgParagraph.className = "erro";
            
            if (window.navigator?.vibrate) window.navigator.vibrate([80, 40, 80]);
            
            setTimeout(() => {
                limparTudo();
            }, 2500);
        }
        // Caso 5: Qualquer outra resposta
        else {
            msgParagraph.innerText = "❌ CPF NÃO CADASTRADO";
            msgParagraph.className = "erro";

            if (window.navigator?.vibrate) window.navigator.vibrate([80, 40, 80]);

            setTimeout(() => {
                limparTudo();
            }, 2500);
        }

    } catch (error) {
        console.error("Erro na API:", error);
        msgParagraph.innerText = "🔌 ERRO DE CONEXÃO";
        msgParagraph.className = "erro";

        if (window.navigator?.vibrate) window.navigator.vibrate([100, 100, 100]);

        setTimeout(() => {
            msgParagraph.innerText = "INSIRA SEU CPF";
            msgParagraph.className = "";
        }, 3000);
    }
}

// ======================== EVENTOS ========================
buttonsNumber.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const num = btn.getAttribute('data-num');
        if (num !== null) {
            addNumber(num);
            btn.classList.add('button-tap');
            setTimeout(() => btn.classList.remove('button-tap'), 120);
        }
    });
});

if (btnClear) {
    btnClear.addEventListener('click', (e) => {
        e.preventDefault();
        limparTudo();
        btnClear.classList.add('button-tap');
        setTimeout(() => btnClear.classList.remove('button-tap'), 120);
    });
}

if (btnOk) {
    btnOk.addEventListener('click', (e) => {
        e.preventDefault();
        validarCPF();
        btnOk.classList.add('button-tap');
        setTimeout(() => btnOk.classList.remove('button-tap'), 150);
    });
}

// ======================== TECLADO FÍSICO ========================
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        e.preventDefault();
        addNumber(key);

        const targetBtn = Array.from(buttonsNumber)
            .find(btn => btn.getAttribute('data-num') === key);

        if (targetBtn) {
            targetBtn.classList.add('button-tap');
            setTimeout(() => targetBtn.classList.remove('button-tap'), 100);
        }
    }
    else if (key === 'Enter') {
        e.preventDefault();
        validarCPF();

        if (btnOk) {
            btnOk.classList.add('button-tap');
            setTimeout(() => btnOk.classList.remove('button-tap'), 100);
        }
    }
    else if (key === 'Backspace' || key === 'Delete') {
        e.preventDefault();
        limparTudo();

        if (btnClear) {
            btnClear.classList.add('button-tap');
            setTimeout(() => btnClear.classList.remove('button-tap'), 100);
        }
    }
    else if (key === 'Escape') {
        e.preventDefault();
        limparTudo();
    }
});

// ======================== MOBILE / BLOQUEIOS ========================
displayInput.addEventListener('touchstart', (e) => {
    e.preventDefault();
});

document.querySelector('.totem')?.addEventListener('contextmenu', (e) => e.preventDefault());

// ======================== INICIALIZAÇÃO ========================
resetMessageStyle();
updateDisplay();