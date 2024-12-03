document.addEventListener('DOMContentLoaded', function() {
    updateTimeGreeting();
    updateDateInfo();
    setInterval(updateTimeGreeting, 60000); // Aggiorna ogni minuto
});

function updateTimeGreeting() {
    const hour = new Date().getHours();
    const timeGreeting = document.querySelector('.time-greeting');
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = 'Buongiorno';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Buon pomeriggio';
    } else {
        greeting = 'Buonasera';
    }

    timeGreeting.textContent = `${greeting}, Admin!`;
}

function updateDateInfo() {
    const dateInfo = document.querySelector('.date-info');
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const date = new Date().toLocaleDateString('it-IT', options);
    dateInfo.textContent = date.charAt(0).toUpperCase() + date.slice(1);
}

// Animazione per le feature cards
const cards = document.querySelectorAll('.feature-card');
cards.forEach((card, index) => {
    card.style.animation = `fadeIn 0.5s ease-out forwards ${index * 0.2}s`;
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