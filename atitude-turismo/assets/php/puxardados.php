<?php
require_once 'functions.php';

$TodosDados = puxarTodosDados::getInstance();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response = array();
    $tipo = isset($_GET['tipo']) ? $_GET['tipo'] : '';

    switch ($tipo) {
        case 'usuarios':
            // Carregar informações do usuário
            $usuarios = $TodosDados->getInfoUsuario();
            if (!empty($usuarios)) {
                $usuariosArray = array();
                foreach ($usuarios as $usuario) {
                    $usuariosArray[] = array(
                        'ID' => $usuario['id'],
                        'Nome' => $usuario['nome'],
                        'Apelido' => $usuario['apelido'],
                        'Email' => $usuario['email'],
                        'WhatsApp' => $usuario['whatsapp'],
                        'CPF' => $usuario['cpf'],
                        'RG' => $usuario['rg'],
                        'Orgao_Expedidor' => $usuario['orgao_expedidor'],
                        'Senha' => $usuario['senha'],
                        'Criado_Em' => $usuario['criado_em'],
                        'Nivel_ID' => $usuario['nivel_id'],
                        'Posicao' => $usuario['posicao'],
                        'Status' => $usuario['status']
                    );
                }
                $response['usuarios'] = $usuariosArray;
            } else {
                $response['usuarios'] = array('mensagem' => "Nenhum usuário encontrado.");
            }
            break;
        
        case 'vei':
            // Carregar vínculos
            $vei = $TodosDados->getVinculos();
            if (!empty($vei)) {
                $veiArray = array();
                foreach ($vei as $vinculo) {
                    $veiArray[] = array(
                        'ID_Evento' => $vinculo['id_eventos'],
                        'Evento_Título' => $vinculo['evento_titulo'],
                        'Evento_CEP' => $vinculo['evento_cep'],
                        'Evento_Numero' => $vinculo['evento_numero'],
                        'Evento_Logradouro' => $vinculo['evento_logradouro'],
                        'Evento_Bairro' => $vinculo['evento_bairro'],
                        'Evento_Cidade' => $vinculo['evento_cidade'],
                        'Evento_UF' => $vinculo['evento_uf'],
                        'Evento_Data_Inicio' => $vinculo['evento_data_inicio'],
                        'Evento_Data_Fim' => $vinculo['evento_data_fim'],
                        'Evento_Descricao' => $vinculo['evento_descricao'],
                        'Evento_Status' => $vinculo['evento_status'],
                        'Evento_Check_Obs' => $vinculo['evento_check_obs'],
                        'Evento_Url' => $vinculo['url_evento'],
                        'ID_Instituicao' => $vinculo['id_instituicoes'],
                        'Instituicao_Título' => $vinculo['instituicao_titulo'],
                        'Instituicao_Descricao' => $vinculo['instituicao_descricao'],
                        'Instituicao_Nome_Responsavel' => $vinculo['instituicao_nome_responsavel'],
                        'Instituicao_Telefone' => $vinculo['instituicao_telefone'],
                        'Instituicao_CEP' => $vinculo['instituicao_cep'],
                        'Instituicao_Numero' => $vinculo['instituicao_numero'],
                        'Instituicao_Logradouro' => $vinculo['instituicao_logradouro'],
                        'Instituicao_Bairro' => $vinculo['instituicao_bairro'],
                        'Instituicao_Cidade' => $vinculo['instituicao_cidade'],
                        'Instituicao_UF' => $vinculo['instituicao_uf'],
                        'Instituicao_Status' => $vinculo['instituicao_status'],
                        'Instituicao_Check_Obs' => $vinculo['instituicao_check_obs'],
                        'Instituicao_Codigo' => $vinculo['instituicao_codigo'],
                        'Instituicao_Url' => $vinculo['url_instituicao']
                    );
                }
                $response['vei'] = $veiArray;
            } else {
                $response['vei'] = array('mensagem' => "Nenhum vínculo encontrado.");
            }
            break;
        case 'veiResumido':
            // Carregar vínculos
            $vei = $TodosDados->getVinculos();
            if (!empty($vei)) {
                $veiArray = array();
                foreach ($vei as $vinculo) {
                    $veiArray[] = array(
                        'ID_Evento' => $vinculo['id_eventos'],
                        'Evento_Título' => $vinculo['evento_titulo'],
                        'Evento_Status' => $vinculo['evento_status'],
                        'Evento_Check_Obs' => $vinculo['evento_check_obs'],
                        'ID_Instituicao' => $vinculo['id_instituicoes'],
                        'Instituicao_Título' => $vinculo['instituicao_titulo'],
                        'Instituicao_Status' => $vinculo['instituicao_status'],
                        'Instituicao_Check_Obs' => $vinculo['instituicao_check_obs'],
                    );
                }
                $response['vei'] = $veiArray;
            } else {
                $response['vei'] = array('mensagem' => "Nenhum vínculo encontrado.");
            }
            break;

        case 'instituicoes':
            // Carregar instituições com URLs
            $inst = $TodosDados->getInstituicoes();
            if (!empty($inst)) {
                $instArray = array();
                foreach ($inst as $instituicao) {
                    $instArray[] = array(
                        'ID' => $instituicao['id'],
                        'Título' => $instituicao['titulo'],
                        'Descricao' => $instituicao['descricao'],
                        'Nome_Responsavel' => $instituicao['nome'],
                        'Telefone' => $instituicao['telefone'],
                        'CEP' => $instituicao['cep'],
                        'Numero' => $instituicao['numero'],
                        'Logradouro' => $instituicao['logradouro'],
                        'Bairro' => $instituicao['bairro'],
                        'Cidade' => $instituicao['cidade'],
                        'UF' => $instituicao['uf'],
                        'Status' => $instituicao['status'],
                        'Check_Obs' => $instituicao['check_obs'],
                        'Criado_Em' => $instituicao['criado_em'],
                        'Atualizado_Em' => $instituicao['atualizado_em'],
                        'Codigo' => $instituicao['codigo'],
                        'URL' => $instituicao['url']
                    );
                }
                $response['instituicoes'] = $instArray;
            } else {
                $response['instituicoes'] = array('mensagem' => "Nenhuma instituição encontrada.");
            }
            break;

        case 'instituicoesTitulosCodigos':
            // Carregar instituições com URLs
            $inst = $TodosDados->getInstituicoes();
            if (!empty($inst)) {
                $instArray = array();
                foreach ($inst as $instituicao) {
                    $instArray[] = array(
                        'Instituicao_Título' => $instituicao['titulo'],
                        'Instituicao_Codigo' => $instituicao['codigo']
                    );
                }
                $response['instituicoesTitulosCodigos'] = $instArray;
            } else {
                $response['instituicoesTitulosCodigos'] = array('mensagem' => "Nenhuma instituição encontrada.");
            }
            break;

        case 'eventos':
            // Carregar eventos com URLs
            $eventos = $TodosDados->getEventos();
            if (!empty($eventos)) {
                $eventosArray = array();
                foreach ($eventos as $evento) {
                    $eventosArray[] = array(
                        'ID' => $evento['id'],
                        'Título' => $evento['titulo'],
                        'CEP' => $evento['cep'],
                        'Número' => $evento['numero'],
                        'Logradouro' => $evento['logradouro'],
                        'Bairro' => $evento['bairro'],
                        'Cidade' => $evento['cidade'],
                        'UF' => $evento['uf'],
                        'Data_Início' => $evento['dt_inicio'],
                        'Data_Fim' => $evento['dt_fim'],
                        'Descrição' => $evento['descricao'],
                        'Criado_Em' => $evento['criado_em'],
                        'Status' => $evento['status'] == 1 ? 'Ativo' : 'Inativo',
                        'Atualizado_Em' => $evento['atualizado_em'],
                        'Check_Obs' => $evento['check_obs'],
                        'URL' => $evento['url'],
                        'Detalhes' => $evento['detalhes'],
                        'Planos' => $evento['planos']
                    );
                }
                $response['eventos'] = $eventosArray;
            } else {
                $response['eventos'] = array('mensagem' => "Nenhum evento encontrado.");
            }
            break;

        default:
            $response = array('mensagem' => 'Tipo de dado não especificado ou inválido.');
            break;
    }

    header('Content-Type: application/json');
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>
