<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

ini_set('display_errors', 0);
error_reporting(0);

$baseUrl = 'http://localhost:8080';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            if (isset($_GET['id']) && !empty($_GET['id'])) {
                // Recupero dettagli di un singolo cliente
                $clienteId = $_GET['id'];
                $url = $baseUrl . "/api/clienti/" . $clienteId;
            } else {
                // Recupero di tutti i clienti
                $url = $baseUrl . '/api/clienti/all';
            }
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            if ($httpCode === 200) {
                echo $response;
            } else {
                throw new Exception('Errore nel recupero dei clienti');
            }
            
            curl_close($ch);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validazione dei dati richiesti
            if (!isset($data['nome']) || !isset($data['email']) || !isset($data['telefono']) || 
                !isset($data['indirizzo']) || !isset($data['codiceFiscale'])) {
                throw new Exception('Dati mancanti');
            }

            // Preparazione della richiesta POST
            $clienteData = [
                'nome' => $data['nome'],
                'email' => $data['email'],
                'telefono' => $data['telefono'],
                'partitaIva' => $data['partitaIva'] ?: null,
                'codiceFiscale' => $data['codiceFiscale'],
                'indirizzo' => $data['indirizzo']
            ];

            $url = $baseUrl . '/api/clienti';
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($clienteData));
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
                throw new Exception($error['message'] ?? 'Errore nella creazione del cliente');
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
