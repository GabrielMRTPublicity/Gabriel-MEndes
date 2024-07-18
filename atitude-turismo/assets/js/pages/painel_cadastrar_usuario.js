var btnSim = document.getElementById('eventoEscolarSim');
var btnNao = document.getElementById('eventoEscolarNao');
let formCount = 0;

//função ativa e desativa o butão que pergunta se o formulario é para um evento escolar sim ou nao.
function AtivarDesativarButtons(fazer) {
    if (fazer == "desativar") {
        btnSim.disabled = true;
        btnNao.disabled = true;
    } else {
        btnSim.disabled = false;
        btnNao.disabled = false;
    }
}
//remover formulario de dependentes
function removeForm(formId) {
    var formToRemove = document.getElementById(formId);
    if (formToRemove) {
        formToRemove.remove();
        formCount--;
        if (formCount < 1) {
            AtivarDesativarButtons("ativar");
        }
    }
}
// preenche automaticamente os campos após digitar o cep e inicia a função de mascara
$(document).ready(function() {
    initializeInputMasks();
    // Inicializa os datepickers
    $('#cep_responsavel').inputmask('99999-999');

    $('#cep_responsavel').on('blur', function() {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length != 8) {
            return;
        }
        $.ajax({
            url: 'https://viacep.com.br/ws/' + cep + '/json/',
            dataType: 'json',
            success: function(response) {
                $('#logradouro_responsavel').val(response.logradouro);
                $('#bairro_responsavel').val(response.bairro);
                $('#cidade_responsavel').val(response.localidade);
                $('#uf_responsavel').val(response.uf);
            }
        });
    });
});
// função que aplica mascaras nos inputs
function initializeInputMasks() {
    $('.whatsapp').inputmask({
        mask: ['(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true,
        clearMaskOnLostFocus: true
    });
    $('.cpf').inputmask({
        mask: '999.999.999-99',
        keepStatic: true,
        clearMaskOnLostFocus: true
    });
    $('.rg').inputmask({
        mask: '99.999.999-9', // Adiciona uma máscara básica para RG
        definitions: {
            '9': {
                validator: "[0-9Xx]"
            }
        },
        keepStatic: true,
        clearMaskOnLostFocus: true
    });
    $('.orgao').inputmask({
        mask: 'AAA',
        definitions: {
            'A': {
                validator: "[A-Za-z0-9]"
            }
        },
        placeholder: "",
        showMaskOnHover: false,
        showMaskOnFocus: false,
        clearMaskOnLostFocus: true
    });
    $('.datepicker-here').datepicker({
        language: 'pt',
        startDate: new Date(),
        autoHide: true,
        onSelect: function(formattedDate, date, inst) {
            validarDatas();
        }
    });
    // Adicionar máscara de entrada para os campos de entrada
    $('.dtNascimentoDependente').inputmask('99/99/9999', {
        placeholder: '__/__/____',
        clearMaskOnLostFocus: true,
        autoUnmask: false // Manter a máscara ao perder o foco
    });

    // Impedir entrada de letras nos campos de data
    $('.dtNascimentoDependente').on('keypress', function(e) {
        var charCode = e.which ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) { // Permitir apenas números
            if (charCode !== 47) { // Permitir a barra "/"
                e.preventDefault();
            }
        }
    });

    $('.dtNascimentoDependente').on('blur', function() {
        validarDatas();
    });
}
// função data nascimento
function validarDatas() {
    var dtNascimento = $('.dtNascimentoDependente').inputmask('unmaskedvalue');
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Setar horas para zero para comparar somente as datas

    if (dtNascimento && dtNascimento.length === 8) {
        var dtNascimentoParts = [
            dtNascimento.slice(0, 2), // Dia
            dtNascimento.slice(2, 4), // Mês
            dtNascimento.slice(4, 8) // Ano
        ];
        var dia = parseInt(dtNascimentoParts[0], 10);
        var mes = parseInt(dtNascimentoParts[1], 10);
        var ano = parseInt(dtNascimentoParts[2], 10);

        // Verificar se o mês e o dia estão dentro dos intervalos válidos
        if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            Swal.fire({
                icon: "error",
                title: 'Data de nascimento inválida',
                text: 'Por favor, selecione uma data de nascimento válida.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('.dtNascimentoDependente').val('');
            });
            return;
        }

        var dtNascimentoValida = new Date(ano, mes - 1, dia);

        // Verificar se a data é inválida (por exemplo, 31 de fevereiro)
        if (dtNascimentoValida.getMonth() + 1 !== mes || dtNascimentoValida.getDate() !== dia || dtNascimentoValida.getFullYear() !== ano) {
            Swal.fire({
                icon: "error",
                title: 'Data de nascimento inválida',
                text: 'Por favor, selecione uma data de nascimento válida.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('.dtNascimentoDependente').val('');
            });
            return;
        }

        var idade = hoje.getFullYear() - dtNascimentoValida.getFullYear();
        var diferencaMes = hoje.getMonth() - dtNascimentoValida.getMonth();
        if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dtNascimentoValida.getDate())) {
            idade--;
        }

        if (idade > 100) {
            Swal.fire({
                icon: "error",
                title: 'Data de nascimento inválida',
                text: 'A pessoa não pode ter mais de 100 anos.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('.dtNascimentoDependente').val('');
            });
            return;
        }

        if (idade < 3) {
            Swal.fire({
                icon: "error",
                title: 'Data de nascimento inválida',
                text: 'A pessoa não pode ter menos de 3 anos de idade.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('.dtNascimentoDependente').val('');
            });
            return;
        }

        if (dtNascimentoValida > hoje) {
            Swal.fire({
                icon: "error",
                title: 'Data de nascimento inválida',
                text: 'Por favor, selecione uma data de nascimento válida.',
                confirmButtonColor: '#f27474',
                confirmButtonText: 'OK'
            }).then(() => {
                $('.dtNascimentoDependente').val('');
            });
            return;
        }
    }
}
//dependentes
document.addEventListener('DOMContentLoaded', function() {

    var btnAdd = document.getElementById('bt_add_dependentes');

    async function fetchData() {
        try {
            const response = await fetch(`../assets/php/puxardados.php?tipo=vei`);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi boa');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Houve um problema com a operação de busca:', error);
            return null;
        }
    }


    async function addForm(tipo, acao) {
        if (formCount < 10) {
            var addDiv = document.getElementById('add');
            const dados = await fetchData();
            var newForm = document.createElement('div');
            newForm.id = `form${formCount}`; // Define um ID único para a nova div
            console.log(dados);
            if (acao == "add") {
                if (tipo == "escolar") {
                    newForm.innerHTML = htmlescolar(formCount) + htmlnormal(formCount);
                    addDiv.appendChild(newForm);
                    formCount++;
                    initializeInputMasks();
                    if (dados) {
                        populateSelects(dados, tipo);
                    }
                } else {
                    newForm.innerHTML = htmloutros(formCount) + htmlnormal(formCount);
                    addDiv.appendChild(newForm);
                    formCount++;
                    initializeInputMasks();
                    if (dados) {
                        populateSelects(dados, tipo);
                    }
                }
            }

            if (formCount > 0) {
                AtivarDesativarButtons("desativar");
            } else {
                AtivarDesativarButtons("ativar");
            }
        } else {
            Swal.fire({
                title: 'Limite Atingido',
                text: 'Você pode adicionar no máximo 10 dependentes.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }

    function htmlnormal(index) {
        return `
        <div class="row">
            <div class="col-sm-6">
                <div class="mb-3">
                    <label for="nomeDependente${index}">Nome Completo:</label>
                    <input class="form-control" name="nomeDependente${index}" id="nomeDependente${index}" type="text" placeholder="Digite o primeiro nome:">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="mb-3">
                    <label for="dtNascimentoDependente${index}">Data Nascimento:</label>
                    <input class="datepicker-here form-control dtNascimentoDependente" id="dtNascimentoDependente${index}" data-inputmask="'alias': 'dd/mm/yyyy'" name="dtNascimentoDependente${index}" type="text" data-language="pt" inputmode="text">
                </div>
            </div>
            <div class="col-sm-5">
                <div class="mb-3">
                    <label for="cpfDependente${index}">CPF:</label>
                    <input class="form-control cpf" name="cpfDependente${index}" id="cpfDependente${index}" type="text" placeholder="Digite o CPF:">
                </div>
            </div>
            <div class="col-sm-4">
                <div class="mb-3">
                    <label for="rgDependente${index}">RG:</label>
                    <input class="form-control rg" name="rgDependente${index}" id="rgDependente${index}" type="text" placeholder="Digite o RG:">
                </div>
            </div>
            <div class="col-sm-3">
                <div class="mb-3">
                    <label for="orgaoDependente${index}">Orgão Expedidor:</label>
                    <input class="form-control orgao" name="orgaoDependente${index}" id="orgaoDependente${index}" type="text" placeholder="EX: SSP">
                </div>
            </div>
            <div class="col-sm-12 text-center" >
                <button type="button" id="bt_excluir_dependentes" class="btn bt_depedentesr" onclick="removeForm('form${index}')">Excluir</button>
            </div>
        </div>`;
    }

    function htmlescolar(index) {
        return `
        <div class="row">
            <div class="col-sm-12">
                <div class="mb-3 mt-3 text-center">
                    <p>Dependente de uma instituição Escolar:</p>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="mb-3">
                    <label for="instituicao_disponivel${index}">Instituição:</label>
                    <select id="instituicao_disponivel${index}" class="form-control instituicao_disponivel">
                        <option value="" disabled selected>Selecione</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="mb-3">
                    <label for="evento_disponivel${index}">Eventos:</label>
                    <select id="evento_disponivel${index}" class="form-control evento_disponivel">
                        <option value="" disabled selected>Selecione</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="mb-3">
                    <label for="tipoEvento${index}">Tipo de Viagem:</label>
                    <select id="tipoEvento${index}" class="form-control tipoEvento">
                        <option value="" disabled selected>Selecione</option>
                        <option value="1">Viagem de Formatura 9°</option>
                        <option value="2">Viagem de Formatura 3°</option>
                        <option value="3">Passeios Escolares</option>
                        <option value="4">Viagem de Funcionários</option>
                        <option value="0">Outros</option>
                    </select>
                </div>
            </div>
        </div>`;
    }

    function htmloutros(index) {
        return `
        <div class="row">
            <div class="col-sm-12">
                <div class="mb-3 mt-3 text-center nao">
                    <p>Dependente de uma instituição não Escolar:</p>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="mb-3">
                    <label for="instituicao_disponivel${index}">Instituição:</label>
                    <select id="instituicao_disponivel${index}" class="form-control instituicao_disponivel">
                        <option value="" disabled selected>Selecione</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="mb-3">
                    <label for="evento_disponivel${index}">Eventos:</label>
                    <select id="evento_disponivel${index}" class="form-control evento_disponivel">
                        <option value="" disabled selected>Selecione</option>
                    </select>
                </div>
            </div>
        </div>`;
    }

    function toggleActive(button, otherButton) {
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            otherButton.classList.remove('active');
        } else {
            button.classList.add('active');
            otherButton.classList.remove('active');
        }
    }

    function checkActiveButtons(acao) {
        var tipo = "";
        if (btnSim.classList.contains('active')) {
            tipo = "escolar";
            addForm(tipo, acao);
        } else if (btnNao.classList.contains('active')) {
            tipo = "outros";
            addForm(tipo, acao);
        } else {
            Swal.fire({
                title: 'Atenção',
                text: 'Você deve escolher se é para um evento escolar o cadastro do dependente.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    }

    function populateSelects(dados, tipo) {
        let eventosNaoEscolares = [];
        let instituicoesNaoEscolares = [];
        let eventosEscolares = [];
        let instituicoesEscolares = [];

        // Separar eventos e instituições
        dados.vei.forEach(function(item) {
            if (!eventosEscolares.some(e => e.id === item.ID_Evento) && !eventosNaoEscolares.some(e => e.id === item.ID_Evento)) {
                if (item.Evento_Check_Obs.split(',').some(val => ["1", "2", "3", "4"].includes(val))) {
                    eventosEscolares.push({
                        id: item.ID_Evento,
                        titulo: item.Evento_Título,
                        check_obs: item.Evento_Check_Obs
                    });
                } else {
                    eventosNaoEscolares.push({
                        id: item.ID_Evento,
                        titulo: item.Evento_Título,
                        check_obs: item.Evento_Check_Obs
                    });
                }
            }

            if (!instituicoesEscolares.some(i => i.id === item.ID_Instituicao) && !instituicoesNaoEscolares.some(i => i.id === item.ID_Instituicao)) {
                if (item.Instituicao_Check_Obs.split(',').some(val => ["1", "2", "3", "4"].includes(val))) {
                    instituicoesEscolares.push({
                        id: item.ID_Instituicao,
                        titulo: item.Instituicao_Título,
                        check_obs: item.Instituicao_Check_Obs
                    });
                } else {
                    instituicoesNaoEscolares.push({
                        id: item.ID_Instituicao,
                        titulo: item.Instituicao_Título,
                        check_obs: item.Instituicao_Check_Obs
                    });
                }
            }
        });


        if (tipo == "escolar") {
            var instituicoesEscolaresSelects = document.getElementsByClassName('instituicao_disponivel');
            var eventosEscolaresSelects = document.getElementsByClassName('evento_disponivel');
            var tipoEventoEscolarSelects = document.getElementsByClassName('tipoEvento');

            // Limpar os selects e preencher com novos dados
            for (let i = 0; i < instituicoesEscolaresSelects.length; i++) {
                instituicoesEscolaresSelects[i].innerHTML = '<option value="" disabled selected>Selecione</option>';
                eventosEscolaresSelects[i].innerHTML = '<option value="" disabled selected>Selecione</option>';
                tipoEventoEscolarSelects[i].innerHTML = '<option value="" disabled selected>Selecione</option>';

                // Preencher selects de instituições e eventos escolares
                eventosEscolares.forEach(function(evento) {
                    var option = document.createElement('option');
                    option.value = evento.id;
                    option.textContent = evento.titulo;
                    eventosEscolaresSelects[i].appendChild(option);
                });

                instituicoesEscolares.forEach(function(instituicao) {
                    var option = document.createElement('option');
                    option.value = instituicao.id;
                    option.textContent = instituicao.titulo;
                    instituicoesEscolaresSelects[i].appendChild(option);
                });

                // Filtrar tipos de viagem em comum para eventos e instituições escolares
                if (eventosEscolares.length > 0 && instituicoesEscolares.length > 0) {
                    var eventoEscolarCheckObs = eventosEscolares.map(e => e.check_obs.split(',')).flat();
                    var instituicaoEscolarCheckObs = instituicoesEscolares.map(i => i.check_obs.split(',')).flat();
                    var tiposEscolaresComuns = eventoEscolarCheckObs.filter(value => instituicaoEscolarCheckObs.includes(value));
                    tiposEscolaresComuns = [...new Set(tiposEscolaresComuns)]; // Remover duplicatas

                    tiposEscolaresComuns.forEach(function(tipo) {
                        var option = document.createElement('option');
                        option.value = tipo;
                        option.textContent = getTipoViagemText(tipo);
                        tipoEventoEscolarSelects[i].appendChild(option);
                    });
                }
            }
        } else {
            var instituicoesNaoEscolaresSelects = document.getElementsByClassName('instituicao_disponivel');
            var eventosNaoEscolaresSelects = document.getElementsByClassName('evento_disponivel');

            // Limpar os selects e preencher com novos dados
            for (let i = 0; i < instituicoesNaoEscolaresSelects.length; i++) {
                instituicoesNaoEscolaresSelects[i].innerHTML = '<option value="" disabled selected>Selecione</option>';
                eventosNaoEscolaresSelects[i].innerHTML = '<option value="" disabled selected>Selecione</option>';

                // Preencher selects de instituições e eventos não escolares
                eventosNaoEscolares.forEach(function(evento) {
                    var option = document.createElement('option');
                    option.value = evento.id;
                    option.textContent = evento.titulo;
                    eventosNaoEscolaresSelects[i].appendChild(option);
                });

                instituicoesNaoEscolares.forEach(function(instituicao) {
                    var option = document.createElement('option');
                    option.value = instituicao.id;
                    option.textContent = instituicao.titulo;
                    instituicoesNaoEscolaresSelects[i].appendChild(option);
                });
            }
        }
    }




    function getTipoViagemText(value) {
        switch (value) {
            case "1":
                return "Viagem de Formatura 9°";
            case "2":
                return "Viagem de Formatura 3°";
            case "3":
                return "Passeios Escolares";
            case "4":
                return "Viagem de Funcionários";
            case "0":
                return "Outros";
            default:
                return "";
        }
    }

    btnSim.addEventListener('click', function() {
        toggleActive(btnSim, btnNao);
    });

    btnNao.addEventListener('click', function() {
        toggleActive(btnNao, btnSim);
    });
    btnAdd.addEventListener('click', function() {
        var acao = "add"
        checkActiveButtons(acao);
    });
});
// Configuração do evento click para o botão "Cancelar"
$(document).ready(function() {
    $('#cancelar_cadastro').on('click', function(event) {
        event.preventDefault();
        $('.form.theme-form input[type="text"], .form.theme-form textarea').val('');
    });
});

// Configuração do evento click para o botão "Criar"
$(document).ready(function() {
    $('#criar_cadastro').click(function(e) {
        e.preventDefault();

        function verificarBotaoAtivo() {
            const botaoSim = document.getElementById('eventoEscolarSim');
            const botaoNao = document.getElementById('eventoEscolarNao');

            if (botaoSim.classList.contains('active')) {
                return "sim";
            } else if (botaoNao.classList.contains('active')) {
                return "nao";
            }
        }

        function validarCamposDependentes(tipo) {
            var todosPreenchidos = true; // Presume inicialmente que todos os campos estão preenchidos
            var campos = tipo === "sim" ? ["instituicao_disponivel", "evento_disponivel", "tipoEvento", "nomeDependente", "dtNascimentoDependente", "cpfDependente", "rgDependente", "orgaoDependente"] : ["instituicao_disponivel", "evento_disponivel", "nomeDependente", "dtNascimentoDependente", "cpfDependente", "rgDependente", "orgaoDependente"];

            var maxIndex = 0; // Determinar esse valor com base na sua lógica ou elemento de página
            for (var i = 0; i <= maxIndex; i++) {
                var baseId = i;
                for (var j = 0; j < campos.length; j++) {
                    var campoId = campos[j] + baseId;
                    var campo = document.getElementById(campoId);
                    if (campo) {
                        if (campo.value.trim() === "") {
                            campo.style.borderColor = "red";
                            Swal.fire({
                                icon: 'error',
                                title: 'Campos não preenchidos',
                                text: 'Por favor, preencha todos os campos obrigatórios.',
                                confirmButtonText: 'Ok'
                            });
                            return false;
                        } else {
                            campo.style.borderColor = "";
                        }
                    }
                }
            }
            //if (todosPreenchidos) {
            //    Swal.fire({
            //        icon: 'success',
            //        title: 'Tudo certo!',
            //        text: 'Todos os campos estão preenchidos.',
            //        confirmButtonText: 'Ok'
            //    });
            //}
            return todosPreenchidos;
        }

        function capturarDadosDependentes(tipo) {
            var dadosDependentes = [];
            var campos = tipo === "sim" ? ["instituicao_disponivel", "evento_disponivel", "tipoEvento", "nomeDependente", "dtNascimentoDependente", "cpfDependente", "rgDependente", "orgaoDependente"] : ["instituicao_disponivel", "evento_disponivel", "nomeDependente", "dtNascimentoDependente", "cpfDependente", "rgDependente", "orgaoDependente"];

            for (var i = 0; i < 10; i++) {
                var dependente = {};
                var baseId = i;
                var campoExistente = document.getElementById(campos[0] + baseId);
                if (campoExistente) {
                    campos.forEach(function(campo) {
                        var valorCampo = document.getElementById(campo + baseId);
                        if (valorCampo) {
                            dependente[campo] = valorCampo.value;
                        }
                    });
                    dadosDependentes.push(dependente);
                } else {
                    break;
                }
            }
            return dadosDependentes;
        }

        var formData = new FormData();
        var tipo = "CadastroInterno"
        var nomeResponsavel = $('#nomeResponsavel').val();
        var emailResponsavel = $('#emailResponsavel').val();
        var whatsappResponsavel = $('#whatsappResponsavel').val();
        var cpfResponsavel = $('#cpfResponsavel').val();
        var rgResponsavel = $('#rgResponsavel').val();
        var orgaoResponsavel = $('#orgaoResponsavel').val();
        var tituloEndereco = $('#tituloEndereco').val();
        var cep_responsavel = $('#cep_responsavel').val();
        var numero_responsavel = $('#numero_responsavel').val();
        var logradouro_responsavel = $('#logradouro_responsavel').val();
        var bairro_responsavel = $('#bairro_responsavel').val();
        var cidade_responsavel = $('#cidade_responsavel').val();
        var uf_responsavel = $('#uf_responsavel').val();

        var camposObrigatorios = [
            { valor: nomeResponsavel, nome: 'Nome do Responsável' },
            { valor: emailResponsavel, nome: 'E-mail do Responsável' },
            { valor: whatsappResponsavel, nome: 'WhatsApp do Responsável' },
            { valor: cpfResponsavel, nome: 'CPF do Responsável' },
            { valor: rgResponsavel, nome: 'RG do Responsável' },
            { valor: orgaoResponsavel, nome: 'Orgão Expedidor do RG' },
            { valor: tituloEndereco, nome: 'Nome do Endereço' },
            { valor: cep_responsavel, nome: 'CEP do Responsável' },
            { valor: numero_responsavel, nome: 'Número residencial do Responsável' },
            { valor: logradouro_responsavel, nome: 'Logradouro do Responsável' },
            { valor: bairro_responsavel, nome: 'Bairro do Responsável' },
            { valor: cidade_responsavel, nome: 'Cidade do Responsável' },
            { valor: uf_responsavel, nome: 'UF do Responsável' },
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
            text: 'Pode demorar devido ao tamanho do conteudo do upload. Enviando dados...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        formData.append('tipo', tipo);
        formData.append('nomeResponsavel', nomeResponsavel);
        formData.append('emailResponsavel', emailResponsavel);
        formData.append('whatsappResponsavel', whatsappResponsavel);
        formData.append('cpfResponsavel', cpfResponsavel);
        formData.append('rgResponsavel', rgResponsavel);
        formData.append('orgaoResponsavel', orgaoResponsavel);
        formData.append('tituloEndereco', tituloEndereco);
        formData.append('cep_responsavel', cep_responsavel);
        formData.append('numero_responsavel', numero_responsavel);
        formData.append('logradouro_responsavel', logradouro_responsavel);
        formData.append('bairro_responsavel', bairro_responsavel);
        formData.append('cidade_responsavel', cidade_responsavel);
        formData.append('uf_responsavel', uf_responsavel);

        if (formCount > 0) {
            var resposta = verificarBotaoAtivo();
            var camposValidados = validarCamposDependentes(resposta);
            if (camposValidados == true) {
                var dependentes = capturarDadosDependentes(resposta);
                //console.log(dependentes);
                formData.append('infoDependentes', JSON.stringify(dependentes));
            }
        }
        //console.log('Conteúdo do FormData:');
        //for (let [key, value] of formData.entries()) {console.log(`${key}: ${value}`);}

        $.ajax({
                type: 'POST',
                url: '../assets/php/cadastro.php',
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
                    }).then(() => {
                        window.location.reload();
                    });
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