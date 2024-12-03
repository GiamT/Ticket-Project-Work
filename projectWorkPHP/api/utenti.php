<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$baseUrl = 'http://localhost:8080';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            if (isset($_GET['username'])) {
                // Recupero utente specifico
                $username = $_GET['username'];
                $url = $baseUrl . "/api/utenti/$username";
            } else {
                // Recupero di tutti gli utenti
                $url = $baseUrl . '/api/utenti/all';
            }
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            if ($httpCode === 200) {
                echo $response;
            } else {
                throw new Exception('Errore nel recupero degli utenti');
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            // Estrai l'ID del cliente dall'URL
            $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $pathSegments = explode('/', $path);
            $clienteId = end($pathSegments);

            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['username']) || !isset($data['password'])) {
                throw new Exception('Username e password sono richiesti');
            }

            // Preparazione dei dati per la richiesta
            $userData = [
                'username' => $data['username'],
                'password' => $data['password'],
                'amministratore' => false
            ];

            // URL per la creazione dell'utente
            $url = $baseUrl . "/api/utenti/$clienteId";
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            if ($httpCode === 201) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Utente creato con successo',
                    'data' => json_decode($response)
                ]);
            } else {
                $error = json_decode($response, true);
                throw new Exception($error['message'] ?? 'Errore nella creazione dell\'utente');
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Metodo non permesso']);
        break;
}
?>