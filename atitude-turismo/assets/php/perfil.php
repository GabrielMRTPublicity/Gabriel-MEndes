<?php
require_once 'functions.php';

$userId = $_SESSION['user']['id'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['acao'])) {
        switch ($_POST['acao']) {
            case 'upload_imagem':
                uploadImagem($userId);
                break;
            case 'atualizar_informacoes':
                atualizarInformacoes($userId); // Ajustada para cumprir sua solicitação
                break;
            case 'atualizar_endereco':
                atualizarEndereco($userId); // Ajustada para cumprir sua solicitação
                break;
            case 'atualizar_senha':
                atualizarSenha($userId); // Ajustada para cumprir sua solicitação
                break;
            default:
                echo json_encode(['error' => false, 'message' => 'Ação desconhecida.']);
                break;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Nenhuma ação especificada.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
}

function uploadImagem($userId) {
    $targetDirectory = "../img/avatars/";
    $targetFile = $targetDirectory . "avatar_" . $userId . '.png';

    if (isset($_FILES["imagem"])) {
        $check = getimagesize($_FILES["imagem"]["tmp_name"]);
        if ($check !== false) {
            if ($_FILES["imagem"]["size"] > 500000) {
                echo json_encode(['success' => false, 'message' => "Desculpe, o arquivo é muito grande."]);
            } else {
                if (move_uploaded_file($_FILES["imagem"]["tmp_name"], $targetFile)) {
                    echo json_encode(['success' => true, 'message' => "O arquivo foi enviado com sucesso."]);
                } else {
                    echo json_encode(['success' => false, 'message' => "Desculpe, houve um erro ao enviar seu arquivo."]);
                }
            }
        } else {
            echo json_encode(['success' => false, 'message' => "Arquivo não é uma imagem."]);
        }
    }
}

function atualizarInformacoes($userId) {
    // Lista dos campos permitidos e que podem ser atualizados
    $camposPermitidos = ['nome', 'whatsapp', 'email', 'cpf', 'data_nasc', 'genero'];
    
    $dadosRecebidos = $_POST;
    
    $dadosParaAtualizar = [];
    
    foreach ($dadosRecebidos as $campo => $valor) {
        if (in_array($campo, $camposPermitidos) && !empty($valor)) {
            // Para campos específicos, remove pontuações
            if ($campo === 'whatsapp' || $campo === 'cpf') {
                $valor = preg_replace('/\D/', '', $valor); // Remove todos os caracteres não dígitos
            }
            $dadosParaAtualizar[$campo] = $valor;
        }
    }
    
   // error_log(print_r($dadosParaAtualizar, true)); 
    $userData = new UserData();
    $loginData = new LoginData();
    if ($userData->atualizarInformacoes($userId, $dadosParaAtualizar)) {
        $dadosAtualizadosDoUsuario = $userData->obterDadosDoUsuarioPorId($userId);
        $address = $loginData->getUserAddress($userId);
        atualizarSessaoUsuario($dadosAtualizadosDoUsuario);
        atualizarSessaoUsuarioEndereco($address);

        echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Falha ao atualizar dados.']);
    }
}

function atualizarEndereco($userId) {
    $fk_pessoas = $userId;
    $dadosRecebidos = $_POST;
    $cep = preg_replace('/\D/', '', $dadosRecebidos['cep']);
    $logradouro = $dadosRecebidos['logradouro'];
    $numero = $dadosRecebidos['numero'];
    $bairro = $dadosRecebidos['bairro'];
    $cidade = $dadosRecebidos['cidade'];
    $uf = $dadosRecebidos['uf'];

    $userData = new UserData();
    $loginData = new LoginData();
    if ($userData->saveOrUpdateAddress($fk_pessoas, $cep, $logradouro, $numero, $bairro, $cidade, $uf)) {

        $address = $loginData->getUserAddress($userId);
        atualizarSessaoUsuarioEndereco($address);
        
        echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Falha ao atualizar dados.']);
    }
}

function atualizarSenha($userId) {    
    $dadosRecebidos = $_POST;
    $senha = $dadosRecebidos['senha'];
    $senhaHash = hash('sha256', $senha);
    //

    $userData = new UserData();
    $loginData = new LoginData();
    if ($userData->updateUserPassword($userId, $senhaHash)) {
        echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Falha ao atualizar dados.']);
    }
}

?>
