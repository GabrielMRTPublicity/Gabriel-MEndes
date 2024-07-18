function formatarCPF(cpf) {return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");}
function formatarWhatsApp(whatsapp) {if (whatsapp.length === 11) {return whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");} else {return whatsapp.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");}}
function formatarRG(rg, orgao, delimitador = " | ") {return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4") + delimitador + orgao;}


document.addEventListener('DOMContentLoaded', function() {
    console.log(informacoesUsuario);

    var cpf = informacoesUsuario.dados.CPF;
    var email = informacoesUsuario.dados.Email;
    var rg = informacoesUsuario.dados.RG;
    var orgao_rg = informacoesUsuario.dados.Orgao_Expedidor;
    var whatsapp = informacoesUsuario.dados.WhatsApp;

    var cpfFormatado = formatarCPF(cpf);
    var whatsappFormatado = formatarWhatsApp(whatsapp);
    var rgFormatado = formatarRG(rg, orgao_rg, " | ");

    console.log(cpfFormatado, email, rgFormatado, whatsappFormatado);
    var html_informacoes_perfil = `
        <div class="mb-3">
            <p class="p_Perfil"><strong>E-mail:</strong> ${email}</p>
        </div>
        <div class="mb-3">
            <p class="p_Perfil"><strong>WhatsApp:</strong> ${whatsappFormatado}</p>
        </div>
        <div class="mb-3">
            <p class="p_Perfil"><strong>CPF:</strong> ${cpfFormatado}</p>
        </div>
        <div class="mb-3">
            <p class="p_Perfil"><strong>RG:</strong> ${rgFormatado}</p>
        </div>
    `;

    document.getElementById('add_informacoes_perfil').innerHTML = html_informacoes_perfil;
});
