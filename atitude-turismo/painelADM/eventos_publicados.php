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
    <title>Eventos | Atitude Turismo</title>
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
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
    <!-- Plugins css Ends-->
    <!-- Bootstrap css-->
    <link rel="stylesheet" type="text/css" href="../assets/css/vendors/bootstrap.css">
    <!-- App css-->
    <link rel="stylesheet" type="text/css" href="../assets/css/style.css">
    <link id="color" rel="stylesheet" href="../assets/css/color-1.css" media="screen">
    <!-- Responsive css-->
    <link rel="stylesheet" type="text/css" href="../assets/css/responsive.css">
    <style type="text/css">
        .hidden {
            display: none;
        }
        .titulo a {
            font-size: 23px;
            transition: transform 0.5s ease; 
        }
        .titulo a:hover {
            transform: translateX(-10px);
        }
        #popupDetalhesEventos, #popupEdicaoEvento{
            width: 90%; 
        }
        .divforaTable{
            border: solid 1px #000;
        }
        .titSubPopup{
            color:var(--theme-deafult) !important;
            font-size: 22px;
             padding: 5px 0!important;
        }
        .tableDetalhesEventos{
            width: 100%;
            border:none;
        }
        .tableDetalhesEventos tr th{
            border:solid 1px #000;
            padding: 3px 0;
        }
        .tableDetalhesEventos tr td{
            border-left: solid 1px #000;
            border-right: solid 1px #000;
            padding: 1px 0;
        }
        .tableDetalhesEventos tr .addbottom{
            border-bottom: solid 1px #000;
            padding: 1px 0;
        }
        .tdDescricao{
            min-height: 60px;
            height: 100%;
            border-bottom: solid 1px #000;
        }
        .popupEditarIMG .swal2-footer-button, .popupEditarPDF .swal2-footer-button {
            background-color: #3085d6;
            color: white;
            border: none;
            padding: 10px 20px;
            margin: 0 10px;
            cursor: pointer;
            border-radius: 5px;

        }
        .popupEditarIMG .swal2-html-container,.popupEditarPDF .swal2-html-container,#popupEdicaoEvento .swal2-html-container{
            scrollbar-width: none!important;
        }

        .popupEditarIMG .swal2-footer-button:hover,.popupEditarPDF .swal2-footer-button:hover {
            background-color: #2874a6;
        }
        
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
        .bt_evento#bt_add_plano{
            background: green;
        }
        .bt_evento#bt_excluir_plano{
            background: red;
        }
        .uploadObrigadorio{
            padding: 20px;
            border: 1px solid #E6E9EB;
        }
        
    </style>
</head>

<body class="light">
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
        <!-- Page Header Start-->
        <?php require_once '../assets/componentes/navbarADM.php'; ?>
        <!-- Page Header Ends-->
        <!-- Page Body Start-->
        <div class="page-body-wrapper default-menu default-menu">
            <!-- Page Sidebar Start-->
            <?php require_once '../assets/componentes/sidebarADM.php'; ?>
            <!-- Page Sidebar Ends-->
            <div class="page-body">
                <div class="container-fluid">
                    <div class="page-title">
                        <div class="row">
                            <div class="col-6">
                                <h4 id="tituloPagina">Lista de Eventos</h4>
                            </div>
                            <div class="col-6">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"> <a href="index.php">
                                        <svg class="stroke-icon">
                                            <use href="../assets/svg/icon-sprite.svg#stroke-home"></use>
                                        </svg></a>
                                    </li>
                                    <li class="breadcrumb-item">Eventos</li>
                                    <li class="breadcrumb-item active">Publicados</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Container-fluid starts-->
                <div class="container-fluid">
                    <input type="file" id="fileInputimg" multiple class="hidden" accept="image/jpeg, image/jpg, image/png, image/webp">
                    <input type="file" id="fileInputpdf" class="hidden" accept="application/pdf">
                    <div id="addConteudo"></div>
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
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
    <!-- Plugins JS Ends-->
    <!-- Theme js-->
    <script src="../assets/js/script.js"></script>
    <script src="../assets/js/sweet-alert/sweetalert2.all.min.js"></script>
    <script src="../assets/js/jquery.inputmask.min.js"></script>
    <script src="../assets/js/pages/eventos-publicados.js"></script>

    <!--script src="../assets/js/theme-customizer/customizer.js"></script-->
</body>

</html>