let globalEventosData;
//const baseUrl = `${window.location.origin}/sistema/atitude-turismo/assets/php/uploads/eventos/`;
const baseUrl = `${window.location.origin}/sites/atitude-turismo/assets/php/uploads/eventos/`;

document.addEventListener('DOMContentLoaded', async () => {
    const addConteudoDiv = document.getElementById('addConteudo');
    const urls = [
        '../assets/php/puxardados.php?tipo=instituicoesTitulosCodigos',
        '../assets/php/puxardados.php?tipo=eventos'
    ];

    let htmlPadrao = `
        <div class="row project-cards">
            <div class="col-md-12 project-list">
                <div class="card">
                    <div class="row">
                        <div class="col-md-9">
                            <ul class="nav nav-tabs border-tab" id="top-tab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="filtroTodos" data-bs-toggle="tab" href="#todos" role="tab" aria-controls="top-home" aria-selected="true"><i data-feather="archive"></i>Todos</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="filtroNao" data-bs-toggle="tab" href="#pendente" role="tab" aria-controls="top-home" aria-selected="false"><i data-feather="watch"></i>Não Iniciado</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="filtroSim" data-bs-toggle="tab" href="#emAndamento" role="tab" aria-controls="top-profile" aria-selected="false"><i data-feather="info"></i>Em Andamento</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="filtrofinalizado" data-bs-toggle="tab" href="#finalizado" role="tab" aria-controls="top-contact" aria-selected="false"><i data-feather="check-circle"></i>Finalizado</a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-0 me-0"></div><a class="btn btn-primary" href="cadastrar_eventos.php"> <i data-feather="plus-square"> </i>Criar Evento</a>
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

    let htmlPendente = `
        <div class="tab-pane fade" id="pendente" role="tabpanel" aria-labelledby="profile-top-tab">
            <div class="row">
            </div>
        </div>`;

    let htmlEmAndamento = `
        <div class="tab-pane fade" id="emAndamento" role="tabpanel" aria-labelledby="profile-top-tab">
            <div class="row">
            </div>
        </div>`;

    let htmlFinalizado = `
        <div class="tab-pane fade" id="finalizado" role="tabpanel" aria-labelledby="contact-top-tab">
            <div class="row">
            </div>
        </div>`;

    const gerarHtmlModelo = (etapa) => {
        let badgeClass;
        switch (etapa) {
            case 'Pendente':
                badgeClass = 'badge-primary';
                break;
            case 'Andamento':
                badgeClass = 'badge-warning';
                break;
            case 'Finalizado':
                badgeClass = 'badge-success';
                break;
        }

        return `
        <div class="col-xxl-4 col-lg-6 box-col-6">
            <div class="project-box b-light1-primary"><span id="Etapa" class="badge ${badgeClass}"></span>
                <h5 class="f-w-700 mb-3 titulo">
                    <a class="f-w-700 mb-3 titLinkEvento" href="#" id="id_evento" onclick="abrirEvento();"></a>
                </h5>
                <p id="Descricao"></p>
                <div class="row informacao mb-3">
                    <div class="col-12"><h5 class="f-w-700 mb-1">Detalhes do Evento</h5></div>
                    <div><p><strong>Tipo:</strong> <span id="TipoEventoBox"></span></p></div>
                    <div><p><strong>Status:</strong> <span id="Status"></span></p></div>
                    <div><p><strong>Data Inicio:</strong> <span id="Data_Inicio"></span></p></div>
                    <div><p><strong>Data Fim:</strong> <span id="Data_Fim"></span></p></div>
                    <div><p><strong>URL:</strong> <span id="URL"></span></p></div>
                    <div><p><strong>Instituição:</strong> <span id="Instituicao"></span></p></div>
                </div>
                <div class="row mb-3 text-center" id="addObrigatorio">></div>
                <div class="row" id="addDetalhesUpload">></div>
                <div class="project-status mt-4">
                    <div class="d-flex mb-0">
                        <p id="porcentagem"></p>
                        <div class="flex-grow-1 text-end"><span>Concluído</span></div>
                    </div>
                    <div class="progress" style="height: 5px">
                        <div id="barraPorcentagem" class="progress-bar-animated bg-primary progress-bar-striped" role="progressbar" style="width: 100%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
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

    function processarEventos(eventosData, instituicoesData) {
        const findInstituicaoByCodigo = (codigo) => {
            const instituicao = instituicoesData.instituicoesTitulosCodigos.find(inst => inst.Instituicao_Codigo === codigo);
            return instituicao ? instituicao.Instituicao_Título : 'Não vínculado';
        };

        const determineEtapa = (dataInicio, dataFim) => {
            const hoje = new Date();
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);

            if (hoje < inicio) {
                return 'Pendente';
            } else if (hoje > fim) {
                return 'Finalizado';
            } else {
                return 'Andamento';
            }
        };

        const tratarDetalhes = (detalhe) => {return detalhe === "1" ? 'Enviado' : 'Pendente';};

        const calcularPorcentagem = (dataInicio, dataFim) => {
            const hoje = new Date();
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);

            if (hoje < inicio) {
                return 0;
            } else if (hoje > fim) {
                return 100;
            } else {
                const totalDias = (fim - inicio) / (1000 * 60 * 60 * 24);
                const diasPassados = (hoje - inicio) / (1000 * 60 * 60 * 24);
                return Math.round((diasPassados / totalDias) * 100);
            }
        };

        const formatarDataBrasileira = (dataISO) => {
            const [data, hora] = dataISO.split(' ');
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        };
        const formatarDataBrasileiraH = (dataISO) => {
            const [data, hora] = dataISO.split(' ');
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano} ${hora}`;
        };

        const processedData = eventosData.eventos.map(evento => {
            let instituicaoCodigo = null;
            if (evento.URL) {
                const urlParts = evento.URL.split('?');
                if (urlParts.length > 1) {
                    const queryParams = urlParts[1].split('-');
                    if (queryParams.length > 0) {
                        instituicaoCodigo = queryParams[0];
                    }
                }
            }
            const instituicao = instituicaoCodigo ? findInstituicaoByCodigo(instituicaoCodigo) : 'Não vínculado';
            const checkObs = evento.Check_Obs === "0" ? "Outros" : "Escolar";
            const etapa = determineEtapa(evento.Data_Início, evento.Data_Fim);
            const porcentagem = calcularPorcentagem(evento.Data_Início, evento.Data_Fim);
            const dataInicioBR = formatarDataBrasileira(evento.Data_Início);
            const dataFimBR = formatarDataBrasileira(evento.Data_Fim);
            const criadoEmBR = formatarDataBrasileiraH(evento.Criado_Em);

            const img_carrousel = tratarDetalhes(evento.Detalhes['img_carrousel']);
            const img_capa = tratarDetalhes(evento.Detalhes['img_capa']);
            const autorizacao_viagem = tratarDetalhes(evento.Detalhes['autorizacao_viagem']);
            const zip_rider = tratarDetalhes(evento.Detalhes['zip_rider']);
            const roteiro = tratarDetalhes(evento.Detalhes['roteiro']);

            let obrigatorioJson = evento.Detalhes['obrigatorio'];
            let obrigatorioArray = JSON.parse(obrigatorioJson);
            let obrigatorioHtml = `<div class="col-12 text-center mb-3"><h5 class="f-w-700 mb-1">Arquivos Obrigatórios</h5></div>`;
            let detalhesUploadHtml = `<div class="col-12 text-center mb-3"><h5 class="f-w-700 mb-1">Status dos Arquivos Obrigatórios</h5></div><div class="col-8"><span><strong>Carrosel de imagens:</strong></span></div><div class="col-4 font-primary" id="img_carrousel">${img_carrousel}</div><div class="col-8"><span><strong>Imagem de capa:</strong></span></div><div class="col-4 font-primary" id="img_capa">${img_capa}</div>`;
            
            let nomeOutrosValor = '';

            obrigatorioArray.forEach(item => {
                if (item.nomeOutros) {
                    nomeOutrosValor = item.valor; 
                }
            });

            obrigatorioArray.forEach(item => {
                if (item.valor === true) {
                    if (item.autorizacaoViagem) {
                        obrigatorioHtml += `<div class="col-4 font-primary">Autorização de Viagem</div>`;
                        detalhesUploadHtml += `<div class="col-8"><span><strong>Autorização de viagem:</strong></span></div><div class="col-4 font-primary" id="autorizacao_viagem">${autorizacao_viagem}</div>`;
                    }
                    if (item.roteiro) {
                        obrigatorioHtml += `<div class="col-4 font-primary">Roteiro de Viagem</div>`;
                        detalhesUploadHtml += `<div class="col-8"><span><strong>Roteiro de viagem:</strong></span></div><div class="col-4 font-primary" id="roteiro">${roteiro}</div>`;
                    }
                    if (item.outros) {
                        obrigatorioHtml += `<div class="col-4 font-primary"> ${nomeOutrosValor} </div>`;
                        detalhesUploadHtml += `<div class="col-8"><span><strong>${nomeOutrosValor}:</strong></span></div><div class="col-4 font-primary" id="zip_rider">${zip_rider}</div>`;
                    }
                }else if(item.valor === false){
                    obrigatorioHtml += `<div class="col-12 font-primary"><p style="text-align:center;">Nenhum arquivo obrigatório selecionado.</p></div>`;
                }
            });
            const htmlModelo = gerarHtmlModelo(etapa);
            const $html = $(htmlModelo);
            // Preenche os dados no HTML
            $html.find("#Etapa").text(etapa);
            $html.find("#id_evento").attr("onclick", "abrirEvento(event, " + evento.ID + ");");
            $html.find("#id_evento").text(evento.Título);
            $html.find("#Descricao").text(evento.Descrição);
            $html.find("#TipoEventoBox").text(evento.Check_Obs === "0" ? "Outros" : "Escolar");
            $html.find("#Status").text(evento.Status);
            $html.find("#Data_Inicio").text(dataInicioBR);
            $html.find("#Data_Fim").text(dataFimBR);
            $html.find("#URL").text(evento.URL ? evento.URL : 'Sem vínculo');
            $html.find("#Instituicao").text(instituicao);
            $html.find("#Criado_Em").text(criadoEmBR);
            $html.find("#addObrigatorio").html(obrigatorioHtml);
            $html.find("#addDetalhesUpload").html(detalhesUploadHtml);
            $html.find("#barraPorcentagem").css("width", `${porcentagem}%`);

            return $html.prop('outerHTML');
        });

        return processedData;
    }

    function classificarEAdicionarEventos(htmlSubstituido) {
        let padraoHtml = $(htmlPadrao).clone();
        let todosHtml = $(htmlTodos).clone();
        let pendenteHtml = $(htmlPendente).clone();
        let andamentoHtml = $(htmlEmAndamento).clone();
        let finalizadoHtml = $(htmlFinalizado).clone();

        let pendenteEventos = [];
        let andamentoEventos = [];
        let finalizadoEventos = [];

        // Adiciona todos os eventos ao HTML de todos os eventos
        htmlSubstituido.forEach(eventoHtml => {
            const etapa = $(eventoHtml).find("#Etapa").text().trim();

            switch (etapa) {
                case 'Pendente':
                case 'Não iniciado':
                    pendenteEventos.push(eventoHtml);
                    break;
                case 'Andamento':
                    andamentoEventos.push(eventoHtml);
                    break;
                case 'Finalizado':
                    finalizadoEventos.push(eventoHtml);
                    break;
            }
        });

        // Adiciona todos os eventos ao HTML de todos os eventos
        todosHtml.find(".row").append(htmlSubstituido.join(''));
        // Adiciona os eventos classificados aos seus respectivos HTMLs
        pendenteHtml.find(".row").append(pendenteEventos.join(''));
        andamentoHtml.find(".row").append(andamentoEventos.join(''));
        finalizadoHtml.find(".row").append(finalizadoEventos.join(''));

        // Adiciona os HTMLs gerados ao padraoHtml
        padraoHtml.find("#top-tabContent").append(todosHtml);
        padraoHtml.find("#top-tabContent").append(pendenteHtml);
        padraoHtml.find("#top-tabContent").append(andamentoHtml);
        padraoHtml.find("#top-tabContent").append(finalizadoHtml);

        return padraoHtml.html();
    }

    try {
        const results = await Promise.all(urls.map(url => fetchData(url)));
        const [instituicoesData, eventosData] = results;
        globalEventosData = eventosData;
        const htmlSubstituido = processarEventos(eventosData, instituicoesData);
        const retornoHtmlPadrao = classificarEAdicionarEventos(htmlSubstituido);

        // Adiciona o retornoHtmlPadrao dentro do addConteudoDiv
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

function prefillCheckboxes(obrigatorioArray) {
    let valorNomeOutros = '';

    obrigatorioArray.forEach(item => {
        if (item.nomeOutros) {
            valorNomeOutros = item.valor; 
        }
    });

    obrigatorioArray.forEach(item => {
        if (item.valor === true) {
            if (item.autorizacaoViagem) {
                document.getElementById('obrigadorio2').checked = true;
            }
            if (item.roteiro) {
                document.getElementById('obrigadorio4').checked = true;
            }
            if (item.outros) {
                const checkboxOutros = document.getElementById('obrigadorio3');
                checkboxOutros.checked = true;
                setupCheckboxListener(valorNomeOutros);
                // Acionar o evento change programaticamente
                const event = new Event('change');
                checkboxOutros.dispatchEvent(event);
            }
            if (item.fichaMedica) {
                document.getElementById('obrigadorio1').checked = true;
            }
        } else if (item.valor === false) {
            if (item.autorizacaoViagem) {
                document.getElementById('obrigadorio2').checked = false;
            }
            if (item.roteiro) {
                document.getElementById('obrigadorio4').checked = false;
            }
            if (item.outros) {
                document.getElementById('obrigadorio3').checked = false;
            }
            if (item.fichaMedica) {
                document.getElementById('obrigadorio1').checked = false;
            }
        }
    });
}

function setupCheckboxListener(valor) {
    const checkboxOutros = document.getElementById('obrigadorio3');
    const addNomeOutrosDiv = document.getElementById('addNomeOutros');

    checkboxOutros.addEventListener('change', function() {
        if (this.checked) {
            // Criar o campo de texto e a label
            const div = document.createElement('div');
            div.className = ' mt-3 mb-3 text-center';

            const label = document.createElement('label');
            label.className = 'form-label';
            label.setAttribute('for', 'nomeOutros');
            label.innerText = 'Nome do arquivo outros:';

            const input = document.createElement('input');
            input.className = 'form-control';
            input.type = 'text';
            input.id = 'nomeOutros';
            input.placeholder = 'Digite o nome do arquivo outros';
            input.value = valor;

            // Adicionar a label e o input ao div
            div.appendChild(label);
            div.appendChild(input);

            // Adicionar o div ao DOM
            addNomeOutrosDiv.appendChild(div);
        } else {
            // Remover o campo de texto se o checkbox for desmarcado
            addNomeOutrosDiv.innerHTML = '';
        }
    });
}

function abrirEvento(event, id) {
    event.preventDefault();
    let eventoId = String(id);
    const evento = globalEventosData.eventos.find(evento => String(evento.ID) === eventoId);
    if (evento) {
        
        const formatarCEP = (cep) => {
            return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
        };
        const formatarDataBrasileira = (dataISO) => {
            const [ano, mes, dia] = dataISO.split('-');
            return `${dia}/${mes}/${ano}`;
        };
        const tratarDetalhes = (detalhe) => {return detalhe === "1" ? 'Enviado' : 'Pendente';};

        const Tratado_img_carrousel = tratarDetalhes(evento.Detalhes['img_carrousel']);
        const Tratado_img_capa = tratarDetalhes(evento.Detalhes['img_capa']);
        const Tratado_autorizacao_viagem = tratarDetalhes(evento.Detalhes['autorizacao_viagem']);
        const Tratado_zip_rider = tratarDetalhes(evento.Detalhes['zip_rider']);
        const Tratado_roteiro = tratarDetalhes(evento.Detalhes['roteiro']);

        const dataInicioBR = formatarDataBrasileira(evento.Data_Início);
        const dataFimBR = formatarDataBrasileira(evento.Data_Fim);
        const cepFormatado = formatarCEP(evento.CEP);

        let obrigatorioJson = evento.Detalhes['obrigatorio'];
        let obrigatorioArray = JSON.parse(obrigatorioJson);
        let obrigatorioHtml = '';
        let detalhesUploadHtml = '';

        let valorNomeOutros = '';

        obrigatorioArray.forEach(item => {
            if (item.nomeOutros) {
                valorNomeOutros = item.valor; 
            }
        });

        obrigatorioArray.forEach(item => {
            if (item.valor === true) {
                if (item.autorizacaoViagem) {
                    obrigatorioHtml += `<td colspan="1">Autorização de Viagem</td>`;
                    detalhesUploadHtml += `<tr><th>Autorização de Viagem</th><td class="addbottom">${Tratado_autorizacao_viagem}</td><td class="addbottom"><button type="button" class="btUpload" onclick="abrirPopupPDF(${evento.ID}, 'autorizacao')">Abrir</button></td></tr>`;
                }
                if (item.roteiro) {
                    obrigatorioHtml += `<td colspan="1">Roteiro de Viagem</td>`;
                    detalhesUploadHtml += `<tr><th>Roteiro de Viagem</th><td class="addbottom">${Tratado_roteiro}</td><td class="addbottom"><button type="button" class="btUpload" onclick="abrirPopupPDF(${evento.ID}, 'roteiro')">Abrir</button></td></tr>`;
                }
                if (item.outros) {
                    obrigatorioHtml += `<td colspan="1">Outros - ${valorNomeOutros}</td>`;
                    detalhesUploadHtml += `<tr><th>Outros - ${valorNomeOutros}</th><td class="addbottom">${Tratado_zip_rider}</td><td class="addbottom"><button type="button" class="btUpload" onclick="abrirPopupPDF(${evento.ID}, 'outros')">Abrir</button></td></tr>`;
                }
            } else if (item.valor === false) {
                obrigatorioHtml += `<td colspan="1"><p style="text-align:center;">Nenhum arquivo obrigatório selecionado.</p></td>`;
            }
        });
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
                        <td>${evento.ID}</td>
                        <td>${evento.Título}</td>
                        <td>${evento.Status}</td>
                    </tr>
                </table>
                <table class="tableDetalhesEventos">
                    <tr>
                        <th>Data Início</th>
                        <th>Data Fim</th>
                        <th>Tipo Evento</th>
                    </tr>
                    <tr>
                        <td>${dataInicioBR}</td>
                        <td>${dataFimBR}</td>
                        <td>${evento.Check_Obs === "0" ? "Outros" : "Escolar"}</td>
                    </tr>
                </table>
                <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="3">Descrição</th>
                    </tr>
                    <tr>
                        <td colspan="3" class="tdDescricao">${evento.Descrição}</td>
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
                        <td>${evento.Logradouro}</td>
                        <td>${evento.Número}</td>
                        <td>${evento.Bairro}</td>
                    </tr>
                    <tr>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>CEP</th>
                    </tr>
                    <tr>
                        <td class="addbottom">${evento.Cidade}</td>
                        <td class="addbottom">${evento.UF}</td>
                        <td class="addbottom">${cepFormatado}</td>
                    </tr>
                </table>
            </div>
            <br>
            <div class="divforaTable">
                <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="3" class="titSubPopup">Arquivos Obrigatórios</th>
                    </tr>
                    ${obrigatorioHtml}
                </table>
            </div>
            <div class="divforaTable">
                <table class="tableDetalhesEventos" id="addDetalhesUpload">
                    <tr>
                        <th colspan="3" class="titSubPopup">Status de upload</th>
                    </tr>
                    <tr>
                        <th>Carrosel de Imagens</th>
                        <td class="addbottom">${evento.Detalhes.img_carrousel === "1" ? "Enviado" : "Pendente"}</td>
                        <td class="addbottom"><button type="button" class="btUpload" onclick="abrirPopupIMG(${evento.ID}, 'carrousel')">Abrir</button></td>
                    </tr>
                    <tr>
                        <th>Imagem de Capa</th>
                        <td class="addbottom">${evento.Detalhes.img_capa === "1" ? "Enviado" : "Pendente"}</td>
                        <td class="addbottom"><button type="button" class="btUpload" onclick="abrirPopupIMG(${evento.ID}, 'capa')">Abrir</button></td>
                    </tr>
                    ${detalhesUploadHtml}
                </table>
            </div>
            <br>
            <div class="divforaTable">
                <table class="tableDetalhesEventos">
                    <tr>
                        <th colspan="4" class="titSubPopup">Planos</th>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                        <th>Status</th>
                    </tr>
                    ${evento.Planos.map(plano => `
                    <tr>
                        <td class="addbottom">${plano.nome}</td>
                        <td class="addbottom">R$ ${plano.valor}</td>
                        <td class="addbottom">${plano.descricao}</td>
                        <td class="addbottom">${plano.status === "1" ? "Ativo" : "Inativo"}</td>
                    </tr>
                    `).join('')}
                </table>
            </div>
        `;

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
                habilitarEdicao(evento, dataInicioBR, dataFimBR, obrigatorioArray);
            }
        });
    } else {
        console.log("Evento não encontrado para o ID:", eventoId);
    }
}

function habilitarEdicao(evento, dataInicioBR, dataFimBR, obrigatorioArray) {
    const formHtml = `
        <form id="editarEventoForm">
            <div class="form theme-form">
                <div class="row">
                    <div class="col-sm-4">
                    </div>
                    <div class="col-sm-4">
                        <div class="mb-3">
                            <label for="titulo_evento">Status do Evento:</label>
                            <div class="select-style">
                                <select class="form-control" name="status_evento" id="status_evento" style="text-align:center;">
                                    <option value="Inativo" ${evento.Status === "Inativo" ? "selected" : ""}>Inativo</option>
                                    <option value="Ativo" ${evento.Status === "Ativo" ? "selected" : ""}>Ativo</option>
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
                            <label for="titulo_evento">Titulo do Evento</label>
                            <input class="form-control" name="titulo_evento" id="titulo_evento" type="text" placeholder="Digite o nome do Evento" value="${evento.Título}">
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="dt_inicio_evento">Data do Início:</label>
                            <input class="form-control" id="dt_inicio_evento" data-inputmask="'alias': 'dd/mm/yyyy'" name="dt_inicio_evento" type="text" data-language="pt" value="${dataInicioBR}">
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="dt_fim_evento">Data do Fim:</label>
                            <input class="form-control" id="dt_fim_evento" data-inputmask="'alias': 'dd/mm/yyyy'" name="dt_fim_evento" type="text" data-language="pt" value="${dataFimBR}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="cep_evento">CEP:</label>
                            <input type="text" class="form-control" id="cep_evento" name="cep_evento" placeholder="Digite seu CEP" value="${evento.CEP}">
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="mb-3">
                            <label for="numero_evento">Numero:</label>
                            <input type="text" class="form-control" id="numero_evento" name="numero_evento" placeholder="Digite o número" value="${evento.Número}">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <label for="logradouro_evento">Logradouro:</label>
                            <input type="text" class="form-control" id="logradouro_evento" name="logradouro_evento" placeholder="Logradouro" value="${evento.Logradouro}">
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="mb-3">
                            <label for="bairro_evento">Bairro:</label>
                            <input type="text" class="form-control" id="bairro_evento" name="bairro_evento" placeholder="Bairro" value="${evento.Bairro}">
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="mb-3">
                            <label for="cidade_evento">Cidade:</label>
                            <input type="text" class="form-control" id="cidade_evento" name="cidade_evento" placeholder="Cidade" value="${evento.Cidade}">
                        </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="mb-3">
                            <label for="uf_evento">UF:</label>
                            <input type="text" class="form-control" id="uf_evento" name="uf_evento" placeholder="UF" value="${evento.UF}">
                        </div>
                    </div>
                </div>
                <div class="row mb-3 uploadObrigadorio">
                    <label class="text-center mb-3"><h5>Arquivos Obrigatórios:</h5></label>
                    <div class="col-md-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="fichhaMedica" id="obrigadorio1">
                            <label class="form-check-label" for="obrigadorio1">
                                Ficha Médica
                            </label>
                        </div>
                    </div>
                    <div class="col-md-3">
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="autorizacaoViagem" id="obrigadorio2">
                            <label class="form-check-label" for="obrigadorio2">
                                Autorização de viagem
                            </label>
                        </div>
                    </div>
                    <div class="col-md-3">
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="outros" id="obrigadorio3">
                            <label class="form-check-label" for="obrigadorio3">
                                Outros (Zip Rider)
                            </label>
                        </div>
                    </div>
                    <div class="col-md-3">
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="roteiro" id="obrigadorio4">
                            <label class="form-check-label" for="obrigadorio4">
                                Roteiro de Viagem
                            </label>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div id="addNomeOutros"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="mb-3">
                            <label for="descricao_evento">Descrição:</label>
                            <textarea name="descricao_evento" id="descricao_evento" class="form-control" rows="4" placeholder="Digite detalhes sobre o evento.">${evento.Descrição}</textarea>
                        </div>
                    </div>
                </div>
                <div id="addRestanteFormulario"></div>
            </div>
        </form>
    `;

    Swal.fire({
        title: 'Editar Evento',
        html: formHtml,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        denyButtonText: 'Excluir',
        didRender: () => {
            document.querySelector('.swal2-popup').id = 'popupEdicaoEvento';
            const form = document.getElementById('editarEventoForm');
            if (form) {
                prefillCheckboxes(obrigatorioArray);
                obterHtmlResto(evento);
            } else {
                console.error("Formulário de edição não encontrado.");
            }
            aplicarMascaras();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            salvarEvento(evento.ID);
        } else if (result.isDenied) {
            excluirEvento(evento.ID);
        }
    });
}

function obterHtmlResto(evento) {
    const tipoEvento = evento.Check_Obs === "0" ? "Outros" : "Escolar";
    const htmlInicial = `
        <div class="row">
            <div class="col-sm-4">
                <div class="mb-3">
                    <label for="tipoEvento">Tipo de Evento:</label>
                    <div class="select-style">
                        <select id="tipoEvento" class="form-control" disabled style="text-align:center;">
                            <option value="evento_escola" ${tipoEvento === "Escolar" ? "selected" : ""}>Evento Escolar</option>
                            <option value="evento_outros" ${tipoEvento === "Outros" ? "selected" : ""}>Outros</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-sm-8">
                <div class="row" id="addConteudoConteiner">
                </div>
            </div>
            <div class="col-sm-12">
                <div class="mb-3" id="tabelaEventosContainer"></div>
            </div>
        </div>
        `;

    let elemento = document.getElementById('addRestanteFormulario');
    if (elemento) {
        elemento.innerHTML = htmlInicial;
        let idCol8 = document.getElementById('addConteudoConteiner');
        let idCol12 = document.getElementById('tabelaEventosContainer');
        if (tipoEvento === 'Escolar') {
            let htmlEscolar = addEventoEscolar(evento);
            if (idCol8) {
                idCol8.innerHTML = htmlEscolar;
                mascaraPreco();
            } else {
                console.log("Elemento com ID 'htmlEscolar' não encontrado.");
            }
        } else if (tipoEvento === 'Outros') {
            let htmlOutros = addEventoOutors(evento);
            if (idCol8 && idCol12) {
                idCol8.innerHTML = htmlOutros;
                setupEventTableButtons(evento);

            } else {
                console.log("Elemento com ID 'htmlOutros' não encontrado.");
            }
        }
    } else {
        console.error("Elemento com ID 'addRestanteFormulario' não encontrado.");
    }

    // Função para adicionar tipo evento escolar
    function addEventoEscolar(evento) {
        let Check_Obs = evento.Check_Obs.split(",");
        var htmlToAdd = `
            <div class="col-sm-6">
                <div class="mb-3">
                    <label for="valor_evento">Valor do Evento:</label>
                    ${evento.Planos.map(plano => `<input class="form-control valor_evento" name="valor_evento" id="valor_evento" type="text" value="${plano.valor}" placeholder="Digite o Valor*">`).join('')}
                </div>
            </div>
            <div class="col-sm-6">
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

    // Função para adicionar tipo evento Outros
    function addEventoOutors(container) {
        var htmlToAdd = `
            <div class="col-sm-12">
                <div class="mb-3">
                    <p class="p_valores_evento text-center">Cadastrar valores dos planos</p>
                    <div class="alinhar_bt_eventos">
                        <button type="button" class="btn bt_evento" id="bt_add_plano" name="bt_add_plano">+ 1</button>
                        <button type="button" class="btn bt_evento" id="bt_excluir_plano" name="bt_excluir_plano">- 1</button>
                    </div>
                </div>
            </div>`;
        return htmlToAdd;
    }

    function setupEventTableButtons(evento) {
        let planosEvento = evento.Planos;

        var btnAddEvento = document.getElementById('bt_add_plano');
        var btnExcluirEvento = document.getElementById('bt_excluir_plano');
        var container = document.getElementById('tabelaEventosContainer');

        // Função para criar a tabela de planos
        function criarTabela() {
            var table = document.createElement('table');
            table.id = 'eventoTable';
            table.className = 'table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th></th>
                        <th class="text-center">Cadastrar Planos</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody id="tabelaEventosBody">
                </tbody>`;
            container.appendChild(table);
        }

        // Função para adicionar uma nova linha à tabela
        function adicionarLinha(plano) {
            var tbody = document.getElementById('tabelaEventosBody');
            var novaLinha = `
                <tr>
                    <td><input type="text" class="form-control nomes_planos_multiplos" placeholder="Nome do Plano" value="${plano ? plano.nome : ''}"></td>
                    <td><input type="text" class="form-control valor_evento valores_planos_multiplos" placeholder="Valor" value="${plano ? plano.valor : ''}"></td>
                    <td><input type="text" class="form-control descricao_planos_multiplos" placeholder="Descrição" value="${plano ? plano.descricao : ''}"></td>
                </tr>`;
            tbody.innerHTML += novaLinha;
            mascaraPreco();
        }

        // Cria a tabela e adiciona linhas iniciais para cada plano em planosEvento
        if (planosEvento && planosEvento.length > 0) {
            criarTabela();
            planosEvento.forEach(plano => {
                adicionarLinha(plano);
            });
        }

        // Configura o botão para adicionar novos planos
        btnAddEvento.addEventListener('click', function() {
            var table = document.getElementById('eventoTable');
            if (!table) {
                criarTabela();
            }
            adicionarLinha();
        });

        // Configura o botão para excluir o último plano
        btnExcluirEvento.addEventListener('click', function() {
            var tbody = document.getElementById('tabelaEventosBody');
            if (tbody && tbody.rows.length > 0) {
                // Remove a última linha da tabela
                tbody.deleteRow(tbody.rows.length - 1);
                // Verifica se a tabela está vazia após remover a linha
                if (tbody.rows.length === 0) {
                    var table = document.getElementById('eventoTable');
                    if (table) {
                        table.remove(); // Remove a tabela inteira se não houver mais linhas
                    }
                }
            }
        });

        // Executa automaticamente o clique para adicionar uma linha ao inicializar
        if (!planosEvento || planosEvento.length === 0) {
            btnAddEvento.click();
        }
    }

    function mascaraPreco() {
        $('.valor_evento').inputmask('currency', {
            prefix: 'R$ ',
            alias: 'numeric',
            autoUnmask: true,
        });
        $('.valor_evento').css('text-align', 'left');
    }
}

function abrirPopupIMG(eventoId, parametro) {
    Swal.close();
    const imagePath = `${baseUrl}${eventoId}/${parametro}/`;
    console.log(imagePath);

    fetch(`../assets/php/check_uploads.php?path=${encodeURIComponent(imagePath)}&tipo=img`)
        .then(response => response.json())
        .then(data => {
            let imageHtml = '';
            if (parametro === "carrousel") {
                if (data.success) {
                    imageHtml = '<div class="carousel">';
                    data.files.forEach(file => {
                        imageHtml += `<div><img src="${imagePath}${file}" alt="Imagem do evento" style="width:100%;"></div>`;
                    });
                    imageHtml += '</div>';
                } else {
                    imageHtml = '<p>Nenhuma imagem encontrada.</p>';
                }
            } else if (parametro === "capa") {
                if (data.success && data.files.length > 0) {
                    imageHtml = `<img src="${imagePath}${data.files[0]}" alt="Imagem de capa" style="width:100%;">`;
                } else {
                    imageHtml = '<p>Não existe imagem de capa.</p>';
                }
            }

            Swal.fire({
                title: parametro === "carrousel" ? 'Carrossel de Imagens' : 'Imagem de Capa',
                html: imageHtml,
                width: 600,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    container: 'popupEditarIMG'
                },
                footer: `
                <button id="excluirImagens" class="swal2-footer-button">Excluir Imagens</button>
                <button id="adicionarImagens" class="swal2-footer-button">Adicionar Imagens</button>
            `,
                didOpen: () => {
                    if (parametro === "carrousel" && data.success) {
                        $('.carousel').slick({
                            dots: true,
                            infinite: true,
                            speed: 300,
                            slidesToShow: 1,
                            adaptiveHeight: true
                        });
                    }

                    // Adicionar eventos aos botões
                    document.getElementById('excluirImagens').addEventListener('click', () => {
                        Swal.fire({
                            title: 'Tem certeza?',
                            text: "Você deseja excluir todas as imagens?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sim, excluir',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log('Excluir Imagens');
                                let acao = "excluir";
                                excluirUpload(eventoId, parametro, acao);
                            }
                        });
                    });

                    document.getElementById('adicionarImagens').addEventListener('click', () => {
                        console.log('Adicionar Imagens');
                        uploadfuncao(eventoId, parametro);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar imagens:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar as imagens. Tente novamente mais tarde.',
                showCloseButton: true,
                showConfirmButton: false
            });
        });
}

function abrirPopupPDF(eventoId, parametro) {
    Swal.close();

    const pdfPath = `${baseUrl}${eventoId}/${parametro}/`;
    console.log(pdfPath);

    fetch(`../assets/php/check_uploads.php?path=${encodeURIComponent(pdfPath)}&tipo=pdf`)
        .then(response => response.json())
        .then(data => {
            let pdfHtml = '';
            if (data.success) {
                if (data.files.length > 0) {
                    pdfHtml = '<ul>';
                    data.files.forEach(file => {
                        pdfHtml += `<li><a href="${pdfPath}${file}" target="_blank">${file}</a></li>`;
                    });
                    pdfHtml += '</ul>';
                } else {
                    pdfHtml = '<p>Nenhum PDF encontrado.</p>';
                }
            } else {
                pdfHtml = '<p>Nenhum PDF encontrado.</p>';
            }

            Swal.fire({
                title: 'PDF',
                html: pdfHtml,
                width: 600,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    container: 'popupEditarPDF'
                },
                footer: `
                <button id="excluirPDFs" class="swal2-footer-button">Excluir PDF</button>
                <button id="adicionarPDFs" class="swal2-footer-button">Adicionar PDF</button>
            `,
                didOpen: () => {
                    // Adicionar eventos aos botões
                    document.getElementById('excluirPDFs').addEventListener('click', () => {
                        Swal.fire({
                            title: 'Tem certeza?',
                            text: "Você deseja excluir todos os PDFs?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sim, excluir',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                console.log('Excluir PDFs');
                                let acao = "excluir";
                                excluirUpload(eventoId, parametro, acao);
                            }
                        });
                    });

                    document.getElementById('adicionarPDFs').addEventListener('click', () => {
                        console.log('Adicionar PDFs');
                        uploadfuncao(eventoId, parametro);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar PDF:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível carregar os PDF. Tente novamente mais tarde.',
                showCloseButton: true,
                showConfirmButton: false
            });
        });
}

function uploadfuncao(eventoId, parametro) {
    let acao = "adicionar";
    let fileInput;

    if (parametro === "carrousel" || parametro === "capa") {
        fileInput = document.getElementById('fileInputimg');
    } else if (parametro === "autorizacao" || parametro === "roteiro" || parametro === "outros") {
        fileInput = document.getElementById('fileInputpdf');
    }

    fileInput.onchange = () => {
        const files = fileInput.files;
        const maxFileSize = 3 * 1024 * 1024; // 3MB

        if (parametro === "carrousel") {
            const maxFiles = 8;
            const validFiles = [];

            console.log(`Quantidade de imagens: ${files.length}`);
            console.log(`ID do usuário: ${eventoId}`);
            console.log(`Parâmetro: ${parametro}`);

            if (files.length > maxFiles) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Você só pode enviar até ${maxFiles} arquivos de uma vez.`,
                });
                return;
            }

            let validationCount = 0;
            let errors = 0;

            for (let file of files) {
                if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `Tipo de arquivo inválido: ${file.type}. Os formatos permitidos são JPEG, JPG, PNG e WEBP.`,
                    });
                    errors++;
                    continue;
                }

                if (file.size > maxFileSize) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `O arquivo ${file.name} excede o tamanho máximo permitido de 3MB.`,
                    });
                    errors++;
                    continue;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        validationCount++;
                        if (img.width > 799 && img.height > 499) {
                            console.log(`Arquivo válido: ${file.name}`);
                            validFiles.push(file);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Erro',
                                text: `Dimensões inválidas para o arquivo: ${file.name}. A largura deve ser maior que 800px e a altura maior que 500px.`,
                            });
                            errors++;
                        }

                        if (validationCount === files.length && errors === 0) {
                            enviarUpload(eventoId, parametro, validFiles, acao);
                        }
                    };
                    img.onerror = () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: `Erro ao carregar a imagem: ${file.name}.`,
                        });
                        validationCount++;
                        errors++;
                    };
                    img.src = e.target.result;
                };
                reader.onerror = () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `Erro ao ler o arquivo: ${file.name}.`,
                    });
                    validationCount++;
                    errors++;
                };
                reader.readAsDataURL(file);
            }
        } else if (parametro === "capa") {
            if (files.length !== 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Você deve enviar apenas uma imagem para a capa.`,
                });
                return;
            }

            const file = files[0];

            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Tipo de arquivo inválido: ${file.type}. Os formatos permitidos são JPEG, JPG, PNG e WEBP.`,
                });
                return;
            }

            if (file.size > maxFileSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `O arquivo ${file.name} excede o tamanho máximo permitido de 3MB.`,
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width === 1920 && img.height === 450) {
                        console.log(`Arquivo válido: ${file.name}`);
                        enviarUpload(eventoId, parametro, [file], acao);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: `Dimensões inválidas para o arquivo: ${file.name}. A imagem deve ser exatamente 1920x450 pixels.`,
                        });
                    }
                };
                img.onerror = () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: `Erro ao carregar a imagem: ${file.name}.`,
                    });
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Erro ao ler o arquivo: ${file.name}.`,
                });
            };
            reader.readAsDataURL(file);
        } else if (parametro === "autorizacao" || parametro === "roteiro" || parametro === "outros") {
            if (files.length !== 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Você deve enviar apenas um arquivo PDF.`,
                });
                return;
            }

            const file = files[0];

            if (file.type !== 'application/pdf') {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Tipo de arquivo inválido: ${file.type}. O formato permitido é PDF.`,
                });
                return;
            }

            if (file.size > maxFileSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `O arquivo ${file.name} excede o tamanho máximo permitido de 3MB.`,
                });
                return;
            }

            console.log(`Arquivo válido: ${file.name}`);
            enviarUpload(eventoId, parametro, [file], acao);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: `Parâmetro não identificado, Entre em contato com RT Publicity.`,
            });
            return;
        }
    };

    fileInput.click();
}

function enviarUpload(eventoId, parametro, validFiles, acao) {
    let formData = new FormData();
    validFiles.forEach(file => {
        formData.append('files[]', file, file.name);
    });
    formData.append('acao', acao);
    formData.append('tipoAtualizacao', "upload");
    formData.append('tipoUpload', parametro);
    formData.append('eventoId', eventoId);

    Swal.fire({
        title: 'Aguarde',
        text: 'Enviando imagens...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('../assets/php/eventos.php', {
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
                    title: 'Upload Completo',
                    text: 'Todas as imagens foram enviadas com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro no Upload',
                    text: data.message || 'Houve um erro ao enviar as imagens. Tente novamente.',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch((error) => {
            Swal.close();
            console.log('Erro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro no Upload',
                text: 'Houve um erro ao enviar as imagens. Tente novamente.',
                confirmButtonText: 'OK'
            });
        });
}

function excluirUpload(eventoId, parametro, acao) {
    let formData = new FormData();
    formData.append('acao', acao);
    formData.append('tipoAtualizacao', "upload");
    formData.append('tipoUpload', parametro);
    formData.append('eventoId', eventoId);

    Swal.fire({
        title: 'Aguarde',
        text: 'Excluindo imagens...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('../assets/php/eventos.php', {
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
                    title: 'Operação Completa',
                    text: 'Todas as imagens foram excluídas com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na Exclusão',
                    text: data.message || 'Houve um erro ao excluir as imagens. Tente novamente.',
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
                text: 'Houve um erro ao excluir as imagens. Tente novamente.',
                confirmButtonText: 'OK'
            });
        });
}

function aplicarMascaras() {
    $('#cep_evento').inputmask('99999-999');

    $('#cep_evento').on('blur', function() {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length != 8) {
            return;
        }
        $.ajax({
            url: 'https://viacep.com.br/ws/' + cep + '/json/',
            dataType: 'json',
            success: function(response) {
                $('#logradouro_evento').val(response.logradouro);
                $('#bairro_evento').val(response.bairro);
                $('#cidade_evento').val(response.localidade);
                $('#uf_evento').val(response.uf);
            }
        });
    });
    $('.datepicker-here').datepicker({
        language: 'pt',
        startDate: new Date(),
        autoHide: true,
        onSelect: function(formattedDate, date, inst) {
            validarDatas();
        }
    });
    $('#dt_inicio_evento, #dt_fim_evento').inputmask('99/99/9999', {
        placeholder: '__/__/____',
        clearMaskOnLostFocus: true,
        autoUnmask: false
    });
    $('#dt_inicio_evento, #dt_fim_evento').on('keypress', function(e) {
        var charCode = e.which ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) {
            if (charCode !== 47) {
                e.preventDefault();
            }
        }
    });
    $('#dt_inicio_evento, #dt_fim_evento').on('blur', function() {
        validarDatas();
    });
}

function validarDatas() {
    var dtInicio = $('#dt_inicio_evento').inputmask('unmaskedvalue');
    var dtFim = $('#dt_fim_evento').inputmask('unmaskedvalue');
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    $('#dt_inicio_evento').removeClass('is-invalid').next('.invalid-feedback').remove();
    $('#dt_fim_evento').removeClass('is-invalid').next('.invalid-feedback').remove();

    if (dtInicio && dtInicio.length === 8) {
        var dtInicioParts = [dtInicio.slice(0, 2), dtInicio.slice(2, 4), dtInicio.slice(4, 8)];
        var dtInicioValida = new Date(dtInicioParts[2], dtInicioParts[1] - 1, dtInicioParts[0]);
        if (isNaN(dtInicioValida.getTime())) {
            console.error('Data de início inválida:', dtInicio);
            $('#dt_inicio_evento').addClass('is-invalid').after('<div class="invalid-feedback">Data de início inválida.</div>');
            return false;
        }
    }
    if (dtFim && dtFim.length === 8) {
        var dtFimParts = [dtFim.slice(0, 2), dtFim.slice(2, 4), dtFim.slice(4, 8)];
        var dtFimValida = new Date(dtFimParts[2], dtFimParts[1] - 1, dtFimParts[0]);

        if (isNaN(dtFimValida.getTime())) {
            console.error('Data de término inválida:', dtFim);
            $('#dt_fim_evento').addClass('is-invalid').after('<div class="invalid-feedback">Data de término inválida.</div>');
            return false;
        }
        if (dtInicioValida && dtFimValida <= dtInicioValida) {
            $('#dt_fim_evento').addClass('is-invalid').after('<div class="invalid-feedback">A data de término do evento deve ser maior que a data de início.</div>');
            return false;
        }
    }
    return true;
}

function capturarValoresPlanos() {
    var nomes = Array.from(document.querySelectorAll('.nomes_planos_multiplos')).map(input => input.value);
    var valores = Array.from(document.querySelectorAll('.valores_planos_multiplos')).map(input => input.value);
    var descricoes = Array.from(document.querySelectorAll('.descricao_planos_multiplos')).map(input => input.value);

    var planos = nomes.map((nome, index) => {
        return {
            nome: nome,
            valor: valores[index],
            descricao: descricoes[index]
        };
    });
    return planos;
}

function capturarValoresObrigatorios() {
    const valores = {};

    // Capturar valores dos checkboxes
    const checkboxIds = ['obrigadorio1', 'obrigadorio2', 'obrigadorio3', 'obrigadorio4'];
    checkboxIds.forEach(id => {
        const checkbox = document.getElementById(id);
        valores[checkbox.value] = checkbox.checked ? true : false;
    });

    // Capturar valor do campo "Nome do Outros", se estiver presente
    const nomeOutrosInput = document.getElementById('nomeOutros');
    if (nomeOutrosInput) {
        valores['nomeOutros'] = nomeOutrosInput.value;
    }

    return valores;
}

function excluirEvento(eventoId) {
    var formData = new FormData();

    formData.append('tipoAtualizacao', 'excluir');
    formData.append('eventoId', eventoId);

    fetch('../assets/php/eventos.php', {
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
                    text: 'Evento excluído com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na Exclusão',
                    text: data.message || 'Houve um erro ao excluir o evento. Tente novamente.',
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
                text: 'Houve um erro ao excluir o evento. Tente novamente.',
                confirmButtonText: 'OK'
            });
        });
}

function salvarEvento(eventoId) {
    const valoresCapturados = capturarValoresObrigatorios();
    var fichaMedica = valoresCapturados.fichaMedica;
    var autorizacaoViagem = valoresCapturados.autorizacaoViagem;
    var outros = valoresCapturados.outros;
    var roteiro = valoresCapturados.roteiro;
    var nomeOutros = valoresCapturados.nomeOutros;

    var uploadsObrigatorios = [
        { fichaMedica: 'fichaMedica', valor: fichaMedica || 0 },
        { autorizacaoViagem: 'autorizacaoViagem', valor: autorizacaoViagem || 0 },
        { outros: 'outros', valor: outros || 0 },
        { roteiro: 'roteiro', valor: roteiro || 0 },
        { nomeOutros: 'nomeOutros', valor: nomeOutros || '' }
    ];

    var formData = new FormData();
    formData.append('eventoId', eventoId);
    var statusEvento = $('#status_evento').val();
    var tituloEvento = $('#titulo_evento').val();
    var dtInicioEvento = $('#dt_inicio_evento').val();
    var dtFimEvento = $('#dt_fim_evento').val();
    var cepEvento = $('#cep_evento').val();
    var numeroEvento = $('#numero_evento').val();
    var tipoEvento = $('#tipoEvento').val();
    var logradouroEvento = $('#logradouro_evento').val();
    var bairroEvento = $('#bairro_evento').val();
    var cidadeEvento = $('#cidade_evento').val();
    var ufEvento = $('#uf_evento').val();
    var descricaoEvento = $('#descricao_evento').val();
    var checkedValues = [];


    if (tipoEvento === 'evento_escola') {
        var valor_evento = $('#valor_evento').val();
        checkedValues = Array.from($('.form-check-input:checked')).map(cb => cb.value);
        if (valor_evento === "") {
            Swal.fire({
                icon: 'error',
                title: 'Valor não informado',
                text: 'Por favor, digite o valor do evento.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }
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
        var valorEvento = [{ nome: "", valor: valor_evento, descricao: "" }];
        formData.append('valorEvento', JSON.stringify(valorEvento));
    } else if (tipoEvento === 'evento_outros') {
        var dadosPlanos = capturarValoresPlanos();
        var camposVazios = dadosPlanos.some(plano => plano.nome === "" || plano.valor === "");

        if (dadosPlanos.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Nenhum plano adicionado',
                text: 'Pelo menos um plano deve ser adicionado.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (camposVazios) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Vazios',
                text: 'Os campos nome e valor não podem estar vazios.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }
        formData.append('valorEvento', JSON.stringify(dadosPlanos));
        checkedValues = ["0"];
    }

    formData.append('checkedValues', JSON.stringify(checkedValues));
    formData.append('uploadsObrigatorios', JSON.stringify(uploadsObrigatorios));

    // Array para verificar campos vazios
    var camposObrigatorios = [
        { valor: statusEvento, nome: 'Status do Evento' },
        { valor: tituloEvento, nome: 'Titulo do Evento' },
        { valor: cepEvento, nome: 'CEP' },
        { valor: numeroEvento, nome: 'Número' },
        { valor: dtInicioEvento, nome: 'Data de Início' },
        { valor: dtFimEvento, nome: 'Data de Fim' },
        { valor: tipoEvento, nome: 'Tipo do Evento' },
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
    formData.append('statusEvento', statusEvento);
    formData.append('tituloEvento', tituloEvento);
    formData.append('dtInicioEvento', dtInicioEvento);
    formData.append('dtFimEvento', dtFimEvento);
    formData.append('cepEvento', cepEvento);
    formData.append('numeroEvento', numeroEvento);
    formData.append('logradouroEvento', logradouroEvento);
    formData.append('bairroEvento', bairroEvento);
    formData.append('cidadeEvento', cidadeEvento);
    formData.append('ufEvento', ufEvento);
    formData.append('descricaoEvento', descricaoEvento);

    //for (var pair of formData.entries()) {
    //    console.log(pair[0] + ': ' + pair[1]);
    //}

    fetch('../assets/php/eventos.php', {
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
                    text: 'Evento Atualizado com sucesso.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na Atualização',
                    text: data.message || 'Houve um erro ao Atualizado o evento. Tente novamente.',
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
                text: 'Houve um erro ao Atualizado o evento. Tente novamente.',
                confirmButtonText: 'OK'
            });
        });
}
