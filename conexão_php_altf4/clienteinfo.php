<?php
include 'conexao.php';  // Incluir o arquivo de conexão

// Consulta SQL para buscar dados de cliente, telefones e calcular a idade
$sql = "SELECT c.ClientID, c.Birthdate, c.Email, c.CPF, c.Name, 
               GROUP_CONCAT(p.Number SEPARATOR ', ') as Telephones, 
               TIMESTAMPDIFF(YEAR, c.Birthdate, CURDATE()) AS Age
        FROM clientinfo AS c
        LEFT JOIN phonenumber AS p ON c.ClientID = p.fk_ClientInfo_ClientID
        GROUP BY c.ClientID";

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
    <div class="tabela">
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Idade</th> 
                <th>Nascimento</th>
                <th>Email</th>
                <th>Telefone(s)</th>
                <th>CPF</th>
                <th>Nome</th>
                <th>Ações</th> 
            </tr>
            <?php
            if ($resultado->num_rows > 0) {
                while($linha = $resultado->fetch_assoc()) {
                    echo "<tr>
                            <td>" . $linha["ClientID"] . "</td>
                            <td>" . $linha["Age"] . "</td>
                            <td>" . $linha["Birthdate"] . "</td>
                            <td>" . $linha["Email"] . "</td>
                            <td>" . $linha["Telephones"] . "</td>
                            <td>" . $linha["CPF"] . "</td>
                            <td>" . $linha["Name"] . "</td>
                            <td><a href='editar_clienteinfo.php?id=" . $linha["ClientID"] . "'>Editar</a></td>
                          </tr>";
                }
            } else {
                echo "<tr><td colspan='8'>Nenhum dado encontrado</td></tr>";
            }
            ?>
        </table>
    </div>
</body>
</html>
