$(document).ready(function() {
    // Aplica a máscara flexível ao campo WhatsApp
    $('.cel').inputmask({
        mask: ['(99) 9999-9999', '(99) 99999-9999'],
        keepStatic: true,
        clearMaskOnLostFocus: true
    });
    //submit formulario simples
    $('#form-contato').click(function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        var nome = $('#nome').val();
        var email = $('#email').val();
        var whatsapp = $('#whatsapp').val();
        var telefone = $('#telefone').val();
        var mensagem = $('#mensagem').val();

        if (nome == '' || email == '' || whatsapp == '' || mensagem  == '') {
            Swal.fire('Por favor, preencha todos os campos.');
            return;
        }
        const cleanNumber = whatsapp.replace(/\D/g, '');
        const cleanNumber2 = telefone.replace(/\D/g, '');
        if (cleanNumber.length < 9) {
            Swal.fire('Por favor, forneça um número de WhatsApp válido com DDD + 8 dígitos no mínimo.');
            return;
        }
        if (cleanNumber2.length < 9) {
            Swal.fire('Por favor, forneça um número de Telefone válido com DDD + 8 dígitos no mínimo.');
            return;
        }


        var formData = {
            nome: nome,
            email: email,
            whatsapp: whatsapp,
            telefone: telefone,
            mensagem: mensagem
        };
        $.ajax({
                type: 'POST',
                url: 'assets-institucional/php/enviar_relatorio.php',
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