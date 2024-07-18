$(document).ready(function() {
    // Aplica a máscara flexível ao campo WhatsApp
    $('.cel').inputmask({
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