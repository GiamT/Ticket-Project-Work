document.addEventListener('DOMContentLoaded', function() {
    loadClienti();
    setupModalHandlers();
    setupNewClienteForm();
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

function setupNewClienteForm() {
    const form = document.getElementById('newClienteForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const clienteData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            partitaIva: document.getElementById('partitaIva').value,
            codiceFiscale: document.getElementById('codiceFiscale').value,
            indirizzo: document.getElementById('indirizzo').value
        };

        try {
            const response = await fetch('../api/clienti.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                alert('Cliente aggiunto con successo!');
                closeModal(document.getElementById('newClienteModal'));
                loadClienti(); // Ricarica la lista clienti
            } else {
                throw new Error(result.message || 'Errore durante l\'aggiunta del cliente');
            }
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante l\'aggiunta del cliente: ' + error.message);
        }
    });
}

function closeModal(modal) {
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

function showNewClienteModal() {
    const modal = document.getElementById('newClienteModal');
    modal.style.display = 'block';
}

async function loadClienti() {
    try {
        const response = await fetch('../api/clienti.php');
        const clienti = await response.json();
        console.log('Clienti caricati:', clienti); // Debug
        
        const clientsList = document.getElementById('clientsList');
        if (!clienti || clienti.length === 0) {
            clientsList.innerHTML = '<p class="no-data">Nessun cliente trovato.</p>';
            return;
        }

        clientsList.innerHTML = clienti.map(cliente => {
            // Debug per vedere l'ID di ogni cliente
            console.log('Cliente:', cliente.nome, 'ID:', cliente.id);
            
            return `
                <div class="client-card">
                    <h3>${cliente.nome}</h3>
                    <div class="card-actions">
                        <button onclick="viewClienteDetail('${cliente.id}')" class="action-btn view-btn" data-tooltip="Dettagli">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Errore nel caricamento dei clienti:', error);
        alert('Errore nel caricamento dei clienti');
    }
}

function viewClienteDetail(clienteId) {
    console.log('Tentativo di visualizzazione cliente con ID:', clienteId); // Debug
    
    if (!clienteId || clienteId === 'null' || clienteId === 'undefined') {
        console.error('ID cliente non valido:', clienteId);
        return;
    }

    try {
        // Converti l'ID in stringa e rimuovi eventuali spazi
        const idToStore = String(clienteId).trim();
        console.log('ID da salvare:', idToStore); // Debug
        
        sessionStorage.setItem('selectedClienteId', idToStore);
        console.log('ID salvato in sessionStorage:', sessionStorage.getItem('selectedClienteId')); // Debug
        
        window.location.href = 'cliente-dettaglio.html';
    } catch (error) {
        console.error('Errore nel reindirizzamento:', error);
    }
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

async function viewClienteDetails(clienteId) {
    try {
        // Carica i dettagli del cliente
        const clienteResponse = await fetch(`../api/clienti.php/${clienteId}`);
        const cliente = await clienteResponse.json();

        // Carica i ticket del cliente
        const ticketsResponse = await fetch(`../api/tickets.php?clienteId=${clienteId}`);
        const tickets = await ticketsResponse.json();

        const modal = document.getElementById('clienteDetailsModal');
        const detailsContent = document.getElementById('clienteDetails');

        detailsContent.innerHTML = `
            <div class="cliente-info-section">
                <h3>Informazioni Cliente</h3>
                <p><strong>Nome:</strong> ${cliente.nome}</p>
                <p><strong>Email:</strong> ${cliente.email}</p>
                <p><strong>Telefono:</strong> ${cliente.telefono || 'N/D'}</p>
            </div>
            
            <div class="tickets-section">
                <h3>Storico Ticket</h3>
                ${tickets && tickets.length > 0 ? `
                    <div class="tickets-list">
                        ${tickets.map(ticket => `
                            <div class="ticket-item">
                                <div class="ticket-header">
                                    <span class="ticket-id">Ticket #${ticket.id}</span>
                                    <span class="status ${getStatusClass(ticket.statoId)}">
                                        ${getStatusText(ticket.statoId)}
                                    </span>
                                </div>
                                <div class="ticket-body">
                                    <p class="ticket-description">${ticket.descrizione}</p>
                                    <div class="ticket-meta">
                                        <span class="ticket-date">
                                            <i class="fas fa-calendar"></i>
                                            Creato il: ${new Date(ticket.dataCreazione).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="no-tickets">Nessun ticket presente</p>'}
            </div>
        `;

        modal.style.display = 'block';
    } catch (error) {
        console.error('Errore nel caricamento dei dettagli:', error);
        alert('Errore nel caricamento dei dettagli del cliente');
    }
}

// Funzioni helper per lo stato del ticket
function getStatusClass(statoId) {
    switch (parseInt(statoId)) {
        case 1: return 'aperto';
        case 2: return 'in-lavorazione';
        case 3: return 'chiuso';
        default: return '';
    }
}

function getStatusText(statoId) {
    switch (parseInt(statoId)) {
        case 1: return 'Aperto';
        case 2: return 'In Lavorazione';
        case 3: return 'Chiuso';
        default: return 'Sconosciuto';
    }
}
