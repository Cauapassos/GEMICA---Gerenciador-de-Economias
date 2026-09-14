// =====================================
// SELEÇÃO DE ELEMENTOS DO DOM
// =====================================

// Seções
const createSection = document.getElementById('createSection');
const listSection = document.getElementById('listSection');

// Nav
const navBtns = document.querySelectorAll('.nav-btn');
const apiUrlNav = document.getElementById('apiUrlNav');

// Create Form
const createUserForm = document.getElementById('createUserForm');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPassword = document.getElementById('userPassword');
const userBalance = document.getElementById('userBalance');
const createBtn = document.getElementById('createBtn');

// List
const refreshListBtn = document.getElementById('refreshListBtn');
const usersTableContainer = document.getElementById('usersTableContainer');

// Modal
const editModal = document.getElementById('editModal');
const editUserForm = document.getElementById('editUserForm');
const editUserId = document.getElementById('editUserId');
const editUserName = document.getElementById('editUserName');
const editUserEmail = document.getElementById('editUserEmail');
const editUserPassword = document.getElementById('editUserPassword');
const editUserBalance = document.getElementById('editUserBalance');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveEditBtn = document.getElementById('saveEditBtn');

// Messages
const messageContainer = document.getElementById('messageContainer');

// =====================================
// ESTADO
// =====================================
let users = [];

// =====================================
// FUNÇÕES UTILITÁRIAS
// =====================================

function getApiUrl() {
    return apiUrlNav.value.trim() || 'http://localhost:8080';
}

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

function clearForm() {
    createUserForm.reset();
}

function openModal(user) {
    editUserId.value = user.id;
    editUserName.value = user.name;
    editUserEmail.value = user.email;
    editUserPassword.value = '';
    editUserBalance.value = user.balance;
    editModal.style.display = 'flex';
}

function closeModal() {
    editModal.style.display = 'none';
    editUserForm.reset();
}

function switchSection(sectionName) {
    // Hide all sections
    createSection.classList.remove('section-active');
    listSection.classList.remove('section-active');
    
    // Remove active class from all nav buttons
    navBtns.forEach(btn => btn.classList.remove('nav-btn-active'));
    
    // Show selected section
    if (sectionName === 'create') {
        createSection.classList.add('section-active');
        document.querySelector('[data-section="create"]').classList.add('nav-btn-active');
    } else if (sectionName === 'list') {
        listSection.classList.add('section-active');
        document.querySelector('[data-section="list"]').classList.add('nav-btn-active');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateCreateForm() {
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const password = userPassword.value.trim();
    const balance = userBalance.value.trim();
    
    if (!name || !email || !password || !balance) {
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
    
    if (isNaN(balance) || parseFloat(balance) < 0) {
        showMessage('Saldo deve ser um número válido', 'error');
        return false;
    }
    
    return true;
}

function validateEditForm() {
    const name = editUserName.value.trim();
    const email = editUserEmail.value.trim();
    const password = editUserPassword.value.trim();
    const balance = editUserBalance.value.trim();
    
    if (!name || !email || !balance) {
        showMessage('Preencha todos os campos obrigatórios', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Email inválido', 'error');
        return false;
    }
    
    if (password && password.length < 6) {
        showMessage('Senha deve ter no mínimo 6 caracteres', 'error');
        return false;
    }
    
    if (isNaN(balance) || parseFloat(balance) < 0) {
        showMessage('Saldo deve ser um número válido', 'error');
        return false;
    }
    
    return true;
}

function formatBalance(balance) {
    return `R$ ${parseFloat(balance || 0).toFixed(2)}`;
}

function renderUsersList(usersList) {
    if (!usersList || usersList.length === 0) {
        usersTableContainer.innerHTML = '<p class="loading-text">Nenhum usuário encontrado</p>';
        return;
    }

    let html = `
        <table class="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Saldo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    usersList.forEach(user => {
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${formatBalance(user.balance)}</td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="btn btn-primary btn-edit edit-user-btn" data-id="${user.id}">
                            Editar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    usersTableContainer.innerHTML = html;

    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            const user = usersList.find(u => u.id == userId);
            if (user) {
                openModal(user);
            }
        });
    });
}

// =====================================
// FUNÇÕES DE API
// =====================================

async function handleCreateUser(e) {
    e.preventDefault();
    
    if (!validateCreateForm()) {
        return;
    }
    
    const userData = {
        name: userName.value.trim(),
        email: userEmail.value.trim(),
        password: userPassword.value.trim(),
        balance: parseFloat(userBalance.value.trim())
    };

    createBtn.disabled = true;
    createBtn.textContent = 'Criando...';

    try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/user/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Usuário criado com sucesso!', 'success');
            clearForm();
        } else {
            showMessage(data.message || 'Erro ao criar usuário', 'error');
        }
    } catch (error) {
        showMessage(`Erro ao conectar com servidor: ${error.message}`, 'error');
        console.error('Erro ao criar usuário:', error);
    } finally {
        createBtn.disabled = false;
        createBtn.textContent = 'Criar Usuário';
    }
}

async function handleListUsers() {
    refreshListBtn.disabled = true;
    refreshListBtn.textContent = 'Carregando...';

    try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/user/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok) {
            users = data;
            renderUsersList(users);
            showMessage('Usuários carregados com sucesso!', 'success');
        } else {
            showMessage(data.message || 'Erro ao listar usuários', 'error');
        }
    } catch (error) {
        showMessage(`Erro ao conectar com servidor: ${error.message}`, 'error');
        console.error('Erro ao listar usuários:', error);
    } finally {
        refreshListBtn.disabled = false;
        refreshListBtn.textContent = '↻ Atualizar';
    }
}

async function handleUpdateUser(e) {
    e.preventDefault();

    if (!validateEditForm()) {
        return;
    }

    const id = editUserId.value;
    const userData = {
        name: editUserName.value.trim(),
        email: editUserEmail.value.trim(),
        balance: parseFloat(editUserBalance.value.trim())
    };

    // Se senha foi preenchida, adiciona ao payload
    if (editUserPassword.value.trim()) {
        userData.password = editUserPassword.value.trim();
    }

    saveEditBtn.disabled = true;
    saveEditBtn.textContent = 'Salvando...';

    try {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/user/put/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Usuário atualizado com sucesso!', 'success');
            closeModal();
            handleListUsers(); // Recarrega a lista
        } else {
            showMessage(data.message || 'Erro ao atualizar usuário', 'error');
        }
    } catch (error) {
        showMessage(`Erro ao conectar com servidor: ${error.message}`, 'error');
        console.error('Erro ao atualizar usuário:', error);
    } finally {
        saveEditBtn.disabled = false;
        saveEditBtn.textContent = 'Salvar Alterações';
    }
}

// =====================================
// EVENT LISTENERS
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });

    // Create Form
    createUserForm.addEventListener('submit', handleCreateUser);

    // List
    refreshListBtn.addEventListener('click', handleListUsers);

    // Modal
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    editUserForm.addEventListener('submit', handleUpdateUser);

    // Close modal when clicking outside
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    // Initialize with create section
    switchSection('create');
});
