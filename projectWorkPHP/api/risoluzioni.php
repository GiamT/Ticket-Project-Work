<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$baseUrl = 'http://localhost:8080';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            if (!isset($_GET['ticketId'])) {
                throw new Exception('ID ticket non specificato');
            }

            $ticketId = $_GET['ticketId'];
            $url = $baseUrl . "/api/risoluzioni/ticket/" . $ticketId;
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            error_log("Requesting resolution for ticket ID: " . $ticketId);
            error_log("Request URL: " . $url);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            error_log("Response code: " . $httpCode);
            error_log("Response body: " . $response);
            
            if ($httpCode === 200) {
                $risoluzione = json_decode($response, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('Errore nel parsing JSON: ' . json_last_error_msg());
                }
                echo json_encode($risoluzione);
            } else {
                throw new Exception('Errore nel recupero della risoluzione. Status: ' . $httpCode);
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            error_log("Error in risoluzioni.php GET: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['ticketId']) || !is_numeric($data['ticketId'])) {
                throw new Exception('ticketId mancante o non valido');
            }
            if (!isset($data['note']) || empty(trim($data['note']))) {
                throw new Exception('Note di risoluzione mancanti o non valide');
            }

            // Prepara i dati nel formato atteso dal DTO Java
            $risoluzioneData = [
                'ticketId' => intval($data['ticketId']),
                'note' => trim($data['note']),
                'dataRisoluzione' => $data['dataRisoluzione'] ?? date('Y-m-d\TH:i:s.000\Z')
            ];

            error_log("Sending risoluzione data: " . json_encode($risoluzioneData));

            $url = $baseUrl . '/api/risoluzioni';
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($risoluzioneData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            error_log("Risoluzione response code: " . $httpCode);
            error_log("Risoluzione response: " . $response);
            
            if ($httpCode === 201) {
                echo $response;
            } else {
                error_log("Error response body: " . $response);
                throw new Exception('Errore nella creazione della risoluzione. Status: ' . $httpCode);
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            error_log("Error in risoluzioni.php POST: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => $e->getMessage(),
                'details' => 'Errore nella creazione della risoluzione'
            ]);
        }
        break;
}
?> 