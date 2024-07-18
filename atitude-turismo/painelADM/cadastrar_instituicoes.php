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
    <title>Cadastrar Instituições | Atitude Turismo</title>
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
        .add_botoes{
            background: #eeeef0;
            margin-bottom: 30px;
            border-radius: 10px;
        }
        .fade-in, .fade-in2 {
            opacity: 0;
            transition: opacity 1s ease-in-out;
        }
        
        .fade-in.show, .fade-in2.show {
            opacity: 1;
        }

        .p_inst_tit{
            font-weight: 600;
            font-size: 16px;
        }
        .bt_inst{
            border: 1px solid;
            border-radius: 20px;
        }

        .bt_inst.sim{
            border-color: green;
            color:green;
        }
        
        .bt_inst.sim.active{
            border-color: green;
            color:#fff;
            background: green;
        }

        .bt_inst.nao{
            border-color: red;
            color:red;
        }
        .bt_inst.nao.active{
            border-color: red;
            color:#fff;
            background: red;
        }

        .bt_inst.nao.active:hover{
            border: 1px solid red;
            color:fff;
            background: red;
        }
        .bt_inst.sim.active:hover{
            border: 1px solid green;
            color:#fff;
            background: green;
        }
        .bt_inst:hover{
            border: 1px solid #007bff;
            color: #fff;
            background: #007bff;
        }
        .dark-only .add_botoes{
            background: #1d1d1d;
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
                                <h4>Cadastrar Instituções</h4>
                            </div>
                            <div class="col-6">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.php">
                                            <svg class="stroke-icon">
                                                <use href="../assets/svg/icon-sprite.svg#stroke-home"></use>
                                            </svg></a></li>
                                    <li class="breadcrumb-item">Instituições</li>
                                    <li class="breadcrumb-item active">Cadastrar</li>
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
                                        <form method="POST">
                                            <div class="row">
                                                <div class="col">
                                                    <div class="mb-3">
                                                        <label for="nome_instituicao">Nome da Instituição:</label>
                                                        <input class="form-control" name="nome_instituicao" id="nome_instituicao" type="text" placeholder="Digite o nome da instituição / grupo de viagem.">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="mb-3">
                                                        <label for="descricao_segmento">Descrição</label>
                                                        <textarea name="descricao_segmento" id="descricao_segmento" class="form-control" rows="4"   placeholder="Digite detalhes sobre a instituição"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row add_botoes">
                                                <div class="col-sm-12">
                                                    <div class="mb-3 mt-3">
                                                        <p class="p_inst_tit text-center">Adicione campos no formulario</p>
                                                        
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="mb-3 text-center">
                                                        <div class="">
                                                            <p class="p_valores_evento text-center">É uma instituição de ensino:</p>
                                                            <div class="">
                                                                <button type="button" class="btn bt_inst sim " id="ensino_sim" name="ensino_sim">Sim</button>
                                                                <button type="button" class="btn bt_inst nao active" id="ensino_nao" name="ensino_nao">Não</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="mb-3 text-center">
                                                        <p class="p_valores_evento text-center">Adicionar Telefone e Responsável:</p>
                                                        <div class="">
                                                            <button type="button" class="btn bt_inst sim" id="add_resposavel_tel_sim" name="add_resposavel_tel_sim">Sim</button>
                                                            <button type="button" class="btn bt_inst nao active" id="add_resposavel_tel_nao" name="add_resposavel_tel_nao">Não</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="mb-3 text-center">
                                                        <p class="p_valores_evento text-center">Adicionar Endereço:</p>
                                                        <div class="">
                                                            <button type="button" class="btn bt_inst sim" id="add_endereco_sim" name="add_endereco_sim">Sim</button>
                                                            <button type="button" class="btn bt_inst nao active" id="add_endereco_nao" name="add_endereco_nao">Não</button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="row">
                                                <div id="add_conteudo"></div>
                                                <div id="add_conteudo_endereco"></div>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="text-end">
                                                        <a class="btn btn-success me-3" id="enviar_segmento" name="enviar_segmento" href="#">Criar</a>
                                                        <a name="cancelar_segmento" id="cancelar_segmento" class="btn btn-danger" href="#">Cancelar</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
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
    <script src="../assets/js/pages/instituicoes-cadastro.js"></script>
    <script src="../assets/js/componentes/popup_vinculador.js"></script>
    <!--script src="../assets/js/theme-customizer/customizer.js"></script-->
</body>

</html>