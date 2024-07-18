<?php

class DBConnection {
    #private $host = "108.167.132.128";
    #private $username = "rthomolo_gabriel";
    #private $password = "Publicidade_1";
    #private $database = "rthomolo_atitude-turismo";
    private $host = "localhost";
    private $username = "gabriel";
    private $password = "Publicidade_1";
    private $database = "atitude-turismo";

    public function connect() {
        $conn = new mysqli($this->host, $this->username, $this->password, $this->database);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        return $conn;
    }
}
class DBConnection_local {
    private $host = "localhost";
    private $username = "gabriel";
    private $password = "Publicidade_1";
    private $database = "atitude-turismo";

    public function connect() {
        $conn = new mysqli($this->host, $this->username, $this->password, $this->database);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        return $conn;
    }
}
?>
