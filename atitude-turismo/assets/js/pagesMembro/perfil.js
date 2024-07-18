function formatarCPF(cpf) { return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); }

function formatarWhatsApp(whatsapp) { if (whatsapp.length === 11) { return whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); } else { return whatsapp.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3"); } }

function formatarRG(rg, orgao, delimitador = " | ") { return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4") + delimitador + orgao; }

let dependentes = `
    <div class="card">
        <div class="card-header">
            <h4 class="card-title mb-0">Add projects And Upload</h4>
            <div class="card-options"><a class="card-options-collapse" href="#" data-bs-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-bs-toggle="card-remove"><i class="fe fe-x"></i></a></div>
        </div>
        <div class="table-responsive add-project custom-scrollbar">
            <table class="table card-table table-vcenter text-nowrap">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><a class="text-inherit" href="#">Untrammelled prevents </a></td>
                        <td>28 May 2018</td>
                        <td><span class="status-icon bg-success"></span> Completed</td>
                        <td>$56,908</td>
                        <td class="text-end"><a class="icon" href="javascript:void(0)"></a><a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-transparent btn-sm" href="javascript:void(0)"><i class="fa fa-link"></i> Update</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a></td>
                    </tr>
                    <tr>
                        <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                        <td>12 June 2018</td>
                        <td><span class="status-icon bg-danger"></span> On going</td>
                        <td>$45,087</td>
                        <td class="text-end"><a class="icon" href="javascript:void(0)"></a><a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-transparent btn-sm" href="javascript:void(0)"><i class="fa fa-link"></i> Update</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a></td>
                    </tr>
                    <tr>
                        <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                        <td>12 July 2018</td>
                        <td><span class="status-icon bg-warning"></span> Pending</td>
                        <td>$60,123</td>
                        <td class="text-end"><a class="icon" href="javascript:void(0)"></a><a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-transparent btn-sm" href="javascript:void(0)"><i class="fa fa-link"></i> Update</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a></td>
                    </tr>
                    <tr>
                        <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                        <td>14 June 2018</td>
                        <td><span class="status-icon bg-warning"></span> Pending</td>
                        <td>$70,435</td>
                        <td class="text-end"><a class="icon" href="javascript:void(0)"></a><a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-transparent btn-sm" href="javascript:void(0)"><i class="fa fa-link"></i> Update</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a></td>
                    </tr>
                    <tr>
                        <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                        <td>25 June 2018</td>
                        <td><span class="status-icon bg-success"></span> Completed</td>
                        <td>$15,987</td>
                        <td class="text-end"><a class="icon" href="javascript:void(0)"></a><a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-transparent btn-sm" href="javascript:void(0)"><i class="fa fa-link"></i> Update</a><a class="icon" href="javascript:void(0)"></a><a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`;

var email = informacoesUsuario.dados.Email;
var nome = informacoesUsuario.dados.Nome;
var whatsapp = informacoesUsuario.dados.WhatsApp;
var cpf = informacoesUsuario.dados.CPF;
var rg = informacoesUsuario.dados.RG;
var orgao = informacoesUsuario.dados.Orgao_Expedidor;
var nomeEndereco = informacoesUsuario.enderecos.nome_endereco;

if (cpf != null){
    var cpfFormatado = formatarCPF(cpf);
}else {
    cpf = "";
}
var whatsappFormatado = formatarWhatsApp(whatsapp);
if (rg != null){
    var rgFormatado = formatarRG(rg, orgao, " - ");
}else {
    rg = "";
}

if (orgao == null){
    orgao = "";
}

document.addEventListener('DOMContentLoaded', function() {
    const addCard4 = document.getElementById('addCard4');
    const addCard8 = document.getElementById('addCard8');
    const addDependentes = document.getElementById('addDependentes');
    console.log(informacoesUsuario);

    function obterEnderecoPorTipo(tipo) {
        var endereco = informacoesUsuario.enderecos.find(end => end.tipo === tipo);
        if (endereco) {
            var nomeEndereco = endereco.nome_endereco;
            var cep = endereco.cep;
            var numeroEndereco = endereco.numero;
            var logradouro = endereco.logradouro;
            var bairro = endereco.bairro;
            var cidade = endereco.cidade;
            var uf = endereco.uf;

            return { nomeEndereco, cep, numeroEndereco, logradouro, bairro, cidade, uf };
        } else {
            return {nomeEndereco: "", cep: "", numeroEndereco: "", logradouro: "", bairro: "", cidade: "", uf: ""};
        }
    }

    function addCardContent4() {
        let cardTemplate = `
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0 text-center">Meu Perfil</h4>
                    <div class="card-options"><a class="card-options-collapse" href="#" data-bs-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-bs-toggle="card-remove"><i class="fe fe-x"></i></a></div>
                </div>
                <div class="card-body">
                    <div class="row mb-2">
                        <div class="profile-title">
                            <div class="imgPerfil">
                                <div>
                                    <div class="text-center mb-1">
                                        <img class="img-100 rounded-circle" alt="" src="../assets/images/user/7.jpg">
                                    </div>
                                    <div class="mb-3 mt-3">
                                        <button type="button" class="btn btn-success" id="atualizar_ft" name="atualizar_ft">Mudar</button>
                                        <button type="button" class="btn btn-danger" id="excluir_ft" name="excluir_ft">Excluir</button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <h5>${nome}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <form>
                            <div class="row text-left">
                                <div class="col-md-12 mb-3">
                                    <h5>Atualizar Login</h5>
                                </div>
                                <div class="mb-3">
                                    <label for="addEmail" class="form-label">E-mail:</label>
                                    <input class="form-control" id="addEmail" placeholder="seu-email@exemplo.com" value="${email}">
                                </div>
                                <div class="mb-3">
                                    <label for="addSenha" class="form-label">Nova Senha:</label>
                                    <input class="form-control" id="addSenha" type="password" value="">
                                </div>
                                <div class="col-md-12 card-footer" style="padding-bottom:0;">
                                    <button type="button" id="atualizarSenha" class="atualizarSenha btn btn-primary btn-block"> Salvar </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;

        // Inserir o card clonado no elemento desejado
        addCard4.innerHTML = cardTemplate;

    }

    function addCardContent8() {
        let cardTemplate = `
        <form class="card">
            <div class="card-header">
                <h4 class="card-title mb-0 text-center">Editar Informações</h4>
                <div class="card-options"><a class="card-options-collapse" href="#" data-bs-toggle="card-collapse"><i class="fe fe-chevron-up"></i></a><a class="card-options-remove" href="#" data-bs-toggle="card-remove"><i class="fe fe-x"></i></a></div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-7">
                        <div class="mb-3">
                            <label for="addNome" class="form-label">Nome Completo:</label>
                            <input class="form-control" id="addNome" type="text" placeholder="Nome" value="${nome}">
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="mb-3">
                            <label for="addWhatsApp" class="form-label">WhatsApp:</label>
                            <input class="form-control whatsapp" id="addWhatsApp" type="text" placeholder="WhatsApp" value="${whatsapp}">
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="mb-3">
                            <label for="addCPF" class="form-label">CPF:</label>
                            <input class="form-control" id="addCPF" type="text" placeholder="CPF" value="${cpf}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="addRG" class="form-label">RG:</label>
                            <input class="form-control" id="addRG" type="text" placeholder="RG" value="${rg}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="mb-3">
                            <label for="addOrgao" class="form-label">Org. Emissor:</label>
                            <input class="form-control" id="addOrgao" type="text" placeholder="SSP" value="${orgao}">
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <div class="mb-3">
                            <label class="form-label" for="addTipoEndereco">Tipo de Endereço:</label>
                            <div class="select-style">
                                <select class="form-control" name="addTipoEndereco" id="addTipoEndereco" style="text-align:center;">
                                    <option value="" selected="">Selecione</option>
                                    <option value="0">Residencial</option>
                                    <option value="1">Faturamento</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-5">
                        <div class="mb-3">
                            <label for="addNomeEndereco" class="form-label">Nome do Endereço:</label>
                            <input class="form-control" id="addNomeEndereco" type="text" placeholder="Minha casa">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="mb-3">
                            <label for="addCEP" class="form-label">CEP:</label>
                            <input class="form-control" id="addCEP" type="text" placeholder="CEP">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="mb-3">
                            <label for="addLogradouro" class="form-label">Logradouro:</label>
                            <input class="form-control" id="addLogradouro" type="text" placeholder="Rua exemplo">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="mb-3">
                            <label for="addNumeroEndereco" class="form-label">Número:</label>
                            <input class="form-control" id="addNumeroEndereco" type="text" placeholder="Número">
                        </div>
                    </div>

                    <div class="col-md-5">
                        <div style="margin-bottom: 11px !important;">
                            <label for="addBairro" class="form-label">Bairro:</label>
                            <input class="form-control" id="addBairro" type="text" placeholder="Bairro">
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div style="margin-bottom: 11px !important;">
                            <label for="addCidade" class="form-label">Cidade:</label>
                            <input class="form-control" id="addCidade" type="text" placeholder="São Paulo">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div style="margin-bottom: 11px !important;">
                            <label for="addUf" class="form-label">UF:</label>
                            <input class="form-control" id="addUf" type="text" placeholder="SP">
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-end">
                <button class="btn btn-primary" id="AtualizarPerfil" type="submit"> Atualizar Perfil </button>
            </div>
        </form>`;

        // Inserir o card clonado no elemento desejado
        addCard8.innerHTML = cardTemplate;

        // Adicionar listener ao select tipoEndereco
        document.getElementById('addTipoEndereco').addEventListener('change', function() {
            var tipo = parseInt(this.value, 10);
            var endereco = obterEnderecoPorTipo(tipo);

            // Preencher os campos de endereço
            document.getElementById('addNomeEndereco').value = endereco.nomeEndereco;
            document.getElementById('addCEP').value = endereco.cep;
            document.getElementById('addNumeroEndereco').value = endereco.numeroEndereco;
            document.getElementById('addLogradouro').value = endereco.logradouro;
            document.getElementById('addBairro').value = endereco.bairro;
            document.getElementById('addCidade').value = endereco.cidade;
            document.getElementById('addUf').value = endereco.uf;
        });
    }

    function addContentDependentes() {
        let cardTemplate = `
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0">Dependentes</h4>
                </div>
                <div class="table-responsive add-project custom-scrollbar">
                    <table class="table card-table table-vcenter text-nowrap">
                        <thead>
                            <tr>
                                <th>Nome:</th>
                                <th>Data de Nasc.</th>
                                <th>Instituição</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><p class="text-inherit nomeDependente"> </p></td>
                                <td><p class="text-inherit dataNascimento"> </p></td>
                                <td><span class="status-icon bg-success"></span> Completed</td>
                                <td>$56,908</td>
                                <td class="text-end">
                                    <a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a>
                                    <a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a>
                                </td>
                            </tr>
                            <tr>
                                <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                                <td>12 June 2018</td>
                                <td><span class="status-icon bg-danger"></span> On going</td>
                                <td>$45,087</td>
                                <td class="text-end">
                                    <a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a>
                                    <a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a>
                                </td>
                            </tr>
                            <tr>
                                <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                                <td>12 July 2018</td>
                                <td><span class="status-icon bg-warning"></span> Pending</td>
                                <td>$60,123</td>
                                <td class="text-end">
                                    <a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a>
                                    <a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a>
                                </td>
                            </tr>
                            <tr>
                                <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                                <td>14 June 2018</td>
                                <td><span class="status-icon bg-warning"></span> Pending</td>
                                <td>$70,435</td>
                                <td class="text-end">
                                    <a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a>
                                    <a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a>
                                </td>
                            </tr>
                            <tr>
                                <td><a class="text-inherit" href="#">Untrammelled prevents</a></td>
                                <td>25 June 2018</td>
                                <td><span class="status-icon bg-success"></span> Completed</td>
                                <td>$15,987</td>
                                <td class="text-end">
                                    <a class="btn btn-primary btn-sm" href="javascript:void(0)"><i class="fa fa-pencil"></i> Edit</a>
                                    <a class="btn btn-danger btn-sm" href="javascript:void(0)"><i class="fa fa-trash"></i> Delete</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>`;

        // Inserir o card clonado no elemento desejado
        addDependentes.innerHTML = cardTemplate;
    }

    addCardContent4();
    addCardContent8();
    addContentDependentes();
});

function initializeInputMasks() {
    console.log("executou");
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

}
initializeInputMasks();