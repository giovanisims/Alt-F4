<?php
include 'conexao.php';  // Incluir o arquivo de conexão

$sql = "SELECT * FROM clientinfo";  // Consulta para obter todos os dados da tabela clientinfo
$resultado = $conexao->query($sql);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informações dos Clientes</title>
</head>
<body>
    <div class="form-fixo">
        <h2>Editar Cliente</h2>
        <form method="post" action="editar_clienteinfo.php">
            <label for="id">ID do Cliente:</label>
            <input type="text" name="id" id="id" required><br>

            <input type="submit" value="Editar">
        </form>
    </div>

    <div class="tabela">
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Nascimento</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Nome</th>
            </tr>
            <?php
            if ($resultado->num_rows > 0) {
                while($linha = $resultado->fetch_assoc()) {
                    echo "<tr>
                            <td>" . $linha["ClientID"] . "</td>
                            <td>" . $linha["Birthdate"] . "</td>
                            <td>" . $linha["Email"] . "</td>
                            <td>" . $linha["Telephone"] . "</td>
                            <td>" . $linha["CPF"] . "</td>
                            <td>" . $linha["ClientName"] . "</td>
                          </tr>";
                }
            } else {
                echo "<tr><td colspan='7'>Nenhum dado encontrado</td></tr>";
            }
            ?>
        </table>
    </div>
</body>
</html>
