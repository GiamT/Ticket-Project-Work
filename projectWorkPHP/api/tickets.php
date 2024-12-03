<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$baseUrl = 'http://localhost:8080';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            if (isset($_GET['clienteId'])) {
                // Debug
                error_log("Requesting tickets for clientId: " . $_GET['clienteId']);
                
                // Recupero ticket di un cliente specifico
                $clienteId = $_GET['clienteId'];
                $url = $baseUrl . "/api/ticket/all";
                
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json'
                ));
                
                // Debug della richiesta
                error_log("Making request to: " . $url);
                
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                
                // Debug della risposta
                error_log("Response code: " . $httpCode);
                error_log("Response body: " . $response);
                
                if ($response === false) {
                    throw new Exception('Errore cURL: ' . curl_error($ch));
                }
                
                if ($httpCode === 200) {
                    // Filtra i ticket per il cliente specifico
                    $tickets = json_decode($response, true);
                    $filteredTickets = array_filter($tickets, function($ticket) use ($clienteId) {
                        return $ticket['clienteId'] == $clienteId;
                    });
                    
                    header('Content-Type: application/json');
                    echo json_encode(array_values($filteredTickets));
                } else {
                    throw new Exception('Errore nel recupero dei ticket. Status code: ' . $httpCode . ', Response: ' . $response);
                }
                
                curl_close($ch);
            } elseif (isset($_GET['id'])) {
                // Recupero dettagli di un ticket specifico
                $ticketId = $_GET['id'];
                $url = $baseUrl . "/api/ticket/" . $ticketId;
                
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                
                if ($httpCode === 200) {
                    echo $response;
                } else {
                    throw new Exception('Errore nel recupero del ticket');
                }
                
                curl_close($ch);
            } else {
                // Recupero di tutti i ticket
                $url = $baseUrl . '/api/ticket/all';
                
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                
                if ($httpCode === 200) {
                    echo $response;
                } else {
                    throw new Exception('Errore nel recupero dei ticket');
                }
                
                curl_close($ch);
            }
        } catch (Exception $e) {
            error_log("Error in tickets.php: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => $e->getMessage(),
                'details' => 'Errore nel recupero dei ticket'
            ]);
        }
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['clienteId']) || !isset($data['descrizione'])) {
                throw new Exception('Dati mancanti');
            }

            $clienteId = $data['clienteId'];
            
            // Prepara i dati per il backend
            $ticketData = [
                'descrizione' => $data['descrizione'],
                'statoId' => 1 // Stato APERTO
            ];
            
            $url = $baseUrl . '/api/ticket?clienteId=' . $clienteId;
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($ticketData));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            if ($httpCode === 201) {
                echo $response;
            } else {
                $error = json_decode($response, true);
                throw new Exception($error['message'] ?? 'Errore nella creazione del ticket');
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $pathSegments = explode('/', $path);
            $ticketId = end($pathSegments);

            if (!$ticketId) {
                throw new Exception('ID ticket non specificato');
            }

            $url = $baseUrl . "/api/ticket/" . $ticketId;
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            if ($httpCode === 204) {
                http_response_code(204);
            } else {
                throw new Exception('Errore nell\'eliminazione del ticket');
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        try {
            if (!isset($_GET['id'])) {
                throw new Exception('ID ticket non specificato');
            }

            $ticketId = $_GET['id'];
            $data = json_decode(file_get_contents('php://input'), true);
            
            error_log("Updating ticket status: " . json_encode($data));

            // Costruisci l'URL corretto per l'API backend
            $url = $baseUrl . '/api/ticket/' . $ticketId;
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json'
            ));
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            error_log("Ticket update response code: " . $httpCode);
            error_log("Ticket update response: " . $response);
            
            if ($httpCode === 200) {
                echo $response;
            } else {
                throw new Exception('Errore nell\'aggiornamento del ticket');
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            error_log("Error in tickets.php PUT: " . $e->getMessage());
        }
        break;
}
?>