async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = event.target.querySelector('button');
    const originalButtonContent = submitButton.innerHTML;
    
    try {
        // Disabilita il bottone e mostra loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Accesso in corso...';
        
        const response = await fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Salva i dati utente
            sessionStorage.setItem('userData', JSON.stringify(data));
            
            // Animazione di successo
            submitButton.style.backgroundColor = '#43a047';
            submitButton.innerHTML = '<i class="fas fa-check"></i> Accesso riuscito!';
            
            // Reindirizza dopo un breve delay
            setTimeout(() => {
                if (data.amministratore) {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    window.location.href = 'user/dashboard.html';
                }
            }, 1000);
        } else {
            throw new Error(data.error || 'Credenziali non valide');
        }
    } catch (error) {
        // Mostra errore
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
        
        // Ripristina il bottone
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
        
        // Shake animation per il form
        const loginContent = document.querySelector('.login-content');
        loginContent.style.animation = 'none';
        loginContent.offsetHeight; // Trigger reflow
        loginContent.style.animation = 'shake 0.5s ease-in-out';
    }
    
    return false;
}

// Aggiungi l'animazione shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Pulisci il messaggio di errore quando l'utente inizia a digitare
document.getElementById('username').addEventListener('input', clearError);
document.getElementById('password').addEventListener('input', clearError);

function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
} 