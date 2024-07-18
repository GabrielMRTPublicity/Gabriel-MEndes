$(document).ready(function() {
    var checkbox = $('#lembrar-senha');
    var senhaInput = $('#senha');

    // Carregar a senha salva, se houver
    if (localStorage.getItem('lembrarSenha') === 'true') {
        checkbox.prop('checked', true);
        senhaInput.val(localStorage.getItem('senha') || '');
    }

    // Adicionar evento de mudança ao checkbox
    checkbox.change(function() {
        if (checkbox.is(':checked')) {
            localStorage.setItem('lembrarSenha', 'true');
            localStorage.setItem('senha', senhaInput.val());
        } else {
            localStorage.removeItem('lembrarSenha');
            localStorage.removeItem('senha');
        }
    });

    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Evita a submissão padrão do formulário

        var email = $('#email').val();
        var senha = $('#senha').val();

        // Verifica campos vazios antes de proceder
        if (email.trim() === '') {
            Swal.fire({
                icon: "error",
                title: 'Oops...',
                text: 'Por favor, digite seu e-mail.'
            });
            return; // Interrompe a execução se o e-mail estiver vazio
        }
        if (senha.trim() === '') {
            Swal.fire({
                icon: "error",
                title: 'Oops...',
                text: 'Por favor, digite sua senha.'
            });
            return; // Interrompe a execução se a senha estiver vazia
        }

        // Mostrar popup "Carregando..."
        Swal.fire({
            title: 'Carregando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });

        // Salvar a senha se o checkbox estiver marcado
        if (checkbox.is(':checked')) {
            localStorage.setItem('senha', senha);
        }

        var formData = {
            email: email,
            senha: senha
        };

        $.ajax({
            type: 'POST',
            url: '../assets/php/login.php',
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
                    text: 'Login realizado com sucesso!',
                    showConfirmButton: true
                }).then(() => {
                    // Redirecionar para a URL adequada conforme a posição do usuário
                    console.log(data.posicao);
                    if (data.posicao === 'Membro') {
                        window.location.href = "../painel/";
                    } else if (data.posicao === 'Admin') {
                        window.location.href = "../painelADM/";
                    } else {
                        console.log('Posição de usuário desconhecida');
                        window.location.reload(); // Recarregar a página se a posição não for reconhecida
                    }
                });
            } else {
                console.log(data.message || 'Erro desconhecido');
                Swal.fire({
                    title: 'Erro!',
                    text: data.message || 'Erro desconhecido',
                    icon: 'error',
                    confirmButtonColor: '#f27474',
                    showConfirmButton: true
                }).then(() => {
                    window.location.reload();
                });
            }
        })
        .fail(function(data) {
            console.log(data.responseText || 'Falha na comunicação com o servidor');
            Swal.fire({
                title: 'Erro!',
                text: data.responseText || 'Falha na comunicação com o servidor',
                icon: 'error',
                showConfirmButton: true
            }).then(() => {
                window.location.reload();
            });
        });
    });
});
