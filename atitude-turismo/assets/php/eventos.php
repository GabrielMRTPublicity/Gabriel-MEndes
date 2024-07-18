<?php
ini_set('post_max_size', '100M');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    require_once 'functions.php';
    require_once 'atualizar.php';
    $atualizar = new Atualizar();
    $eventos = new Eventos();

    $tipoAtualizar = "eventos";
    $caminhoBaseUpload = __DIR__ . "/uploads/eventos/";
    $nomesArquivos = array();

    if (isset($_POST["tipoAtualizacao"])) {
        $tipoAtualizacao = $_POST["tipoAtualizacao"];
        if ($tipoAtualizacao === "cadastro") {
            if (isset($_POST["tipoEvento"])) {
                $tipoEvento = $_POST["tipoEvento"];
                $valorEvento = $_POST["valorEvento"];
                $uploadsObrigatorios = $_POST["uploadsObrigatorios"];
                $uploadsObrigatorios = json_decode($uploadsObrigatorios);
                $valorEvento = json_decode($valorEvento);
                $tipo = gettype($valorEvento);
                $checkedValues = "0";
                if($tipoEvento == "evento_escola"){$checkedValues = $_POST["checkedValues"];$checkedValues = json_decode($checkedValues);if (is_array($checkedValues)) {$checkedValues = implode(',', $checkedValues);}}
                $tituloEvento = $_POST["tituloEvento"];
                $cepEvento = str_replace("-", "", $_POST["cepEvento"]);
                $numeroEvento = $_POST["numeroEvento"];
                $logradouroEvento = $_POST["logradouroEvento"];
                $bairroEvento = $_POST["bairroEvento"];
                $cidadeEvento = $_POST["cidadeEvento"];
                $ufEvento = $_POST["ufEvento"];
                $descricaoEvento = $_POST["descricaoEvento"];
                $dtInicioEvento = $_POST["dtInicioEvento"];
                $dtFimEvento = $_POST["dtFimEvento"];
                //error_log("Data inicio: $dtInicioEvento, Data Fim: $dtFimEvento");
                $dtInicioEvento = DateTime::createFromFormat('d/m/Y', $dtInicioEvento)->format('Y-m-d');
                $dtFimEvento = DateTime::createFromFormat('d/m/Y', $dtFimEvento)->format('Y-m-d');
                $opcaoFuncao = "criar";
                $eventoId = "";
                $statusEvento = "";
                error_log("upload obrigatorios: " . print_r($uploadsObrigatorios, true));
                //$cadastrar_evento = true;
                $cadastrar_evento = $eventos->inserirEvento($opcaoFuncao,$eventoId, $statusEvento, $tituloEvento, $cepEvento, $numeroEvento, $logradouroEvento, $bairroEvento, $cidadeEvento, $ufEvento, $dtInicioEvento, $dtFimEvento, $descricaoEvento, $checkedValues, $valorEvento, $uploadsObrigatorios);
                if ($cadastrar_evento !== false) {
                    //error_log("ID do evento inserido: $cadastrar_evento");
                    $caminhoUpload = $caminhoBaseUpload . $cadastrar_evento . '/carrousel/';
                    if (!file_exists($caminhoUpload)) {
                        mkdir($caminhoUpload, 0777, true);
                    }
                    if (isset($_FILES['file']['name']) && is_array($_FILES['file']['name'])) {
                        $totalImagens = count($_FILES['file']['name']);
                        for ($i = 0; $i < $totalImagens; $i++) {
                            $nomeArquivo = $_FILES['file']['name'][$i];
                            $tmpNome = $_FILES['file']['tmp_name'][$i];
                            $nomeArquivoWebp = ($i + 1) . '.webp';
                            $caminhoCompleto = $caminhoUpload . $nomeArquivoWebp;
                            $info = getimagesize($tmpNome);
                            $tipoImagem = $info[2];
                            switch ($tipoImagem) {
                                case IMAGETYPE_JPEG:
                                    $imagem = imagecreatefromjpeg($tmpNome);
                                    break;
                                case IMAGETYPE_PNG:
                                    $imagem = imagecreatefrompng($tmpNome);
                                    break;
                                case IMAGETYPE_GIF:
                                    $imagem = imagecreatefromgif($tmpNome);
                                    break;
                                default:
                                    $imagem = null;
                            }
                            if ($imagem !== null) {
                                $larguraOriginal = imagesx($imagem);
                                $alturaOriginal = imagesy($imagem);
                                $novaLargura = 800;
                                $novaAltura = ($alturaOriginal / $larguraOriginal) * $novaLargura;
                                $imagemRedimensionada = imagecreatetruecolor($novaLargura, $novaAltura);
                                imagecopyresampled($imagemRedimensionada, $imagem, 0, 0, 0, 0, $novaLargura, $novaAltura, $larguraOriginal, $alturaOriginal);
                                // Cortar a altura se necessário
                                if ($novaAltura > 600) {
                                    $imagemCortada = imagecreatetruecolor($novaLargura, 600);
                                    $yCorte = ($novaAltura - 600) / 2;
                                    imagecopy($imagemCortada, $imagemRedimensionada, 0, 0, 0, $yCorte, $novaLargura, 600);
                                    imagewebp($imagemCortada, $caminhoCompleto);
                                    imagedestroy($imagemCortada);
                                } else {
                                    imagewebp($imagemRedimensionada, $caminhoCompleto);
                                }
                                imagedestroy($imagem);
                                imagedestroy($imagemRedimensionada);
                                $nomesArquivos[] = $nomeArquivoWebp;
                            }
                        }
                    }
                    if (!empty($nomesArquivos)) {
                        $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($cadastrar_evento, 'img_carrousel', true);
        
                        if ($resultado_detalhesEvento !== false){
                            $atualizar->atualizar($tipoAtualizar);
                            $response = ["success" => true, "message" => "Dados e arquivos salvos com sucesso!", "arquivos" => $nomesArquivos];
                        }else{
                            $atualizar->atualizar($tipoAtualizar);
                            $response = ["success" => true, "message" => "Dados salvos com sucesso, mas as do carrousel foram definidar como nao enviadas no banco, rever o código!"];
                        }
                    } else {
                        $atualizar->atualizar($tipoAtualizar);
                        $response = ["success" => true, "message" => "Dados salvos com sucesso, mas nenhum arquivo foi enviado."];
                    }
                } else {
                    $response = ["success" => false, "message" => "Não foi possível salvar os dados."];
                }
            } else {
                $response = ["success" => false, "message" => "Não foi possivel identificar o tipo de Evento"];
            }
        }elseif ($tipoAtualizacao === "upload") {
            if (isset($_POST['eventoId'])) {
                $eventoId = $_POST["eventoId"];
                $eventoId = (int)$eventoId;
                if (isset($_POST['tipoUpload'])) {
                    $tipoUpload = $_POST["tipoUpload"];
                    if($tipoUpload == "carrousel"){
                        $acao = $_POST["acao"];
                        if ($acao == "adicionar") {
                            if (isset($_FILES['files']) && is_array($_FILES['files']['name'])) {
                                $totalFiles = count($_FILES['files']['name']);
                                $caminhoUpload = $caminhoBaseUpload . $eventoId . '/carrousel/';
                                if (!file_exists($caminhoUpload)) {
                                    mkdir($caminhoUpload, 0777, true);
                                }
                        
                                $existingFiles = array_diff(scandir($caminhoUpload), array('.', '..'));
                                $maxNumber = 0;
                                foreach ($existingFiles as $file) {
                                    $number = (int)pathinfo($file, PATHINFO_FILENAME);
                                    if ($number > $maxNumber) {
                                        $maxNumber = $number;
                                    }
                                }
                        
                                for ($i = 0; $i < $totalFiles; $i++) {
                                    $fileTmpName = $_FILES['files']['tmp_name'][$i];
                                    $fileNumber = $maxNumber + $i + 1;
                                    $fileNameWebp = $fileNumber . '.webp';
                                    $caminhoCompleto = $caminhoUpload . $fileNameWebp;
                        
                                    $info = getimagesize($fileTmpName);
                                    $tipoImagem = $info[2];
                        
                                    switch ($tipoImagem) {
                                        case IMAGETYPE_JPEG:
                                            $imagem = imagecreatefromjpeg($fileTmpName);
                                            break;
                                        case IMAGETYPE_PNG:
                                            $imagem = imagecreatefrompng($fileTmpName);
                                            break;
                                        case IMAGETYPE_GIF:
                                            $imagem = imagecreatefromgif($fileTmpName);
                                            break;
                                        default:
                                            $imagem = null;
                                    }
                        
                                    if ($imagem !== null) {
                                        $larguraOriginal = imagesx($imagem);
                                        $alturaOriginal = imagesy($imagem);
                        
                                        $novaLargura = 800;
                                        $novaAltura = ($alturaOriginal / $larguraOriginal) * $novaLargura;
                        
                                        $imagemRedimensionada = imagecreatetruecolor($novaLargura, $novaAltura);
                                        imagecopyresampled($imagemRedimensionada, $imagem, 0, 0, 0, 0, $novaLargura, $novaAltura, $larguraOriginal, $alturaOriginal);
                        
                                        if ($novaAltura > 600) {
                                            $imagemCortada = imagecreatetruecolor($novaLargura, 600);
                                            $yCorte = ($novaAltura - 600) / 2;
                                            imagecopy($imagemCortada, $imagemRedimensionada, 0, 0, 0, $yCorte, $novaLargura, 600);
                                            imagewebp($imagemCortada, $caminhoCompleto);
                                            imagedestroy($imagemCortada);
                                        } else {
                                            imagewebp($imagemRedimensionada, $caminhoCompleto);
                                        }
                        
                                        imagedestroy($imagem);
                                        imagedestroy($imagemRedimensionada);
                        
                                        error_log("Arquivo $i: Nome = $fileNameWebp, Temp Name = $fileTmpName");
                        
                                        try {
                                            $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($eventoId, 'img_carrousel', true);
                                        } catch (Exception $e) {
                                            error_log("Erro ao atualizar detalhes do evento para o arquivo $fileNameWebp: " . $e->getMessage());
                                            $response = ["success" => false, "message" => "Erro ao atualizar detalhes do evento."];
                                            echo json_encode($response);
                                            exit;
                                        }
                                    } else {
                                        error_log("Erro ao processar a imagem $i: Tipo de imagem não suportado.");
                                    }
                                }
                                $atualizar->atualizar($tipoAtualizar);
                                $response = ["success" => true, "message" => "Tudo Certo!"];
                            } else {
                                $response = ["success" => false, "message" => "Nenhum arquivo enviado."];
                            }
                        }elseif ($acao == "excluir") {
                            $caminhoUpload = $caminhoBaseUpload . $eventoId . '/carrousel/';
                            if (file_exists($caminhoUpload) && is_dir($caminhoUpload)) {
                                $files = glob($caminhoUpload . '*'); 
                                foreach ($files as $file) {
                                    if (is_file($file)) {
                                        unlink($file); 
                                    }
                                }
                                $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($eventoId, 'img_carrousel', false);
                                $atualizar->atualizar($tipoAtualizar);
                                $response = ["success" => true, "message" => "Todas as imagens foram excluídas."];
                            } else {
                                $response = ["success" => false, "message" => "Diretório não encontrado."];
                            }
                        }else{
                            $response = ["success" => false, "message" => "Tipo de ação invalido."];
                        }
                    }elseif ($tipoUpload == "capa") {
                        $acao = $_POST["acao"];
                        $caminhoUpload = $caminhoBaseUpload . $eventoId . '/capa/';
                    
                        if ($acao == "adicionar") {
                            if (isset($_FILES['files']) && is_array($_FILES['files']['name']) && count($_FILES['files']['name']) == 1) {
                                if (!file_exists($caminhoUpload)) {
                                    mkdir($caminhoUpload, 0777, true);
                                }
                    
                                // Limpar a pasta antes de adicionar a nova imagem
                                $existingFiles = glob($caminhoUpload . '*');
                                foreach ($existingFiles as $file) {
                                    if (is_file($file)) {
                                        unlink($file);
                                    }
                                }
                    
                                $fileTmpName = $_FILES['files']['tmp_name'][0];
                                $fileNameWebp = '1.webp';
                                $caminhoCompleto = $caminhoUpload . $fileNameWebp;
                    
                                $info = getimagesize($fileTmpName);
                                $tipoImagem = $info[2];
                    
                                switch ($tipoImagem) {
                                    case IMAGETYPE_JPEG:
                                        $imagem = imagecreatefromjpeg($fileTmpName);
                                        break;
                                    case IMAGETYPE_PNG:
                                        $imagem = imagecreatefrompng($fileTmpName);
                                        break;
                                    case IMAGETYPE_GIF:
                                        $imagem = imagecreatefromgif($fileTmpName);
                                        break;
                                    default:
                                        $imagem = null;
                                }
                    
                                if ($imagem !== null) {
                                    $larguraOriginal = imagesx($imagem);
                                    $alturaOriginal = imagesy($imagem);
                    
                                    if ($larguraOriginal == 1920 && $alturaOriginal == 450) {
                                        imagewebp($imagem, $caminhoCompleto);
                                        imagedestroy($imagem);
                    
                                        error_log("Arquivo 1: Nome = $fileNameWebp, Temp Name = $fileTmpName");
                    
                                        try {
                                            $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($eventoId, 'img_capa', true);
                                        } catch (Exception $e) {
                                            error_log("Erro ao atualizar detalhes do evento para o arquivo $fileNameWebp: " . $e->getMessage());
                                            $response = ["success" => false, "message" => "Erro ao atualizar detalhes do evento."];
                                            echo json_encode($response);
                                            exit;
                                        }
                    
                                        $atualizar->atualizar($tipoAtualizar);
                                        $response = ["success" => true, "message" => "Tudo Certo!"];
                                    } else {
                                        imagedestroy($imagem);
                                        error_log("Dimensões inválidas para a imagem: Largura = $larguraOriginal, Altura = $alturaOriginal");
                                        $response = ["success" => false, "message" => "Dimensões inválidas para a imagem. A imagem deve ter exatamente 1920x450 pixels."];
                                    }
                                } else {
                                    error_log("Erro ao processar a imagem: Tipo de imagem não suportado.");
                                    $response = ["success" => false, "message" => "Tipo de imagem não suportado."];
                                }
                            } else {
                                $response = ["success" => false, "message" => "Nenhum arquivo enviado ou múltiplos arquivos enviados."];
                            }
                        } elseif ($acao == "excluir") {
                            if (file_exists($caminhoUpload) && is_dir($caminhoUpload)) {
                                $files = glob($caminhoUpload . '*');
                                foreach ($files as $file) {
                                    if (is_file($file)) {
                                        unlink($file);
                                    }
                                }
                                $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($eventoId, 'img_capa', false);
                                $atualizar->atualizar($tipoAtualizar);
                                $response = ["success" => true, "message" => "A imagem foi excluída com sucesso."];
                            } else {
                                $response = ["success" => false, "message" => "Diretório não encontrado."];
                            }
                        }else{
                            $response = ["success" => false, "message" => "Tipo de ação invalido."];
                        }
                    }elseif ($tipoUpload == "autorizacao" || $tipoUpload == "roteiro" || $tipoUpload == "outros") {
                        $acao = $_POST["acao"];
                        $caminhoUpload = $caminhoBaseUpload . $eventoId . '/' . $tipoUpload . '/';
                        if ($tipoUpload == "autorizacao"){
                            $fileNamePdf = 'Autorizacao_viagem.pdf';
                            $tipoDetalhe = "autorizacao_viagem";
                        }elseif( $tipoUpload == "roteiro"){
                            $fileNamePdf = 'Roteiro_viagem.pdf';
                             $tipoDetalhe = "roteiro";
                        }elseif($tipoUpload == "outros"){
                            $fileNamePdf = 'Outros.pdf';
                            $tipoDetalhe = "zip_rider";
                        }
                        if ($acao == "adicionar") {
                            if (isset($_FILES['files']) && is_array($_FILES['files']['name']) && count($_FILES['files']['name']) == 1) {
                                if (!file_exists($caminhoUpload)) {
                                    mkdir($caminhoUpload, 0777, true);
                                }
                                $existingFiles = glob($caminhoUpload . '*');
                                foreach ($existingFiles as $file) {
                                    if (is_file($file)) {
                                        unlink($file);
                                    }
                                }
                    
                                $fileTmpName = $_FILES['files']['tmp_name'][0];
                                $caminhoCompleto = $caminhoUpload . $fileNamePdf;
                                try {
                                    move_uploaded_file($fileTmpName, $caminhoCompleto);
                                    try {
                                        $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($eventoId, $tipoDetalhe, true);
                                    } catch (Exception $e) {
                                        error_log("Erro ao atualizar detalhes do evento para o arquivo $fileNamePdf: " . $e->getMessage());
                                        $response = ["success" => false, "message" => "Erro ao atualizar detalhes do evento."];
                                        echo json_encode($response);
                                        exit;
                                    }
                    
                                    $atualizar->atualizar($tipoAtualizar);
                                    $response = ["success" => true, "message" => "Tudo Certo!"];
                                } catch (Exception $e) {
                                    error_log("Erro ao processar o arquivo PDF: " . $e->getMessage());
                                    $response = ["success" => false, "message" => "Erro ao processar o arquivo PDF."];
                                }
                            } else {
                                $response = ["success" => false, "message" => "Nenhum arquivo enviado ou múltiplos arquivos enviados."];
                            }
                        } elseif ($acao == "excluir") {
                            if (file_exists($caminhoUpload) && is_dir($caminhoUpload)) {
                                $files = glob($caminhoUpload . '*');
                                foreach ($files as $file) {
                                    if (is_file($file)) {
                                        unlink($file);
                                    }
                                }
                                $resultado_detalhesEvento = $eventos->atualizarDetalhesEvento($eventoId, $tipoDetalhe, false);
                                $atualizar->atualizar($tipoAtualizar);
                                $response = ["success" => true, "message" => "O arquivo foi excluído com sucesso."];
                            } else {
                                $response = ["success" => false, "message" => "Diretório não encontrado."];
                            }
                        } else {
                            $response = ["success" => false, "message" => "Tipo de ação inválido."];
                        }
                    }else{
                        $response = ["success" => false, "message" => "Tipo de upload do evento não identificado"];
                    }
                }else {
                    $response = ["success" => false, "message" => "Tipo de upload do evento não fornecido"];
                }
            } else {
                $response = ["success" => false, "message" => "ID do evento não fornecido"];
            }
        }elseif ($tipoAtualizacao === "atualizar"){
            if (isset($_POST['eventoId'])) {
                $eventoId = (int)$_POST["eventoId"];
                $statusEvento = $_POST['statusEvento'] ?? '';
                $uploadsObrigatorios = $_POST["uploadsObrigatorios"];
                $uploadsObrigatorios = json_decode($uploadsObrigatorios);
                $tituloEvento = $_POST['tituloEvento'] ?? '';
                $cepEvento = $_POST['cepEvento'] ?? '';
                $numeroEvento = $_POST['numeroEvento'] ?? '';
                $logradouroEvento = $_POST['logradouroEvento'] ?? '';
                $bairroEvento = $_POST['bairroEvento'] ?? '';
                $cidadeEvento = $_POST['cidadeEvento'] ?? '';
                $ufEvento = $_POST['ufEvento'] ?? '';
                $dtInicioEvento = $_POST['dtInicioEvento'] ?? '';
                $dtFimEvento = $_POST['dtFimEvento'] ?? '';
                $descricaoEvento = $_POST['descricaoEvento'] ?? '';
                $valorEvento = $_POST['valorEvento'] ?? '';
                $valorEvento = json_decode($valorEvento, true);
                $checkedValues = $_POST['checkedValues'] ?? '';
                $checkedValues = json_decode($checkedValues, true);
                if ($statusEvento === 'Inativo') {$statusEvento = 0;} elseif ($statusEvento === 'Ativo') {$statusEvento = 1;}
                if (is_array($checkedValues)) {$checkedValues = implode(',', $checkedValues);}
                $cepEvento = str_replace("-", "", $cepEvento);
                $dtInicioEvento = DateTime::createFromFormat('d/m/Y', $dtInicioEvento)->format('Y-m-d');
                $dtFimEvento = DateTime::createFromFormat('d/m/Y', $dtFimEvento)->format('Y-m-d');
                $opcaoFuncao = "atualizar";

                error_log("upload obrigatorios: " . print_r($uploadsObrigatorios, true));
                #$atualizar_evento = true;
                $atualizar_evento = $eventos->inserirEvento($opcaoFuncao, $eventoId, $statusEvento, $tituloEvento, $cepEvento, $numeroEvento, $logradouroEvento, $bairroEvento,$cidadeEvento,$ufEvento,$dtInicioEvento,$dtFimEvento,$descricaoEvento,$checkedValues, $valorEvento, $uploadsObrigatorios);
                if ($atualizar_evento == true){
                    $atualizar->atualizar($tipoAtualizar);
                    $response = ["success" => true, "message" => "Dados recebidos com sucesso"];
                }else{
                    
                    $response = ["success" => false, "message" => "Erro ao atualizar os dados no banco"];
                }
                
            } else {
                $response = ["success" => false, "message" => "ID do evento não fornecido"];
            }
        }elseif ($tipoAtualizacao === "excluir"){
            if (isset($_POST['eventoId'])) {
                $eventoId = (int)$_POST["eventoId"];
                error_log("id para excluir: $eventoId");
                $excluirEvento = true;
                //$excluirEvento = $eventos->inserirEvento($opcaoFuncao, $eventoId, $statusEvento, $tituloEvento, $cepEvento, $numeroEvento, $logradouroEvento, $bairroEvento,$cidadeEvento,$ufEvento,$dtInicioEvento,$dtFimEvento,$descricaoEvento,$checkedValues, $valorEvento);
                if ($excluirEvento == true){
                    //$atualizar->atualizar($tipoAtualizar);
                    $response = ["success" => true, "message" => "Dados recebidos com sucesso"];
                }else{
                    
                    $response = ["success" => false, "message" => "Erro ao atualizar os dados no banco"];
                }
            } else {
                $response = ["success" => false, "message" => "ID do evento não fornecido"];
            }
        }else {
            $response = ["success" => false, "message" => "Tipo de atualização desconhecido"];
        }
    } else {
        $response = ["success" => false, "message" => "Tipo de atualização não definido"];
    }   
} else {
    http_response_code(405);
    $response = ["success" => false, "message" => "Método não permitido."];
}
header('Content-Type: application/json');
echo json_encode($response);
?>