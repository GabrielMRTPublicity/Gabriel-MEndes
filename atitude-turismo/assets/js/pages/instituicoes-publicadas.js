let globalEventosData;

document.addEventListener('DOMContentLoaded', async () => {
    const addConteudoDiv = document.getElementById('addConteudo');
    const urls = [
        '../assets/php/puxardados.php?tipo=veiResumido',
        '../assets/php/puxardados.php?tipo=instituicoes'
    ];

    let htmlPadrao = `
        <div class="row project-cards">
            <div class="col-md-12 project-list">
                <div class="card">
                    <div class="row">
                        <div class="col-md-8">
                            <ul class="nav nav-tabs border-tab" id="top-tab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="filtroTodos" data-bs-toggle="tab" href="#todos" role="tab" aria-controls="top-home" aria-selected="true"><i data-feather="archive"></i>Todos</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="filtroNao" data-bs-toggle="tab" href="#Ativo" role="tab" aria-controls="top-home" aria-selected="false"><i data-feather="watch"></i>Ativas</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="filtrofinalizado" data-bs-toggle="tab" href="#Inativo" role="tab" aria-controls="top-contact" aria-selected="false"><i data-feather="check-circle"></i>Desativadas</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group mb-0 me-0"></div><a class="btn btn-primary" href="cadastrar_instituicoes.php"> <i data-feather="plus-square"> </i>Criar Instituição</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                        <div class="tab-content" id="top-tabContent">
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    let htmlTodos = `
        <div class="tab-pane fade show active" id="todos" role="tabpanel" aria-labelledby="top-home-tab">
            <div class="row">
            </div>
        </div>`;

    let htmlAtivo = `
        <div class="tab-pane fade" id="Ativo" role="tabpanel" aria-labelledby="profile-top-tab">
            <div class="row">
            </div>
        </div>`;

    let htmlDesativado = `
        <div class="tab-pane fade" id="Inativo" role="tabpanel" aria-labelledby="contact-top-tab">
            <div class="row">
            </div>
        </div>`;

    const gerarHtmlModelo = (etapa) => {
        let badgeClass;
        switch (etapa) {
            case 'Ativo':
                badgeClass = 'badge-primary';
                break;
            case 'Inativo':
                badgeClass = 'badge-success';
                break;
        }

        return `
        <div class="col-xxl-4 col-lg-6 box-col-6">
            <div class="project-box b-light1-primary"><span id="Etapa" class="badge ${badgeClass}"></span>
                <h5 class="f-w-700 mb-3 titulo">
                    <a class="f-w-700 mb-3 titLinkinstituicao" href="#" id="id_Instituicao" onclick="abrirInstituicao();"></a>
                </h5>
                <p id="Descricao"></p>
                <div class="row informacao mb-3">
                    <div class="col-12"><h5 class="f-w-700 mb-1">Detalhes da Instituição</h5></div>
                    <div><p><strong>Tipo:</strong> <span id="TipoInstituicaoBox"></span></p></div>
                    <div><p><strong>Status:</strong> <span id="Status"></span></p></div>
                    <div><p><strong>URL:</strong> <span id="URL"></span></p></div>
                </div>
                <div class="text-center mt-3">
                    <p><strong>Criado em:</strong> <span id="Criado_Em"></span></p>
                </div>
            </div>
        </div>`;
    };

    const fetchData = (url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.statusText);
                }
                return response.json();
            });
    };

    function processarEventos(instituicoesData) {

        const formatarDataBrasileiraH = (dataISO) => {
            const [data, hora] = dataISO.split(' ');
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano} ${hora}`;
        };

        const processedData = instituicoesData.instituicoes.map(instituicao => {

            const checkObs = instituicao.Check_Obs === "0" ? "Outros" : "Escolar";
            const status = instituicao.Status === "1" ? "Ativo" : "Inativo";
            const criadoEmBR = formatarDataBrasileiraH(instituicao.Criado_Em);
            const htmlModelo = gerarHtmlModelo(status);
            const $html = $(htmlModelo);
            // Preenche os dados no HTML
            $html.find("#Etapa").text(status);
            $html.find("#id_Instituicao").attr("onclick", "abrirInstituicao(event, " + instituicao.ID + ");");
            $html.find("#id_Instituicao").text(instituicao.Título);
            $html.find("#Descricao").text(instituicao.Descricao);
            $html.find("#TipoInstituicaoBox").text(instituicao.Check_Obs === "0" ? "Outros" : "Escolar");
            $html.find("#Status").text(status);
            $html.find("#URL").text(instituicao.URL);
            $html.find("#Criado_Em").text(criadoEmBR);

            return $html.prop('outerHTML');
        });

        return processedData;
    }

    function classificarEAdicionarEventos(htmlSubstituido) {
        let padraoHtml = $(htmlPadrao).clone();
        let todosHtml = $(htmlTodos).clone();
        let pendenteHtml = $(htmlAtivo).clone();
        let finalizadoHtml = $(htmlDesativado).clone();

        let pendenteEventos = [];
        let finalizadoEventos = [];

        // Adiciona todos os eventos ao HTML de todos os eventos
        htmlSubstituido.forEach(eventoHtml => {
            const etapa = $(eventoHtml).find("#Etapa").text().trim();

            switch (etapa) {
                case 'Ativo':
                    pendenteEventos.push(eventoHtml);
                    break;
                case 'Inativo':
                    finalizadoEventos.push(eventoHtml);
                    break;
            }
        });

        // Adiciona todos os eventos ao HTML de todos os eventos
        todosHtml.find(".row").append(htmlSubstituido.join(''));
        // Adiciona os eventos classificados aos seus respectivos HTMLs
        pendenteHtml.find(".row").append(pendenteEventos.join(''));
        finalizadoHtml.find(".row").append(finalizadoEventos.join(''));

        // Adiciona os HTMLs gerados ao padraoHtml
        padraoHtml.find("#top-tabContent").append(todosHtml);
        padraoHtml.find("#top-tabContent").append(pendenteHtml);
        padraoHtml.find("#top-tabContent").append(finalizadoHtml);

        return padraoHtml.html();
    }

    try {
        const results = await Promise.all(urls.map(url => fetchData(url)));
        const [veiData, instituicoesData] = results;
        globalInstituicoesData = instituicoesData;
        globalVeiData = veiData;

        const htmlSubstituido = processarEventos(instituicoesData);
        const retornoHtmlPadrao = classificarEAdicionarEventos(htmlSubstituido);

        addConteudoDiv.innerHTML = retornoHtmlPadrao;
        feather.replace();
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao buscar os dados. A página será recarregada.',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            location.reload();
        });
    }
});

function abrirInstituicao(event, id) {
    event.preventDefault();
    let instituicaoId = String(id);
    const instituicao = globalInstituicoesData.instituicoes.find(instituicao => String(instituicao.ID) === instituicaoId);
    let vei = [];
    if (globalVeiData.vei && Array.isArray(globalVeiData.vei)) {
        vei = globalVeiData.vei.filter(v => String(v.ID_Instituicao) === instituicaoId);
    }
    if (instituicao) {

        const formatarTelefone = (telefone) => {
            telefone = telefone.replace(/\D/g, '');
            if (telefone.length === 11) {
                return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else if (telefone.length === 10) {
                return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
            } else {
                return telefone;
            }
        };
        const formatarCEP = (cep) => { return cep.replace(/(\d{5})(\d{3})/, "$1-$2"); };
        const formatarDataBrasileiraH = (dataISO) => {
            const [data, hora] = dataISO.split(' ');
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano} ${hora}`;
        };
        const status = instituicao.Status === "1" ? "Ativo" : "Inativo";
        const criadoEmBR = formatarDataBrasileiraH(instituicao.Criado_Em);
        const ultimaAtualizacao = formatarDataBrasileiraH(instituicao.Atualizado_Em);
        const cepFormatado = formatarCEP(instituicao.CEP);
        const telefone = formatarTelefone(instituicao.Telefone);

        let detalhesHtml = `
            <div class="divforaTable">
                <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="3" class="titSubPopup">Detalhes do Evento</th>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Status</th>
                    </tr>
                    <tr>
                        <td>${instituicao.ID}</td>
                        <td>${instituicao.Título}</td>
                        <td>${status}</td>
                    </tr>
                </table>
                <table class="tableDetalhesEventos">
                    <tr>
                        <th>Nome do Responsável</th>
                        <th>Telefone</th>
                        <th>Tipo Instituição</th>
                    </tr>
                    <tr>
                        <td>${instituicao.Nome_Responsavel}</td>
                        <td>${telefone}</td>
                        <td>${instituicao.Check_Obs === "0" ? "Outros" : "Escolar"}</td>
                    </tr>
                </table>
                <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="3">Descrição</th>
                    </tr>
                    <tr>
                        <td colspan="3" class="tdDescricao">${instituicao.Descricao}</td>
                    </tr>
                </table>
                </div>
                <br>
                <div class="divforaTable">
                    <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="3" class="titSubPopup">Endereço</th>
                    </tr>
                    <tr>
                        <th>Logradouro</th>
                        <th>Número</th>
                        <th>Bairro</th>
                    </tr>
                    <tr>
                        <td>${instituicao.Logradouro}</td>
                        <td>${instituicao.Numero}</td>
                        <td>${instituicao.Bairro}</td>
                    </tr>
                    <tr>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>CEP</th>
                    </tr>
                    <tr>
                        <td class="addbottom">${instituicao.Cidade}</td>
                        <td class="addbottom">${instituicao.UF}</td>
                        <td class="addbottom">${cepFormatado}</td>
                    </tr>
                    </table>
                </div>
                <br>
                <div class="divforaTable">
                <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="2" class="titSubPopup">Detalhes</th>
                    </tr>
                    <tr>
                        <th>Link:</th>
                        <td class="addbottom">${instituicao.URL}</td>
                    </tr>
                    <tr>
                        <th>Criado Em:</th>
                        <td class="addbottom">${criadoEmBR}</td>
                    </tr>
                    <tr>
                        <th>Última Atualização:</th>
                        <td class="addbottom">${ultimaAtualizacao}</td>
                    </tr>
                </table>
            </div>
            `;

        if (vei.length > 0) {
            detalhesHtml += `
                <br>
                <div class="divforaTable">
                    <table class="tableDetalhesEventos">
                        <tr>
                            <th colspan="3" class="titSubPopup">Eventos Vinculados</th>
                        </tr>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Status</th>
                        </tr>`;

            vei.forEach(evento => {
                const eventoStatus = evento.Evento_Status === 1 ? "Ativo" : "Inativo";
                detalhesHtml += `
                    <tr>
                        <td class="addbottom">${evento.ID_Evento}</td>
                        <td class="addbottom">${evento.Evento_Título}</td>
                        <td class="addbottom">${eventoStatus}</td>
                    </tr>`;
            });

            detalhesHtml += `
                    </table>
                </div>`;
        }

        Swal.fire({
            title: '',
            html: detalhesHtml,
            showCancelButton: true,
            confirmButtonText: 'Editar',
            cancelButtonText: 'Fechar',
            didOpen: () => {
                document.querySelector('.swal2-popup').id = 'popupDetalhesEventos';
                document.querySelector('.swal2-confirm').id = 'editarButton';
            }
        }).then((result) => {
            if (result.isConfirmed) {
                habilitarEdicao(instituicao);
            }
        });
    } else {
        console.log("Evento não encontrado para o ID:", eventoId);
    }
}

function habilitarEdicao(instituicao) {
    const formHtml = `
        <form id="editarInstituicaoForm">
            <div class="form theme-form">
                <div class="row">
                    <div class="col-sm-4">
                    </div>
                    <div class="col-sm-4">
                        <div class="mb-3">
                            <label for="titulo_evento">Status do Evento:</label>
                            <div class="select-style">
                                <select class="form-control" name="status_instituicao" id="status_instituicao" style="text-align:center;">
                                    <option value="Inativo" ${instituicao.Status === "0" ? "selected" : ""}>Inativo</option>
                                    <option value="Ativo" ${instituicao.Status === "1" ? "selected" : ""}>Ativo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <label for="titulo_instituicao">Titulo do Evento</label>
                            <input class="form-control" name="titulo_instituicao" id="titulo_instituicao" type="text" placeholder="Digite o nome do Evento" value="${instituicao.Título}">
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="nome_responsavel">Nome do Responsável:</label>
                            <input class="form-control" id="nome_responsavel" name="nome_responsavel" type="text" value="${instituicao.Nome_Responsavel}">
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="telefone">WhatsApp:</label>
                            <input class="form-control" id="telefone" name="telefone" type="text"value="${instituicao.Telefone}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="cep_instituicao">CEP:</label>
                            <input type="text" class="form-control" id="cep_instituicao" name="cep_instituicao" placeholder="Digite seu CEP" value="${instituicao.CEP}">
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="numero_instituicao">Numero:</label>
                            <input type="text" class="form-control" id="numero_instituicao" name="numero_instituicao" placeholder="Digite o número" value="${instituicao.Numero}">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <label for="logradouro_instituicao">Logradouro:</label>
                            <input type="text" class="form-control" id="logradouro_instituicao" name="logradouro_instituicao" placeholder="Logradouro" value="${instituicao.Logradouro}">
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="mb-3">
                            <label for="bairro_instituicao">Bairro:</label>
                            <input type="text" class="form-control" id="bairro_instituicao" name="bairro_instituicao" placeholder="Bairro" value="${instituicao.Bairro}">
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="mb-3">
                            <label for="cidade_instituicao">Cidade:</label>
                            <input type="text" class="form-control" id="cidade_instituicao" name="cidade_instituicao" placeholder="Cidade" value="${instituicao.Cidade}">
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="mb-3">
                            <label for="uf_instituicao">UF:</label>
                            <input type="text" class="form-control" id="uf_instituicao" name="uf_instituicao" placeholder="UF" value="${instituicao.UF}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="mb-3">
                            <label for="descricao_instituicao">Descrição:</label>
                            <textarea name="descricao_instituicao" id="descricao_instituicao" class="form-control" rows="4" placeholder="Digite detalhes sobre a instituição.">${instituicao.Descricao}</textarea>
                        </div>
                    </div>
                </div>
                <div id="addRestanteFormulario"></div>
            </div>
        </form>
    `;

    Swal.fire({
        title: 'Editar Instituição',
        html: formHtml,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        denyButtonText: 'Excluir',
        didRender: () => {
            document.querySelector('.swal2-popup').id = 'popupEdicaoInstituicao';
            const form = document.getElementById('editarInstituicaoForm');
            if (form) {
                obterHtmlResto(instituicao);
            } else {
                console.error("Formulário de edição não encontrado.");
            }
            aplicarMascaras();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            salvarEvento(instituicao.ID);
        } else if (result.isDenied) {
            excluirEvento(instituicao.ID);
        }
    });
}

function obterHtmlResto(instituicao) {
    const tipoIstituicao = instituicao.Check_Obs === "0" ? "Outros" : "Escolar";
    const htmlInicial = `
        <div class="row">
            <div class="col-sm-6">
                <div class="mb-3">
                    <label for="tipoIstituicao">Tipo de Instituição:</label>
                    <div class="select-style">
                        <select id="tipoInstituicao" class="form-control" disabled style="text-align:center;">
                            <option value="instituicao_escola" ${tipoIstituicao === "Escolar" ? "selected" : ""}>Evento Escolar</option>
                            <option value="instituicao_outros" ${tipoIstituicao === "Outros" ? "selected" : ""}>Outros</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="row" id="addConteudoConteiner">
                </div>
            </div>
        </div>
        `;

    function addEventoEscolar(instituicao) {
        let Check_Obs = instituicao.Check_Obs.split(",");
        var htmlToAdd = `
            <div class="col-sm-12">
                <div class="mb-3">
                    <label>Tipo de Viagem:</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="1" id="evento1" ${Check_Obs.includes("1") ? "checked" : ""}>
                        <label class="form-check-label" for="evento1">
                            Viagem de Formatura 9°
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="2" id="evento2" ${Check_Obs.includes("2") ? "checked" : ""}>
                        <label class="form-check-label" for="evento2">
                            Viagem de Formatura 3°
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="3" id="evento3" ${Check_Obs.includes("3") ? "checked" : ""}>
                        <label class="form-check-label" for="evento3">
                            Passeios Escolares
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="4" id="evento4" ${Check_Obs.includes("4") ? "checked" : ""}>
                        <label class="form-check-label" for="evento4">
                            Viagem de Funcionários
                        </label>
                    </div>
                </div>
            </div>`;
        return htmlToAdd;
    }
    let elemento = document.getElementById('addRestanteFormulario');
    if (elemento) {
        elemento.innerHTML = htmlInicial;
        let idCol8 = document.getElementById('addConteudoConteiner');
        if (tipoIstituicao === 'Escolar') {
            let htmlEscolar = addEventoEscolar(instituicao);
            if (idCol8) {
                idCol8.innerHTML = htmlEscolar;
                aplicarMascaras();
            } else {
                console.log("Elemento com ID 'htmlEscolar' não encontrado.");
            }
        }
    } else {
        console.error("Elemento com ID 'addRestanteFormulario' não encontrado.");
    }
}

function aplicarMascaras() {
    $('#telefone').inputmask({
        mask: ['(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true,
        clearMaskOnLostFocus: true
    });

    $('#cep_instituicao').inputmask('99999-999');

    $('#cep_instituicao').on('blur', function() {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length != 8) {
            return;
        }
        $.ajax({
            url: 'https://viacep.com.br/ws/' + cep + '/json/',
            dataType: 'json',
            success: function(response) {
                $('#logradouro_instituicao').val(response.logradouro);
                $('#bairro_instituicao').val(response.bairro);
                $('#cidade_instituicao').val(response.localidade);
                $('#uf_instituicao').val(response.uf);
            }
        });
    });
}

function excluirEvento(instituicaoId) {
    var formData = new FormData();

    formData.append('tipoAtualizacao', 'excluir');
    formData.append('instituicaoId', instituicaoId);

    fetch('../assets/php/instituicoes.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();
            console.log('Sucesso:', data);
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Certo',
                    text: 'Instituição excluída com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na Exclusão',
                    text: data.message || 'Houve um erro ao excluir a Instituição. Tente novamente.',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch((error) => {
            Swal.close();
            console.log('Erro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro na Exclusão',
                text: 'Houve um erro ao excluir a Instituição. Tente novamente.',
                confirmButtonText: 'OK'
            });
        });
}

function salvarEvento(instituicaoId) {
    var formData = new FormData();
    formData.append('instituicaoId', instituicaoId);
    var statusInstituicao = $('#status_instituicao').val();
    var tituloInstituicao = $('#titulo_instituicao').val();
    var nomeResponsavel = $('#nome_responsavel').val();
    var telefoneResponsavel = $('#telefone').val();
    var cepInstituicao = $('#cep_instituicao').val();
    var numeroInstituicao = $('#numero_instituicao').val();
    var tipoInstituicao = $('#tipoInstituicao').val();
    var logradouroInstituicao = $('#logradouro_instituicao').val();
    var bairroInstituicao = $('#bairro_instituicao').val();
    var cidadeInstituicao = $('#cidade_instituicao').val();
    var ufInstituicao = $('#uf_instituicao').val();
    var descricaoInstituicao = $('#descricao_instituicao').val();
    var checkedValues = [];


    if (tipoInstituicao === 'instituicao_escola') {
        checkedValues = Array.from($('.form-check-input:checked')).map(cb => cb.value);
        if (checkedValues.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Nenhum tipo selecionado',
                text: 'Por favor, selecione pelo menos um tipo de Viagem.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }
    } else if (tipoInstituicao === 'instituicao_outros') {
        checkedValues = ["0"];
    }

    formData.append('checkedValues', JSON.stringify(checkedValues));

    // Array para verificar campos vazios
    var camposObrigatorios = [
        { valor: statusInstituicao, nome: 'Status do Instituicao' },
        { valor: tituloInstituicao, nome: 'Titulo do Instituicao' },
        { valor: cepInstituicao, nome: 'CEP' },
        { valor: numeroInstituicao, nome: 'Número' },
        { valor: nomeResponsavel, nome: 'Data de Início' },
        { valor: telefoneResponsavel, nome: 'Data de Fim' },
        { valor: tipoInstituicao, nome: 'Tipo do Instituicao' },
    ];

    var camposVazios = camposObrigatorios.filter(campo => !campo.valor);
    if (camposVazios.length > 0) {
        let camposVaziosNomes = camposVazios.map(campo => campo.nome).join(', ');
        Swal.fire({
            icon: 'error',
            title: 'Campos obrigatórios não preenchidos',
            text: 'Por favor, preencha os seguintes campos: ' + camposVaziosNomes,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: 'Aguarde...',
        text: 'Pode demorar um pouco.',
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });

    formData.append('tipoAtualizacao', 'atualizar');
    formData.append('statusInstituicao', statusInstituicao);
    formData.append('tituloInstituicao', tituloInstituicao);
    formData.append('nomeResponsavel', nomeResponsavel);
    formData.append('telefoneResponsavel', telefoneResponsavel);
    formData.append('cepInstituicao', cepInstituicao);
    formData.append('numeroInstituicao', numeroInstituicao);
    formData.append('logradouroInstituicao', logradouroInstituicao);
    formData.append('bairroInstituicao', bairroInstituicao);
    formData.append('cidadeInstituicao', cidadeInstituicao);
    formData.append('ufInstituicao', ufInstituicao);
    formData.append('descricaoInstituicao', descricaoInstituicao);

    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    fetch('../assets/php/instituicoes.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();
            console.log('Sucesso:', data);
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Certo',
                    text: 'Instituição atualizada com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na Atualização',
                    text: data.message || 'Houve um erro ao Atualizado a Instituição. Tente novamente.',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch((error) => {
            Swal.close();
            console.log('Erro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro na Atualização',
                text: 'Houve um erro ao Atualizado a Instituição. Tente novamente.',
                confirmButtonText: 'OK'
            });
        });
}