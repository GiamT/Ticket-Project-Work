<?php
session_start();

// Pulisce tutte le variabili di sessione
$_SESSION = array();

// Distrugge il cookie di sessione se esiste
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time()-3600, '/');
}

// Distrugge la sessione
session_destroy();

// Invia una risposta JSON
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logout effettuato con successo']);
?> 