<?php
require '../php/functions.php'; 
$todosDados = puxarTodosDados::getInstance();
$instituicoes = $todosDados->getInstituicoesAtivas();
$vinculos = $todosDados->getVinculosComTitulos();
$eventos = $todosDados->getEventosAtivos();
error_log(print_r($eventos, true));

?>