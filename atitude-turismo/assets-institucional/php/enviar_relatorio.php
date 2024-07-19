<?php
// Obter os dados do formulário
$nome = $_POST['nome'];
$email = $_POST['email'];
$whatsapp = $_POST['whatsapp'];
$telefone = $_POST['telefone'];
$mensagem = $_POST['mensagem'];

// Criar o conteúdo do relatório
$relatorio = "Relatório de Contato:\n\n";
$relatorio .= "Nome: $nome\n";
$relatorio .= "E-mail: $email\n";
$relatorio .= "WhatsApp: $whatsapp\n";
$relatorio .= "Telefone: $telefone\n";
$relatorio .= "Mensagem: $mensagem\n";

// Salvar o relatório em um arquivo
$arquivo = "relatorio_" . date("Y-m-d_H-i-s") . ".txt";
file_put_contents($arquivo, $relatorio);

// Enviar o relatório por e-mail
$destinatario = "gabrielmendes@rtpublicity.com"; // Substitua pelo seu endereço de e-mail
$assunto = "Novo Relatório de Contato";
$mensagem_email = "Segue em anexo o relatório de contato.";
$headers = "From: gabrielmendes@rtpublicity.com\r\n"; // Substitua pelo seu endereço de e-mail
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();
var_dump($mail)
if (mail($destinatario, $assunto, $mensagem_email, $headers)) {
    echo json_encode(array('success' => true, 'message' => 'Formulário enviado com sucesso!'));
} else {
    echo json_encode(array('success' => false, 'message' => 'Erro ao enviar o formulário. Por favor, tente novamente.'));
}
?>
