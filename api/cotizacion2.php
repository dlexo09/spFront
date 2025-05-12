<?php
// Mostrar errores para depuración (quítalo en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Valores por default para prueba
$nombre = "Prueba";
$email = "prueba@siscoprint.com";
$telefono = "5555555555";
$mensaje = "Este es un mensaje de prueba desde cotizacion.php";
$sku = "SKU-PRUEBA";
$productName = "Producto de Prueba";

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