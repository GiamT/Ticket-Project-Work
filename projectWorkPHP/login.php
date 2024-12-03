<?php
session_start(); // Inizia o riprende una sessione

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Disabilita l'output degli errori PHP come HTML
ini_set('display_errors', 0);
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Prima pulisce eventuali sessioni precedenti
        $_SESSION = array();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            throw new Exception('Dati di input non validi');
        }
        
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            throw new Exception('Username e password sono richiesti');
        }
        
        // URL del microservizio Spring Boot
        $url = 'http://localhost:8080/api/utenti/login';
        
        // Preparazione dei dati per la chiamata
        $postData = json_encode([
            'username' => $username,
            'password' => $password
        ]);
        
        // Inizializzazione cURL
        $ch = curl_init($url);
        if ($ch === false) {
            throw new Exception('Errore nell\'inizializzazione di cURL');
        }
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($postData)
        ]);
        
        // Esecuzione della chiamata
        $response = curl_exec($ch);
        if ($response === false) {
            throw new Exception('Errore nella chiamata API: ' . curl_error($ch));
        }
        
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $userData = json_decode($response, true);
            if ($userData === null) {
                throw new Exception('Risposta API non valida');
            }
            
            // Verifica esplicita del ruolo amministratore
            if (isset($userData['amministratore'])) {
                // Aggiungiamo un campo più esplicito per il ruolo
                $userData['isAdmin'] = $userData['amministratore'] === true;
                
                // Salva i dati dell'utente nella sessione
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['username'] = $userData['username'];
                $_SESSION['isAdmin'] = $userData['isAdmin'];
                $_SESSION['last_access'] = time();
                $_SESSION['logged_in'] = true; // Flag esplicito di login
                
                if (isset($userData['cliente'])) {
                    $_SESSION['cliente_id'] = $userData['cliente']['id'];
                }
                if (isset($userData['admin'])) {
                    $_SESSION['admin_id'] = $userData['admin']['id'];
                }
                
                $response = json_encode($userData);
            }
        } else {
            throw new Exception('Login fallito: credenziali non valide');
        }
        
        http_response_code($httpCode);
        echo $response;
        
    } catch (Exception $e) {
        // In caso di errore, assicurati che la sessione sia pulita
        $_SESSION = array();
        session_destroy();
        
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo non permesso']);
}
?> 