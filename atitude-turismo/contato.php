<!DOCTYPE html>
<html lang="pt-BR" data-bs-theme="auto">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="generator" content="">
    <title>Atitude Turismo | Contato</title>
    <link rel="icon" href="assets-institucional/images/favicon.png" type="image/x-icon">
    <link rel="shortcut icon" href="assets-institucional/images/favicon.png" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="assets-institucional/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link rel="stylesheet" href="assets-institucional/css/owl.carousel.min.css">
    <link rel="stylesheet" href="assets-institucional/css/owl.theme.default.min.css">
    <link href="assets-institucional/css/style.css" rel="stylesheet">
</head>

<body>
    <?php require_once 'assets-institucional/componentes/navbar.php'; ?>
    <main>
        <section class="cor-sobre" id="sobre-nos">
            <div class="container m-0 p-0">
                <div class="row m-0 p-0">
                    <div class="col-lg-6 d-flex flex-column">
                        <br><br><br>
                        <h1 class="title-topo">CONTATO</h1>
                        <p class="lead text1">Tem alguma dúvida ou precisa de mais informações sobre nossos pacotes de viagem? Estamos aqui para ajudar! Entre em contato conosco e nossa equipe dedicada da Atitude Turismo estará pronta para oferecer todo o suporte necessário. Seja por telefone, e-mail ou redes sociais, estamos à disposição para tornar sua experiência de viagem inesquecível desde o primeiro contato. </p>
                    </div>
                    <div class="col-lg-6 div-img-meio">
                        <img class="img-fluid img-meio" src="assets-institucional/images/img-topo.png" width="400" height="380" alt="banner" />
                    </div>
                </div>
            </div>
        </section>
        <section class="contact-area pb-100 form-contact" id="contato">
            <div class="container">
                <form class="contactForm2">
                    <div class="row">
                        <h2 class="title-destino">FALE CONOSCO</h2>
                        <h3 class="sub-title-destino">Vamos planejar juntos a sua próxima grande aventura!<br><br></h3>
                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="text" name="nome" id="nome" autocomplete="nome" placeholder="Nome" class="form-control" required data-error="Este campo é obrigatório." />
                                <div class="help-block with-errors"></div>
                                <br>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="email" name="email" id="email" autocomplete="email" placeholder="E-mail" class="form-control" required data-error="Este campo é obrigatório." />
                                <br>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="text" name="whatsapp" id="whatsapp" autocomplete="whatsapp" placeholder="WhatsApp" required data-error="Este campo é obrigatório." class="cel form-control" maxlength="15" />
                                <div class="help-block with-errors"></div>
                                <br>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="form-group">
                                <input type="text" name="telefone" id="telefone" autocomplete="telefone" placeholder="Telefone" class="cel form-control" maxlength="14" required data-error="Este campo é obrigatório." />
                                <br>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <div class="form-group">
                                <textarea name="mensagem" class="form-control" id="mensagem" autocomplete="Como podemos te ajudar?" placeholder="Como podemos te ajudar?" cols="30" rows="6" required data-error="Este campo é obrigatório."></textarea>
                                <br>
                                <br>
                                <div class="help-block with-errors"></div>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 text-center">
                            <button type="submit" class="default-btn">
                                <span>Enviar</span>
                            </button>
                            <br><br>
                            <div id="msgSubmit" class="h3 text-center hidden"></div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
        <div class="contatos">
            <div>
                <img src="assets-institucional/images/logo-rd.png" width="280" alt="logo" />
            </div>
        </div>
    </main>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets-institucional/js/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="assets-institucional/js/bootstrap.min.js"></script>
    <script src="assets-institucional/js/owl.carousel.min.js"></script>
    <script src="assets/js/jquery.inputmask.min.js"></script>
    <script src="assets-institucional/js/contato.js"></script>
    <script>
    function setActive(element) {
        var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        element.classList.add('active');
    }
    </script>

    
</body>

</html>