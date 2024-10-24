<?php
include 'connection.php';  // Include the connection file

// Check if the ID was sent via GET
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Get the client data based on the ID, including the phone numbers
    $sql = "SELECT c.ClientID, c.Name, c.Email, c.CPF, c.Birthdate, 
                   GROUP_CONCAT(p.Number SEPARATOR ', ') AS Telephones
            FROM clientinfo AS c
            LEFT JOIN phonenumber AS p ON c.ClientID = p.fk_ClientInfo_ClientID
            WHERE c.ClientID = $id
            GROUP BY c.ClientID";
    $result = $connection->query($sql);

    if ($result->num_rows > 0) {
        $client = $result->fetch_assoc(); // Client data, including phone numbers
    } else {
        echo "Client not found!";
        exit;
    }
} else {
    echo "Client ID not provided!";
    exit;
}

// Check if the form was submitted to update the data
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phones = $_POST['phone']; // Can be a string with multiple numbers
    $cpf = $_POST['cpf'];
    $birthdate = $_POST['birthdate'];

    // Update the client data in the database
    $sql = "UPDATE clientinfo SET Name='$name', Email='$email', CPF='$cpf', Birthdate='$birthdate' WHERE ClientID=$id";

    if ($connection->query($sql) === TRUE) {
        // Update phone numbers
        // First, delete all old phone numbers
        $deletePhonesSql = "DELETE FROM phonenumber WHERE fk_ClientInfo_ClientID = $id";
        $connection->query($deletePhonesSql);

        // Insert the new phone numbers
        $phonesArray = explode(',', $phones); // Separate the phone numbers by comma
        foreach ($phonesArray as $phone) {
            $phone = trim($phone); // Remove whitespace
            if (!empty($phone)) {
                $insertPhoneSql = "INSERT INTO phonenumber (NumberID, fk_ClientInfo_ClientID, Number) VALUES (NULL, $id, '$phone')";
                $connection->query($insertPhoneSql);
            }
        }

        echo "Data updated successfully!";
        // Redirect to the main page or display a message
        header("Location: index.php");
        exit;
    } else {
        echo "Error updating data: " . $connection->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Client</title>
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
    <h1>Edit Client</h1>
    <form method="post" action="">
        <!-- Hidden field to keep the client ID -->
        <input type="hidden" name="id" value="<?php echo isset($client['ClientID']) ? $client['ClientID'] : ''; ?>">
        
        <label for="name">Name:</label>
        <input type="text" name="name" id="name" value="<?php echo isset($client['Name']) ? $client['Name'] : ''; ?>" required>

        <label for="email">Email:</label>
        <input type="email" name="email" id="email" value="<?php echo isset($client['Email']) ? $client['Email'] : ''; ?>" required>

        <label for="phone">Phone(s):</label>
        <input type="text" name="phone" id="phone" value="<?php echo isset($client['Telephones']) ? $client['Telephones'] : ''; ?>" required>

        <label for="cpf">CPF:</label>
        <input type="text" name="cpf" id="cpf" value="<?php echo isset($client['CPF']) ? $client['CPF'] : ''; ?>" required>

        <label for="birthdate">Birthdate:</label>
        <input type="date" name="birthdate" id="birthdate" value="<?php echo isset($client['Birthdate']) ? $client['Birthdate'] : ''; ?>" required>

        <input type="submit" name="update" value="Update">
    </form>
</body>
</html>
