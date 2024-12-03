document.addEventListener('DOMContentLoaded', async function() {
    const clienteId = sessionStorage.getItem('selectedClienteId');
    console.log('ID Cliente recuperato:', clienteId);
    
    if (!clienteId) {
        alert('Nessun cliente selezionato');
        window.location.href = 'gestione-clienti.html';
        return;
    }

    try {
        // Carica i dettagli del cliente
        const clienteResponse = await fetch(`../api/clienti.php?id=${clienteId}`);
        if (!clienteResponse.ok) {
            throw new Error(`HTTP error! status: ${clienteResponse.status}`);
        }
        
        const cliente = await clienteResponse.json();

        // Popola i dettagli del cliente
        document.querySelector('.dettagli-cliente').innerHTML = `
            <div class="info-row">
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span>Nome: ${cliente.nome}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>Email: ${cliente.email}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <i class="fas fa-building"></i>
                    <span>P.IVA: ${cliente.partitaIva}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-id-card"></i>
                    <span>Codice Fiscale: ${cliente.codiceFiscale}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Indirizzo: ${cliente.indirizzo}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span>Telefono: ${cliente.telefono}</span>
                </div>
            </div>
        `;

        // Carica i ticket del cliente
        const ticketResponse = await fetch(`../api/tickets.php?clienteId=${clienteId}`);
        if (!ticketResponse.ok) {
            throw new Error(`HTTP error! status: ${ticketResponse.status}`);
        }
        
        const tickets = await ticketResponse.json();
        const ticketList = document.getElementById('ticketList');

        if (tickets && tickets.length > 0) {
            ticketList.innerHTML = tickets.map(ticket => `
                <div class="ticket-card">
                    <div class="ticket-header">
                        <div class="ticket-id">
                            <i class="fas fa-ticket-alt"></i>
                            <span>Ticket #${ticket.id}</span>
                        </div>
                        <span class="status ${getStatusClass(ticket.statoId)}">
                            ${getStatusText(ticket.statoId)}
                        </span>
                    </div>
                    <div class="ticket-content">
                        <p class="ticket-description">${ticket.descrizione}</p>
                        <div class="ticket-meta">
                            <span class="ticket-date">
                                <i class="fas fa-calendar-alt"></i>
                                Creato il: ${new Date(ticket.dataCreazione).toLocaleString('it-IT')}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            ticketList.innerHTML = '<div class="no-tickets">Nessun ticket presente per questo cliente</div>';
        }

    } catch (error) {
        console.error('Errore:', error);
        alert('Errore nel caricamento dei dati');
    }
});

function getStatusClass(statoId) {
    switch (parseInt(statoId)) {
        case 1: return 'status-aperto';
        case 2: return 'status-in-lavorazione';
        case 3: return 'status-chiuso';
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

// Funzione logout
function logout() {
    fetch('../logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Logout effettuato con successo!');
                sessionStorage.removeItem('userData');
                window.location.href = '../login.html';
            }
        })
        .catch(error => {
            console.error('Errore durante il logout:', error);
            alert('Errore durante il logout');
        });
} 