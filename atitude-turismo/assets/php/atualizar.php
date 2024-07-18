<?php
require_once 'functions.php';
$puxar = puxarTodosDados::getInstance();
$puxar->atualizarInfoUsuario();
$puxar->atualizarVinculos();
$puxar->atualizarInstituicoes();
$puxar->atualizarEventos();

class Atualizar {
    private $puxarTodosDados;

    public function __construct() {
        $this->puxarTodosDados = puxarTodosDados::getInstance();
    }

    public function atualizar($tipo) {
        switch ($tipo) {
            case 'infoUsuario':
                $this->puxarTodosDados->atualizarInfoUsuario();
                break;
            case 'vinculos':
                $this->puxarTodosDados->atualizarVinculos();
                break;
            case 'instituicoes':
                $this->puxarTodosDados->atualizarInstituicoes();
                break;
            case 'eventos':
                $this->puxarTodosDados->atualizarEventos();
                break;
            default:
                throw new Exception("Tipo inválido fornecido: $tipo");
        }
    }
}
?>
