<?php
require_once 'functions.php';

$userData = new UserData();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tipo = $_POST["tipo"];
    if ($tipo == 'mudarSenha'){
        $email = $_POST["email"];
        $verificar_email = $userData->emailExiste($email);//0 não e 1 sim 
        if ($verificar_email == '1'){
            $resultado = $userData->criarSalvaEnviarSenha($email);
            if ($resultado == true) {
                $response = array("success" => true, "message" => "Uma senha foi gerada e enviado para seu E-mail");
            }elseif ($resultado == "erroSenha") {
               $response = array("success" => false, "message" => "Erro ao tentar subir a senha no Banco de dados");
            } else {
                $response = array("success" => false, "message" => "Erro ao enviar a senha por E-mail");
            }
        } else {
            $response = array("success" => false, "message" => "E-mail não está cadastrado no banco de dados");
        }
    }
} else {
    $response = array("success" => false, "message" => "não foi feito o metodo post");
    http_response_code(405);
}
header('Content-Type: application/json');
echo json_encode($response);
?>
