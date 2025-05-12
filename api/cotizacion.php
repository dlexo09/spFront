<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Obtener datos del POST
$data = json_decode(file_get_contents("php://input"), true);

// Guardar datos recibidos para depuración (opcional)
file_put_contents(__DIR__ . "/cotizacion_debug.txt", print_r($data, true));

// Asignar variables SIN echo
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$telefono = $data['telefono'] ?? '';
$mensaje = $data['mensaje'] ?? '';
$sku = $data['sku'] ?? '';
$productName = $data['productName'] ?? '';

// Validación básica
if (!$nombre || !$email || !$telefono || !$sku) {
    echo json_encode(['error' => 'Faltan datos obligatorios.']);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Correo electrónico no válido.']);
    exit;
}

// Destinatario
$to = "dlexo09@gmail.com";
$subject = "Nueva solicitud de cotización (SKU: $sku)";
$body = "Nombre: $nombre\nCorreo: $email\nTeléfono: $telefono\nSKU: $sku\nProducto: $productName\nMensaje: $mensaje";
$headers = "From: $email\r\nReply-To: $email\r\n";

// Enviar correo
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'No se pudo enviar el correo.']);
}
?>