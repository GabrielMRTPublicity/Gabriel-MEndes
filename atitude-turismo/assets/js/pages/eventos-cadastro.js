// preenche automaticamente os campos após digitar o cep
$(document).ready(function() {
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
});

// Configurar inputs Datas
$(document).ready(function() {
    // Inicializa os datepickers
    $('.datepicker-here').datepicker({
        language: 'pt',
        startDate: new Date(),
        autoHide: true,
        onSelect: function(formattedDate, date, inst) {
            validarDatas();
        }
    });

    // Adicionar máscara de entrada para os campos de entrada
    $('#dtNascimentoDependente, #dt_inicio_evento, #dt_fim_evento').inputmask('99/99/9999', {
        placeholder: '__/__/____', 
        clearMaskOnLostFocus: true, 
        autoUnmask: false // Manter a máscara ao perder o foco
    });

    // Impedir entrada de letras nos campos de data
    $('#dt_inicio_evento, #dt_fim_evento').on('keypress', function(e) {
        var charCode = e.which ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) { // Permitir apenas números
            if (charCode !== 47) { // Permitir a barra "/"
                e.preventDefault();
            }
        }
    });

    $('#dt_inicio_evento, #dt_fim_evento').on('blur', function() {
        validarDatas();
    });
});

// Validar inputs Datas
function validarDatas() {
    var dtInicio = $('#dt_inicio_evento').inputmask('unmaskedvalue');
    var dtFim = $('#dt_fim_evento').inputmask('unmaskedvalue');
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Setar horas para zero para comparar somente as datas

    if (dtInicio && dtInicio.length === 8) {
        var dtInicioParts = [dtInicio.slice(0, 2), dtInicio.slice(2, 4), dtInicio.slice(4, 8)];
        var dtInicioValida = new Date(dtInicioParts[2], dtInicioParts[1] - 1, dtInicioParts[0]);

        if (isNaN(dtInicioValida.getTime())) {
            console.error('Data de início inválida:', dtInicio);
            return;
        }
        if (dtInicioValida <= hoje) {
            Swal.fire({
                icon: "error",
                title: 'Datas inválidas',
                text: 'Por favor, selecione datas futuras para o evento.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('#dt_inicio_evento').val('');
            });
            return;
        }
    }

    if (dtFim && dtFim.length === 8) {
        var dtFimParts = [dtFim.slice(0, 2), dtFim.slice(2, 4), dtFim.slice(4, 8)];
        var dtFimValida = new Date(dtFimParts[2], dtFimParts[1] - 1, dtFimParts[0]);

        if (isNaN(dtFimValida.getTime())) {
            console.error('Data de término inválida:', dtFim);
            return;
        }
        if (dtInicioValida && dtFimValida <= dtInicioValida) {
            Swal.fire({
                icon: "error",
                title: 'Datas inválidas',
                text: 'A data de término do evento deve ser maior que a data de início.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('#dt_fim_evento').val('');
            });
            return;
        }
    }
}

// configurar uploads de imagens
Dropzone.options.fotosevideos = {
    paramName: "file",
    maxFilesize: 3, // Limite de tamanho em MB
    maxFiles: 8, // Limitar o número total de arquivos que podem ser carregados
    dictFileTooBig: 'O arquivo é muito grande ({{filesize}}MB). Tamanho máximo permitido: {{maxFilesize}}MB.',
    maxThumbnailFilesize: 5, // MB
    thumbnailWidth: 160, // Largura das miniaturas
    thumbnailHeight: 160, // Altura das miniaturas
    parallelUploads: 1, // Carregar arquivos um de cada vez
    uploadMultiple: true, // Permitir múltiplos uploads
    acceptedFiles: 'image/jpeg, image/jpg, image/png, image/webp', // Tipos de arquivos aceitos
    init: function() {
        this.on("addedfile", function(file) {
            var dropzone = this;
            var reader = new FileReader();

            reader.onload = function(e) {
                var img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    if (img.width < 800) {
                        dropzone.removeFile(file);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro ao Carregar o Arquivo',
                            text: 'A imagem deve ter no mínimo 800 pixels de largura.',
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'OK'
                        });
                    }
                };
            };
            reader.readAsDataURL(file);
        });

        this.on("error", function(file, response) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao Carregar o Arquivo',
                text: response,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            this.removeFile(file); // Remove o arquivo da fila
        });

        this.on("maxfilesexceeded", function(file) {
            this.removeFile(file); // Remove automaticamente os arquivos adicionados que excedam o limite
            Swal.fire({
                icon: 'warning',
                title: 'Limite de Arquivos Excedido',
                text: 'Você pode carregar no máximo 8 arquivos.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        });
    }
};

// configurar tipo de evento
document.getElementById('tipoEvento').addEventListener('change', function() {
    var selectedValue = this.value;
    var container = document.getElementById('addConteudoConteiner');

    $(container).fadeOut(500, function() {
        container.innerHTML = '';

        if (selectedValue === 'evento_escola') {
            limparTabelaConteiner();
            addEventoEscolar(container);
            $(container).fadeIn(500);
            mascaraPreco();
        } else if (selectedValue === 'evento_familia') {

            addbotoes12(container);
            $(container).fadeIn(500);

        } else if (selectedValue === 'evento_outros') {
            limparTabelaConteiner();
            var htmlToAdd = `
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <p class="p_valores_evento text-center">O valor do evento é único?</p>
                            <div class="alinhar_bt_eventos btn-group" role="group" aria-label="Botões de escolha única">
                                <button type="button" class="btn bt_evento btn-evento-inativo" id="unico_sim" name="unico_sim">Sim</button>
                                <button type="button" class="btn bt_evento btn-evento-inativo" id="unico_nao" name="unico_nao">Não</button>
                            </div> 
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <div id="add_eventos_outros"></div>
                        </div>
                    </div>`;

            container.innerHTML = htmlToAdd;
            funcaoBToutros();
            $(container).fadeIn(500);
        }
    });
});

// Funções marcara de preço
function mascaraPreco() {
    $('.valor_evento').inputmask('currency', {
        prefix: 'R$ ',
        alias: 'numeric',
        autoUnmask: true,
    });
    $('.valor_evento').css('text-align', 'left');
}

// Funções adicionar tipo evento escolar
function addEventoEscolar(container) {
    var htmlToAdd = `
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <label for="valor_evento">Valor do Evento:</label>
                            <input class="form-control valor_evento" name="valor_evento" id="valor_evento" type="text" placeholder="Digite o Valor*">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="mb-3">
                            <label>Tipo de Viagem:</label>
                            <div class="form-check">
                                <input class="form-check-input checkTipoViagem" type="checkbox" value="1" id="evento1">
                                <label class="form-check-label" for="evento1">
                                    Viagem de Formatura 9°
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input checkTipoViagem" type="checkbox" value="2" id="evento2">
                                <label class="form-check-label" for="evento2">
                                    Viagem de Formatura 3°
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input checkTipoViagem" type="checkbox" value="3" id="evento3">
                                <label class="form-check-label" for="evento3">
                                    Passeios Escolares
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input checkTipoViagem" type="checkbox" value="4" id="evento4">
                                <label class="form-check-label" for="evento4">
                                    Viagem de Funcionários
                                </label>
                            </div>
                        </div>
                    </div>`;
    container.innerHTML = htmlToAdd;
    $(container).fadeIn(500); // Aplica o efeito fade in diretamente aqui se necessário
}

// Função adicionar tipo outros
function addValorUnico(container) {
    var htmlToAdd = `
        <label for="valor_evento">Valor do Evento:</label>
        <input class="form-control valor_evento" name="valor_evento" id="valor_evento" type="text" placeholder="Digite o Valor*">
        `;
    container.innerHTML = htmlToAdd;
    mascaraPreco();
}

// Função adicionar botoes col-6
function addbotoes6(container) {
    var htmlToAdd = `
        <p class="p_valores_evento text-center">Cadastrar valores dos planos</p>
        <div class="alinhar_bt_eventos">
            <button class="btn bt_evento" id="bt_add_evento" name="bt_add_evento">+ 1</button>
            <button class="btn bt_evento" id="bt_excluir_evento" name="bt_excluir_evento">- 1</button>
        </div>`;
    container.innerHTML = htmlToAdd;
    setupEventTableButtons();
}

// Função adicionar botoes col-12
function addbotoes12(container) {
    var htmlToAdd = `
            <div class="col-sm-12">
                <div class="mb-3">
                    <p class="p_valores_evento text-center">Cadastrar valores dos planos</p>
                    <div class="alinhar_bt_eventos">
                        <button class="btn bt_evento" id="bt_add_evento" name="bt_add_evento">+ 1</button>
                        <button class="btn bt_evento" id="bt_excluir_evento" name="bt_excluir_evento">- 1</button>
                    </div>
                </div>
            </div>`;

    container.innerHTML = htmlToAdd;
    setupEventTableButtons();
}

// Função dos botões de adicionar evento
function setupEventTableButtons() {
    // Botão adicionar evento
    var btnAddEvento = document.getElementById('bt_add_evento');
    btnAddEvento.addEventListener('click', function() {
        var container = document.getElementById('tabelaEventosContainer');
        var table = document.getElementById('eventoTable');
        var tbody = document.getElementById('tabelaEventosBody');

        // Verifica se a tabela não existe e cria se necessário
        if (!table) {
            table = document.createElement('table');
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
            tbody = document.getElementById('tabelaEventosBody');
        }

        // Adiciona uma nova linha na tabela
        var novaLinha = `
            <tr>
                <td><input type="text" class="form-control nomes_planos_multiplos" placeholder="Nome do Plano"></td>
                <td><input type="text" class="form-control valor_evento valores_planos_multiplos" placeholder="Valor"></td>
                <td><input type="text" class="form-control descricao_planos_multiplos" placeholder="Descrição"></td>
            </tr>`;
        tbody.innerHTML += novaLinha;
        mascaraPreco(); // Supondo que esta função aplica a máscara de preço nos inputs
    });

    // Botão excluir evento
    document.getElementById('bt_excluir_evento').addEventListener('click', function() {
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
    btnAddEvento.click();
}

// Função limpar campos da tabela 
function limparTabelaConteiner() {
    var container = document.getElementById('tabelaEventosContainer');
    if (container) {
        container.innerHTML = '';
    }
}

// Função do botao outros
function funcaoBToutros() {
    var btnSim = document.getElementById('unico_sim');
    var btnNao = document.getElementById('unico_nao');
    var container = document.getElementById('add_eventos_outros');
    btnSim.addEventListener('click', function() {
        limparTabelaConteiner();
        toggleButtonState(btnSim, btnNao);
        addValorUnico(container); // Chamada da função quando Sim é selecionado
    });

    btnNao.addEventListener('click', function() {
        limparTabelaConteiner();
        toggleButtonState(btnNao, btnSim);
        addbotoes6(container); // Chamada da função quando Não é selecionado
    });

    function toggleButtonState(activeBtn, inactiveBtn) {
        activeBtn.classList.add('btn-evento-ativo');
        activeBtn.classList.remove('btn-evento-inativo');
        inactiveBtn.classList.add('btn-evento-inativo');
        inactiveBtn.classList.remove('btn-evento-ativo');
    }
}

// Função pegar valores dos planos
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
// Função pegar valores obrigatorios
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

// configurações da parte de arquivos obrigatorios
document.addEventListener('DOMContentLoaded', function() {
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
});

// Configuração do evento click para o botão "Cancelar"
$(document).ready(function() {
    $('#cancelar_evento').on('click', function(event) {
        event.preventDefault();
        $('.form.theme-form input[type="text"], .form.theme-form textarea').val('');
        var myDropzone = Dropzone.forElement('#fotosevideos');
        myDropzone.removeAllFiles();
    });
});

// Configuração do evento click para o botão "Criar"
$(document).ready(function() {
    $('#enviar_evento').click(function(e) {
        e.preventDefault();

        const valoresCapturados = capturarValoresObrigatorios();
        var tituloEvento = $('#titulo_evento').val();
        var dtInicioEvento = $('#dt_inicio_evento').val();
        var dtFimEvento = $('#dt_fim_evento').val();
        var cepEvento = $('#cep_evento').val();
        var numeroEvento = $('#numero_evento').val();
        var tipoEvento = $('#tipoEvento').val();
        var fichaMedica = valoresCapturados.fichaMedica;
        var autorizacaoViagem = valoresCapturados.autorizacaoViagem;
        var outros = valoresCapturados.outros;
        var roteiro = valoresCapturados.roteiro;
        var nomeOutros = valoresCapturados.nomeOutros;

        // Array para verificar campos vazios
        var camposObrigatorios = [
            { valor: tituloEvento, nome: 'Titulo do Evento' },
            { valor: cepEvento, nome: 'CEP' },
            { valor: numeroEvento, nome: 'Número' },
            { valor: dtInicioEvento, nome: 'Data de Início' },
            { valor: dtFimEvento, nome: 'Data de Fim' },
            { valor: tipoEvento, nome: 'Tipo do Evento' },
        ];

        if (outros === true) {
            const nomeOutrosInput = document.getElementById('nomeOutros');
            camposObrigatorios.push({ valor: nomeOutrosInput ? nomeOutrosInput.value : '', nome: 'Nome do arquivo Outros' });
        }

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
            text: 'Pode demorar devido ao tamanho do conteúdo do upload. Enviando dados...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        
        var uploadsObrigatorios = [
            { fichaMedica: 'fichaMedica', valor: fichaMedica || 0 },
            { autorizacaoViagem: 'autorizacaoViagem', valor: autorizacaoViagem || 0 },
            { outros: 'outros', valor: outros || 0 },
            { roteiro: 'roteiro', valor: roteiro || 0 },
            { nomeOutros: 'nomeOutros', valor: nomeOutros || '' }
        ];

        var formData = new FormData();
        formData.append('tipoAtualizacao', 'cadastro');
        formData.append('tipoEvento', tipoEvento);
        formData.append('tituloEvento', tituloEvento);
        formData.append('dtInicioEvento', dtInicioEvento);
        formData.append('dtFimEvento', dtFimEvento);
        formData.append('cepEvento', cepEvento);
        formData.append('numeroEvento', numeroEvento);
        formData.append('uploadsObrigatorios', JSON.stringify(uploadsObrigatorios));

        if (tipoEvento === 'evento_escola') {
            var valor_evento = $('#valor_evento').val();
            var checkedValues = Array.from($('.checkTipoViagem:checked')).map(cb => cb.value);
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
            formData.append('logradouroEvento', $('#logradouro_evento').val());
            formData.append('bairroEvento', $('#bairro_evento').val());
            formData.append('cidadeEvento', $('#cidade_evento').val());
            formData.append('ufEvento', $('#uf_evento').val());
            formData.append('valorEvento', JSON.stringify(valor_evento));
            formData.append('checkedValues', JSON.stringify(checkedValues));
            formData.append('descricaoEvento', $('#descricao_evento').val());
        } else if (tipoEvento === 'evento_familia') {
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
            formData.append('logradouroEvento', $('#logradouro_evento').val());
            formData.append('bairroEvento', $('#bairro_evento').val());
            formData.append('cidadeEvento', $('#cidade_evento').val());
            formData.append('ufEvento', $('#uf_evento').val());
            formData.append('valorEvento', JSON.stringify(dadosPlanos));
            formData.append('descricaoEvento', $('#descricao_evento').val());
        } else if (tipoEvento === 'evento_outros') {
            var btnSim = document.getElementById('unico_sim');
            var btnNao = document.getElementById('unico_nao');

            if (btnSim.classList.contains('btn-evento-ativo')) {
                var valor_evento = $('#valor_evento').val();
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
                formData.append('logradouroEvento', $('#logradouro_evento').val());
                formData.append('bairroEvento', $('#bairro_evento').val());
                formData.append('cidadeEvento', $('#cidade_evento').val());
                formData.append('ufEvento', $('#uf_evento').val());
                formData.append('valorEvento', JSON.stringify(valor_evento));
                formData.append('descricaoEvento', $('#descricao_evento').val());
            } else if (btnNao.classList.contains('btn-evento-ativo')) {
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
                formData.append('logradouroEvento', $('#logradouro_evento').val());
                formData.append('bairroEvento', $('#bairro_evento').val());
                formData.append('cidadeEvento', $('#cidade_evento').val());
                formData.append('ufEvento', $('#uf_evento').val());
                formData.append('valorEvento', JSON.stringify(dadosPlanos));
                formData.append('descricaoEvento', $('#descricao_evento').val());
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Escolha uma opção',
                    text: 'Escolha se o evento terá um valor único',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                return;
            }
        }

        var dropzoneFiles = $('#fotosevideos')[0].dropzone.files;

        for (var i = 0; i < dropzoneFiles.length; i++) {
            formData.append('file[]', dropzoneFiles[i]); // Use 'file[]' para garantir que o PHP trate como array
        }

        //for (var pair of formData.entries()) {
        //    console.log(pair[0] + ': ' + pair[1]);
        //}
        $.ajax({
            type: 'POST',
            url: '../assets/php/eventos.php',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            encode: true
        })
        .done(function(data) {
            Swal.close();
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    confirmButtonColor: '#5bce1a',
                    text: data.message
                });
                //.then(() => {
                //    window.location.reload();
                //});
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Falha!',
                    confirmButtonColor: '#f27474',
                    text: data.message
                });
            }
        })
        .fail(function(data) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Erro ao enviar os dados',
                confirmButtonColor: '#f27474',
                text: 'Por favor, tente novamente.'
            });
        });
    });
});

