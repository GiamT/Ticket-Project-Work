document.addEventListener('DOMContentLoaded', function() {
    loadAllTickets();
    setupModalHandlers();
    setupEditTicketForm();
});

async function loadAllTickets() {
    try {
        // Carica tutti i ticket
        const ticketResponse = await fetch('../api/tickets.php');
        const tickets = await ticketResponse.json();
        console.log('Tickets loaded:', tickets);

        // Per ogni ticket, carica i suoi aggiornamenti e la risoluzione se è chiuso
        const ticketsWithDetails = await Promise.all(tickets.map(async ticket => {
            // Carica aggiornamenti
            const aggiornamentiResponse = await fetch(`../api/aggiornamenti.php?ticketId=${ticket.id}`);
            const aggiornamenti = await aggiornamentiResponse.json();
            
            // Carica risoluzione se il ticket è chiuso
            let risoluzione = null;
            if (parseInt(ticket.statoId) === 3) {
                const risoluzioneResponse = await fetch(`../api/risoluzioni.php?ticketId=${ticket.id}`);
                if (risoluzioneResponse.ok) {
                    risoluzione = await risoluzioneResponse.json();
                }
            }

            // Carica i dettagli del cliente
            const clienteResponse = await fetch(`../api/clienti.php?id=${ticket.clienteId}`);
            const cliente = await clienteResponse.json();

            return { ...ticket, aggiornamenti, risoluzione, cliente };
        }));

        const ticketsList = document.getElementById('ticketsList');
        ticketsList.innerHTML = ticketsWithDetails.map(ticket => `
            <div class="ticket-card">
                <div class="ticket-header">
                    <div class="ticket-info">
                        <span class="ticket-id">Ticket #${ticket.id}</span>
                        <div class="cliente-info">
                            <i class="fas fa-user"></i>
                            <span>${ticket.cliente.nome} - ${ticket.cliente.email}</span>
                        </div>
                    </div>
                    <span class="status ${getStatusClass(ticket.statoId)}">
                        ${getStatusText(ticket.statoId)}
                    </span>
                </div>
                <div class="ticket-content">
                    <p class="ticket-description">${ticket.descrizione}</p>
                    <span class="ticket-date">Creato il: ${new Date(ticket.dataCreazione).toLocaleString('it-IT')}</span>
                </div>
                
                <!-- Sezione Aggiornamenti -->
                <div class="aggiornamenti-section">
                    <h4><i class="fas fa-history"></i> Storico Aggiornamenti</h4>
                    ${ticket.aggiornamenti && ticket.aggiornamenti.length > 0 ? 
                        ticket.aggiornamenti.map(agg => `
                            <div class="aggiornamento-item">
                                <p>${agg.descrizione}</p>
                                <div class="aggiornamento-meta">
                                    <span class="tech-name">
                                        <i class="fas fa-user-tie"></i> 
                                        Tecnico: ${agg.tecnicoNome || 'N/D'}
                                    </span>
                                    <span class="date">
                                        <i class="fas fa-calendar"></i> 
                                        ${new Date(agg.dataAggiornamento).toLocaleString('it-IT')}
                                    </span>
                                </div>
                            </div>
                        `).join('') 
                        : '<p class="no-aggiornamenti">Nessun aggiornamento disponibile</p>'
                    }
                </div>

                <div class="ticket-actions">
                    <button onclick="editTicket(${ticket.id})" class="action-btn edit-btn">
                        <i class="fas fa-edit"></i> Modifica
                    </button>
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

let currentTicketId = null;

async function editTicket(ticketId) {
    try {
        // Carica i dettagli del ticket corrente
        const response = await fetch(`../api/tickets.php?id=${ticketId}`);
        const ticket = await response.json();
        
        currentTicketId = ticketId;
        
        // Imposta lo stato corrente del ticket nel form
        const statoSelect = document.getElementById('statoTicket');
        if (ticket.statoId) {
            statoSelect.value = ticket.statoId.toString();
        } else {
            // Se per qualche motivo lo stato non è definito, imposta "Aperto" come default
            statoSelect.value = "1";
        }
        
        // Mostra/nascondi il campo note risoluzione in base allo stato selezionato
        const resolutionNotes = document.querySelector('.resolution-notes');
        resolutionNotes.style.display = statoSelect.value === '3' ? 'block' : 'none';
        
        document.getElementById('editTicketModal').style.display = 'block';
    } catch (error) {
        console.error('Errore nel caricamento del ticket:', error);
        alert('Errore nel caricamento del ticket');
    }
}

function setupEditTicketForm() {
    const form = document.getElementById('editTicketForm');
    const statoSelect = document.getElementById('statoTicket');
    
    statoSelect.addEventListener('change', function() {
        const resolutionNotes = document.querySelector('.resolution-notes');
        resolutionNotes.style.display = this.value === '3' ? 'block' : 'none';
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const statoId = document.getElementById('statoTicket').value;
        const noteAggiornamento = document.getElementById('noteAggiornamento').value;
        const noteRisoluzione = document.getElementById('noteRisoluzione').value;

        try {
            // 1. Aggiorna lo stato del ticket
            const ticketResponse = await fetch(`../api/tickets.php?id=${currentTicketId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentTicketId,
                    statoId: parseInt(statoId),
                    stato: getStatusText(parseInt(statoId)).toLowerCase()
                })
            });

            if (!ticketResponse.ok) {
                const errorData = await ticketResponse.json();
                throw new Error(errorData.error || 'Errore nell\'aggiornamento del ticket');
            }

            // 2. Crea un nuovo aggiornamento con le note
            if (noteAggiornamento.trim()) {
                const aggiornamentoData = {
                    ticketId: parseInt(currentTicketId),
                    descrizione: noteAggiornamento,
                    dataAggiornamento: new Date().toISOString()
                };

                console.log('Sending aggiornamento:', aggiornamentoData);

                const aggResponse = await fetch('../api/aggiornamenti.php', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(aggiornamentoData)
                });

                if (!aggResponse.ok) {
                    const errorData = await aggResponse.json();
                    throw new Error(errorData.error || 'Errore nella creazione dell\'aggiornamento');
                }
            }

            // 3. Se il ticket viene chiuso, crea una risoluzione
            if (statoId === '3' && noteRisoluzione.trim()) {
                const risoluzioneData = {
                    ticketId: parseInt(currentTicketId),
                    note: noteRisoluzione,
                    dataRisoluzione: new Date().toISOString()
                };

                console.log('Sending risoluzione:', risoluzioneData);

                const risResponse = await fetch('../api/risoluzioni.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(risoluzioneData)
                });

                if (!risResponse.ok) {
                    const errorData = await risResponse.json();
                    throw new Error(errorData.error || 'Errore nella creazione della risoluzione');
                }
            }

            alert('Ticket aggiornato con successo!');
            closeModal(document.getElementById('editTicketModal'));
            loadAllTickets();
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore durante l\'aggiornamento del ticket: ' + error.message);
        }
    });
}

function setupModalHandlers() {
    // Gestione click sul bottone X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        }
    });

    // Gestione click fuori dal modal
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    }

    // Gestione tasto ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });
}

function closeModal(modal) {
    if (!modal) return;
    
    // Aggiungi animazione di uscita
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(-30px)';
    
    // Aspetta che l'animazione finisca prima di nascondere il modal
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '';
        modal.style.transform = '';
        
        // Reset del form se presente
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            // Nascondi il campo note risoluzione se presente
            const resolutionNotes = modal.querySelector('.resolution-notes');
            if (resolutionNotes) {
                resolutionNotes.style.display = 'none';
            }
        }
    }, 300);
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
 