<?php
require_once 'functions.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST["email"];
    $senha = $_POST["senha"];
    $senhaHash = hash('sha256', $senha);

    $loginData = new LoginData();
    $userData = new UserData();
    
    $verificar_email = $userData->emailExiste($email);
    error_log("verificar email: $verificar_email"); 
    // 0 = não | 1 = sim
    if ($verificar_email == '1') {
        $user = $loginData->loginUser($email, $senhaHash);
        if ($user) {
            $statusUsuario = $userData->verificarStatus($user['id']);
            error_log("status:  $statusUsuario");
            if($statusUsuario == 'ativo') {
                $posicaoUsuario = $userData->verificarPosicao($user['id']);
                $_SESSION['user'] = array(
                    'id' => $user['id'],
                    'nome' => $user['nome'],
                    'apelido' => $user['apelido'],
                    'email' => $user['email'],
                    'whatsapp' => $user['whatsapp'],
                    'posicao' => $posicaoUsuario  
                );
                if ($posicaoUsuario == "Membro"){
                    $sessaoMembro = new SessaoMembro();
                    $resultado = $sessaoMembro->informacoes_usuario($user['id']);
                }else{
                    $sessaoAdmin = new SessaoAdmin();
                    $resultado = "certo";
                }
                
                if ($resultado == "certo"){
                    $response = array("success" => true, "message" => "Login realizado com sucesso.", "posicao" => $posicaoUsuario);
                }

            } elseif ($statusUsuario == 'inativo') {
                $response = array(
                    "success" => false,
                    "message" => "Você não tem acesso ao Painel, entre em contato com o administrador ou tente novamente mais tarde.",
                    "redirect" => "logout.php"
                );
            }else{
                error_log("$statusUsuario");
                $response = array(
                    "success" => false,
                    "message" => "erro ao verificar o status do usuário.",
                    "redirect" => "logout.php"
                );
            }
        } else {
            $response = array("success" => false, "message" => "Senha de login inválidas. Por favor, tente novamente.");
        }
    } else {
        $response = array("success" => false, "message" => "E-mail não está cadastrado no banco de dados");
    }
} else {
    $response = array("success" => false, "message" => "Método de requisição inválido.");
}

header('Content-Type: application/json');
echo json_encode($response);
?>
