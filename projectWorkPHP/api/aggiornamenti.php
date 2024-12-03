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
            $url = $baseUrl . "/api/aggiornamenti/ticket/" . $ticketId;
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            error_log("Requesting updates for ticket ID: " . $ticketId);
            error_log("Request URL: " . $url);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            error_log("Response code: " . $httpCode);
            error_log("Response body: " . $response);
            
            if ($httpCode === 200) {
                $aggiornamenti = json_decode($response, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('Errore nel parsing JSON: ' . json_last_error_msg());
                }
                echo json_encode($aggiornamenti);
            } else {
                throw new Exception('Errore nel recupero degli aggiornamenti. Status: ' . $httpCode);
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            error_log("Error in aggiornamenti.php GET: " . $e->getMessage());
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
            if (!isset($data['descrizione']) || empty(trim($data['descrizione']))) {
                throw new Exception('Descrizione mancante o non valida');
            }

            $aggiornamentoData = [
                'ticketId' => intval($data['ticketId']),
                'descrizione' => trim($data['descrizione']),
                'dataAggiornamento' => $data['dataAggiornamento'] ?? date('Y-m-d\TH:i:s.000\Z')
            ];

            error_log("Sending aggiornamento data: " . json_encode($aggiornamentoData));

            $url = $baseUrl . '/api/aggiornamenti';
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($aggiornamentoData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            error_log("Aggiornamento response code: " . $httpCode);
            error_log("Aggiornamento response: " . $response);
            
            if ($httpCode === 201) {
                echo $response;
            } else {
                error_log("Error response body: " . $response);
                throw new Exception('Errore nella creazione dell\'aggiornamento. Status: ' . $httpCode);
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            error_log("Error in aggiornamenti.php POST: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => $e->getMessage(),
                'details' => 'Errore nella creazione dell\'aggiornamento'
            ]);
        }
        break;
}
?> 