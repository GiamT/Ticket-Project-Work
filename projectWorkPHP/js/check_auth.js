async function checkAuth() {
    try {
        // Verifica lato client
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const currentPath = window.location.pathname;
        
        // Se non ci sono dati utente
        if (!userData) {
            alert('Devi effettuare il login per accedere a questa pagina');
            window.location.href = '/projectWorkPHP/login.html';
            return;
        }

        // Verifica lato server
        const response = await fetch('/projectWorkPHP/check_session.php');
        const sessionData = await response.json();

        if (!sessionData.authenticated) {
            alert('Sessione scaduta. Effettua nuovamente il login');
            sessionStorage.removeItem('userData');
            window.location.href = '/projectWorkPHP/login.html';
            return;
        }

        // Controlla se l'utente sta cercando di accedere a pagine admin
        const isAdminPage = currentPath.includes('/admin/');
        
        if (isAdminPage && !sessionData.isAdmin) {
            alert('Non hai i permessi per accedere all\'area amministrativa');
            window.location.href = '/projectWorkPHP/user/dashboard.html';
            return;
        }

        if (!isAdminPage && currentPath.includes('/user/') && sessionData.isAdmin) {
            alert('Stai cercando di accedere all\'area utenti come amministratore');
            window.location.href = '/projectWorkPHP/admin/dashboard.html';
            return;
        }

    } catch (error) {
        console.error('Errore durante la verifica dell\'autenticazione:', error);
        alert('Si è verificato un errore durante la verifica dell\'accesso. Verrai reindirizzato alla pagina di login');
        window.location.href = '/projectWorkPHP/login.html';
    }
}

// Esegui il controllo quando il documento è caricato
document.addEventListener('DOMContentLoaded', checkAuth);

// Aggiungi un listener per intercettare la navigazione
window.addEventListener('popstate', checkAuth); 