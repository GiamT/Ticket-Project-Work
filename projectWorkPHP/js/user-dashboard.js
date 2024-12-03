document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadTickets();
    setupModalHandlers();
    setupNewTicketForm();
});

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

async function loadUserInfo() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        document.getElementById('userName').textContent = `${userData.username}`;
    }
}

async function loadTickets() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        console.log('Loading tickets for client:', userData.cliente.id); // Debug

        const response = await fetch(`../api/tickets.php?clienteId=${userData.cliente.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tickets = await response.json();
        console.log('Received tickets:', tickets); // Debug
        
        const ticketsList = document.getElementById('ticketsList');
        if (!tickets || tickets.length === 0) {
            ticketsList.innerHTML = '<p class="no-tickets">Nessun ticket presente</p>';
            return;
        }

        ticketsList.innerHTML = tickets.map(ticket => `
            <div class="ticket-card">
                <div class="ticket-header">
                    <h3>Ticket #${ticket.id}</h3>
                    <span class="status ${getStatusClass(ticket.statoId)}">
                        ${getStatusText(ticket.statoId)}
                    </span>
                </div>
                <div class="ticket-content">
                    <p>${ticket.descrizione}</p>
                    <div class="ticket-details">
                        <span class="date">Creato il: ${new Date(ticket.dataCreazione).toLocaleString()}</span>
                    </div>
                </div>
                <div class="ticket-actions">
                    <button onclick="viewTicketDetails(${ticket.id})" class="action-btn view-btn">
                        <i class="fas fa-eye"></i> Dettagli
                    </button>
                    ${ticket.statoId === 1 ? 
                        `<button onclick="deleteTicket(${ticket.id})" class="action-btn delete-btn">
                            <i class="fas fa-trash"></i> Elimina
                        </button>` : ''
                    }
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Errore nel caricamento dei ticket:', error);
        alert('Errore nel caricamento dei ticket');
    }
}

function getStatusClass(statoId) {
    switch (statoId) {
        case 1: return 'aperto';
        case 2: return 'in-lavorazione';
        case 3: return 'chiuso';
        default: return '';
    }
}

function getStatusText(statoId) {
    switch (statoId) {
        case 1: return 'Aperto';
        case 2: return 'In Lavorazione';
        case 3: return 'Chiuso';
        default: return 'Sconosciuto';
    }
}

async function viewTicketDetails(ticketId) {
    try {
        // Carica dettagli ticket
        const ticketResponse = await fetch(`../api/tickets.php?id=${ticketId}`);
        if (!ticketResponse.ok) {
            throw new Error(`HTTP error! status: ${ticketResponse.status}`);
        }
        const ticket = await ticketResponse.json();
        console.log('Dettagli ticket:', ticket);

        // Carica aggiornamenti
        const aggiornamentiResponse = await fetch(`../api/aggiornamenti.php?ticketId=${ticketId}`);
        if (!aggiornamentiResponse.ok) {
            throw new Error(`HTTP error! status: ${aggiornamentiResponse.status}`);
        }
        const aggiornamenti = await aggiornamentiResponse.json();
        console.log('Aggiornamenti ticket:', aggiornamenti);

        // Carica risoluzione se il ticket è chiuso
        let risoluzione = null;
        if (parseInt(ticket.statoId) === 3) {
            const risoluzioneResponse = await fetch(`../api/risoluzioni.php?ticketId=${ticketId}`);
            if (risoluzioneResponse.ok) {
                risoluzione = await risoluzioneResponse.json();
                console.log('Risoluzione ticket:', risoluzione);
            }
        }

        // Popola il modal con i dettagli
        const modal = document.getElementById('ticketDetailsModal');
        const modalContent = document.querySelector('#ticketDetailsModal .modal-content');

        modalContent.innerHTML = `
            <span class="close">&times;</span>
            
            <!-- Dettagli Ticket -->
            <div class="ticket-details-container">
                <h3>Ticket #${ticket.id || 'N/D'}</h3>
                <div class="ticket-info">
                    <p class="ticket-description">${ticket.descrizione || 'Nessuna descrizione disponibile'}</p>
                    <div class="ticket-meta">
                        <span class="status ${getStatusClass(ticket.statoId)}">
                            ${getStatusText(ticket.statoId)}
                        </span>
                        <span class="date">
                            <i class="fas fa-calendar"></i>
                            Creato il: ${ticket.dataCreazione ? new Date(ticket.dataCreazione).toLocaleString('it-IT') : 'Data non disponibile'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Aggiornamenti -->
            <div class="ticket-updates-container">
                <h4><i class="fas fa-history"></i> Note del Tecnico</h4>
                ${aggiornamenti && aggiornamenti.length > 0 ? 
                    aggiornamenti.map(agg => `
                        <div class="update-item">
                            <p>${agg.descrizione || 'Nessuna nota disponibile'}</p>
                            <div class="update-meta">
                                <span class="tech-name">
                                    <i class="fas fa-user-tie"></i> 
                                    Tecnico: ${agg.tecnicoNome || 'N/D'}
                                </span>
                                <span class="date">
                                    <i class="fas fa-calendar"></i> 
                                    ${agg.dataAggiornamento ? new Date(agg.dataAggiornamento).toLocaleString('it-IT') : 'Data non disponibile'}
                                </span>
                            </div>
                        </div>
                    `).join('') 
                    : '<p class="no-updates">Nessun aggiornamento disponibile</p>'
                }
            </div>

            <!-- Risoluzione -->
            ${parseInt(ticket.statoId) === 3 && risoluzione ? `
                <div class="ticket-resolution-container">
                    <h3><i class="fas fa-check-circle"></i> Risoluzione</h3>
                    <div class="resolution-content">
                        <p class="resolution-note">${risoluzione.note || 'Nessuna nota di risoluzione'}</p>
                        <div class="resolution-meta">
                            <span class="resolution-tech">
                                <i class="fas fa-user-tie"></i> 
                                Tecnico: ${risoluzione.tecnicoNome || 'N/D'}
                            </span>
                            <span class="resolution-date">
                                <i class="fas fa-calendar-check"></i> 
                                ${risoluzione.dataRisoluzione ? new Date(risoluzione.dataRisoluzione).toLocaleString('it-IT') : 'Data non disponibile'}
                            </span>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        // Mostra il modal
        modal.style.display = 'block';

        // Gestione chiusura modal
        const closeBtn = modalContent.querySelector('.close');
        closeBtn.onclick = () => modal.style.display = 'none';

    } catch (error) {
        console.error('Errore nel caricamento dei dettagli:', error);
        alert('Errore nel caricamento dei dettagli del ticket');
    }
}

async function deleteTicket(ticketId) {
    if (confirm('Sei sicuro di voler eliminare questo ticket?')) {
        try {
            const response = await fetch(`../api/tickets.php/${ticketId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Ticket eliminato con successo');
                loadTickets(); // Ricarica la lista dei ticket
            } else {
                throw new Error('Errore nell\'eliminazione del ticket');
            }
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante l\'eliminazione del ticket');
        }
    }
}

function setupModalHandlers() {
    const modals = document.getElementsByClassName('modal');
    const closes = document.getElementsByClassName('close');

    // Gestione click sul bottone X
    for (let close of closes) {
        close.onclick = function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        }
    }

    // Gestione click fuori dal modal
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    }
}

function closeModal(modal) {
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) {
        form.reset(); // Reset del form quando si chiude il modal
    }
}

function showNewTicketModal() {
    const modal = document.getElementById('newTicketModal');
    modal.style.display = 'block';
}

function setupNewTicketForm() {
    const form = document.getElementById('newTicketForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const ticketData = {
            descrizione: document.getElementById('descrizione').value,
            statoId: 1, // 1 = APERTO
            clienteId: userData.cliente.id
        };

        try {
            const response = await fetch(`../api/tickets.php?clienteId=${userData.cliente.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                throw new Error('Errore nella risposta del server');
            }

            const result = await response.json();
            alert('Ticket creato con successo!');
            document.getElementById('newTicketModal').style.display = 'none';
            form.reset();
            loadTickets(); // Ricarica la lista dei ticket
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante la creazione del ticket: ' + error.message);
        }
    });
} 