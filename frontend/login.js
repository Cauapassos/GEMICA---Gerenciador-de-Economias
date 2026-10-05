// =====================================
// SELEÇÃO DE ELEMENTOS DO DOM
// =====================================
const createUserForm = document.getElementById('createUserForm');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPassword = document.getElementById('userPassword');
const createBtn = document.getElementById('createBtn');
const messageContainer = document.getElementById('messageContainer');


// =====================================
// CONFIGURAÇÃO
// =====================================
const API_URL = 'http://localhost:8080';


// =====================================
// FUNÇÕES UTILITÁRIAS
// =====================================
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');

    messageEl.className = `message ${type}`;
    messageEl.textContent = message;

    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 4000);
}


// =====================================
// TEMA (CLARO / ESCURO)
// =====================================
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    toggle.checked = document.documentElement.dataset.theme === 'dark';

    toggle.addEventListener('change', () => {
        const tema = toggle.checked ? 'dark' : 'light';
        document.documentElement.dataset.theme = tema;
        try {
            localStorage.setItem('gemicaTheme', tema);
        } catch (e) { /* sem storage disponível: o tema vale só nesta visita */ }
    });
}


// =====================================
// VALIDAÇÕES
// =====================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}


function validateCreateForm() {
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const password = userPassword.value.trim();

    if (!name || !email || !password) {
        showMessage('Preencha todos os campos', 'error');
        return false;
    }

    if (!isValidEmail(email)) {
        showMessage('Email inválido', 'error');
        return false;
    }

    if (password.length < 6) {
        showMessage('Senha deve ter no mínimo 6 caracteres', 'error');
        return false;
    }

    return true;
}


// =====================================
// API - CRIAR USUÁRIO
// =====================================
async function handleCreateUser(e) {
    e.preventDefault();

    if (!validateCreateForm()) {
        return;
    }

    const userData = {
        nome: userName.value.trim(),
        email: userEmail.value.trim(),
        senha: userPassword.value.trim()
    };

    let redirecionando = false;

    createBtn.disabled = true;
    createBtn.textContent = 'Criando...';

    try {
        // POST /user/post
        const response = await fetch(`${API_URL}/user/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            localStorage.setItem('usuarioLogado', JSON.stringify(data));
            redirecionando = true;
            window.location.href = 'dashboard.html';
        } else {
            showMessage(
                data.message || 'Não foi possível criar o usuário. O email pode já estar cadastrado.',
                'error'
            );
        }

    } catch (error) {
        showMessage(`Erro ao conectar com servidor: ${error.message}`, 'error');
        console.error('Erro ao criar usuário:', error);

    } finally {
        if (!redirecionando) {
            createBtn.disabled = false;
            createBtn.textContent = 'Criar Usuário';
        }
    }
}


// =====================================
// EVENT LISTENERS
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    createUserForm.addEventListener('submit', handleCreateUser);
});
