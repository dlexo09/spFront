<?php
session_start();

// Limitar la frecuencia de envíos (1 envío por minuto)
if (!isset($_SESSION['last_submit_time'])) {
    $_SESSION['last_submit_time'] = 0;
}

$timeSinceLastSubmit = time() - $_SESSION['last_submit_time'];
if ($timeSinceLastSubmit < 60) { // Limitar a 1 envío por minuto
    http_response_code(429);
    echo "Por favor, espera antes de enviar otra solicitud.";
    exit;
}

$_SESSION['last_submit_time'] = time();

// Validar el CAPTCHA con Google
$captchaToken = $_POST['captchaToken'];
$secretKey = "6Le0OyErAAAAAG_0BzzyiC8JJW9ZrxbsqGNfVAbr"; // Reemplaza con tu Secret Key

$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captchaToken");
$responseKeys = json_decode($response, true);

if (!$responseKeys["success"]) {
    http_response_code(400);
    echo "Error en la validación del CAPTCHA.";
    exit;
}

// Configuración del correo
$to = "dlexo0909@gmail.com"; // Reemplaza con tu correo de destino
$subject = "Solicitud de Cotización";

// Obtener los datos enviados desde el formulario
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);
$message = trim($_POST['message']);
$productName = trim($_POST['productName']);
$productSku = trim($_POST['productSku']);

// Validar los campos
if (empty($name) || empty($email) || empty($phone) || empty($productName) || empty($productSku)) {
    http_response_code(400);
    echo "Todos los campos son obligatorios.";
    exit;
}

// Validar el correo electrónico
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Correo electrónico no válido.";
    exit;
}

// Crear el cuerpo del correo
$body = "Solicitud de Cotización\n\n";
$body .= "Nombre: $name\n";
$body .= "Correo: $email\n";
$body .= "Teléfono: $phone\n";
$body .= "Producto: $productName (SKU: $productSku)\n";
$body .= "Mensaje: $message\n";

// Encabezados del correo
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Enviar el correo
if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo "Correo enviado con éxito.";
} else {
    http_response_code(500);
    echo "Error al enviar el correo.";
}
?>