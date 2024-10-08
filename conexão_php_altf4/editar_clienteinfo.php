<?php
include 'conexao.php';  // Incluir o arquivo de conexão

// Verificar se o ID foi enviado via POST
if (isset($_POST['id'])) {
    $id = $_POST['id'];

    // Obter os dados do cliente com base no ID
    $sql = "SELECT * FROM clientinfo WHERE ClientID = $id";
    $resultado = $conexao->query($sql);

    if ($resultado->num_rows > 0) {
        $cliente = $resultado->fetch_assoc(); // Dados do cliente
    } else {
        echo "Cliente não encontrado!";
        exit;
    }
} else {
    echo "ID do cliente não fornecido!";
    exit;
}

// Verificar se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['atualizar'])) {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $telefone = $_POST['telefone'];
    $cpf = $_POST['cpf'];
    $nascimento = $_POST['nascimento'];

    // Atualizar os dados do cliente no banco de dados
    $sql = "UPDATE clientinfo SET ClientName='$nome', Email='$email', Telephone='$telefone', CPF='$cpf', Birthdate='$nascimento' WHERE ClientID=$id";

    if ($conexao->query($sql) === TRUE) {
        echo "Dados atualizados com sucesso!";
        // Redirecionar para a página principal ou exibir uma mensagem
        header("Location: index.php");
        exit;
    } else {
        echo "Erro ao atualizar os dados: " . $conexao->error;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Cliente</title>
</head>
<body>
    <h1>Editar Cliente</h1>
    <form method="post" action="">
        <input type="hidden" name="id" value="<?php echo $cliente['ClientID']; ?>">
        
        <label for="nome">Nome:</label>
        <input type="text" name="nome" id="nome" value="<?php echo $cliente['ClientName']; ?>" required><br>

        <label for="email">Email:</label>
        <input type="email" name="email" id="email" value="<?php echo $cliente['Email']; ?>" required><br>

        <label for="telefone">Telefone:</label>
        <input type="text" name="telefone" id="telefone" value="<?php echo $cliente['Telephone']; ?>" required><br>

        <label for="cpf">CPF:</label>
        <input type="text" name="cpf" id="cpf" value="<?php echo $cliente['CPF']; ?>" required><br>

        <label for="nascimento">Nascimento:</label>
        <input type="date" name="nascimento" id="nascimento" value="<?php echo $cliente['Birthdate']; ?>" required><br>

        <input type="submit" name="atualizar" value="Atualizar">
    </form>
</body>
</html>
