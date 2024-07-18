<?php
header('Content-Type: application/json');

$response = ["success" => false, "files" => []];

if (isset($_GET['path']) && isset($_GET['tipo'])) {
    $path = urldecode($_GET['path']);
    $tipo = $_GET['tipo'];

    // Convert URL to a filesystem path
    $path = str_replace('http://localhost/', $_SERVER['DOCUMENT_ROOT'] . '/', $path);
    //$path = str_replace('https://rthomolog.com.br/sistema/atitude-turismo/', $_SERVER['DOCUMENT_ROOT'] . '/', $path);
    if (file_exists($path) && is_dir($path)) {
        $files = array_diff(scandir($path), array('.', '..'));
        $files = array_values(array_filter($files, function($file) use ($path, $tipo) {
            if (is_file($path . $file)) {
                $extension = pathinfo($path . $file, PATHINFO_EXTENSION);
                if ($tipo === 'img') {
                    return in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif']);
                } elseif ($tipo === 'pdf') {
                    return $extension === 'pdf';
                }
            }
            return false;
        }));

        if (!empty($files)) {
            $response["success"] = true;
            $response["files"] = $files;
        }
    } else {
        error_log("O caminho não existe ou não é um diretório: $path");
    }
} else {
    error_log("Nenhum caminho ou tipo fornecido.");
}

echo json_encode($response);
?>
