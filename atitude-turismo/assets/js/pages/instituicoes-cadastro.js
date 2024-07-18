// preenche automaticamente os campos após digitar o cep
function cep() {
    $('#cep_segmento').inputmask('99999-999');
    $('#cep_segmento').on('blur', function() {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length != 8) {
            return;
        }
        $.ajax({
            url: 'https://viacep.com.br/ws/' + cep + '/json/',
            dataType: 'json',
            success: function(response) {
                $('#logradouro_segmento').val(response.logradouro);
                $('#bairro_segmento').val(response.bairro);
                $('#cidade_segmento').val(response.localidade);
                $('#uf_segmento').val(response.uf);
            }
        });
    });
}
//mascara do telefone
function mascara_tel() {
    $('#telefone').inputmask({
        mask: ['(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true,
        clearMaskOnLostFocus: true
    });
}
// controla funcoes do botao sim e nao add escola
document.addEventListener('DOMContentLoaded', function() {
    var ensinoSim = document.getElementById('ensino_sim');
    var ensinoNao = document.getElementById('ensino_nao');
    var responsavelSim = document.getElementById('add_resposavel_tel_sim');
    var responsavelNao = document.getElementById('add_resposavel_tel_nao');
    var addConteudo = document.getElementById('add_conteudo');

    if (ensinoSim && ensinoNao && responsavelSim && responsavelNao && addConteudo) {

        ensinoSim.addEventListener('click', function(event) {
            event.preventDefault();
            if (responsavelSim.classList.contains('active')) {
                //console.log('O botão "Sim" tem a classe "active".');
                ensinoSim.classList.add('active');
                ensinoNao.classList.remove('active');
                responsavelNao.classList.add('active');
                responsavelSim.classList.remove('active');
            } else {
                //console.log('O botão "Sim" não tem a classe "active".');
                ensinoSim.classList.add('active');
                ensinoNao.classList.remove('active');
            }
            addConteudo.innerHTML = `
                <div class="fade-in mt-3">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <label for="nome_resposavel">Nome do Resposável</label>
                                <input class="form-control" type="text" name="nome_resposavel" id="nome_resposavel" placeholder="Nome do Responsavel" autocomplete="name">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <label for="telefone">Telefone do Resposável</label>
                                <input class="form-control" type="text" name="telefone" id="telefone" placeholder="(11) 99999-9999" autocomplete="phone">
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="mb-3">
                                <label>Tipo de Viagem:</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="1" id="evento1">
                                    <label class="form-check-label" for="evento1">
                                        Viagem de Formatura 9°
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="2" id="evento2">
                                    <label class="form-check-label" for="evento2">
                                        Viagem de Formatura 3°
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="3" id="evento3">
                                    <label class="form-check-label" for="evento3">
                                        Passeios Escolares
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="4" id="evento4">
                                    <label class="form-check-label" for="evento4">
                                        Viagem de Funcionários
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            setTimeout(function() {
                document.querySelector('.fade-in').classList.add('show');
                mascara_tel();
            }, 10);
        });

        ensinoNao.addEventListener('click', function(event) {
            event.preventDefault();
            if (responsavelSim.classList.contains('active')) {
                //console.log('O botão "Sim" tem a classe "active".');
                ensinoNao.classList.add('active');
                ensinoSim.classList.remove('active');
                responsavelSim.classList.add('active');
                responsavelNao.classList.remove('active');
            } else {
                //console.log('O botão "Sim" não tem a classe "active".');
                ensinoNao.classList.add('active');
                ensinoSim.classList.remove('active');
            }

            addConteudo.innerHTML = '';
        });
    } else {
        console.log('Elementos não encontrados1.');
    }
});
// controla funcoes do botao sim e nao do resposavel e telefone
document.addEventListener('DOMContentLoaded', function() {
    var ensinoSim = document.getElementById('ensino_sim');
    var ensinoNao = document.getElementById('ensino_nao');
    var responsavelSim = document.getElementById('add_resposavel_tel_sim');
    var responsavelNao = document.getElementById('add_resposavel_tel_nao');
    var addConteudo = document.getElementById('add_conteudo');

    if (ensinoSim && ensinoNao && responsavelSim && responsavelNao && addConteudo) {
        //console.log('Elementos encontrados, adicionando event listeners.');

        responsavelSim.addEventListener('click', function(event) {
            event.preventDefault();
            if (ensinoSim.classList.contains('active')) {
                //console.log('O botão "Sim" tem a classe "active".');
                ensinoNao.classList.add('active');
                ensinoSim.classList.remove('active');
                responsavelSim.classList.add('active');
                responsavelNao.classList.remove('active');
            } else {
                //console.log('O botão "Sim" não tem a classe "active".');
                responsavelSim.classList.add('active');
                responsavelNao.classList.remove('active');
            }
            addConteudo.innerHTML = `
                <div class="fade-in mt-3">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="nome_resposavel">Nome do Resposável</label>
                                <input class="form-control" type="text" name="nome_resposavel" id="nome_resposavel" placeholder="Nome do Responsavel" autocomplete="nome">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="telefone">Telefone do Resposável</label>
                                <input class="form-control" type="text" name="telefone" id="telefone" placeholder="(11) 99999-9999" autocomplete="telefone">
                            </div>
                        </div>
                    </div>
                </div>`;
            // Adicionar a classe 'show' após um pequeno atraso para iniciar a animação
            setTimeout(function() {
                document.querySelector('.fade-in').classList.add('show');
                mascara_tel();
            }, 10);
        });

        responsavelNao.addEventListener('click', function(event) {
            event.preventDefault();

            if (ensinoSim.classList.contains('active')) {
                //console.log('O botão "Sim" tem a classe "active".');
                responsavelNao.classList.add('active');
                responsavelSim.classList.remove('active');
                ensinoSim.classList.add('active');
                ensinoNao.classList.remove('active');


            } else {
                //console.log('O botão "Sim" não tem a classe "active".');
                responsavelNao.classList.add('active');
                responsavelSim.classList.remove('active');

                ensinoNao.classList.add('active');
                ensinoSim.classList.remove('active');
                addConteudo.innerHTML = '';
            }



        });
    } else {
        console.log('Elementos não encontrados2.');
    }
});
// controla funcoes do botao sim e nao do Endereço
document.addEventListener('DOMContentLoaded', function() {
    var enderesoSim = document.getElementById('add_endereco_sim');
    var enderesoNao = document.getElementById('add_endereco_nao');
    var addConteudo = document.getElementById('add_conteudo_endereco');

    if (enderesoSim && enderesoNao && addConteudo) {

        enderesoSim.addEventListener('click', function(event) {
            event.preventDefault();

            enderesoSim.classList.add('active');
            enderesoNao.classList.remove('active');

            addConteudo.innerHTML = `
                <div class="fade-in2 mt-3">
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="cep_segmento">CEP:</label>
                                <input type="text" class="form-control" id="cep_segmento" name="cep_segmento" placeholder="Digite seu CEP">
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="mb-3">
                                <label for="numero_segmento">Numero:</label>
                                <input type="text" class="form-control" id="numero_segmento" name="numero_segmento" placeholder="Digite o número">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="mb-3">
                                <label for="logradouro_segmento">Logradouro:</label>
                                <input type="text" class="form-control" id="logradouro_segmento" name="logradouro_segmento" placeholder="Logradouro">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="mb-3">
                                <label for="bairro_segmento">Bairro:</label>
                                <input type="text" class="form-control" id="bairro_segmento" name="bairro_segmento" placeholder="Bairro">
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="mb-3">
                                <label for="cidade_segmento">Cidade:</label>
                                <input type="text" class="form-control" id="cidade_segmento" name="cidade_segmento" placeholder="Cidade">
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <div class="mb-3">
                                <label for="uf_segmento">UF:</label>
                                <input type="text" class="form-control" id="uf_segmento" name="uf_segmento" placeholder="UF">
                            </div>
                        </div>
                    </div>
                </div>`;

            // Adicionar a classe 'show' após um pequeno atraso para iniciar a animação
            setTimeout(function() {
                document.querySelector('.fade-in2').classList.add('show');
                cep();
            }, 10);
        });

        enderesoNao.addEventListener('click', function(event) {
            event.preventDefault();

            enderesoSim.classList.remove('active');
            enderesoNao.classList.add('active');

            addConteudo.innerHTML = '';
        });
    } else {
        console.log('Elementos não encontrados3.');
    }
});
// Configuração do evento click para o botão "Cancelar"
$(document).ready(function() {
    $('#cancelar_segmento').on('click', function(event) {
        event.preventDefault();
        $('.form.theme-form input[type="text"], .form.theme-form textarea').val('');
    });
});
// Configuração do evento click para o botão "Criar"
$(document).ready(function() {
    $('#enviar_segmento').click(function(e) {
        e.preventDefault();

        var tituloSegmento = $('#nome_instituicao').val();
        var descricaoSegmento = $('#descricao_segmento').val();
        var tipoSegmento = "";

        var camposObrigatorios = [
            { valor: tituloSegmento, nome: 'Nome da Instituição' }
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

        var formData = new FormData();
        formData.append('tipoAtualizacao', 'cadastro');
        formData.append('tituloSegmento', tituloSegmento);
        formData.append('descricaoSegmento', descricaoSegmento);

        var ensinoSim = document.getElementById('ensino_sim');
        var responsavelSim = document.getElementById('add_resposavel_tel_sim');
        var enderecoSim = document.getElementById('add_endereco_sim');

        if (ensinoSim.classList.contains('active')) {
            var checkedValues = Array.from($('.form-check-input:checked')).map(cb => cb.value);
            var nomeResponsavel = $('#nome_resposavel').val();
            var telefoneResponsavel = $('#telefone').val();
            tipoSegmento = "escolar";
            var camposObrigatorios = [
                { valor: nomeResponsavel, nome: 'Nome do Resposável' },
                { valor: telefoneResponsavel, nome: 'Telefone do Resposável' }
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
            formData.append('nomeResponsavel', nomeResponsavel);
            formData.append('telefoneResponsavel', telefoneResponsavel);
            formData.append('checkedValues', JSON.stringify(checkedValues));
        } else if (responsavelSim.classList.contains('active')) {
            var nomeResponsavel = $('#nome_resposavel').val();
            var telefoneResponsavel = $('#telefone').val();

            var camposObrigatorios = [
                { valor: nomeResponsavel, nome: 'Nome do Resposável' },
                { valor: telefoneResponsavel, nome: 'Telefone do Resposável' }
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

            formData.append('nomeResponsavel', nomeResponsavel);
            formData.append('telefoneResponsavel', telefoneResponsavel);
        }
        if (enderecoSim.classList.contains('active')) {
            var end_cep = $('#cep_segmento').val();
            var end_numero = $('#numero_segmento').val();
            var end_logradouro = $('#logradouro_segmento').val();
            var end_bairro = $('#bairro_segmento').val();
            var end_cidade = $('#cidade_segmento').val();
            var end_uf = $('#uf_segmento').val();
            if (end_cep.length !== 9) {
                Swal.fire({
                    icon: 'error',
                    title: 'CEP Inválido',
                    text: 'Por favor, insira um CEP válido no formato XXXXX-XXX.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                return;
            }
            var camposObrigatorios = [
                { valor: end_cep, nome: 'numero do CEP' },
                { valor: end_logradouro, nome: 'Logradouro' },
                { valor: end_bairro, nome: 'Nome do Bairro' },
                { valor: end_cidade, nome: 'Nome do Cidade' },
                { valor: end_uf, nome: 'UF' }
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
            formData.append('end_cep', end_cep);
            formData.append('end_numero', end_numero);
            formData.append('end_logradouro', end_logradouro);
            formData.append('end_bairro', end_bairro);
            formData.append('end_cidade', end_cidade);
            formData.append('end_uf', end_uf);
        }

        if(tipoSegmento == ""){
            tipoSegmento = "outros";
            formData.append('tipoSegmento', tipoSegmento);
        }else{
            formData.append('tipoSegmento', tipoSegmento);
        }
        
        //formData.forEach((value, key) => {
        //    console.log(`${key}: ${value}`);
        //});

        $.ajax({
                type: 'POST',
                url: '../assets/php/instituicoes.php',
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