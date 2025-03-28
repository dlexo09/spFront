<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Configuración de la base de datos
$host = "localhost"; // Cambia esto si tu base de datos está en otro servidor
$user = "root"; // Usuario de MySQL
$password = ""; // Contraseña de MySQL
$database = "siscoprint"; // Nombre de tu base de datos

// Conexión a la base de datos
$conn = new mysqli($host, $user, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit;
}

// Obtener la ruta solicitada
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Ruta para obtener todos los productos
if ($requestMethod === 'GET' && strpos($requestUri, '/api/products') !== false) {
    if (preg_match('/\/api\/products\/([^\/]+)/', $requestUri, $matches)) {
        // Obtener un producto por SKU
        $sku = $matches[1];
        $productQuery = "SELECT * FROM productos WHERE sku = ?";
        $stmt = $conn->prepare($productQuery);
        $stmt->bind_param("s", $sku);
        $stmt->execute();
        $productResult = $stmt->get_result();

        if ($productResult->num_rows > 0) {
            $product = $productResult->fetch_assoc();

            // Obtener las imágenes del producto
            $imagesQuery = "SELECT image_url FROM galeriaproductos WHERE sku = ?";
            $stmt = $conn->prepare($imagesQuery);
            $stmt->bind_param("s", $sku);
            $stmt->execute();
            $imagesResult = $stmt->get_result();

            $images = [];
            while ($row = $imagesResult->fetch_assoc()) {
                $images[] = $row['image_url'];
            }

            $product['galeria'] = $images;
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Producto no encontrado"]);
        }
    } else {
        // Obtener todos los productos
        $query = "SELECT * FROM productos";
        $result = $conn->query($query);

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        echo json_encode($products);
    }
    exit;
}

// Si la ruta no coincide
http_response_code(404);
echo json_encode(["error" => "Ruta no encontrada"]);