document.addEventListener('DOMContentLoaded', function() {
    loadUtenti();
    setupModalHandlers();
    setupNewUserForm();
    loadClientiForSelect();
});

function setupModalHandlers() {
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        }
    });

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    }
}

function closeModal(modal) {
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) form.reset();
}

function showNewUserModal() {
    const modal = document.getElementById('newUserModal');
    modal.style.display = 'block';
}

async function loadClientiForSelect() {
    try {
        const response = await fetch('../api/clienti.php');
        const clienti = await response.json();
        
        const select = document.getElementById('clienteSelect');
        select.innerHTML = '<option value="">Seleziona un cliente</option>' +
            clienti.map(cliente => 
                `<option value="${cliente.id}">${cliente.nome} (${cliente.email})</option>`
            ).join('');
    } catch (error) {
        console.error('Errore nel caricamento dei clienti:', error);
        alert('Errore nel caricamento dei clienti');
    }
}

async function loadUtenti() {
    try {
        const response = await fetch('../api/utenti.php');
        const utenti = await response.json();
        
        const usersList = document.getElementById('usersList');
        if (!utenti || utenti.length === 0) {
            usersList.innerHTML = '<p class="no-data">Nessun utente trovato.</p>';
            return;
        }

        usersList.innerHTML = utenti.map(utente => `
            <div class="user-card">
                <div class="user-info">
                    <h3>${utente.username}</h3>
                    <p>Cliente: ${utente.cliente?.nome || 'N/D'}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Errore nel caricamento degli utenti:', error);
        alert('Errore nel caricamento degli utenti');
    }
}

function setupNewUserForm() {
    const form = document.getElementById('newUserForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const clienteId = document.getElementById('clienteSelect').value;
        if (!clienteId) {
            alert('Seleziona un cliente');
            return;
        }

        const userData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            amministratore: false
        };

        try {
            const response = await fetch(`../api/utenti.php/${clienteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Utente creato con successo!');
                closeModal(document.getElementById('newUserModal'));
                loadUtenti(); // Ricarica la lista degli utenti
            } else {
                throw new Error(result.message || 'Errore durante la creazione dell\'utente');
            }
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante la creazione dell\'utente: ' + error.message);
        }
    });
}

async function logout() {
    try {
        const response = await fetch('../logout.php');
        const data = await response.json();
        
        if (data.success) {
            alert('Logout effettuato con successo!');
            sessionStorage.removeItem('userData');
            window.location.href = '../login.html';
        } else {
            throw new Error('Errore durante il logout');
        }
    } catch (error) {
        console.error('Errore durante il logout:', error);
        alert('Errore durante il logout');
    }
} 