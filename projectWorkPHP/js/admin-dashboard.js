document.addEventListener('DOMContentLoaded', function() {
    // Verifica autenticazione
    const userData = sessionStorage.getItem('userData');
    if (!userData || !JSON.parse(userData).isAdmin) {
        window.location.href = '../login.html';
        return;
    }

    // Imposta il nome dell'admin
    const admin = JSON.parse(userData);
    document.getElementById('adminName').textContent = admin.username;

    // Carica i dati iniziali
    loadTickets();
    loadUsers();
});

async function loadTickets(filter = 'all') {
    try {
        const response = await fetch('../api/tickets.php');
        const tickets = await response.json();
        
        const ticketsList = document.getElementById('ticketsList');
        const filteredTickets = filter === 'all' ? 
            tickets : 
            tickets.filter(ticket => ticket.stato.toLowerCase() === filter);

        ticketsList.innerHTML = filteredTickets.map(ticket => `
            <div class="ticket-card">
                <div class="ticket-header">
                    <h3>Ticket #${ticket.id}</h3>
                    <span class="status ${ticket.stato.toLowerCase()}">${ticket.stato}</span>
                </div>
                <div class="ticket-body">
                    <p><strong>Cliente:</strong> ${ticket.cliente.nome}</p>
                    <p><strong>Descrizione:</strong> ${ticket.descrizione}</p>
                    <p><strong>Data:</strong> ${new Date(ticket.dataCreazione).toLocaleString()}</p>
                </div>
                <div class="ticket-actions">
                    <button onclick="showTicketDetail(${ticket.id})" class="detail-btn">
                        <i class="fas fa-eye"></i> Dettagli
                    </button>
                    ${ticket.stato !== 'chiuso' ? `
                        <button onclick="updateTicketStatus(${ticket.id})" class="status-btn">
                            <i class="fas fa-sync-alt"></i> Aggiorna Stato
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Errore nel caricamento dei ticket:', error);
        alert('Errore nel caricamento dei ticket');
    }
}

function filterTickets(status) {
    loadTickets(status);
}

async function showTicketDetail(ticketId) {
    try {
        const response = await fetch(`../api/tickets.php?id=${ticketId}`);
        const ticket = await response.json();
        
        // Mostra il modale con i dettagli del ticket
        const modal = document.getElementById('ticketDetailModal');
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Dettagli Ticket #${ticket.id}</h2>
                <div class="ticket-info">
                    <p><strong>Stato:</strong> <span class="status ${ticket.stato.toLowerCase()}">${ticket.stato}</span></p>
                    <p><strong>Cliente:</strong> ${ticket.cliente.nome}</p>
                    <p><strong>Data Creazione:</strong> ${new Date(ticket.dataCreazione).toLocaleString()}</p>
                    <p><strong>Descrizione:</strong> ${ticket.descrizione}</p>
                </div>
                <div class="updates-section">
                    <h3>Aggiornamenti</h3>
                    <div id="updatesList">
                        ${ticket.aggiornamenti ? ticket.aggiornamenti.map(agg => `
                            <div class="update-item">
                                <p>${agg.descrizione}</p>
                                <small>${new Date(agg.dataAggiornamento).toLocaleString()}</small>
                            </div>
                        `).join('') : '<p>Nessun aggiornamento</p>'}
                    </div>
                    ${ticket.stato !== 'chiuso' ? `
                        <form id="updateForm" onsubmit="addUpdate(event, ${ticket.id})">
                            <textarea id="updateText" required placeholder="Inserisci un aggiornamento..."></textarea>
                            <button type="submit">Aggiungi Aggiornamento</button>
                        </form>
                    ` : ''}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Errore nel caricamento dei dettagli del ticket:', error);
        alert('Errore nel caricamento dei dettagli del ticket');
    }
}

async function updateTicketStatus(ticketId) {
    try {
        const newStatus = prompt('Inserisci il nuovo stato (aperto, in_lavorazione, chiuso):');
        if (!newStatus) return;

        const response = await fetch('../api/tickets.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: ticketId,
                stato: newStatus
            })
        });

        if (response.ok) {
            alert('Stato del ticket aggiornato con successo!');
            loadTickets();
        } else {
            throw new Error('Errore nell\'aggiornamento dello stato del ticket');
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore nell\'aggiornamento dello stato del ticket');
    }
}

// Funzioni per i modali
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Gestione degli aggiornamenti
async function showAggiornamenti(ticketId) {
    try {
        const response = await fetch(`../api/aggiornamenti.php?ticketId=${ticketId}`);
        const aggiornamenti = await response.json();
        
        document.getElementById('ticketId').value = ticketId;
        openModal('aggiornamentoModal');
        
        // Mostra gli aggiornamenti esistenti
        const aggiornamentsList = document.createElement('div');
        aggiornamentsList.className = 'aggiornamenti-list';
        aggiornamentsList.innerHTML = aggiornamenti.map(agg => `
            <div class="aggiornamento-item">
                <p>${agg.descrizione}</p>
                <small>Data: ${new Date(agg.dataAggiornamento).toLocaleString()}</small>
                <small>Tecnico: ${agg.tecnicoNome || 'N/D'}</small>
            </div>
        `).join('');
        
        document.querySelector('#aggiornamentoModal .modal-content').appendChild(aggiornamentsList);
    } catch (error) {
        console.error('Errore nel caricamento degli aggiornamenti:', error);
        alert('Errore nel caricamento degli aggiornamenti');
    }
}

// Gestione delle risoluzioni
async function showRisoluzione(ticketId) {
    try {
        const response = await fetch(`../api/risoluzioni.php?ticketId=${ticketId}`);
        const risoluzione = await response.json();
        
        document.getElementById('ticketIdRisoluzione').value = ticketId;
        openModal('risoluzioneModal');
        
        if (risoluzione) {
            document.getElementById('noteRisoluzione').value = risoluzione.note;
        }
    } catch (error) {
        console.error('Errore nel caricamento della risoluzione:', error);
        alert('Errore nel caricamento della risoluzione');
    }
}

// Event Listeners per i form
document.getElementById('aggiornamentoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ticketId = document.getElementById('ticketId').value;
    const descrizione = document.getElementById('descrizioneAggiornamento').value;
    
    try {
        const response = await fetch('../api/aggiornamenti.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticketId: parseInt(ticketId),
                descrizione: descrizione,
                tecnicoId: JSON.parse(sessionStorage.getItem('userData')).admin.id
            })
        });
        
        if (response.ok) {
            alert('Aggiornamento salvato con successo');
            closeModal('aggiornamentoModal');
            loadTickets(); // Ricarica i ticket
        } else {
            throw new Error('Errore nel salvataggio dell\'aggiornamento');
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore nel salvataggio dell\'aggiornamento');
    }
});

document.getElementById('risoluzioneForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ticketId = document.getElementById('ticketIdRisoluzione').value;
    const note = document.getElementById('noteRisoluzione').value;
    
    try {
        const response = await fetch('../api/risoluzioni.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticketId: parseInt(ticketId),
                note: note,
                tecnicoId: JSON.parse(sessionStorage.getItem('userData')).admin.id
            })
        });
        
        if (response.ok) {
            alert('Risoluzione salvata con successo');
            closeModal('risoluzioneModal');
            loadTickets(); // Ricarica i ticket
        } else {
            throw new Error('Errore nel salvataggio della risoluzione');
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore nel salvataggio della risoluzione');
    }
});

// Chiusura modali
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}