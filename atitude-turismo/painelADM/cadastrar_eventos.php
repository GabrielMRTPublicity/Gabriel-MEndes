<?php
require_once '../assets/php/functions.php';
$loginData = new LoginData();

if (!$loginData->isLoggedIn()) {
  header("Location: ../login/");
  exit;
}
// Verifica se o usuário é "Admin"
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
    <title>Cadastrar Eventos | Atitude Turismo</title>
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
    <link rel="stylesheet" href="../assets/css/componentes/popup_vinculador.css">
    <style>
    .select-style {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .select-style:after {
        content: '\f107';
        font-family: 'FontAwesome';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
    }

    select {
        width: 100%;
        padding-right: 30px;
    }
    .p_valores_evento{
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    .alinhar_bt_eventos{
        display: flex;
        justify-content: center;
    }
    .bt_evento{
        border-radius: 15px;
        color: #fff;
        border: 1px solid #E6E9EB;
        width: 130px;
        margin: 0 15px;
    }
    .btn-evento-inativo:hover, .btn-evento-ativo:hover{
        color: #fff;
        background-color: #007bff;
    }
    .bt_evento#bt_add_evento{
        background: green;
    }
    .bt_evento#bt_excluir_evento{
        background: red;
    }
    .btn-evento-ativo {
        color: #fff;
        background-color: #007bff;
    }
    
    .btn-evento-inativo {
        background-color: #ccc;
    }
    .uploadObrigadorio{
        padding: 20px;
        border: 1px solid #E6E9EB;
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
                                <h4>Cadastrar Eventos</h4>
                            </div>
                            <div class="col-6">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.php">
                                            <svg class="stroke-icon">
                                                <use href="../assets/svg/icon-sprite.svg#stroke-home"></use>
                                            </svg></a></li>
                                    <li class="breadcrumb-item">Eventos</li>
                                    <li class="breadcrumb-item active">Cadastrar Evento</li>
                                </ol>
                            </div>
                            <div class="col-12 div-popup">
                                <div class="text-center">
                                    <div id="modal-vinculador"></div>
                                    <button type="button" id="vincular_evento" class="vincular_evento">Vincular ao Evento</button>
                                </div>
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
                                            <div class="col-sm-6">
                                                <div class="mb-3">
                                                    <label for="titulo_evento">Titulo do Evento</label>
                                                    <input class="form-control" name="titulo_evento" id="titulo_evento" type="text" placeholder="Digite o nome do Evento">
                                                </div>
                                            </div>
                                            <div class="col-sm-3">
                                                <div class="mb-3">
                                                    <label for="dt_inicio_evento">Data do Início:</label>
                                                    <input class="datepicker-here form-control" id="dt_inicio_evento" data-inputmask="'alias': 'dd/mm/yyyy'" name="dt_inicio_evento" type="text" data-language="pt">
                                                </div>
                                            </div>
                                            <div class="col-sm-3">
                                                <div class="mb-3">
                                                    <label for="dt_fim_evento">Data do Fim:</label>
                                                    <input class="datepicker-here form-control" id="dt_fim_evento" data-inputmask="'alias': 'dd/mm/yyyy'" name="dt_fim_evento" type="text" data-language="pt">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <div class="mb-3">
                                                    <label for="cep_evento">CEP:</label>
                                                    <input type="text" class="form-control" id="cep_evento" name="cep_evento" placeholder="Digite seu CEP">
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="mb-3">
                                                    <label for="logradouro_evento">Logradouro:</label>
                                                    <input type="text" class="form-control" id="logradouro_evento" name="logradouro_evento" placeholder="Logradouro">
                                                </div>
                                            </div>
                                            <div class="col-sm-3">
                                                <div class="mb-3">
                                                    <label for="numero_evento">Numero:</label>
                                                    <input type="text" class="form-control" id="numero_evento" name="numero_evento" placeholder="Digite o número">
                                                </div>
                                            </div>
                                            <div class="col-sm-5">
                                                <div class="mb-3">
                                                    <label for="bairro_evento">Bairro:</label>
                                                    <input type="text" class="form-control" id="bairro_evento" name="bairro_evento" placeholder="Bairro">
                                                </div>
                                            </div>
                                            <div class="col-sm-5">
                                                <div class="mb-3">
                                                    <label for="cidade_evento">Cidade:</label>
                                                    <input type="text" class="form-control" id="cidade_evento" name="cidade_evento" placeholder="Cidade">
                                                </div>
                                            </div>
                                            <div class="col-sm-2">
                                                <div class="mb-3">
                                                    <label for="uf_evento">UF:</label>
                                                    <input type="text" class="form-control" id="uf_evento" name="uf_evento" placeholder="UF">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <div class="mb-3">
                                                    <label for="tipoEvento">Tipo de Evento:</label>
                                                    <div class="select-style">
                                                        <select id="tipoEvento" class="form-control">
                                                            <option value="" disabled selected>Selecione</option>
                                                            <option value="evento_escola">Evento Escolar</option>
                                                            <option value="evento_familia">Evento Familiar</option>
                                                            <option value="evento_outros">Outros</option>
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
                                        <div class="row">
                                            <div class="col">
                                                <div class="mb-3">
                                                    <label for="descricao_evento">Descrição:</label>
                                                    <textarea name="descricao_evento" id="descricao_evento" class="form-control" rows="4" placeholder="Digite detalhes sobre o evento."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mb-3 uploadObrigadorio">
                                            <label class="text-center mb-3"><h5>Arquivos Obrigatórios:</h5></label>
                                            <div class="col-md-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" value="fichaMedica" id="obrigadorio1">
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
                                                    <label>Carregar Fotos do Evento</label>
                                                    <form class="dropzone" id="fotosevideos" name="fotosevideos" action="#" enctype="multipart/form-data">
                                                        <div class="dz-message needsclick"><i class="icon-cloud-up"></i>
                                                            <h6 class="f-w-600">Solte os arquivos aqui ou clique para fazer upload.</h6>
                                                            <span class="note needsclick">
                                                                (aceitamos apenas arquivos no formato <strong>JPG, PNG e WEBP</strong>.)
                                                            </span>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <div class="text-end">
                                                    <a class="btn btn-success me-3" id="enviar_evento" name="enviar_evento" href="#">Criar</a>
                                                    <a name="cancelar_evento" id="cancelar_evento" class="btn btn-danger" href="#">Cancelar</a>
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
    <script src="../assets/js/pages/eventos-cadastro.js"></script>
    <script src="../assets/js/componentes/popup_vinculador.js"></script>
    <!--script src="../assets/js/theme-customizer/customizer.js"></script-->
</body>

</html>