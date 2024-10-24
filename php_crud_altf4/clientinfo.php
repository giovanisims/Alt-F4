
<?php
include 'connection.php';  // Include the connection file

// SQL query to fetch client data, phones and calculate age
$sql = "SELECT c.ClientID, c.Birthdate, c.Email, c.CPF, c.Name, 
               GROUP_CONCAT(p.Number SEPARATOR ', ') as Telephones, 
               TIMESTAMPDIFF(YEAR, c.Birthdate, CURDATE()) AS Age
        FROM clientinfo AS c
        LEFT JOIN phonenumber AS p ON c.ClientID = p.fk_ClientInfo_ClientID
        GROUP BY c.ClientID";

$result = $connection->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="crud_style.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Information</title>
</head>
<body>
    <div class="table">
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Age</th> 
                <th>Birthdate</th>
                <th>Email</th>
                <th>Telephone(s)</th>
                <th>CPF</th>
                <th>Name</th>
                <th>Actions</th> 
            </tr>
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<tr>
                            <td>" . $row["ClientID"] . "</td>
                            <td>" . $row["Age"] . "</td>
                            <td>" . $row["Birthdate"] . "</td>
                            <td>" . $row["Email"] . "</td>
                            <td>" . $row["Telephones"] . "</td>
                            <td>" . $row["CPF"] . "</td>
                            <td>" . $row["Name"] . "</td>
                            <td><a href='edit_clientinfo.php?id=" . $row["ClientID"] . "'>Edit</a></td>
                          </tr>";
                }
            } else {
                echo "<tr><td colspan='8'>No data found</td></tr>";
            }
            ?>
        </table>
    </div>
</body>
</html>
