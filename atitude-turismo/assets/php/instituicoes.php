<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    require_once 'functions.php';
    require_once 'atualizar.php';
    $instituicoes = new instituicoes();
    $atualizar = new Atualizar();
    $tipoAtualizar = "instituicoes";

    if (isset($_POST["tipoAtualizacao"])) {
        $tipoAtualizacao = $_POST["tipoAtualizacao"];
        if ($tipoAtualizacao === "cadastro") {
            $tipoSegmento = isset($_POST["tipoSegmento"]) ? $_POST["tipoSegmento"] : "";
            $checkedValues = "0";
            if ($tipoSegmento == "escolar") {
                if (isset($_POST["checkedValues"])) {
                    $checkedValues = $_POST["checkedValues"];
                    $checkedValues = json_decode($checkedValues);
                    if (is_array($checkedValues)) {
                        $checkedValues = implode(',', $checkedValues);
                    }
                }
            }
            $tituloSegmento = isset($_POST["tituloSegmento"]) ? $_POST["tituloSegmento"] : "";
            $descricaoSegmento = isset($_POST["descricaoSegmento"]) ? $_POST["descricaoSegmento"] : "";
            $nomeResponsavel = isset($_POST["nomeResponsavel"]) ? $_POST["nomeResponsavel"] : "";
            $telefoneResponsavel = isset($_POST["telefoneResponsavel"]) ? preg_replace("/[^0-9]/", "", $_POST["telefoneResponsavel"]) : "";
            $end_cep = isset($_POST["end_cep"]) ? str_replace("-", "", $_POST["end_cep"]) : "";
            $end_numero = isset($_POST["end_numero"]) ? $_POST["end_numero"] : "";
            $end_logradouro = isset($_POST["end_logradouro"]) ? $_POST["end_logradouro"] : "";
            $end_bairro = isset($_POST["end_bairro"]) ? $_POST["end_bairro"] : "";
            $end_cidade = isset($_POST["end_cidade"]) ? $_POST["end_cidade"] : "";
            $end_uf = isset($_POST["end_uf"]) ? $_POST["end_uf"] : "";
            $opcaoFuncao = "criar";
            $instituicaoId = "";
            $statusInstituicao = "";
            $cadastrar_instituicao = $instituicoes->inserirInstituicao($opcaoFuncao, $instituicaoId, $statusInstituicao, $tituloSegmento, $descricaoSegmento, $nomeResponsavel, $telefoneResponsavel, $end_cep, $end_numero, $end_logradouro, $end_bairro, $end_cidade, $end_uf, $checkedValues);
            if ($cadastrar_instituicao === true) {
                $atualizar->atualizar($tipoAtualizar);
                $response = ["success" => true, "message" => "Dados salvos com sucesso"];
            } else {
                $response = ["success" => false, "message" => "Não foi possível salvar os dados."];
            }
        }elseif ($tipoAtualizacao === "atualizar"){
            if (isset($_POST['instituicaoId'])) {
                $instituicaoId = (int)$_POST["instituicaoId"];
                $statusInstituicao = $_POST['statusInstituicao'] ?? '';
                if ($statusInstituicao === 'Inativo') {$statusInstituicao = 0;} elseif ($statusInstituicao === 'Ativo') {$statusInstituicao = 1;}
                if (isset($_POST["checkedValues"])) {$checkedValues = $_POST["checkedValues"];$checkedValues = json_decode($checkedValues);
                    if (is_array($checkedValues)) {
                        $checkedValues = implode(',', $checkedValues);
                    }
                }
                $tituloSegmento = isset($_POST["tituloInstituicao"]) ? $_POST["tituloInstituicao"] : "";
                $descricaoSegmento = isset($_POST["descricaoInstituicao"]) ? $_POST["descricaoInstituicao"] : "";
                $nomeResponsavel = isset($_POST["nomeResponsavel"]) ? $_POST["nomeResponsavel"] : "";
                $telefoneResponsavel = isset($_POST["telefoneResponsavel"]) ? preg_replace("/[^0-9]/", "", $_POST["telefoneResponsavel"]) : "";
                $end_cep = isset($_POST["cepInstituicao"]) ? str_replace("-", "", $_POST["cepInstituicao"]) : "";
                $end_numero = isset($_POST["numeroInstituicao"]) ? $_POST["numeroInstituicao"] : "";
                $end_logradouro = isset($_POST["logradouroInstituicao"]) ? $_POST["logradouroInstituicao"] : "";
                $end_bairro = isset($_POST["bairroInstituicao"]) ? $_POST["bairroInstituicao"] : "";
                $end_cidade = isset($_POST["cidadeInstituicao"]) ? $_POST["cidadeInstituicao"] : "";
                $end_uf = isset($_POST["ufInstituicao"]) ? $_POST["ufInstituicao"] : "";
                $opcaoFuncao = "atualizar";
                $cadastrar_instituicao = $instituicoes->inserirInstituicao(
                    $opcaoFuncao, 
                    $instituicaoId, 
                    $statusInstituicao,
                    $tituloSegmento, 
                    $descricaoSegmento, 
                    $nomeResponsavel, 
                    $telefoneResponsavel, 
                    $end_cep, 
                    $end_numero, 
                    $end_logradouro, 
                    $end_bairro, 
                    $end_cidade, 
                    $end_uf, 
                    $checkedValues, 
                );
                if ($cadastrar_instituicao === true) {
                    $atualizar->atualizar($tipoAtualizar);
                    $response = ["success" => true, "message" => "Dados salvos com sucesso"];
                } else {
                    $response = ["success" => false, "message" => "Não foi possível salvar os dados."];
                }
            } else {
                $response = ["success" => false, "message" => "ID da Instituição não fornecido"];
            }
        }elseif ($tipoAtualizacao === "excluir"){
            if (isset($_POST['instituicaoId'])) {
                $instituicaoId = (int)$_POST["instituicaoId"];
                $excluirEvento = true;
                //$excluirEvento = $eventos->inserirEvento($opcaoFuncao, $instituicaoId, $statusEvento, $tituloEvento, $cepEvento, $numeroEvento, $logradouroEvento, $bairroEvento,$cidadeEvento,$ufEvento,$dtInicioEvento,$dtFimEvento,$descricaoEvento,$checkedValues, $valorEvento);
                if ($excluirEvento == true){
                    //$atualizar->atualizar($tipoAtualizar);
                    $response = ["success" => true, "message" => "Dados Excluídos com sucesso"];
                }else{
                    $response = ["success" => false, "message" => "Erro ao Excluídos os dados no banco"];
                }
            } else {
                $response = ["success" => false, "message" => "ID do evento não fornecido"];
            }
        }else {
            $response = ["success" => false, "message" => "Tipo de atualização desconhecido"];
        }
    }else {
        $response = ["success" => false, "message" => "Tipo de atualização não definido"];
    } 
    
} else {
    http_response_code(405);
    $response = ["success" => false, "message" => "Método não permitido."];
}

header('Content-Type: application/json');
echo json_encode($response);

// Função para gerar código de 6 dígitos aleatórios (números e letras)
function generateRandomCode($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>
