var btForm = document.getElementById('addForm');
var cadastroParametro = false;
let codigoInstituicao = null;
let codigoEvento = null;
const formCadastroSimples = `
    <div>
        <div>
            <a class="logo" href="index.html"> 
                <img class="img-fluid for-dark" src="../assets/images/logo/logo.png" alt="looginpage">
                <img class="img-fluid for-light" src="../assets/images/logo/logo_dark.png" alt="looginpage">
            </a>
        </div>
        <div class="login-main">
            <form id="form-cadastro" class="theme-form">
                <h4>Crie sua conta</h4>
                <p>Preecha os campos abaixo para criar uma conta</p>
                <div class="form-group">
                    <label for="nome" class="col-form-label pt-0">*Nome Completo</label>
                    <div class="row g-2">
                        <div class="col-12">
                            <input class="form-control" type="text" name="nome" id="nome" required="" placeholder="Nome Completo" autocomplete="nome">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email" class="col-form-label">*E-mail</label>
                    <input class="form-control" type="email" name="email" id="email" required="" placeholder="teste@gmail.com" autocomplete="email">
                </div>
                <div class="form-group">
                    <label for="whatsapp" class="col-form-label">*WhatsApp</label>
                    <input class="form-control" type="text" name="whatsapp" id="whatsapp" required="" placeholder="(11) 99999-9999" autocomplete="whatsapp">
                </div>
                <div class="form-group">
                    <div class="row g-2">
                        <div class="col-6">
                            <label for="senha" class="col-form-label">*Senha</label>
                            <input class="form-control" type="password" id="senha" name="senha" required="" placeholder="" >
                        </div>
                        <div class="col-6">
                            <label for="confirmar-senha" class="col-form-label">*Confirmar Senha</label>
                            <input class="form-control" type="password" id="confirmar-senha" name="confirmar-senha" required="" placeholder="">
                        </div>
                        <div>
                            <div class="show-hide"><span class="show"></span></div>
                        </div>
                    </div>
                </div>
                <div class="form-group mb-0">
                    <div class="checkbox p-0">
                        <input id="checkbox1" type="checkbox">
                        <label class="text-muted" for="checkbox1">Concordo com a<a class="ms-1" href="politica">Política de Privacidade</a></label>
                    </div>
                    <button class="btn btn-primary btn-block w-100" type="submit">Criar uma conta</button>
                </div>
                <p class="mt-4 mb-0">Já tem uma conta?<a class="ms-1" href="../login/index.html">Entrar</a></p>
            </form>
        </div>
    </div>
    `;
const formCadastroParametros = `
        <div>
            <a class="logo" href="index.html">
                <img class="img-fluid for-dark" src="../assets/images/logo/logo.png" alt="looginpage">
                <img class="img-fluid for-light" src="../assets/images/logo/logo_dark.png" alt="looginpage">
            </a>
        </div>
        <div class="card">
            <div class="card-body">
                <div class="form theme-form">
                    <div class="row">
                        <div class="col-sm-12 text-center">
                            <p class="titulo_p">Informações do Respósavel</p>
                        </div>
                        <div class="col-sm-12">
                            <div class="mb-3">
                                <label for="nomeResponsavel">Nome Completo:</label>
                                <input class="form-control" name="nomeResponsavel" id="nomeResponsavel" type="text" placeholder="Digite o primeiro nome:">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="emailResponsavel">E-mail:</label>
                                <input class="form-control" name="emailResponsavel" id="emailResponsavel" type="text" placeholder="Digite o E-mail:">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="whatsappResponsavel">WhatsApp:</label>
                                <input class="form-control whatsapp" name="whatsappResponsavel" id="whatsappResponsavel" type="text" placeholder="Digite o WhatsApp:">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="senha" class="col-form-label">Senha</label>
                            <input class="form-control" type="password" id="senha" name="senha" required="" placeholder="" >
                        </div>
                        <div class="col-6">
                            <label for="confirmar-senha" class="col-form-label">Confirmar Senha</label>
                            <input class="form-control" type="password" id="confirmar-senha" name="confirmar-senha" required="" placeholder="">
                        </div>
                        <div>
                            <div class="show-hide"><span class="show"></span></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-5">
                            <div class="mb-3">
                                <label for="cpfResponsavel">CPF:</label>
                                <input class="form-control cpf" name="cpfResponsavel" id="cpfResponsavel" type="text" placeholder="Digite o CPF:">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <label for="rgResponsavel">RG:</label>
                                <input class="form-control rg" name="rgResponsavel" id="rgResponsavel" type="text" placeholder="Digite o RG:">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="orgaoResponsavel">Orgão Expedidor:</label>
                                <input class="form-control orgao" name="orgaoResponsavel" id="orgaoResponsavel" type="text" placeholder="EX: SSP">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-5">
                            <div class="mb-3">
                                <label for="tituloEndereco">Nome do Endereço:</label>
                                <input type="text" class="form-control" id="tituloEndereco" name="tituloEndereco" placeholder="EX: Minha Casa">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <label for="cep_responsavel">CEP:</label>
                                <input type="text" class="form-control" id="cep_responsavel" name="cep_responsavel" placeholder="Digite seu CEP">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="numero_responsavel">Numero:</label>
                                <input type="text" class="form-control" id="numero_responsavel" name="numero_responsavel" placeholder="Digite o número">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="logradouro_responsavel">Logradouro:</label>
                                <input type="text" class="form-control" id="logradouro_responsavel" name="logradouro_responsavel" placeholder="Logradouro">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="bairro_responsavel">Bairro:</label>
                                <input type="text" class="form-control" id="bairro_responsavel" name="bairro_responsavel" placeholder="Bairro">
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="mb-3">
                                <label for="cidade_responsavel">Cidade:</label>
                                <input type="text" class="form-control" id="cidade_responsavel" name="cidade_responsavel" placeholder="Cidade">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <label for="uf_responsavel">UF:</label>
                                <input type="text" class="form-control" id="uf_responsavel" name="uf_responsavel" placeholder="UF">
                            </div>
                        </div>
                        <div class="row mt-3 mb-5">
                            <div class="col-sm-12 text-center">
                                <p class="titulo_p">Informações do Dependente</p>
                            </div>
                            <div class="col-sm-6">
                                <div id="add_depedentes">
                                    <p class="p_add_depedentes text-center">É para um evento escolar?</p>
                                    <div class="alinhar_bt_depedentes">
                                        <button class="btn bt_depedentes" id="eventoEscolarSim" name="eventoEscolarSim">Sim</button>
                                        <button class="btn bt_depedentes" id="eventoEscolarNao" name="eventoEscolarNao">Não</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div id="add_depedentes">
                                    <p class="p_add_depedentes text-center">Adicionar Dependentes</p>
                                    <div class="alinhar_bt_depedentes">
                                        <button class="btn bt_depedentes" id="bt_add_dependentes" name="bt_add_dependentes">+ 1</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div id="add" class="mt-3 mb-3"></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group mb-0">
                    <div class="checkbox p-0">
                        <input id="checkbox1" type="checkbox">
                        <label class="text-muted" for="checkbox1">Concordo com a<a class="ms-1" href="politica">Política de Privacidade</a></label>
                    </div>
                    <button class="btn btn-primary btn-block w-100" type="button" id="criar_cadastro" name="criar_cadastro" id>Criar uma conta</button>
                </div>
                <p class="mt-4 mb-0">Já tem uma conta?<a class="ms-1" href="../login/index.html">Entrar</a></p>
                </div>
            </div>
        </div>
    `;

// Função para obter os parâmetros da URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=?([^&]*)/g;
    let match;
    while (match = regex.exec(queryString)) {
        const key = decodeURIComponent(match[1].replace(/\+/g, ' '));
        const value = decodeURIComponent(match[2].replace(/\+/g, ' '));
        params[key] = value;
    }
    return params;
}
// Capturar os parâmetros da URL
const queryParams = getQueryParams();
if (Object.keys(queryParams).length > 0) {
    for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
            const paramValue = key;
            if (paramValue) {
                if (paramValue.includes('-')) {
                    var cadastroParametro = true;
                    const [part1, part2] = paramValue.split('-');
                    codigoInstituicao = part1;
                    codigoEvento = part2;
                    if (codigoEvento == "") {
                        codigoEvento = null;
                    }
                    var cadastroParametro = true;
                    btForm.innerHTML = formCadastroParametros;

                } else {
                    codigoInstituicao = paramValue;
                    var cadastroParametro = true;
                    codigoEvento = "";
                    if (codigoEvento == "") {
                        codigoEvento = null;
                    }
                    btForm.innerHTML = formCadastroParametros;

                }
            } else {
                console.log(`Parâmetro '${key}' sem valor`);
            }
        }
    }
} else {
    btForm.innerHTML = formCadastroSimples;
}

$(document).ready(function() {
    // Aplica a máscara flexível ao campo WhatsApp
    $('#whatsapp').inputmask({
        mask: ['(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true,
        clearMaskOnLostFocus: true
    });
    //submit formulario simples
    $('#form-cadastro').submit(function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        var tipo = "CadastroExternoSimples"
        var nome = $('#nome').val();
        var email = $('#email').val();
        var whatsapp = $('#whatsapp').val();
        var senha = $('#senha').val();
        var confirmarSenha = $('#confirmar-senha').val();

        if (nome == '' || email == '' || whatsapp == '' || senha == '' || confirmarSenha == '') {
            Swal.fire('Por favor, preencha todos os campos.');
            return;
        }
        const cleanNumber = whatsapp.replace(/\D/g, '');
        if (cleanNumber.length < 10) {
            Swal.fire('Por favor, forneça um número de WhatsApp válido com DDD + 8 dígitos no mínimo.');
            return;
        }
        if (senha != confirmarSenha) {
            Swal.fire('As senhas precisam ser iguais.');
            return;
        }

        if (!$('#checkbox1').is(':checked')) {
            Swal.fire('Por favor, concorde com a Política de Privacidade.');
            return;
        }

        var formData = {
            tipo: tipo,
            nome: nome,
            email: email,
            whatsapp: whatsapp,
            senha: senha
        };
        $.ajax({
                type: 'POST',
                url: '../assets/php/cadastro.php',
                data: formData,
                dataType: 'json',
                encode: true
            })
            .done(function(data) {
                if (data.success) {
                    Swal.fire(data.message).then(() => {
                        window.location.href = "../login/index.html";
                    });
                } else {
                    Swal.fire(data.message);
                }
            })
            .fail(function(data) {
                Swal.fire('Erro ao enviar os dados. Por favor, tente novamente.').then(() => {
                    window.location.reload();
                });
            });
    });
    // mostrar senha
    (function($) {
        "use strict";
        $(".show-hide").show();
        $(".show-hide span").addClass("show");

        $(".show-hide span").click(function() {
            if ($(this).hasClass("show")) {
                $('input[name="senha"]').attr("type", "text");
                $('input[name="confirmar-senha"]').attr("type", "text");
                $(this).removeClass("show");
            } else {
                $('input[name="senha"]').attr("type", "password");
                $('input[name="confirmar-senha"]').attr("type", "password");
                $(this).addClass("show");
            }
        });
    })(jQuery);
});

if (cadastroParametro == true) {
    var btnSim = document.getElementById('eventoEscolarSim');
    var btnNao = document.getElementById('eventoEscolarNao');
    let formCount = 0;

    function toggleActive(button, otherButton) {
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            otherButton.classList.remove('active');
        } else {
            button.classList.add('active');
            otherButton.classList.remove('active');
        }
    }

    btnSim.addEventListener('click', function() { toggleActive(btnSim, btnNao); });
    btnNao.addEventListener('click', function() { toggleActive(btnNao, btnSim); });

    async function fetchData(tipo) {
        try {
            if (tipo == "instituicao") {
                const dadosInstituicoes = await fetch(`../assets/php/puxardados.php?tipo=instituicoes`);
                if (!dadosInstituicoes.ok) {
                    throw new Error('A resposta da rede não foi boa');
                }
                const instituicoesResponse = await dadosInstituicoes.json();
                const instituicoes = Array.isArray(instituicoesResponse.instituicoes) ? instituicoesResponse.instituicoes : [];
                return instituicoes;

            } else if (tipo == "vei") {
                const dadosVei = await fetch(`../assets/php/puxardados.php?tipo=veiResumido`);
                if (!dadosVei.ok) {
                    throw new Error('A resposta da rede não foi boa');
                }
                const veiResponse = await dadosVei.json();
                const vei = Array.isArray(veiResponse.vei) ? veiResponse.vei : [];
                return vei;
            }
        } catch (error) {
            console.error('Houve um problema com a operação de busca:', error);
            return [];
        }
    }

    async function verificarInstituicaoCheckObs() {
        let clicou = false; // Variável de controle para garantir que o clique ocorra apenas uma vez
        const instituicoes = await fetchData("instituicao");
        if (Array.isArray(instituicoes) && instituicoes.length > 0) {
            instituicoes.forEach(item => {
                if (item.Codigo === codigoInstituicao && !clicou) {
                    const checkObsArray = item.Check_Obs.split(',');
                    if (checkObsArray.includes("0")) {
                        btnNao.click();
                        clicou = true;
                        AtivarDesativarButtons("desativar");
                    } else {
                        btnSim.click();
                        clicou = true;
                        AtivarDesativarButtons("desativar");
                    }
                }
            });
        } else {
            console.error("Instituicoes não é um array ou está vazio:", instituicoes);
        }
    }
    verificarInstituicaoCheckObs();

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
                // AtivarDesativarButtons("ativar");
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
        async function addForm(tipo, acao) {
            if (formCount < 10) {
                var addDiv = document.getElementById('add');
                const instituicoes = await fetchData("instituicao");
                const vei = await fetchData("vei");
                dados = [];
                if (Array.isArray(instituicoes)) {
                    const instituicaoEncontrada = instituicoes.find(inst => inst.Codigo === codigoInstituicao);
                    if (instituicaoEncontrada.Status === "1") {
                        dados.push({
                            Check_Obs: instituicaoEncontrada.Check_Obs,
                            ID: instituicaoEncontrada.ID,
                            Título: instituicaoEncontrada.Título
                        });
                        if (codigoEvento === null) {
                            const eventosInstituicao = vei.filter(v => parseInt(v.ID_Instituicao, 10) === parseInt(instituicaoEncontrada.ID, 10));

                            eventosInstituicao.forEach(evento => {
                                dados.push({
                                    ID_Evento: evento.ID_Evento,
                                    Evento_Título: evento.Evento_Título,
                                    Evento_Check_Obs: evento.Evento_Check_Obs
                                });
                            });
                        } else {
                            const eventoEncontrado = vei.find(v => parseInt(v.ID_Evento, 10) === parseInt(codigoEvento, 10) && v.Evento_Status === 1);
                            if (eventoEncontrado) {
                                dados.push({
                                    ID_Evento: eventoEncontrado.ID_Evento,
                                    Evento_Título: eventoEncontrado.Evento_Título,
                                    Evento_Check_Obs: eventoEncontrado.Evento_Check_Obs
                                });
                            } else {
                                dados.push("Não existe evento disponível ou ativo.");
                            }
                        }

                    } else {
                        dados.push("Instituição inativa");
                    }
                } else {
                    dados.push("Instituição inativa ou excluída.");
                }
                var newForm = document.createElement('div');
                newForm.id = `form${formCount}`; // Define um ID único para a nova div
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
            let instituicaoAdicionada = false;
            const instituicoes = [];
            const eventos = [];
            const instituicaoTipos = new Set();
            const eventoTipos = new Set();

            dados.forEach(item => {
                if (!instituicaoAdicionada) {
                    instituicoes.push({
                        ID_Instituicao: item.ID,
                        Instituicao_Título: item.Título,
                        Instituicao_Check_Obs: item.Check_Obs
                    });
                    instituicaoAdicionada = true;
                    item.Check_Obs.split(',').forEach(t => instituicaoTipos.add(t));
                }
                if (item.ID_Evento) {
                    if (codigoEvento == null || parseInt(item.ID_Evento, 10) === parseInt(codigoEvento, 10)) {
                        // Adiciona o evento
                        eventos.push({
                            ID_Evento: item.ID_Evento,
                            Evento_Título: item.Evento_Título,
                            Evento_Check_Obs: item.Evento_Check_Obs
                        });

                        // Adicionar tipos do evento ao conjunto
                        item.Evento_Check_Obs.split(',').forEach(t => eventoTipos.add(t));
                    }
                }
            });

            if (tipo != "outros") {
                // Encontrar tipos em comum entre instituição e eventos
                const tiposComuns = [...instituicaoTipos].filter(t => eventoTipos.has(t));

                // Atualizar todos os selects com a classe .tipoEvento
                document.querySelectorAll('.tipoEvento').forEach(tipoEventoSelect => {
                    tipoEventoSelect.innerHTML = '<option value="" disabled="" selected="">Selecione</option>';
                    tiposComuns.forEach(tipo => {
                        const option = document.createElement('option');
                        option.value = tipo;
                        option.textContent = getTipoViagemText(tipo);
                        tipoEventoSelect.appendChild(option);
                    });
                });
            }

            // Preencher todos os selects com a classe .instituicao_disponivel com a instituição correspondente
            document.querySelectorAll('.instituicao_disponivel').forEach(instituicaoSelect => {
                instituicaoSelect.innerHTML = ''; // Limpar opções existentes
                instituicoes.forEach(instituicao => {
                    const option = document.createElement('option');
                    option.value = instituicao.ID_Instituicao;
                    option.textContent = instituicao.Instituicao_Título;
                    instituicaoSelect.appendChild(option);
                });
            });

            // Preencher todos os selects com a classe .evento_disponivel com os eventos correspondentes
            document.querySelectorAll('.evento_disponivel').forEach(eventoSelect => {
                eventoSelect.innerHTML = ''; // Limpar opções existentes
                eventos.forEach(evento => {
                    const option = document.createElement('option');
                    option.value = evento.ID_Evento;
                    option.textContent = evento.Evento_Título;
                    eventoSelect.appendChild(option);
                });
            });
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

        btnAdd.addEventListener('click', function() {
            var acao = "add"
            checkActiveButtons(acao);
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
            var tipo = "CadastroExterno"
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
            var senha = $('#senha').val();
            var confirmarSenha = $('#confirmar-senha').val();

            const cleanNumber = whatsappResponsavel.replace(/\D/g, '');
            if (cleanNumber.length < 10) {
                Swal.fire('Por favor, forneça um número de WhatsApp válido com DDD + 8 dígitos no mínimo.');
                return;
            }
            if (senha != confirmarSenha) {
                Swal.fire('As senhas precisam ser iguais.');
                return;
            }

            if (!$('#checkbox1').is(':checked')) {
                Swal.fire('Por favor, concorde com a Política de Privacidade.');
                return;
            }
            var camposObrigatorios = [
                { valor: nomeResponsavel, nome: 'Nome do Responsável' },
                { valor: emailResponsavel, nome: 'E-mail do Responsável' },
                { valor: whatsappResponsavel, nome: 'WhatsApp do Responsável' },
                { valor: senha, nome: 'Senha' },
                { valor: confirmarSenha, nome: 'Confirmar senha' },
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
            formData.append('senhaResponsavel', senha);
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
            console.log('Conteúdo do FormData:');
            for (let [key, value] of formData.entries()) { console.log(`${key}: ${value}`); }

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
                        Swal.fire(data.message).then(() => {
                            window.location.href = "../login/index.html";
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
}