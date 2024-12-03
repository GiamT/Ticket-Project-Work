<?php
session_start(); // Riprende la sessione esistente

header('Content-Type: application/json');

$response = [
    'authenticated' => false,
    'isAdmin' => false,
    'username' => null
];

// Verifica se l'utente è loggato
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    $response['authenticated'] = true;
    $response['isAdmin'] = $_SESSION['isAdmin'] ?? false;
    $response['username'] = $_SESSION['username'] ?? null;
    $response['last_access'] = $_SESSION['last_access'] ?? null;
}

echo json_encode($response);
?> 