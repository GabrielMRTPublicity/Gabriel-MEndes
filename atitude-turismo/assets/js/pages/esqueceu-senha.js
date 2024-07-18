$(document).ready(function() {
    function enviarCodigo(email) {
        var tipo = 'mudarSenha';
        var formData = {
            email: email,
            tipo: tipo
        };
        Swal.fire({
            title: 'Aguarde...',
            text: 'Enviando código...',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });

        $.ajax({
                type: 'POST',
                url: '../assets/php/esqueceu-senha.php',
                data: formData,
                dataType: 'json',
                encode: true
            })
            .done(function(data) {
                if (data.success) {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: data.message,
                        icon: 'success',
                        showConfirmButton: true
                    }).then(() => {
                        // Redireciona o usuário para outra página
                        window.location.href = "index.html";
                    });
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: data.message,
                        icon: 'error',
                        showConfirmButton: true
                    }).then(() => {
                        window.location.reload();
                    });
                }
            })
            .fail(function(data) {
                Swal.fire({
                    title: 'Erro!',
                    text: data.message,
                    icon: 'error',
                    showConfirmButton: true
                }).then(() => {
                    window.location.reload();
                });
            });
    }

    $('#mudar_senha').click(function(event) {
        event.preventDefault(); // Previne o envio padrão do formulário
        var email = $('#email').val();
        if (email.trim() === '') {
            Swal.fire('Por favor, forneça um E-mail para enviar o código');
            return;
        }
        enviarCodigo(email);
    });

});
