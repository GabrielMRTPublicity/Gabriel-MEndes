<?php
require_once '../assets/php/functions.php';
$loginData = new LoginData();

if (!$loginData->isLoggedIn()) {
  header("Location: ../login/");
  exit;
}
if ($_SESSION['user']['posicao'] !== 'Admin') {
    header("Location: logout.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="RT Publicity">
    <link rel="icon" href="../assets/images/favicon.png" type="image/x-icon">
    <link rel="shortcut icon" href="../assets/images/favicon.png" type="image/x-icon">
    <title>Cadastrar Usuário | Atitude Turismo</title>
    <!-- Google font-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="../assets/css/font-awesome.css">
    <!-- ico-font-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/icofont.css">
    <!-- Themify icon-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/themify.css">
    <!-- Flag icon-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/flag-icon.css">
    <!-- Feather icon-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/feather-icon.css">
    <!-- Plugins css start-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/slick.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/slick-theme.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/scrollbar.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/animate.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/date-picker.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/dropzone.css">
    <!-- Plugins css Ends-->
    <!-- Bootstrap css-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/bootstrap.css">
    <!-- App css-->
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
    <link id="color" rel="stylesheet" href="../assets/css/color-1.css" media="screen">
    <!-- Responsive css-->
    <link rel="stylesheet" type="text/css" href="../assets/css/responsive.css">
    <style>
    .titulo_p{
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 30px!important;
        color: #027bfd;
    }
    #add_depedentes{
        display: flex;
        flex-direction: column;
    }
    .p_add_depedentes {
        font-size: 15px;
        font-weight: 500;
    }
    .alinhar_bt_depedentes {
        display: flex;
        justify-content: center;
    }
    .bt_depedentes{
        border: 2px solid;
        color: #027bfd;
        font-weight: 600;

    }
    #bt_add_dependentes{
        border-color: #027bfd;
        border-radius: 8px 8px 20px 20px;
        margin-right: 5px;
        min-width: 135px;
        transition: border-color 0.5s, background 0.6s, color 0.5s;
    }
    #eventoEscolarSim{
        border-color: #027bfd;
        border-radius: 8px 0 0 20px;
        margin-right: 5px;
        transition: border-color 0.5s, background 0.6s, color 0.5s;
    }
    #eventoEscolarNao{
        border-color: #027bfd;
        border-radius: 0 8px 20px 0;
        margin-left: 5px;
        transition: border-color 0.5s, background 0.6s, color 0.5s;
    }
    #bt_excluir_dependentes{
        border-color: #027bfd;
        border-radius: 8px 8px 20px 20px;
        min-width: 135px;
        margin-left: 5px;
        transition: border-color 0.5s, background 0.6s, color 0.5s;
    }
    #bt_add_dependentes:hover, #eventoEscolarSim:hover{
        border-color: #008000;
        background: #008000;
        color: #fff;
    }
    #bt_excluir_dependentes:hover, #eventoEscolarNao:hover{
        border-color: #ff0000;
        background: #ff0000;
        color: #fff;
    }

    #eventoEscolarSim.active{
        border-style: dashed;
        border-color: #fff;
        background: #008000;
        color: #fff;
    }

    #eventoEscolarNao.active{
        border-style: dashed;
        border-color: #fff;
        background: #ff0000;
        color: #fff;
    }
    #add .mb-3.mt-3.text-center{
        padding: 5px;
        border-radius: 4px;
        background: #59ac59;
        color: #fff;
        font-weight: 600;
    }
    #add .mb-3.mt-3.text-center.nao{
        background: #ff5959;
    }
</style>
</head>

<body>
    <!-- loader starts-->
    <div class="loader-wrapper">
        <div class="loader">
            <div class="loader4"></div>
        </div>
    </div>
    <!-- loader ends-->
    <!-- tap on top starts-->
    <div class="tap-top"><i data-feather="chevrons-up"></i></div>
    <!-- tap on tap ends-->
    <!-- page-wrapper Start-->
    <div class="page-wrapper default-wrapper" id="pageWrapper">
        <!-- navbar -->
        <?php require_once '../assets/componentes/navbarADM.php'; ?>
        <!-- navbar -->
        <div class="page-body-wrapper default-menu default-menu">
            <!-- Page Sidebar Start-->
            <?php require_once '../assets/componentes/sidebarADM.php'; ?>
            <!-- Page Sidebar Ends-->
            <div class="page-body">
                <div class="container-fluid">
                    <div class="page-title">
                        <div class="row">
                            <div class="col-6">
                                <h4>Cadastrar Usuários e dependentes</h4>

                            </div>
                            <div class="col-6">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="index.php">
                                            <svg class="stroke-icon">
                                                <use href="../assets/svg/icon-sprite.svg#stroke-home"></use>
                                            </svg>
                                        </a>
                                    </li>
                                    <li class="breadcrumb-item">Usuários</li>
                                    <li class="breadcrumb-item active">Cadastrar Usuário</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Container-fluid starts-->
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-12">
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
                                        <div class="row">
                                            <div class="col">
                                                <div class="text-center">
                                                    <a class="btn btn-success me-3" id="criar_cadastro" name="criar_cadastro" href="#">Criar</a>
                                                    <a class="btn btn-danger" id="cancelar_cadastro"  name="cancelar_cadastro" href="#">Cancelar</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Container-fluid Ends-->
            </div>
            <!-- footer start-->
            <?php require_once '../assets/componentes/footer.php'; ?>
        </div>
    </div>
    <!-- latest jquery-->
    <script src="../assets/js/jquery.min.js"></script>
    <!-- Bootstrap js-->
    <script src="../assets/js/bootstrap/bootstrap.bundle.min.js"></script>
    <!-- feather icon js-->
    <script src="../assets/js/icons/feather-icon/feather.min.js"></script>
    <script src="../assets/js/icons/feather-icon/feather-icon.js"></script>
    <!-- scrollbar js-->
    <script src="../assets/js/scrollbar/simplebar.js"></script>
    <script src="../assets/js/scrollbar/custom.js"></script>
    <!-- Sidebar jquery-->
    <script src="../assets/js/config.js"></script>
    <!-- Plugins JS start-->
    <script src="../assets/js/sidebar-menu.js"></script>
    <script src="../assets/js/sidebar-pin.js"></script>
    <script src="../assets/js/slick/slick.min.js"></script>
    <script src="../assets/js/slick/slick.js"></script>
    <script src="../assets/js/header-slick.js"></script>
    <!-- calendar js-->
    <script src="../assets/js/datepicker/date-picker/datepicker.js"></script>
    <script src="../assets/js/datepicker/date-picker/datepicker.pt.js"></script>
    <script src="../assets/js/datepicker/date-picker/datepicker.custom.js"></script>
    <script src="../assets/js/dropzone/dropzone.js"></script>
    <script src="../assets/js/typeahead/handlebars.js"></script>
    <script src="../assets/js/typeahead/typeahead.bundle.js"></script>
    <script src="../assets/js/typeahead/typeahead.custom.js"></script>
    <script src="../assets/js/typeahead-search/handlebars.js"></script>
    <script src="../assets/js/typeahead-search/typeahead-custom.js"></script>
    <!-- Plugins JS Ends-->
    <!-- Theme js-->
    <script src="../assets/js/script.js"></script>
    <script src="../assets/js/sweet-alert/sweetalert2.all.min.js"></script>
    <script src="../assets/js/jquery.inputmask.min.js"></script>
    <script src="../assets/js/pages/painel_cadastrar_usuario.js"></script>
    <!--script src="../assets/js/theme-customizer/customizer.js"></script-->
</body>

</html>