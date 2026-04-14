// ======================== CONFIGURAÇÕES ========================
let cpfRaw = "";
const displayInput = document.getElementById('display');
const msgParagraph = document.getElementById('msg');
const API_URL = 'https://api-academia-mu.vercel.app';

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
    if (window.navigator && window.navigator.vibrate) {
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
            if (msgParagraph.innerText === "⚠️ CPF COMPLETO") {
                if (cpfRaw.length === 11) {
                    msgParagraph.innerText = "INSIRA SEU CPF";
                    resetMessageStyle();
                }
            }
        }, 1200);
    }
}

// ======================== LIMPAR ========================
function limparTudo() {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(8);
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
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
        return;
    }
    
    msgParagraph.innerText = "⏳ VERIFICANDO...";
    msgParagraph.className = "";
    
    try {
        const response = await fetch(`${API_URL}/catraca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ cpf: cpfNumerico })
        });
        
        if (!response.ok) {
            let errorDetail = `Erro ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.message || errorDetail;
            } catch(e) {}
            throw new Error(errorDetail);
        }
        
        const data = await response.json();
        
        if (data.status && data.status.toUpperCase() === "ATIVO") {
            msgParagraph.innerText = "✅ ACESSO LIBERADO";
            msgParagraph.className = "sucesso";
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
            
            setTimeout(() => {
                limparTudo();
                msgParagraph.innerText = "✅ BEM-VINDO(A)";
                msgParagraph.className = "sucesso";
                setTimeout(() => {
                    if (msgParagraph.innerText === "✅ BEM-VINDO(A)") {
                        msgParagraph.innerText = "INSIRA SEU CPF";
                        msgParagraph.className = "";
                    }
                }, 2000);
            }, 2800);
        } else {
            msgParagraph.innerText = "⛔ ACESSO NEGADO";
            msgParagraph.className = "erro";
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([80, 40, 80]);
            
            setTimeout(() => {
                if (msgParagraph.innerText === "⛔ ACESSO NEGADO") {
                    msgParagraph.innerText = "INSIRA SEU CPF";
                    msgParagraph.className = "";
                }
            }, 2500);
        }
    } 
    catch (error) {
        console.error("Erro na API:", error);
        msgParagraph.innerText = "🔌 ERRO DE CONEXÃO";
        msgParagraph.className = "erro";
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([100, 100, 100]);
        
        setTimeout(() => {
            if (msgParagraph.innerText === "🔌 ERRO DE CONEXÃO") {
                msgParagraph.innerText = "INSIRA SEU CPF";
                msgParagraph.className = "";
            }
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
        const targetBtn = Array.from(buttonsNumber).find(btn => btn.getAttribute('data-num') === key);
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

// Previne teclado virtual no mobile
displayInput.addEventListener('touchstart', (e) => {
    e.preventDefault();
});

// Remove menu de contexto
document.querySelector('.totem')?.addEventListener('contextmenu', (e) => e.preventDefault());

// Inicialização
resetMessageStyle();
updateDisplay();