<?php
include 'conexao.php';  // Incluir o arquivo de conexão

// Verificar se o ID foi enviado via GET
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Obter os dados do cliente com base no ID, incluindo os telefones
    $sql = "SELECT c.ClientID, c.Name, c.Email, c.CPF, c.Birthdate, 
                   GROUP_CONCAT(p.Number SEPARATOR ', ') AS Telephones
            FROM clientinfo AS c
            LEFT JOIN phonenumber AS p ON c.ClientID = p.fk_ClientInfo_ClientID
            WHERE c.ClientID = $id
            GROUP BY c.ClientID";
    $resultado = $conexao->query($sql);

    if ($resultado->num_rows > 0) {
        $cliente = $resultado->fetch_assoc(); // Dados do cliente, incluindo telefones
    } else {
        echo "Cliente não encontrado!";
        exit;
    }
} else {
    echo "ID do cliente não fornecido!";
    exit;
}

// Verificar se o formulário foi enviado para atualizar os dados
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['atualizar'])) {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $telefones = $_POST['telefone']; // Pode ser uma string com vários números
    $cpf = $_POST['cpf'];
    $nascimento = $_POST['nascimento'];

    // Atualizar os dados do cliente no banco de dados
    $sql = "UPDATE clientinfo SET Name='$nome', Email='$email', CPF='$cpf', Birthdate='$nascimento' WHERE ClientID=$id";

    if ($conexao->query($sql) === TRUE) {
        // Atualizar telefones
        // Primeiro, deletar todos os telefones antigos
        $deletePhonesSql = "DELETE FROM phonenumber WHERE fk_ClientInfo_ClientID = $id";
        $conexao->query($deletePhonesSql);

        // Inserir os novos telefones
        $telefonesArray = explode(',', $telefones); // Separar os telefones por vírgula
        foreach ($telefonesArray as $telefone) {
            $telefone = trim($telefone); // Remover espaços em branco
            if (!empty($telefone)) {
                $insertPhoneSql = "INSERT INTO phonenumber (fk_ClientInfo_ClientID, Number) VALUES ($id, '$telefone')";
                $conexao->query($insertPhoneSql);
            }
        }

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
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            text-align: center;
        }
        form {
            margin: 0 auto;
            width: 300px;
        }
        label, input {
            display: block;
            margin-bottom: 10px;
            width: 100%;
        }
        input[type="submit"] {
            width: auto;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Editar Cliente</h1>
    <form method="post" action="">
        <!-- Campo oculto para manter o ID do cliente -->
        <input type="hidden" name="id" value="<?php echo isset($cliente['ClientID']) ? $cliente['ClientID'] : ''; ?>">
        
        <label for="nome">Nome:</label>
        <input type="text" name="nome" id="nome" value="<?php echo isset($cliente['Name']) ? $cliente['Name'] : ''; ?>" required>

        <label for="email">Email:</label>
        <input type="email" name="email" id="email" value="<?php echo isset($cliente['Email']) ? $cliente['Email'] : ''; ?>" required>

        <label for="telefone">Telefone(s):</label>
        <input type="text" name="telefone" id="telefone" value="<?php echo isset($cliente['Telephones']) ? $cliente['Telephones'] : ''; ?>" required>

        <label for="cpf">CPF:</label>
        <input type="text" name="cpf" id="cpf" value="<?php echo isset($cliente['CPF']) ? $cliente['CPF'] : ''; ?>" required>

        <label for="nascimento">Nascimento:</label>
        <input type="date" name="nascimento" id="nascimento" value="<?php echo isset($cliente['Birthdate']) ? $cliente['Birthdate'] : ''; ?>" required>

        <input type="submit" name="atualizar" value="Atualizar">
    </form>
</body>
</html>
