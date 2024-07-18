<?php

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailSender {
    private $smtp_server;
    private $smtp_port;
    private $smtp_username;
    private $smtp_password;
    private $remetente;

    public function __construct($smtp_server, $smtp_port, $smtp_username, $smtp_password, $remetente) {
        $this->smtp_server = $smtp_server;
        $this->smtp_port = $smtp_port;
        $this->smtp_username = $smtp_username;
        $this->smtp_password = $smtp_password;
        $this->remetente = $remetente;
    }

    /**
     * Envia um e-mail com o código de redefinição de senha.
     * 
     * @param string $email O endereço de e-mail do destinatário.
     * @param string $codigo O código de redefinição de senha.
     * @return bool True se o e-mail for enviado com sucesso, false caso contrário.
     * @throws Exception Se ocorrer um erro durante o envio do e-mail.
     */
    public function enviar_senha_por_email($email, $senha) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $this->smtp_server;
            $mail->SMTPAuth = true;
            $mail->Username = $this->smtp_username;
            $mail->Password = $this->smtp_password;
            $mail->SMTPSecure = 'ssl';
            $mail->Port = $this->smtp_port;
    
            $mail->setFrom($this->remetente, 'Atitude Turismo');
            $mail->addAddress($email);
    
            // Definindo a codificação UTF-8 para o assunto e o corpo do e-mail
            $mail->CharSet = 'UTF-8';
            $mail->Subject = '=?UTF-8?B?' . base64_encode('Código de redefinição de senha') . '?=';
            $mail->Body = "Olá,\n\nSua senha para acessar o Painel é: $senha\n\nAtenciosamente,\nAtitude Turismo";
    
            $mail->send();
            return true;
        } catch (Exception $e) {
            throw new Exception("Erro ao enviar o e-mail: {$mail->ErrorInfo}");
        }
    }

}

?>
