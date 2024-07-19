<?php
session_start();
require 'enviar_emails.php';

class UserData {
    private $email_sender;

    public function __construct() {
        $db = new DBConnection();
        $this->conn = $db->connect();
        $this->puxarTodosDados = puxarTodosDados::getInstance(); // Use o Singleton
        
        // Configurações do servidor de e-mail
        $smtp_server = 'smtp.gmail.com';  
        $smtp_port = 587;  
        $smtp_username = 'gabrielmendes@rtpublicity.com';  
        $smtp_password = 'yuhv cyqg scmx aiza';  
        $remetente = 'gabrielmendes@rtpublicity.com';

        $this->email_sender = new EmailSender($smtp_server, $smtp_port, $smtp_username, $smtp_password, $remetente);
    }

    public function SalvaEnviarSenha($email, $mensagem) {
        try {
            $enviado = $this->email_sender->enviar_senha_por_email($email, $mensagem);
            if ($enviado) {
                return true; 
            } else {
                error_log("Erro ao enviar e-mail porem não gerou codigo de erro no try catch");
                return false;
            }
        } catch (Exception $e) {
            error_log("Erro ao enviar e-mail: " . $e->getMessage());
            return false;
        }
    }
}
//$mail->SMTPDebug  = SMTP::DEBUG_OFF;                  
//$mail->isSMTP();                                      
//$mail->Host       = 'smtp.gmail.com';                 
//$mail->SMTPAuth   = true;                             
//$mail->Username   = 'testexampp.pq@gmail.com';        
//$mail->Password   = 'senha';                          
//$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   
// $mail->Port       = 587;                              

?>

