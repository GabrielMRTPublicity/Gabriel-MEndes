<?php
require_once 'functions.php';
$userData = new UserData();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST["tipo"])) {
        $response = array("success" => false, "message" => "A variável 'tipo' é obrigatória.");
    }else{
        $tipo = $_POST["tipo"];
        if ($tipo == "CadastroExternoSimples"){
            $nome = $_POST["nome"];
            $apelido = extrairPrimeiroNome($nome);
            $email = $_POST["email"];
            $whatsapp = preg_replace("/[^0-9]/", "", $_POST["whatsapp"]);
            $senha = $_POST["senha"];
            $senhaHash = hash('sha256', $senha);
            // error_log("Nome: $nome, Apelido: $apelido, Email: $email, WhatsApp: $whatsapp, Senha: $senhaHash");
            $verificar_email = $userData->emailExiste($email);// 0 = não | 1 = sim
            if ($verificar_email == '1'){
                $response = array("success" => false, "message" => "E-mail já cadastrado no sistema.");
            }else{
                $salvo = $userData->salvarUsuarios($nome, $apelido, $email, $whatsapp, $senhaHash);
                if ($salvo) {
                    $response = array("success" => true, "message" => "Dados salvos com sucesso!");
                } else {
                    $response = array("success" => false, "message" => "Erro ao salvar os dados. Por favor, tente novamente.");
                }
            }
        }elseif ($tipo == "CadastroInterno") {
            $nomeResponsavel = $_POST["nomeResponsavel"];
            $apelidoResposavel = extrairPrimeiroNome($nomeResponsavel);
            $emailResponsavel = $_POST["emailResponsavel"];
            $whatsappResponsavel = preg_replace("/[^0-9]/", "", $_POST["whatsappResponsavel"]);
            $cpfResponsavel = preg_replace("/[^0-9]/", "", $_POST["cpfResponsavel"]);
            $rgResponsavel = preg_replace("/[^0-9]/", "", $_POST["rgResponsavel"]);
            $orgaoResponsavel = $_POST["orgaoResponsavel"];
            $tituloEndereco = $_POST["tituloEndereco"];
            $cep_responsavel = str_replace("-", "", $_POST["cep_responsavel"]);
            $numero_responsavel = $_POST["numero_responsavel"];
            $logradouro_responsavel = $_POST["logradouro_responsavel"];
            $bairro_responsavel = $_POST["bairro_responsavel"];
            $cidade_responsavel = $_POST["cidade_responsavel"];
            $uf_responsavel = $_POST["uf_responsavel"];
            $infoDependentes = isset($_POST["infoDependentes"]) ? $_POST["infoDependentes"] : null;

            $enderecoResponsavel = [
                "tituloEndereco" => $tituloEndereco,
                "cep_responsavel" => $cep_responsavel,
                "numero_responsavel" => $numero_responsavel,
                "logradouro_responsavel" => $logradouro_responsavel,
                "bairro_responsavel" => $bairro_responsavel,
                "cidade_responsavel" => $cidade_responsavel,
                "uf_responsavel" => $uf_responsavel,
            ];
            
            if ($infoDependentes) {
                $dependentesOrganizados = organizarDependentes($infoDependentes);
            } else {
                $dependentesOrganizados = [];
            }

            $verificar_email = $userData->emailExiste($emailResponsavel); // 0 = não | 1 = sim
            if ($verificar_email == '1') {
                $response = array("success" => false, "message" => "E-mail já cadastrado no sistema.");
            } else {
                if ($dependentesOrganizados !== false) {
                    $salvo = $userData->salvarUsuariosInterno($nomeResponsavel, $apelidoResposavel, $emailResponsavel, $whatsappResponsavel, $cpfResponsavel, $rgResponsavel, $orgaoResponsavel, $enderecoResponsavel, $dependentesOrganizados);
                    if (is_bool($salvo) && $salvo === true) {
                        $response = array("success" => true, "message" => "Dados salvos com sucesso!");
                    } elseif (is_bool($salvo) && $salvo === false) {
                        $response = array("success" => false, "message" => "Erro ao salvar os dados. Por favor, tente novamente.");
                    } elseif (is_numeric($salvo) && strlen((string)$salvo) == 6) {
                        $response = array("success" => false, "message" => "Dados salvos porem a senha não foi enviada por E-mail. Código: $salvo");
                    } elseif ($salvo == "erroSenha") {
                        $response = array("success" => false, "message" => "Dados salvos, porem nao subiu no banco uma senha para o usuário.");
                    } else {
                        $response = array("success" => false, "message" => "Erro inesperado.");
                    }
                } else {
                    $response = array("success" => false, "message" => "Erro ao processar os dados dos dependentes.");
                }
            }
        }elseif ($tipo == "CadastroExterno") {
            $nomeResponsavel = $_POST["nomeResponsavel"];
            $apelidoResposavel = extrairPrimeiroNome($nomeResponsavel);
            $emailResponsavel = $_POST["emailResponsavel"];
            $whatsappResponsavel = preg_replace("/[^0-9]/", "", $_POST["whatsappResponsavel"]);
            $cpfResponsavel = preg_replace("/[^0-9]/", "", $_POST["cpfResponsavel"]);
            $rgResponsavel = preg_replace("/[^0-9]/", "", $_POST["rgResponsavel"]);
            $orgaoResponsavel = $_POST["orgaoResponsavel"];
            $tituloEndereco = $_POST["tituloEndereco"];
            $cep_responsavel = str_replace("-", "", $_POST["cep_responsavel"]);
            $numero_responsavel = $_POST["numero_responsavel"];
            $logradouro_responsavel = $_POST["logradouro_responsavel"];
            $bairro_responsavel = $_POST["bairro_responsavel"];
            $cidade_responsavel = $_POST["cidade_responsavel"];
            $uf_responsavel = $_POST["uf_responsavel"];
            $infoDependentes = isset($_POST["infoDependentes"]) ? $_POST["infoDependentes"] : null;
            $senha = $_POST["senhaResponsavel"];
            $senhaHash = hash('sha256', $senha);
            $enderecoResponsavel = [
                "tituloEndereco" => $tituloEndereco,
                "cep_responsavel" => $cep_responsavel,
                "numero_responsavel" => $numero_responsavel,
                "logradouro_responsavel" => $logradouro_responsavel,
                "bairro_responsavel" => $bairro_responsavel,
                "cidade_responsavel" => $cidade_responsavel,
                "uf_responsavel" => $uf_responsavel,
            ];
            
            if ($infoDependentes) {
                $dependentesOrganizados = organizarDependentes($infoDependentes);
            } else {
                $dependentesOrganizados = [];
            }

            $verificar_email = $userData->emailExiste($emailResponsavel); // 0 = não | 1 = sim
            if ($verificar_email == '1') {
                $response = array("success" => false, "message" => "E-mail já cadastrado no sistema.");
            } else {
                if ($dependentesOrganizados !== false) {
                    $salvo = $userData->salvarUsuariosExterno($nomeResponsavel, $apelidoResposavel, $emailResponsavel, $whatsappResponsavel, $senhaHash, $cpfResponsavel, $rgResponsavel, $orgaoResponsavel, $enderecoResponsavel, $dependentesOrganizados);
                    if (is_bool($salvo) && $salvo === true) {
                        $response = array("success" => true, "message" => "Dados salvos com sucesso!");
                    } elseif (is_bool($salvo) && $salvo === false) {
                        $response = array("success" => false, "message" => "Erro ao salvar os dados. Por favor, tente novamente.");
                    } else {
                        $response = array("success" => false, "message" => "Erro inesperado.");
                    }
                } else {
                    $response = array("success" => false, "message" => "Erro ao processar os dados dos dependentes.");
                }
            }
        }
    }
}
else{http_response_code(405);}

function organizarDependentes($dependentesJson) {
    $dependentes = json_decode($dependentesJson, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Erro ao decodificar JSON: " . json_last_error_msg());
        return false;
    }
    $dependentesOrganizados = [];
    foreach ($dependentes as $dependente) {
        if (!isset($dependente["tipoEvento"])) {
            $dependente["tipoEvento"] = "0";
        }
        $dtNascimentoParts = explode('/', $dependente["dtNascimentoDependente"]);
        if (count($dtNascimentoParts) == 3) {
            $dtNascimentoDependente = $dtNascimentoParts[2] . '-' . $dtNascimentoParts[1] . '-' . $dtNascimentoParts[0];
        } else {
            $dtNascimentoDependente = null; 
        }
        $cpfDependente = preg_replace("/[^0-9]/", "", $dependente["cpfDependente"]);
        $rgDependente = preg_replace("/[^0-9]/", "", $dependente["rgDependente"]);
        $dependenteOrganizado = [
            "instituicao_disponivel" => $dependente["instituicao_disponivel"],
            "evento_disponivel" => $dependente["evento_disponivel"],
            "tipoEvento" => $dependente["tipoEvento"],
            "nomeDependente" => $dependente["nomeDependente"],
            "dtNascimentoDependente" => $dtNascimentoDependente,
            "cpfDependente" => $cpfDependente,
            "rgDependente" => $rgDependente,
            "orgaoDependente" => $dependente["orgaoDependente"],
        ];
        //error_log("Dependente Organizado: " . json_encode($dependenteOrganizado));
        $dependentesOrganizados[] = $dependenteOrganizado;
    }
    return $dependentesOrganizados;
}

function extrairPrimeiroNome($nome) {
    $partesNome = explode(' ', $nome);
    return $partesNome[0];
}

// Retornar resposta JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
