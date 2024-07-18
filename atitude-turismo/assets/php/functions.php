<?php
session_start();
require_once 'config.php';
require 'enviar_emails.php';

class puxarTodosDados {
    private static $instance = null;
    private $conn;
    private $vinculos;
    private $infoUsuario;
    private $instituicoes;
    private $eventos;
    // para variaveis de sessão admin
    // para variaveis de sessão membro
    private $enderecosMembro;
    private $dependentesMembro;
    //variaveis que consulta outras variaveis
    private $eventosAtivos;
    private $vinculosComTitulos;
    private $instituicoesAtivas;
    //cache
    private $cacheFile;

    private function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->vinculos = null;
        $this->infoUsuario = null;
        $this->instituicoes = null;
        $this->eventos = null;
        $this->enderecosMembro = null;
        $this->dependentesMembro = null;
        $this->eventosAtivos = null;
        $this->vinculosComTitulos = null;
        $this->instituicoesAtivas = null;
        $this->cacheFile = __DIR__ . '/cache.json';
        $this->loadCache();
    }
    
    public static function getInstance() {
        if (self::$instance == null) {
            error_log("Instanciando Singleton.");
            self::$instance = new puxarTodosDados();
        }
        error_log("Reutilizando instância Singleton.");
        return self::$instance;
    }

    private function saveCache() {
        file_put_contents($this->cacheFile, json_encode([
            'vinculos' => $this->vinculos,
            'infoUsuario' => $this->infoUsuario,
            'instituicoes' => $this->instituicoes,
            'eventos' => $this->eventos,
            'enderecosMembro' => $this->enderecosMembro,
            'dependentesMembro' => $this->dependentesMembro,
            'eventosAtivos' => $this->eventosAtivos,
            'vinculosComTitulos' => $this->vinculosComTitulos,
            'instituicoesAtivas' => $this->instituicoesAtivas
        ]));
    }

    private function loadCache() {
        if (file_exists($this->cacheFile)) {
            $data = json_decode(file_get_contents($this->cacheFile), true);
            $this->vinculos = isset($data['vinculos']) ? $data['vinculos'] : null;
            $this->infoUsuario = isset($data['infoUsuario']) ? $data['infoUsuario'] : null;
            $this->instituicoes = isset($data['instituicoes']) ? $data['instituicoes'] : null;
            $this->eventos = isset($data['eventos']) ? $data['eventos'] : null;
            $this->enderecosMembro = isset($data['enderecosMembro']) ? $data['enderecosMembro'] : null;
            $this->dependentesMembro = isset($data['dependentesMembro']) ? $data['dependentesMembro'] : null;
            $this->eventosAtivos = isset($data['eventosAtivos']) ? $data['eventosAtivos'] : null;
            $this->vinculosComTitulos = isset($data['vinculosComTitulos']) ? $data['vinculosComTitulos'] : null;
            $this->instituicoesAtivas = isset($data['instituicoesAtivas']) ? $data['instituicoesAtivas'] : null;
        }
    }
    // Atualizar Variáveis completas
    public function atualizarInfoUsuario() {
        error_log("at infoUsuario ataulizado informacoes de usuarios");
        $this->infoUsuario = $this->carregarInformacoesUsuarios();
        $this->saveCache();
    }
    public function atualizarVinculos() {
        error_log("at vínculos");
        $this->vinculos = $this->carregarVinculosTodosCampos();
        $this->saveCache();
        // Atualizar variáveis dependentes
        $this->atualizarVinculosComTitulos();
    }
    public function atualizarInstituicoes() {
        error_log("at instituições");
        $this->instituicoes = $this->carregarInstituicoes();
        $this->saveCache();
        // Atualizar variáveis dependentes
        $this->atualizarInstituicoesAtivas();
    }
    public function atualizarEventos() {
        error_log("at eventos");
        $this->eventos = $this->carregarEventos();
        $this->saveCache();
        // Atualizar variáveis dependentes
        $this->atualizarEventosAtivos();
    }
    // atualizar variaveis de sessão membro
    public function atualizarEnderecosMembro($userId) {
        error_log("at ed membro");
        $this->enderecosMembro = $this->carregarEnderecosPorUsuario($userId);
        $this->saveCache();
    }
    public function atualizarDependentesMembro($userId) {
        error_log("at dp membro");
        $this->dependentesMembro = $this->carregarDependentesPorUsuario($userId);
        $this->saveCache();
    }

    // Atualizar Variáveis que consulta as outras variaveis do banco
    public function atualizarEventosAtivos() {error_log("at ativos");$this->eventosAtivos = $this->carregarEventosAtivos();$this->saveCache();}
    public function atualizarVinculosComTitulos() {error_log("at títulos");$this->vinculosComTitulos = $this->carregarVinculosComTitulos();$this->saveCache();}
    public function atualizarInstituicoesAtivas() {error_log("at insti ativas");$this->instituicoesAtivas = $this->carregarInstituicoesAtivas();$this->saveCache();}

    // Acessar informações das variáveis, caso não tiver informações, elas serão carregadas
    public function getVinculos() {if ($this->vinculos === null) {error_log("vinculos nulo");$this->atualizarVinculos();}return $this->vinculos;}
    public function getInfoUsuario() {if ($this->infoUsuario === null) { error_log("infoUsuario nulo"); $this->atualizarInfoUsuario();}return $this->infoUsuario;}
    public function getInstituicoes() {if ($this->instituicoes === null) {error_log("instituicoes nulo");$this->atualizarInstituicoes();}return $this->instituicoes;}
    public function getEventos() {if ($this->eventos === null) {error_log("eventos é nulo, atualizando.");$this->atualizarEventos();}return $this->eventos;}
    public function getEnderecosMembro($userId) {if ($this->enderecosMembro === null) {error_log("enderecosMembro é nulo, atualizando.");$this->atualizarEnderecosMembro($userId);}return $this->enderecosMembro;}
    public function getDependentesMembro($userId) {if ($this->dependentesMembro === null) {error_log("dependentesMembro é nulo, atualizando.");$this->atualizarDependentesMembro($userId);}return $this->dependentesMembro;}
    public function getEventosAtivos() {if ($this->eventosAtivos === null) {error_log("eventosAtivos é nulo, atualizando.");$this->atualizarEventosAtivos();}return $this->eventosAtivos;}
    public function getVinculosComTitulos() {if ($this->vinculosComTitulos === null) {error_log("vinculosComTitulos é nulo, atualizando.");$this->atualizarVinculosComTitulos();}return $this->vinculosComTitulos;}
    public function getInstituicoesAtivas() {if ($this->instituicoesAtivas === null) {error_log("instituicoesAtivas é nulo, atualizando.");$this->atualizarInstituicoesAtivas();}return $this->instituicoesAtivas;}

    // Funções que buscam as informações no banco
    private function carregarInformacoesUsuarios() {
        $infoUsuario = [];
        $sql = "
            SELECT 
                u.*, 
                n.id AS nivel_id, 
                n.posicao, 
                n.status 
            FROM 
                usuarios u
            LEFT JOIN 
                nivel_usuarios n ON u.id = n.id_usuario";
        
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $infoUsuario = $result->fetch_all(MYSQLI_ASSOC);
        } else {
            $infoUsuario = [];
        }
        return $infoUsuario;
    }
    private function carregarInstituicoes() {
        $instituicoes = [];
        $sql = "SELECT * FROM instituicoes;";

        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $instituicoes = $result->fetch_all(MYSQLI_ASSOC);
        } else {
            $instituicoes = [];
        }

        return $instituicoes;
    }
    private function carregarEventos() {
        $eventos = [];
        $sql = "
            SELECT 
                e.*,
                de.img_carrousel,
                de.img_capa,
                de.autorizacao_viagem,
                de.zip_rider,
                de.roteiro,
                de.obrigatorio,
                pe.nome AS plano_nome,
                pe.valor AS plano_valor,
                pe.descricao AS plano_descricao,
                pe.status AS plano_status
            FROM 
                eventos e
            LEFT JOIN 
                detalhes_eventos de ON e.id = de.id_eventos
            LEFT JOIN 
                planos_eventos pe ON e.id = pe.id_eventos;
        ";
    
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $eventoId = $row['id'];
                if (!isset($eventos[$eventoId])) {
                    $eventos[$eventoId] = [
                        'id' => $row['id'],
                        'titulo' => $row['titulo'],
                        'cep' => $row['cep'],
                        'numero' => $row['numero'],
                        'logradouro' => $row['logradouro'],
                        'bairro' => $row['bairro'],
                        'cidade' => $row['cidade'],
                        'uf' => $row['uf'],
                        'dt_inicio' => $row['dt_inicio'],
                        'dt_fim' => $row['dt_fim'],
                        'descricao' => $row['descricao'],
                        'criado_em' => $row['criado_em'],
                        'atualizado_em' => $row['atualizado_em'],
                        'check_obs' => $row['check_obs'],
                        'status' => $row['status'],
                        'url' => $row['url'],
                        'detalhes' => [
                            'img_carrousel' => $row['img_carrousel'],
                            'img_capa' => $row['img_capa'],
                            'autorizacao_viagem' => $row['autorizacao_viagem'],
                            'zip_rider' => $row['zip_rider'],
                            'roteiro' => $row['roteiro'],
                            'obrigatorio' => $row['obrigatorio']
                        ],
                        'planos' => []
                    ];
                }
                if (!is_null($row['plano_valor'])) {
                    $eventos[$eventoId]['planos'][] = [
                        'nome' => $row['plano_nome'],
                        'valor' => $row['plano_valor'],
                        'descricao' => $row['plano_descricao'],
                        'status' => $row['plano_status']
                    ];
                }
            }
        }
        return array_values($eventos);
    }
    private function carregarVinculosTodosCampos() {
        error_log("Carregando todos os vínculos");
        $sql = "
            SELECT 
                vei.id_eventos,
                e.titulo AS evento_titulo,
                e.cep AS evento_cep,
                e.numero AS evento_numero,
                e.logradouro AS evento_logradouro,
                e.bairro AS evento_bairro,
                e.cidade AS evento_cidade,
                e.uf AS evento_uf,
                e.dt_inicio AS evento_data_inicio,
                e.dt_fim AS evento_data_fim,
                e.descricao AS evento_descricao,
                e.status AS evento_status,
                e.check_obs AS evento_check_obs,
                e.url AS url_evento,
                vei.id_instituicoes,
                i.titulo AS instituicao_titulo,
                i.descricao AS instituicao_descricao,
                i.nome AS instituicao_nome_responsavel,
                i.telefone AS instituicao_telefone,
                i.cep AS instituicao_cep,
                i.numero AS instituicao_numero,
                i.logradouro AS instituicao_logradouro,
                i.bairro AS instituicao_bairro,
                i.cidade AS instituicao_cidade,
                i.uf AS instituicao_uf,
                i.status AS instituicao_status,
                i.check_obs AS instituicao_check_obs,
                i.codigo AS instituicao_codigo,
                i.url AS url_instituicao
            FROM 
                vincular_eventos_instituicoes vei
            JOIN 
                eventos e ON vei.id_eventos = e.id
            JOIN 
                instituicoes i ON vei.id_instituicoes = i.id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();

        $vinculos = [];
        while ($row = $result->fetch_assoc()) {
            $vinculos[] = $row;
        }
        return $vinculos;
    }
    // Funções que buscam as informações no banco de usuarios especificos
    private function carregarEnderecosPorUsuario($userId) {
        $enderecosMembro = [];
        $sql = "
            SELECT 
                e.tipo,
                e.nome_endereco,
                e.cep,
                e.numero,
                e.logradouro,
                e.bairro,
                e.cidade,
                e.uf
            FROM 
                enderecos_usuarios e
            WHERE 
                e.id_usuario = ?";
            
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $enderecosMembro = $result->fetch_all(MYSQLI_ASSOC);
        } else {
            $enderecosMembro = [];
        }
    
        return $enderecosMembro;
    }
    private function carregarDependentesPorUsuario($userId) {
        $dependentesMembro = [];
        $sql = "
            SELECT 
                d.id_instituicao,
                d.id_evento,
                d.check_obs,
                d.nome AS dependente_nome,
                d.dt_nascimento AS dependente_dt_nascimento,
                d.cpf AS dependente_cpf,
                d.rg AS dependente_rg,
                d.orgao_expedidor AS dependente_orgao_expedidor
            FROM 
                dependentes d
            WHERE 
                d.id_responsavel = ?";
            
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $dependentesMembro = $result->fetch_all(MYSQLI_ASSOC);
        } else {
            $dependentesMembro = [];
        }
    
        return $dependentesMembro;
    }

    // Funções que buscam dados nas variáveis e alimentam outras variáveis
    private function carregarEventosAtivos() {
        error_log("Carregando eventos ativos");
        $todosEventos = $this->getEventos();
        $eventosAtivos = array_filter($todosEventos, function($evento) {
            return $evento['status'] == 1; 
        });
        $eventosAtivos = array_map(function ($evento) {
            return [
                'id' => $evento['id'], 
                'titulo' => $evento['titulo'],
                'check_obs' => $evento['check_obs']
            ];
        }, $eventosAtivos);
        return $eventosAtivos;
    }
    private function carregarInstituicoesAtivas() {
        error_log("Carregando instituições ativas");
        $todasInstituicoes = $this->getInstituicoes();
        $instituicoesAtivas = array_filter($todasInstituicoes, function($instituicao) {
            return $instituicao['status'] == 1;
        });
        $instituicoesAtivas = array_map(function ($instituicao) {
            return [
                'id' => $instituicao['id'], 
                'titulo' => $instituicao['titulo'], 
                'check_obs' => $instituicao['check_obs'] 
            ];
        }, $instituicoesAtivas);
        return $instituicoesAtivas;
    }
    private function carregarVinculosComTitulos() {
        error_log("Carregando vínculos com títulos");
        $todosVinculos = $this->getVinculos();
        $vinculosComTitulos = array_map(function ($vinculo) {
            return [
                'id_eventos' => $vinculo['id_eventos'],
                'evento_titulo' => $vinculo['evento_titulo'],
                'evento_check_obs' => $vinculo['evento_check_obs'],
                'id_instituicoes' => $vinculo['id_instituicoes'],
                'instituicao_titulo' => $vinculo['instituicao_titulo'],
                'instituicao_check_obs' => $vinculo['instituicao_check_obs']
            ];
        }, $todosVinculos);

        return $vinculosComTitulos;
    }

    // Funções com parâmetros de busca dados nas variáveis e retornam um valor personalizado
    public function codigoInstituicao($idInstituicao) {
        $instituicoes = $this->getInstituicoes();
        foreach ($instituicoes as $instituicao) {
            if ($instituicao['id'] == $idInstituicao) {
                return $instituicao['codigo'];
            }
        }
        return null;
    }
    public function emailExiste($email) {
        $infoUsuario = $this->getInfoUsuario();
        foreach ($infoUsuario as $usuario) {
            if ($usuario['email'] == $email) {
                return "1";
            }
        }
        return "0";
    }
    public function verificarStatus($id_usuario) {
        $infoUsuario = $this->getInfoUsuario();
        foreach ($infoUsuario as $usuario) {
            if ($usuario['id'] == $id_usuario) {
                return $usuario['status'] == 0 ? 'inativo' : 'ativo';
            }
        }
        return 'erro';
    }
    public function verificarPosicao($id_usuario) {
        $infoUsuario = $this->getInfoUsuario();
        foreach ($infoUsuario as $usuario) {
            if ($usuario['id'] == $id_usuario) {
                return $usuario['posicao'] == 0 ? 'Admin' : 'Membro';
            }
        }
        return 'erro';
    }
    public function obterDetalhesUsuario($id_usuario) {
        $infoUsuario = $this->getInfoUsuario();
        foreach ($infoUsuario as $usuario) {
            if ($usuario['id'] == $id_usuario) {
                error_log($usuario['posicao']);
                return array(
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
                    'Posicao' => $usuario['posicao'] == 0 ? 'Admin' : 'Membro',
                    'Status' => $usuario['status']
                );
            }
        }

        return null; // Retorna null se o usuário não for encontrado
    }
}

class SessaoMembro {
    private $conn;
    private $puxarTodosDados;

    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->puxarTodosDados = puxarTodosDados::getInstance(); // Use o Singleton
    }

    public function informacoes_usuario($id_usuario) {
        $dados = $this->puxarTodosDados->obterDetalhesUsuario($id_usuario);
        $endereco = $this->puxarTodosDados->getEnderecosMembro($id_usuario);
        $dependente = $this->puxarTodosDados->getDependentesMembro($id_usuario);

        $_SESSION['informacoes_usuario'] = array(
            'dados' => $dados,
            'enderecos' => $endereco,
            'dependentes' => $dependente
        );
        return "certo";
    }

    public function atualizar_informacoes_usuario($id_usuario) {
        $this->puxarTodosDados->atualizarInfoUsuario(); 
        $dados = $this->puxarTodosDados->obterDetalhesUsuario($id_usuario);
        $endereco = $this->puxarTodosDados->atualizarEnderecosMembro($id_usuario);
        $dependente = $this->puxarTodosDados->atualizarDependentesMembro($id_usuario);

        $_SESSION['informacoes_usuario'] = array(
            'dados' => $dados,
            'enderecos' => $endereco,
            'dependentes' => $dependente
        );
        return "certo";
    }
}

class SessaoAdmin{
    private $conn;

}

class links {
    private $conn;

    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
    }
    public function criarUrlInstituicao($codigo) {
        $protocolo = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $dominio_completo = $protocolo . $_SERVER['HTTP_HOST'];
        $url_completa = $dominio_completo . '/sites/atitude-turismo/cadastrar/?' . $codigo;
    
        return $url_completa;
    }
    public function criarUrlEvento($codigoIstituicao, $idEvento) {
        $protocolo = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $dominio_completo = $protocolo . $_SERVER['HTTP_HOST'];
        $url_completa = $dominio_completo . '/sites/atitude-turismo/cadastrar/?' . $codigoIstituicao . '-' . $idEvento;
    
        return $url_completa;
    }
    public function inserirUrlEvento($idEvento, $url) {
        $this->conn->begin_transaction(); 
        try {
            $stmt = $this->conn->prepare("UPDATE eventos SET url = ? WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Erro na preparação da declaração: " . $this->conn->error);
            }
            $stmt->bind_param("si", $url, $idEvento);
            if (!$stmt->execute()) {
                throw new Exception("Erro ao executar declaração: " . $stmt->error);
            }
            $this->conn->commit(); 
            return "certo";
        } catch (Exception $e) {
            error_log("Erro ao inserir URL: " . $e->getMessage()); 
            $this->conn->rollback(); 
            return "erro"; 
        } finally {
            $stmt->close();
        }
    }    
    public function excluirUrlEvento($idEvento) {
        $this->conn->begin_transaction();
    
        try {
            $stmt = $this->conn->prepare("UPDATE eventos SET url = NULL WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Erro na preparação da declaração: " . $this->conn->error);
            }
    
            $stmt->bind_param("i", $idEvento);
            if (!$stmt->execute()) {
                throw new Exception("Erro ao executar declaração: " . $stmt->error);
            }
    
            $this->conn->commit();
            return "certo";
        } catch (Exception $e) {
            error_log("Erro ao excluir URL: " . $e->getMessage());
            $this->conn->rollback();
            return "erro";
        } finally {
            $stmt->close();
        }
    }
}

class instituicoes {
    private $conn;
    private $links;
    private $puxarTodosDados;

    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->links = new links();
        $this->puxarTodosDados = puxarTodosDados::getInstance();
    }

    public function inserirInstituicao($opcaoFuncao, $instituicaoId, $statusInstituicao, $titulo, $descricao, $nome, $telefone, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $checkedValues) {
        try {
            if ($opcaoFuncao == "criar") {
                $resultado = $this->criarInstituicao($titulo, $descricao, $nome, $telefone, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $checkedValues);
            } elseif ($opcaoFuncao === "atualizar") {
                $resultado = $this->atualizarInstituicao($instituicaoId, $statusInstituicao, $titulo, $descricao, $nome, $telefone, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $checkedValues);
            } else {
                throw new Exception("Opção de função inválida: " . $opcaoFuncao);
            }
            return $resultado;
        } catch (Exception $e) {
            error_log("Erro ao inserir evento: " . $e->getMessage());
            return false;
        }
    }

    public function criarInstituicao($titulo, $descricao, $nome, $telefone, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $checkedValues) {
        $this->conn->begin_transaction();
        $codigo = $this->gerarcodigo();
        $url = $this->links->criarUrlInstituicao($codigo);
        $sql = "INSERT INTO instituicoes (titulo, descricao, nome, telefone, cep, numero, logradouro, bairro, cidade, uf, check_obs, codigo, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            $this->conn->rollback();
            return false;
        }

        $stmt->bind_param("sssssssssssss", $titulo, $descricao, $nome, $telefone, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $checkedValues, $codigo, $url);
        $success = $stmt->execute();
        if ($success) {
            $stmt->close();
            $this->puxarTodosDados->atualizarInstituicoes(); 
            $this->conn->commit();
            return true;
        } else {
            $stmt->close();
            $this->conn->rollback();
            return false;
        }
    }

    public function atualizarInstituicao($instituicaoId, $statusInstituicao, $titulo, $descricao, $nome, $telefone, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $checkedValues) {
        $this->conn->begin_transaction();
    
        $sql = "UPDATE instituicoes 
                SET status = ?, 
                    titulo = ?, 
                    descricao = ?, 
                    nome = ?, 
                    telefone = ?, 
                    cep = ?, 
                    numero = ?, 
                    logradouro = ?, 
                    bairro = ?, 
                    cidade = ?, 
                    uf = ?, 
                    check_obs = ? 
                WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            $this->conn->rollback();
            return false;
        }
    
        $stmt->bind_param("isssssssssssi", 
            $statusInstituicao, 
            $titulo, 
            $descricao, 
            $nome, 
            $telefone, 
            $cep, 
            $numero, 
            $logradouro, 
            $bairro, 
            $cidade, 
            $uf, 
            $checkedValues, 
            $instituicaoId
        );
    
        $success = $stmt->execute();
        if ($success) {
            $stmt->close();
            $this->puxarTodosDados->atualizarInstituicoes(); 
            $this->conn->commit();
            return true;
        } else {
            $stmt->close();
            $this->conn->rollback();
            return false;
        }
    }
    
    public function gerarcodigo($length = 6) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

}

class vincular_eventos_instituicoes {
    private $conn;
    private $links;
    private $puxarTodosDados;
    
    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->links = new links();
        $this->puxarTodosDados = puxarTodosDados::getInstance(); 
    }
    public function vincularEventoInstituicao($eventoId, $instituicaoId) {
        $this->conn->begin_transaction();
        $sql = "SELECT COUNT(*) FROM vincular_eventos_instituicoes WHERE id_eventos = ? AND id_instituicoes = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventoId, $instituicaoId);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        if ($count > 0) {
            $this->conn->rollback(); 
            return false;
        }
        $sql = "INSERT INTO vincular_eventos_instituicoes (id_eventos, id_instituicoes) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventoId, $instituicaoId);
        if ($stmt->execute()) {
            $codigoInstituicao = $this->puxarTodosDados->codigoInstituicao($instituicaoId);
            if ($codigoInstituicao != null){
                $url = $this->links->criarUrlEvento($codigoInstituicao, $eventoId);
                $resultado = $this->links->inserirUrlEvento($eventoId, $url);
                if ($resultado == "certo") {
                    $this->conn->commit();
                    $this->puxarTodosDados->atualizarVinculos(); 
                    $this->puxarTodosDados->atualizarEventos();
                    return true;
                } else {
                    error_log("Erro variavel resultado retornou erro."); 
                    $this->conn->rollback(); 
                    return "erro";
                }
            }else{
                error_log("Erro variavel codigoInstituicao retornou null.");
                $this->conn->rollback(); 
                return "erro";
            }
        } else {
            error_log("Erro ao inserir vínculo: " . $stmt->error); 
            $this->conn->rollback(); 
            return "erro";
        }
    }
    public function desvincularEventoInstituicao($eventoId, $instituicaoId) {
        $this->conn->begin_transaction();
    
        $sql = "SELECT COUNT(*) FROM vincular_eventos_instituicoes WHERE id_eventos = ? AND id_instituicoes = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventoId, $instituicaoId);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        if ($count == 0) {
            $this->conn->rollback(); 
            return false;
        }
        $sql = "DELETE FROM vincular_eventos_instituicoes WHERE id_eventos = ? AND id_instituicoes = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventoId, $instituicaoId);
        if ($stmt->execute()) {
            $resultado = $this->links->excluirUrlEvento($eventoId);
            if ($resultado == "certo") {
                $this->conn->commit();
                $this->puxarTodosDados->atualizarVinculos(); 
                $this->puxarTodosDados->atualizarEventos();
                return true;
            } else {
                error_log("Erro variavel resultado retornou erro. "); 
                $this->conn->rollback(); 
                return "erro";
            }
        } else {
            error_log("Erro ao remover vínculo: " . $stmt->error); 
            $this->conn->rollback(); 
            return "erro"; 
        }
    }
}

class Eventos {
    private $conn;
    private $puxarTodosDados;
    
    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->puxarTodosDados = puxarTodosDados::getInstance();
    }

    public function inserirEvento($opcaoFuncao, $eventoId, $statusEvento, $titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $checkedValues, $valorEvento, $uploadsObrigatorios) {
        try {
            if ($opcaoFuncao == "criar") {
                $resultado = $this->criarEvento($titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $checkedValues, $valorEvento, $uploadsObrigatorios);
            } elseif ($opcaoFuncao === "atualizar") {
                $resultado = $this->atualizarEvento($eventoId, $statusEvento, $titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $checkedValues, $valorEvento);
            } else {
                throw new Exception("Opção de função inválida: " . $opcaoFuncao);
            }
            return $resultado;
        } catch (Exception $e) {
            error_log("Erro ao inserir evento: " . $e->getMessage());
            return false;
        }
    }

    public function inserirPlanoEvento($idEvento, $nome, $valor, $descricao) {
        try {
            $sqlPlano = "INSERT INTO planos_eventos (id_eventos, nome, valor, descricao) VALUES (?, ?, ?, ?)";
            $stmtPlano = $this->conn->prepare($sqlPlano);
            if (!$stmtPlano) {
                throw new Exception("Erro na preparação da declaração: " . $this->conn->error);
            }
    
            $stmtPlano->bind_param("isds", $idEvento, $nome, $valor, $descricao);
            if (!$stmtPlano->execute()) {
                throw new Exception("Erro ao executar declaração: " . $stmtPlano->error);
            }
    
            if ($stmtPlano->affected_rows == 0) {
                throw new Exception("Nenhuma linha afetada ao inserir plano de evento");
            }
    
            return true;
        } catch (Exception $e) {
            error_log("Erro ao inserir plano de evento: " . $e->getMessage());
            return false;
        } finally {
            $stmtPlano->close();
        }
    }

    public function atualizarPlanosEvento($idEvento, $planos) {
        try {
            // Iniciar transação
            $this->conn->begin_transaction();
    
            // Excluir planos existentes
            $sqlExcluir = "DELETE FROM planos_eventos WHERE id_eventos = ?";
            $stmtExcluir = $this->conn->prepare($sqlExcluir);
            if (!$stmtExcluir) {
                throw new Exception("Erro na preparação da declaração de exclusão: " . $this->conn->error);
            }
            $stmtExcluir->bind_param("i", $idEvento);
            if (!$stmtExcluir->execute()) {
                throw new Exception("Erro ao executar declaração de exclusão: " . $stmtExcluir->error);
            }
    
            // Inserir novos planos
            $sqlInserir = "INSERT INTO planos_eventos (id_eventos, nome, valor, descricao) VALUES (?, ?, ?, ?)";
            $stmtInserir = $this->conn->prepare($sqlInserir);
            if (!$stmtInserir) {
                throw new Exception("Erro na preparação da declaração de inserção: " . $this->conn->error);
            }
    
            foreach ($planos as $plano) {
                $nome = $plano['nome'];
                $valor = $plano['valor'];
                $descricao = $plano['descricao'];
                $stmtInserir->bind_param("isds", $idEvento, $nome, $valor, $descricao);
                if (!$stmtInserir->execute()) {
                    throw new Exception("Erro ao executar declaração de inserção: " . $stmtInserir->error);
                }
    
                if ($stmtInserir->affected_rows == 0) {
                    throw new Exception("Nenhuma linha afetada ao inserir plano de evento");
                }
            }
    
            // Commit da transação
            $this->conn->commit();
    
            return true;
        } catch (Exception $e) {
            // Rollback da transação em caso de erro
            $this->conn->rollback();
            error_log("Erro ao atualizar planos de evento: " . $e->getMessage());
            return false;
        } finally {
            $stmtExcluir->close();
            $stmtInserir->close();
        }
    }

    public function atualizarEvento($eventoId, $statusEvento, $titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $checkedValues, $valorEvento) {
        try {
            // Iniciar transação
            $this->conn->begin_transaction();
    
            // Atualizar detalhes do evento
            $sql = "UPDATE eventos SET titulo = ?, cep = ?, numero = ?, logradouro = ?, bairro = ?, cidade = ?, uf = ?, dt_inicio = ?, dt_fim = ?, descricao = ?, status = ?, check_obs = ? WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Erro na preparação da declaração: " . $this->conn->error);
            }
    
            $stmt->bind_param("ssisssssssisi", $titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $statusEvento, $checkedValues, $eventoId);
            if (!$stmt->execute()) {
                throw new Exception("Erro ao executar declaração: " . $stmt->error);
            }
    
            // Atualizar os planos do evento
            if (is_array($valorEvento)) {
                // Acessar propriedades do array associativo corretamente
                $planos = array_map(function($plano) {
                    return ['nome' => $plano['nome'], 'valor' => $plano['valor'], 'descricao' => $plano['descricao']];
                }, $valorEvento);
    
                if (!$this->atualizarPlanosEvento($eventoId, $planos)) {
                    throw new Exception("Erro ao atualizar planos de evento");
                }
            } else if (is_string($valorEvento) && !empty($valorEvento)) {
                $planos = [
                    ['nome' => "", 'valor' => $valorEvento, 'descricao' => ""]
                ];
                if (!$this->atualizarPlanosEvento($eventoId, $planos)) {
                    throw new Exception("Erro ao atualizar planos de evento");
                }
            }
    
            // Commit da transação
            $this->conn->commit();
    
            return true;
        } catch (Exception $e) {
            // Rollback da transação em caso de erro
            $this->conn->rollback();
            error_log("Erro ao atualizar evento: " . $e->getMessage());
            return false;
        } finally {
            $stmt->close();
        }
    }
    
    public function criarEvento($titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $checkedValues, $valorEvento, $uploadsObrigatorios) {
        $this->conn->begin_transaction();
        try {
            $sql = "INSERT INTO eventos (titulo, cep, numero, logradouro, bairro, cidade, uf, dt_inicio, dt_fim, descricao, check_obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Erro na preparação da declaração: " . $this->conn->error);
            }
            $stmt->bind_param("ssissssssss", $titulo, $cep, $numero, $logradouro, $bairro, $cidade, $uf, $dtInicio, $dtFim, $descricao, $checkedValues);
            if (!$stmt->execute()) {
                throw new Exception("Erro ao executar declaração: " . $stmt->error);
            }
    
            if ($stmt->affected_rows > 0) {
                $idEvento = $this->conn->insert_id;
                error_log("ID do evento: $idEvento");
    
                // Serializar uploads obrigatórios
                $uploadsObrigatoriosJson = json_encode($uploadsObrigatorios);
    
                $sqlDetalhes = "INSERT INTO detalhes_eventos (id_eventos, obrigatorio) VALUES (?,?)";
                $stmtDetalhes = $this->conn->prepare($sqlDetalhes);
                if (!$stmtDetalhes) {
                    throw new Exception("Erro na preparação da declaração detalhes_eventos: " . $this->conn->error);
                }
    
                $stmtDetalhes->bind_param("is", $idEvento, $uploadsObrigatoriosJson);
                if (!$stmtDetalhes->execute()) {
                    throw new Exception("Erro ao executar declaração detalhes_eventos: " . $stmtDetalhes->error);
                }
    
                // Verificar e inserir planos de eventos
                if (is_array($valorEvento)) {
                    foreach ($valorEvento as $plano) {
                        if (is_object($plano)) {
                            $plano = (array) $plano; // Converter stdClass para array associativo
                        }
    
                        if (isset($plano['nome']) && isset($plano['valor']) && isset($plano['descricao'])) {
                            if (!$this->inserirPlanoEvento($idEvento, $plano['nome'], $plano['valor'], $plano['descricao'])) {
                                throw new Exception("Erro ao inserir plano de evento");
                            }
                        } else {
                            throw new Exception("Formato de plano de evento inválido");
                        }
                    }
                } else if (is_string($valorEvento) && !empty($valorEvento)) {
                    if (!$this->inserirPlanoEvento($idEvento, null, $valorEvento, null)) {
                        throw new Exception("Erro ao inserir plano de evento");
                    }
                }
                $this->conn->commit();
                return $idEvento;
    
            } else {
                throw new Exception("Nenhuma linha afetada ao inserir evento");
            }
    
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Erro ao inserir evento: " . $e->getMessage());
            return false;
        } finally {
            $stmt->close();
            if (isset($stmtDetalhes)) {
                $stmtDetalhes->close();
            }
        }
    }
    
    
    
    public function atualizarDetalhesEvento($idEvento, $tipo, $parametro) {
        // Validar os tipos permitidos
        $tiposPermitidos = ['img_carrousel', 'img_capa', 'autorizacao_viagem', 'zip_rider', 'roteiro'];
        if (!in_array($tipo, $tiposPermitidos)) {
            throw new Exception("Tipo inválido fornecido: $tipo");
        }
    
        // Validar o ID do evento
        if (!is_int($idEvento) || $idEvento <= 0) {
            throw new Exception("ID do evento inválido: $idEvento");
        }
    
        // Garantir que o parâmetro seja booleano e convertê-lo para inteiro
        if (!is_bool($parametro)) {
            throw new Exception("O parâmetro deve ser booleano.");
        }
        $parametro = $parametro ? 1 : 0;
    
        // Construir a query de atualização
        $sql = "UPDATE detalhes_eventos SET $tipo = ? WHERE id_eventos = ?";
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Erro na preparação da declaração: " . $this->conn->error);
        }
    
        $stmt->bind_param("ii", $parametro, $idEvento);
        if (!$stmt->execute()) {
            $stmt->close();
            throw new Exception("Erro ao executar declaração: " . $stmt->error);
        }
    
        $affectedRows = $stmt->affected_rows;
        $stmt->close();
    
        if ($affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }
}

class UserData {
    private $conn;
    private $puxarTodosDados;
    private $email_sender;

    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->puxarTodosDados = puxarTodosDados::getInstance(); // Use o Singleton
        
        // Configurações do servidor de e-mail
        $smtp_server = 'mail.rtpublicity.com';  
        $smtp_port = 465;  
        $smtp_username = 'gabriel@rtpublicity.com';  
        $smtp_password = 'Publicidade_1';  
        $remetente = 'gabriel@rtpublicity.com';

        $this->email_sender = new EmailSender($smtp_server, $smtp_port, $smtp_username, $smtp_password, $remetente);
    }
    public function salvarUsuarios($nome, $apelido, $email, $whatsapp, $senha, $posicao = 1) {
        $this->conn->begin_transaction();
        try {
            $pessoasSql = "INSERT INTO usuarios (nome, apelido, email, whatsapp, senha) VALUES (?, ?, ?, ?, ?)";
            $stmtPessoas = $this->conn->prepare($pessoasSql);
            $stmtPessoas->bind_param("sssss", $nome, $apelido, $email, $whatsapp, $senha);
            $resultPessoas = $stmtPessoas->execute();
            if ($resultPessoas) {
                $idUsuario = $this->conn->insert_id;
                $nivelSql = "INSERT INTO nivel_usuarios (id_usuario, posicao) VALUES (?, ?)";
                $stmtNivel = $this->conn->prepare($nivelSql);
                $stmtNivel->bind_param("ii", $idUsuario, $posicao);
                $resultNivel = $stmtNivel->execute();
                if ($resultNivel) {
                    $this->conn->commit();
                    $this->puxarTodosDados->atualizarInfoUsuario();
                    return true;
                } else {
                    $this->conn->rollback();
                    return false;
                }
            } else {
                $this->conn->rollback();
                return false;
            }
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Erro ao salvar usuário: " . $e->getMessage());
            return false;
        }
    }
    public function salvarUsuariosInterno($nome, $apelido, $email, $whatsapp, $cpf , $rg , $orgao, $endereco, $depedente, $posicao = 1){
        $this->conn->begin_transaction();
        try {
            $pessoasSql = "INSERT INTO usuarios (nome, apelido, email, whatsapp, cpf, rg, orgao_expedidor) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmtPessoas = $this->conn->prepare($pessoasSql);
            $stmtPessoas->bind_param("sssssss", $nome, $apelido, $email, $whatsapp, $cpf, $rg, $orgao);
            $resultPessoas = $stmtPessoas->execute();
            if ($resultPessoas) {
                $idUsuario = $this->conn->insert_id;
                $nivelSql = "INSERT INTO nivel_usuarios (id_usuario, posicao) VALUES (?, ?)";
                $stmtNivel = $this->conn->prepare($nivelSql);
                $stmtNivel->bind_param("ii", $idUsuario, $posicao);
                $resultNivel = $stmtNivel->execute();
                if ($resultNivel) {
                    $resultadoEndereco = $this->inserirEnderecoUsuario($idUsuario, $endereco);
                    if ($resultadoEndereco == true) {
                        $resultadoDependente = $this->inserirDependentesUsuario($idUsuario, $depedente);
                        if ($resultadoDependente == true) {
                            $senha = $this->gerarSenha();
                            $resultadoEmail = $this->SalvaEnviarSenha($email, $senha);
                            if ($resultadoEmail == true) {
                                $this->conn->commit();
                                $this->puxarTodosDados->atualizarInfoUsuario();
                                return true;
                            }elseif ($resultado == "erroSenha") {
                                return "erroSenha";
                            } else {
                                return $senha;
                            }
                        }else{
                            error_log("Erro na variavel resultadoDependente");
                            $this->conn->rollback();
                            return false;
                        }
                    }else{
                        error_log("Erro na variavel resultadoEndereco");
                        $this->conn->rollback();
                        return false;
                    }   
                } else {
                    $this->conn->rollback();
                    return false;
                }
            } else {
                $this->conn->rollback();
                return false;
            }
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Erro ao salvar usuário: " . $e->getMessage());
            return false;
        }
    }
    public function salvarUsuariosExterno($nome, $apelido, $email, $whatsapp, $senha, $cpf , $rg , $orgao, $endereco, $depedente, $posicao = 1){
        $this->conn->begin_transaction();
        try {
            $pessoasSql = "INSERT INTO usuarios (nome, apelido, email, whatsapp, cpf, rg, orgao_expedidor, senha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtPessoas = $this->conn->prepare($pessoasSql);
            $stmtPessoas->bind_param("ssssssss", $nome, $apelido, $email, $whatsapp, $cpf, $rg, $orgao, $senha);
            $resultPessoas = $stmtPessoas->execute();
            if ($resultPessoas) {
                $idUsuario = $this->conn->insert_id;
                $nivelSql = "INSERT INTO nivel_usuarios (id_usuario, posicao) VALUES (?, ?)";
                $stmtNivel = $this->conn->prepare($nivelSql);
                $stmtNivel->bind_param("ii", $idUsuario, $posicao);
                $resultNivel = $stmtNivel->execute();
                if ($resultNivel) {
                    $resultadoEndereco = $this->inserirEnderecoUsuario($idUsuario, $endereco);
                    if ($resultadoEndereco == true) {
                        $resultadoDependente = $this->inserirDependentesUsuario($idUsuario, $depedente);
                        if ($resultadoDependente == true) {
                            $this->conn->commit();
                            $this->puxarTodosDados->atualizarInfoUsuario();
                            return true;
                        }else{
                            error_log("Erro na variavel resultadoDependente");
                            $this->conn->rollback();
                            return false;
                        }
                    }else{
                        error_log("Erro na variavel resultadoEndereco");
                        $this->conn->rollback();
                        return false;
                    }   
                } else {
                    $this->conn->rollback();
                    return false;
                }
            } else {
                $this->conn->rollback();
                return false;
            }
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Erro ao salvar usuário: " . $e->getMessage());
            return false;
        }
    }
    public function inserirEnderecoUsuario($id_usuario, $endereco) {
        if (!is_array($endereco)) {
            error_log("O endereço fornecido não é um array válido.");
            return false;
        }
        try {
            $sql = "INSERT INTO enderecos_usuarios (id_usuario, nome_endereco, cep, numero, logradouro, bairro, cidade, uf, tipo)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)";
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception("Erro ao preparar a declaração SQL: " . $this->conn->error);
            }
            $stmt->bind_param(
                "ississss",
                $id_usuario,
                $endereco['tituloEndereco'],
                $endereco['cep_responsavel'],
                $endereco['numero_responsavel'],
                $endereco['logradouro_responsavel'],
                $endereco['bairro_responsavel'],
                $endereco['cidade_responsavel'],
                $endereco['uf_responsavel']
            );
            if (!$stmt->execute()) {
                throw new Exception("Erro ao executar a declaração SQL: " . $stmt->error);
            }
            return true;
        } catch (Exception $e) {
            error_log($e->getMessage());
            return false;
        }
    }
    public function inserirDependentesUsuario($id_usuario, $dependentesOrganizados) {
        if (empty($dependentesOrganizados)) {
            return true;
        }
        $this->conn->begin_transaction();
        try {
            $sql = "INSERT INTO dependentes (id_responsavel, id_instituicao, id_evento, check_obs, nome, dt_nascimento, cpf, rg, orgao_expedidor)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new Exception("Erro ao preparar a declaração SQL: " . $this->conn->error);
            }
            foreach ($dependentesOrganizados as $dependente) {
                $stmt->bind_param(
                    "iiissssss",
                    $id_usuario,
                    $dependente['instituicao_disponivel'],
                    $dependente['evento_disponivel'],
                    $dependente['tipoEvento'],
                    $dependente['nomeDependente'],
                    $dependente['dtNascimentoDependente'],
                    $dependente['cpfDependente'],
                    $dependente['rgDependente'],
                    $dependente['orgaoDependente']
                );
                if (!$stmt->execute()) {
                    throw new Exception("Erro ao executar a declaração SQL: " . $stmt->error);
                }
            }
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log($e->getMessage());
            return false;
        }
    }
    public function SalvaEnviarSenha($email, $senha) {
        $senhaHash = hash('sha256', $senha); 
        $subir_senha = $this->update_senha($email, $senhaHash); 
        if ($subir_senha == true) {
            try {
                $enviado = $this->email_sender->enviar_senha_por_email($email, $senha);
                if ($enviado) {
                    return true; 
                } else {
                    error_log("Erro ao enviar e-mail porem não gerou codigo de erro no try catch");
                    return false;
                }
            } catch (Exception $e) {
                error_log("Erro ao enviar e-mail: " . $e->getMessage());
                return false;
            }
        } else {
            return "erroSenha";
        }
    }
    public function criarSalvaEnviarSenha($email) {
        $senha = $this->gerarSenha();
        $senhaHash = hash('sha256', $senha); 
        $subir_senha = $this->update_senha($email, $senhaHash); 
        if ($subir_senha == true) {
            try {
                $enviado = $this->email_sender->enviar_senha_por_email($email, $senha);
                if ($enviado) {
                    return true; 
                } else {
                    error_log("Erro ao enviar e-mail porem não gerou codigo de erro no try catch");
                    return false;
                }
            } catch (Exception $e) {
                error_log("Erro ao enviar e-mail: " . $e->getMessage());
                return false;
            }
        } else {
            return "erroSenha";
        }
    }
    public function update_senha($email, $senhaHash) {
        $this->conn->begin_transaction();
        try {
            $query = "UPDATE usuarios SET senha = ? WHERE email = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Erro ao preparar a declaração SQL: " . $this->conn->error);
            }

            $stmt->bind_param("ss", $senhaHash, $email);
            $result = $stmt->execute();
            if ($result === false) {
                throw new Exception("Erro ao executar a declaração SQL: " . $stmt->error);
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log($e->getMessage());
            return false;
        }
    }

    public function gerarSenha() {$senha = rand(100000, 999999);return $senha;}
    public function emailExiste($email) {return $this->puxarTodosDados->emailExiste($email);}
    public function verificarStatus($userId) {return $this->puxarTodosDados->verificarStatus($userId);}
    public function verificarPosicao($userId) {return $this->puxarTodosDados->verificarPosicao($userId);}
}

class LoginData {
    private $conn;

    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
    }

    public function loginUser($email, $senha) {
        $loginSql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
        $stmtLogin = $this->conn->prepare($loginSql);
        $stmtLogin->bind_param("ss", $email, $senha);
        $stmtLogin->execute();
        $result = $stmtLogin->get_result();

        if ($result->num_rows == 1) {
            return $result->fetch_assoc();
        } else {
            return false;
        }
    }

    public function isLoggedIn() {
        if (isset($_SESSION['user'])) {
            if (isset($_SESSION['user']['id']) && isset($_SESSION['user']['nome']) && isset($_SESSION['user']['apelido']) &&  isset($_SESSION['user']['email']) && isset($_SESSION['user']['whatsapp'])) {
                if (!empty($_SESSION['user']['id']) && !empty($_SESSION['user']['nome']) && !empty($_SESSION['user']['apelido'])  && !empty($_SESSION['user']['email']) && !empty($_SESSION['user']['whatsapp'])) {
                    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 7200)) {
                        $this->logout();
                        return false;
                    }
                    $_SESSION['last_activity'] = time();
                    return true;
                }
            }
        }
        return false;
    }

    public function verificarAcesso($posicaoNecessaria = 'Membro') {
        if (!$this->isLoggedIn()) {
            header("Location: ../login/");
            exit;
        }

        if (!isset($_SESSION['user']['posicao']) || $_SESSION['user']['posicao'] !== $posicaoNecessaria) {
            header("Location: logout.php");
            exit;
        }
    }

    public function logout() {
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        header("Location: ../login/");
        exit;
    }
}

?>