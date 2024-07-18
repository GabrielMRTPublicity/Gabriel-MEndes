<?php
require '../php/functions.php'; 
$todosDados = puxarTodosDados::getInstance();
$instituicoes = $todosDados->getInstituicoesAtivas();
$vinculos = $todosDados->getVinculosComTitulos();
$eventos = $todosDados->getEventosAtivos();
#error_log(print_r($eventos, true));
?>
<div id="myModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <div class="row">
            <p class="titulo-vinculo">Deseja ver eventos ou instituições já vinculadas?<br><span>clique no botão da sua escolha</span></p>
            <div class="col-12 col-sm-6 mb-3">
                <button type="button" id="mostrar_eventos">Mostrar Eventos</button>
            </div>
            <div class="col-12 col-sm-6 mb-3">
                <button type="button" id="mostrar_instituicoes">Mostrar Instituições</button>
            </div>
        </div>
        <!-- Tabela de Eventos -->
        <div id="div_evento" style="display:none;">
            <span class="titulo-table">Eventos com vínculos:</span>
            <table id="eventos-table">
                <thead>
                    <tr>
                        <th class="id_col">ID Eventos</th>
                        <th class="titulo_col">Títulos dos Eventos</th>
                        <th class="titulo_col2">
                            <div class="filtro">
                                <label for="tipoFiltroEvento">Tipo:</label>
                                <select id="tipoFiltroEvento">
                                    <option value="todos">Todos</option>
                                    <option value="escolar">Escolar</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="eventos-tbody">
                    <?php
                    $eventos_adicionados = [];
                    foreach ($vinculos as $vinculo):
                        if (!in_array($vinculo['id_eventos'], $eventos_adicionados)):
                            $eventos_adicionados[] = $vinculo['id_eventos'];
                    ?>
                    <tr data-evento-id="<?php echo htmlspecialchars($vinculo['id_eventos']); ?>" class="evento-row" style="cursor: pointer;">
                        <td class="id_col">
                            <?php echo htmlspecialchars($vinculo['id_eventos']); ?>
                        </td>
                        <td class="titulo_col">
                            <?php echo htmlspecialchars($vinculo['evento_titulo']); ?>
                        </td>
                        <td class="titulo_col2">
                            <?php if ($vinculo['evento_check_obs'] === '0') {echo "Outros";} else {echo "Escolar";}?>
                        </td>
                    </tr>
                    <?php 
                        endif;
                    endforeach; 
                    ?>
                </tbody>
            </table>
            <table id="mostrar-instituicoes-table" style="display:none;">
                <thead>
                    <tr>
                        <th class="id_col">ID Instituição</th>
                        <th class="titulo_col">Título da Instituição</th>
                    </tr>
                </thead>
                <tbody id="mostrar-instituicoes-tbody">
                    <?php foreach ($instituicoes as $instituicao): ?>
                    <tr data-instituicao-id="<?php echo htmlspecialchars($instituicao['id']); ?>">
                        <td>
                            <?php echo htmlspecialchars($instituicao['id']); ?>
                        </td>
                        <td>
                            <?php echo htmlspecialchars($instituicao['titulo']); ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <!-- Tabela de Instituições -->
        <div id="div_instituicao" style="display:none;">
            <span class="titulo-table">Instituições com vínculos:</span>
            <table id="instituicoes-table">
                <thead>
                    <tr>
                        <th class="id_col">ID Instituição</th>
                        <th class="titulo_col">Títulos das Instituições</th>
                        <th class="titulo_col2">
                            <div class="filtro">
                                <label for="tipoFiltroInsituicoes">Tipo:</label>
                                <select id="tipoFiltroInsituicoes">
                                    <option value="todos">Todos</option>
                                    <option value="Escolar">Escolar</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="instituicoes-tbody">
                    <?php
                    $instituicoes_adicionadas = [];
                    foreach ($vinculos as $vinculo):
                        if (!in_array($vinculo['id_instituicoes'], $instituicoes_adicionadas)):
                            $instituicoes_adicionadas[] = $vinculo['id_instituicoes'];
                    ?>
                    <tr data-instituicao-id="<?php echo htmlspecialchars($vinculo['id_instituicoes']); ?>" class="instituicao-row" style="cursor: pointer;">
                        <td class="id_col">
                            <?php echo htmlspecialchars($vinculo['id_instituicoes']); ?>
                        </td>
                        <td class="titulo_col">
                            <?php echo htmlspecialchars($vinculo['instituicao_titulo']); ?>
                        </td>
                        <td class="titulo_col2">
                            <?php if ($vinculo['instituicao_check_obs'] === '0') { echo "Outros";} else {echo "Escolar";}?>
                        </td>
                    </tr>
                    <?php
                        endif;
                    endforeach;
                    ?>
                </tbody>
            </table>
            <table id="mostrar-eventos-table" style="display:none;">
                <thead>
                    <tr>
                        <th class="id_col">ID Evento</th>
                        <th class="titulo_col">Título do Evento</th>
                    </tr>
                </thead>
                <tbody id="mostrar-eventos-tbody">
                    <?php foreach ($eventos as $evento): ?>
                    <tr data-evento-id="<?php echo htmlspecialchars($evento['id']); ?>" class="evento-row" style="cursor: pointer;">
                        <td>
                            <?php echo htmlspecialchars($evento['id']); ?>
                        </td>
                        <td>
                            <?php echo htmlspecialchars($evento['titulo']); ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <form method="post">
            <p>Adicione ou exclua eventos para as instituições cadastradas</p>
            <div class="flex-popup row mb-3">
                <div class="col-12 col-lg-6">
                    <div>
                        <p class="escolha">Escolha uma opção para vincular*:</p>
                    </div>
                    <div class="container">
                        <button type="button" id="filtro-escolar" class="filtro-btn">Escolar</button>
                        <button type="button" id="filtro-outros" class="filtro-btn">Outros</button>
                    </div>
                </div>
            </div>
            <div class="flex-popup row mb-3">
                <div class="col-12 col-lg-6">
                    <div>
                        <label class="escolha" for="evento">Evento:</label>
                    </div>
                    <div class="select-container">
                        <select name="evento" id="evento">
                            <!-- Options populated by JavaScript -->
                        </select>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div>
                        <label class="escolha" for="instituicao">Instituição:</label>
                    </div>
                    <div class="select-container">
                        <select name="instituicao" id="instituicao">
                            <!-- Options populated by JavaScript -->
                        </select>
                    </div>
                </div>
            </div>

            <div class="flex-popup row">
                <div class="col-12 col-sm-6 alinhar_add mb-3">
                    <button type="button" id="add_vinculo">Adicionar vínculo</button>
                </div>
                <div class="col-12 col-sm-6 alinhar_ex mb-3">
                    <button type="button" id="remover_vinculo">Excluir vínculo</button>
                </div>
            </div>
        </form>
    </div>
</div>

        