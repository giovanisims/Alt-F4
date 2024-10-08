<?php
$servidor = "localhost";  // Endereço do servidor do banco de dados
$usuario = "root";        // Usuário do banco de dados
$senha = "PUC@1234";              // Senha do banco de dados
$banco = "altf4";     // Nome do banco de dados
$porta = 3305;            // Porta do banco de dados

// Criar a conexão
$conexao = new mysqli($servidor, $usuario, $senha, $banco, $porta);

// Verificar se houve erro na conexão
if ($conexao->connect_error) {
    die("Conexão falhou: " . $conexao->connect_error);
}
?>
