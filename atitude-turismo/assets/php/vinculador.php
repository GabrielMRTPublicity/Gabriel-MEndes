<?php
require_once 'functions.php';
$vinculador = new vincular_eventos_instituicoes();
$vinculadorGet = puxarTodosDados::getInstance();
$response = array();

$instituicoesAtivas = $vinculadorGet->getInstituicoesAtivas();
$eventosAtivos = $vinculadorGet->getEventosAtivos();
$vinculos = $vinculadorGet->getVinculosComTitulos();
// Processa a requisição POST para adicionar ou remover vínculos
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    $eventoId = $_POST['evento_id'];
    $instituicaoId = $_POST['instituicao_id'];

    if ($action === 'add') {
        $resultado = $vinculador->vincularEventoInstituicao($eventoId, $instituicaoId);
        if ($resultado === true) {
            $response = array('success' => true, 'message' => 'Vínculo adicionado com sucesso.');
        } elseif ($resultado === false) {
            $response = array('success' => false, 'message' => 'Vínculo já existe.');
        } elseif ($resultado === "erro") {
            $response = array('success' => false, 'message' => 'Erro ao adicionar vínculo.');
        }
    }elseif ($action === 'remove') {
        $resultado = $vinculador->desvincularEventoInstituicao($eventoId, $instituicaoId);
        if ($resultado === true) {
            $response = array('success' => true, 'message' => 'Vínculo removido com sucesso.');
        } elseif ($resultado === false) {
            $response = array('success' => false, 'message' => 'Vínculo não existe.');
        } elseif ($resultado === "erro") {
            $response = array('success' => false, 'message' => 'Erro ao remover vínculo.');
        }
    } else {
        $response = array('success' => false, 'message' => 'Ação inválida.');
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}

// Processa a requisição GET para carregar os dados
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response = array();
    if (!empty($instituicoesAtivas)) {
        $instituicoesArray = array();
        foreach ($instituicoesAtivas as $instituicao) {
            $instituicoesArray[] = array(
                'ID' => $instituicao['id'],
                'Título' => $instituicao['titulo'],
                'check_obs' => $instituicao['check_obs']
            );
        }
        $response['instituicoes'] = $instituicoesArray;
    } else {
        $response['instituicoes'] = array('mensagem' => "Nenhuma instituição ativa encontrada.");
    }
    if (!empty($eventosAtivos)) {
        $eventosArray = array();
        foreach ($eventosAtivos as $evento) {
            $eventosArray[] = array(
                'ID' => $evento['id'],
                'Título' => $evento['titulo'],
                'check_obs' => $evento['check_obs']
            );
        }
        $response['eventos'] = $eventosArray;
    } else {
        $response['eventos'] = array('mensagem' => "Nenhum evento ativo encontrado.");
    }
    if (!empty($vinculos)) {
        $response['vinculos'] = $vinculos;
    } else {
        $response['vinculos'] = array('mensagem' => "Nenhum vínculo encontrado.");
    }

    header('Content-Type: application/json');
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

?>
