<?php
// Configuración de reCAPTCHA
$recaptchaSecret = "6Le0OyErAAAAAG_0BzzyiC8JJW9ZrxbsqGNfVAbr"; // Reemplaza con tu clave secreta

// Obtener los datos enviados desde el formulario
$data = json_decode(file_get_contents("php://input"), true);

// Validar los datos del formulario
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$message = $data['message'] ?? '';
$contactType = $data['contactType'] ?? '';
$captchaToken = $data['captchaToken'] ?? '';

if (empty($name) || empty($email) || empty($phone) || empty($message) || empty($captchaToken)) {
    http_response_code(400);
    echo json_encode(["error" => "Todos los campos son obligatorios."]);
    exit;
}

// Validar el token de reCAPTCHA
$recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";
$response = file_get_contents("$recaptchaUrl?secret=$recaptchaSecret&response=$captchaToken");
$responseKeys = json_decode($response, true);

if (!$responseKeys["success"]) {
    http_response_code(400);
    echo json_encode(["error" => "reCAPTCHA no válido."]);
    exit;
}

// Opcional: Enviar un correo con los datos del formulario
$to = "destinatario@tudominio.com"; // Cambia esto por el correo donde recibirás los mensajes
$subject = "Nuevo mensaje de contacto - $contactType";
$body = "Nombre: $name\nCorreo: $email\nTeléfono: $phone\nMensaje:\n$message";
$headers = "From: $email";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(["success" => "Formulario enviado con éxito."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al enviar el correo."]);
}
?>